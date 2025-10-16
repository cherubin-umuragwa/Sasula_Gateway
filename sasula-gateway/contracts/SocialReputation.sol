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

    // Authorized callers (e.g., PaymentRouter) that can report payments
    mapping(address => bool) public isAuthorizedCaller;

    struct Metrics {
        uint256 sentCount;
        uint256 receivedCount;
        uint256 volume; // sum of amounts across tokens normalized 1e18 by caller
        uint256 endorsements; // number of unique endorsements
        mapping(address => bool) hasEndorsed;
    }

    mapping(address => Metrics) private userMetrics;

    // Simple loan book
    mapping(address => uint256) public outstandingDebt;
    uint256 public totalPool;

    event AuthorizedCaller(address indexed caller, bool allowed);
    event PaymentReported(address indexed from, address indexed to, address token, uint256 amount);
    event Endorsed(address indexed endorser, address indexed target);
    event Unendorsed(address indexed endorser, address indexed target);
    event PoolFunded(address indexed from, uint256 amount);
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

    // --- Reputation core ---
    function setAuthorizedCaller(address caller, bool allowed) external onlyAdmin {
        isAuthorizedCaller[caller] = allowed;
        emit AuthorizedCaller(caller, allowed);
    }

    // Caller should normalize `amount` to 1e18 scale for fair scoring
    function reportPayment(address from, address to, address token, uint256 amountNormalized1e18) external onlyAuthorized {
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
        Metrics storage m = userMetrics[target];
        require(!m.hasEndorsed[msg.sender], "Already endorsed");
        m.hasEndorsed[msg.sender] = true;
        unchecked { m.endorsements += 1; }
        emit Endorsed(msg.sender, target);
    }

    function unendorse(address target) external {
        Metrics storage m = userMetrics[target];
        require(m.hasEndorsed[msg.sender], "Not endorsed");
        m.hasEndorsed[msg.sender] = false;
        unchecked { m.endorsements -= 1; }
        emit Unendorsed(msg.sender, target);
    }

    function getScore(address user) public view returns (uint256) {
        Metrics storage m = userMetrics[user];
        // Simple weighted scoring: counts + endorsements + volume factor
        // Weights chosen for demo purposes
        uint256 score = m.sentCount * 2 + m.receivedCount * 1 + m.endorsements * 10 + m.volume / 1e20; // volume dampened
        return score;
    }

    // --- Micro-loans ---
    function fundPool(uint256 amount) external {
        require(amount > 0, "amount=0");
        bool ok = loanToken.transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom fail");
        totalPool += amount;
        emit PoolFunded(msg.sender, amount);
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
        outstandingDebt[msg.sender] = amount; // no interest for demo
        totalPool -= amount;
        require(loanToken.transfer(msg.sender, amount), "transfer fail");
        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        require(amount > 0, "amount=0");
        uint256 debt = outstandingDebt[msg.sender];
        require(debt > 0, "no debt");
        require(amount <= debt, "too much");
        bool ok = loanToken.transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom fail");
        outstandingDebt[msg.sender] = debt - amount;
        totalPool += amount;
        emit Repaid(msg.sender, amount);
    }
}
