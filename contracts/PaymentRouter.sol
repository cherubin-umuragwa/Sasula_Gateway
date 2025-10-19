// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PaymentRouter - Main payment processing contract
 * @dev Handles P2P transfers with social messages and multi-token support
 * @notice For beginners: think of this as a simple bank ledger on Base Sepolia
 *
 * KEY CONCEPTS:
 * - msg.sender: Address that called the function
 * - address: Like a bank account number on blockchain
 * - require(): A rule that must be true or the transaction reverts
 * - event: A log for off-chain apps (frontends/indexers) to watch
 *
 * BASE L2 BENEFITS:
 * - Very low fees and fast confirmations while inheriting Ethereum security
 */
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function decimals() external view returns (uint8);
}

contract PaymentRouter {
    // Admin address that can toggle emergency mode; in a future version, controlled by EmergencyMode contract
    address public immutable admin;

    // Global emergency flag (fee-free transfers when true); extendable to region-based in future
    bool public emergencyActive;

    // Flat fee in wei for ETH transfers when not in emergency; default 0 for test, can be updated by admin later
    uint256 public flatEthFeeWei;

    // Mapping to track number of payments sent per user (simple reputation signal)
    mapping(address => uint256) public paymentsSentCount;

    // Mapping to track number of payments received per user
    mapping(address => uint256) public paymentsReceivedCount;

    /// @dev Payment record structure kept minimal for gas; frontends pull full detail from events
    struct PaymentRecord {
        address from;
        address to;
        address token; // address(0) for native ETH
        uint256 amount;
        uint256 timestamp;
    }

    // Simple per-user circular history: latest N hashes for quick on-chain peek; complete history should be read from events
    uint8 public constant HISTORY_SIZE = 16;
    mapping(address => bytes32[HISTORY_SIZE]) private userRecentPayments;
    mapping(address => uint8) private userRecentIndex;

    /// @notice Emitted on every payment
    event PaymentSent(
        address indexed from,
        address indexed to,
        address indexed token,
        uint256 amount,
        string message,
        uint256 timestamp
    );

    /// @notice Emitted when emergency toggles
    event EmergencyModeUpdated(bool active, uint256 timestamp);

    constructor() {
        admin = msg.sender; // Deployer becomes admin
        flatEthFeeWei = 0; // Start with zero fee to simplify testing
    }

    /**
     * @notice Toggle global emergency mode (admin-only)
     * @dev In emergencies, fees are waived to support crisis payments
     */
    function setEmergencyActive(bool active) external {
        require(msg.sender == admin, "Only admin");
        emergencyActive = active;
        emit EmergencyModeUpdated(active, block.timestamp);
    }

    /**
     * @notice Update the flat ETH fee (admin-only). Ignored while emergencyActive.
     */
    function setFlatEthFeeWei(uint256 newFee) external {
        require(msg.sender == admin, "Only admin");
        flatEthFeeWei = newFee;
    }

    /**
     * @notice Send native ETH with an optional social message
     * @param to Recipient address
     * @param message Social note (stored in event only)
     */
    function payETH(address to, string calldata message) external payable {
        require(to != address(0), "Invalid to");
        require(msg.value > 0, "No value");

        uint256 valueToSend = msg.value;
        if (!emergencyActive && flatEthFeeWei > 0) {
            require(valueToSend > flatEthFeeWei, "Fee exceeds amount");
            unchecked {
                valueToSend -= flatEthFeeWei;
            }
            // fee retained in contract; in production, route to treasury
        }

        // Transfer remaining ETH to recipient
        (bool ok, ) = to.call{value: valueToSend}("");
        require(ok, "ETH transfer failed");

        _afterPayment(msg.sender, to, address(0), valueToSend, message);
    }

    /**
     * @notice Send ERC-20 tokens (e.g., USDC) with a message
     * @dev Sender must approve this contract to spend tokens first via token.approve()
     * @param token ERC-20 token address
     * @param to Recipient address
     * @param amount Token amount in smallest units (e.g., 6 decimals for USDC)
     * @param message Social note (event-only)
     */
    function payERC20(address token, address to, uint256 amount, string calldata message) external {
        require(to != address(0), "Invalid to");
        require(token != address(0), "Invalid token");
        require(amount > 0, "No amount");

        IERC20 erc20 = IERC20(token);

        // Pull tokens from sender; requires prior approval
        bool ok = erc20.transferFrom(msg.sender, to, amount);
        require(ok, "transferFrom failed");

        _afterPayment(msg.sender, to, token, amount, message);
    }

    /**
     * @notice Return a user's last up to HISTORY_SIZE payment hashes
     * @dev Frontends typically index events; this is a lightweight on-chain glimpse
     */
    function getRecentPayments(address user) external view returns (bytes32[HISTORY_SIZE] memory) {
        return userRecentPayments[user];
    }

    function _afterPayment(
        address from,
        address to,
        address token,
        uint256 amount,
        string calldata message
    ) internal {
        // Update simple counters
        unchecked {
            paymentsSentCount[from] += 1;
            paymentsReceivedCount[to] += 1;
        }

        // Record circular history via a hash (from,to,token,amount,ts)
        uint8 idx = userRecentIndex[from];
        bytes32 entry = keccak256(abi.encode(from, to, token, amount, block.timestamp));
        userRecentPayments[from][idx] = entry;
        userRecentIndex[from] = (idx + 1) % HISTORY_SIZE;

        emit PaymentSent(from, to, token, amount, message, block.timestamp);
    }

    // Allow contract to receive ETH (from fees or accidental sends)
    receive() external payable {}
}

