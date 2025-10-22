// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

/**
 * @title SocialReputation
 * @dev On-chain reputation scoring and simple micro-loans backed by a token pool
 */
contract SocialReputation {
    address public immutable admin;
    IERC20 public immutable loanToken; // e.g., USDC on Base Sepolia

    // Global epoch to allow admin to reset reputation across all users
    uint256 public currentEpoch = 1;

    // Authorized callers (e.g., PaymentRouter) that can report payments
    mapping(address => bool) public isAuthorizedCaller;

    struct Metrics {
        uint256 sentCount;
        uint256 receivedCount;
        uint256 volume; // sum of amounts across tokens normalized 1e18 by caller
        uint256 endorsements; // number of unique endorsements (for current epoch)
        // Track endorsements per epoch to allow re-endorsement after resets
        mapping(uint256 => mapping(address => bool)) hasEndorsed; // epoch -> endorser -> bool
    }

    mapping(address => Metrics) private userMetrics;
    // For counters (sent/received/volume/endorsements), track which epoch a user's
    // metrics are aligned to. If stale, we reset on first write in new epoch.
    mapping(address => uint256) public metricsEpoch;

    // Pool accounting using shares (proportional claims)
    uint256 public totalPool; // total token balance managed by the pool
    uint256 public totalShares; // sum of all userShares
    mapping(address => uint256) public userShares; // depositor shares

    // Simple loan book (one loan at a time per user for demo)
    mapping(address => uint256) public outstandingDebt; // principal owed
    uint256 public interestBps = 200; // 2% flat interest per loan (for demo)

    // Reputation boosts for funding: flat bonuses per funding action in current epoch
    mapping(address => uint256) public fundingBonus; // additive to score (per epoch)
    mapping(address => uint256) public fundingBonusEpoch;

    event AuthorizedCaller(address indexed caller, bool allowed);
    event PaymentReported(address indexed from, address indexed to, address token, uint256 amount);
    event Endorsed(address indexed endorser, address indexed target);
    event Unendorsed(address indexed endorser, address indexed target);
    event PoolFunded(address indexed from, uint256 amount, uint256 sharesMinted);
    event PoolWithdrawn(address indexed to, uint256 amount, uint256 sharesBurned);
    event Borrowed(address indexed borrower, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyAuthorized() {
        require(isAuthorizedCaller[msg.sender], "Not authorized");
        _;
    }

    constructor(IERC20 _loanToken) {
        admin = msg.sender;
        loanToken = _loanToken;
    }

    // Internal: reset user metrics if their epoch is stale
    function _syncUserEpoch(address user) internal {
        if (metricsEpoch[user] != currentEpoch) {
            Metrics storage m = userMetrics[user];
            m.sentCount = 0;
            m.receivedCount = 0;
            m.volume = 0;
            m.endorsements = 0;
            metricsEpoch[user] = currentEpoch;
        }
    }

    // --- Reputation core ---
    function setAuthorizedCaller(address caller, bool allowed) external onlyAdmin {
        isAuthorizedCaller[caller] = allowed;
        emit AuthorizedCaller(caller, allowed);
    }

    // Caller should normalize `amount` to 1e18 scale for fair scoring
    function reportPayment(address from, address to, address token, uint256 amountNormalized1e18) external onlyAuthorized {
        _syncUserEpoch(from);
        _syncUserEpoch(to);
        Metrics storage mf = userMetrics[from];
        Metrics storage mt = userMetrics[to];
        unchecked {
            mf.sentCount += 1;
            mt.receivedCount += 1;
            mf.volume += amountNormalized1e18;
            mt.volume += amountNormalized1e18;
        }
        emit PaymentReported(from, to, token, amountNormalized1e18);
    }

    function endorse(address target) external {
        _syncUserEpoch(target);
        Metrics storage m = userMetrics[target];
        require(!m.hasEndorsed[currentEpoch][msg.sender], "Already endorsed");
        m.hasEndorsed[currentEpoch][msg.sender] = true;
        unchecked { m.endorsements += 1; }
        emit Endorsed(msg.sender, target);
    }

    function unendorse(address target) external {
        _syncUserEpoch(target);
        Metrics storage m = userMetrics[target];
        require(m.hasEndorsed[currentEpoch][msg.sender], "Not endorsed");
        m.hasEndorsed[currentEpoch][msg.sender] = false;
        unchecked { m.endorsements -= 1; }
        emit Unendorsed(msg.sender, target);
    }

    function getScore(address user) public view returns (uint256) {
        uint256 score = 0;
        if (metricsEpoch[user] == currentEpoch) {
            Metrics storage m = userMetrics[user];
            // Simple weighted scoring: counts + endorsements + volume factor
            // Weights chosen for demo purposes
            score = m.sentCount * 2 + m.receivedCount * 1 + m.endorsements * 10 + m.volume / 1e20; // volume dampened
        }
        if (fundingBonusEpoch[user] == currentEpoch) {
            score += fundingBonus[user];
        }
        return score;
    }

    // --- Micro-loans ---
    function fundPool(uint256 amount) external {
        require(amount > 0, "amount=0");
        bool ok = loanToken.transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom fail");
        uint256 shares;
        if (totalShares == 0 || totalPool == 0) {
            shares = amount; // 1:1 initial pricing
        } else {
            shares = (amount * totalShares) / totalPool;
        }
        require(shares > 0, "shares=0");
        totalPool += amount;
        totalShares += shares;
        userShares[msg.sender] += shares;
        // Add flat reputation bonus per funding action (20 points)
        if (fundingBonusEpoch[msg.sender] != currentEpoch) {
            fundingBonus[msg.sender] = 0;
            fundingBonusEpoch[msg.sender] = currentEpoch;
        }
        unchecked { fundingBonus[msg.sender] += 20; }
        emit PoolFunded(msg.sender, amount, shares);
    }

    function getUserStakeValue(address user) public view returns (uint256) {
        if (totalShares == 0) return 0;
        return (userShares[user] * totalPool) / totalShares;
    }

    // Withdraw exact token amount (partial allowed)
    function withdrawAmount(uint256 amount) external {
        require(amount > 0, "amount=0");
        require(totalPool > 0 && totalShares > 0, "empty");
        uint256 shares = (amount * totalShares) / totalPool;
        require(shares > 0 && userShares[msg.sender] >= shares, "shares");
        userShares[msg.sender] -= shares;
        totalShares -= shares;
        totalPool -= amount;
        require(loanToken.transfer(msg.sender, amount), "transfer fail");
        emit PoolWithdrawn(msg.sender, amount, shares);
    }

    // Withdraw by shares
    function withdrawShares(uint256 shares) external {
        require(shares > 0 && userShares[msg.sender] >= shares, "shares");
        require(totalShares > 0, "no shares");
        uint256 amount = (shares * totalPool) / totalShares;
        userShares[msg.sender] -= shares;
        totalShares -= shares;
        totalPool -= amount;
        require(loanToken.transfer(msg.sender, amount), "transfer fail");
        emit PoolWithdrawn(msg.sender, amount, shares);
    }

    function maxBorrowable(address user) public view returns (uint256) {
        // Very simple policy: max = min(pool, score * 10^loanDecimals / 100)
        uint8 dec = loanToken.decimals();
        uint256 base = getScore(user) * (10 ** dec) / 100; // 1% of score in token units
        if (base > totalPool) return totalPool;
        return base;
    }

    function borrow(uint256 amount) external {
        require(outstandingDebt[msg.sender] == 0, "Debt exists");
        uint256 maxAmt = maxBorrowable(msg.sender);
        require(amount > 0 && amount <= maxAmt, "exceeds limit");
        outstandingDebt[msg.sender] = amount; // principal
        totalPool -= amount;
        require(loanToken.transfer(msg.sender, amount), "transfer fail");
        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        require(amount > 0, "amount=0");
        uint256 debt = outstandingDebt[msg.sender];
        require(debt > 0, "no debt");
        uint256 due = debt + ((debt * interestBps) / 10000);
        require(amount >= due, "insufficient repay");
        bool ok = loanToken.transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom fail");
        outstandingDebt[msg.sender] = 0;
        totalPool += amount; // interest increases pool value for all depositors
        emit Repaid(msg.sender, amount);
    }

    // --- Admin controls ---
    // Increment epoch to reset reputation scoring for all users
    function resetAllReputation() external onlyAdmin {
        unchecked { currentEpoch += 1; }
    }

    // --- Endorsements ---
    // Already one-per-endorser per epoch; allow self-endorse once per epoch
    function selfEndorse() external {
        _syncUserEpoch(msg.sender);
        Metrics storage m = userMetrics[msg.sender];
        require(!m.hasEndorsed[currentEpoch][msg.sender], "Already self-endorsed");
        m.hasEndorsed[currentEpoch][msg.sender] = true;
        unchecked { m.endorsements += 1; }
        emit Endorsed(msg.sender, msg.sender);
    }
}
