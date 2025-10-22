// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

/**
 * @title SavingsCircles
 * @dev Minimal ROSCA implementation for rotating payouts using an ERC-20 token
 */
contract SavingsCircles {
    struct Circle {
        address organizer;
        IERC20 token;
        uint256 contribution;
        uint256 periodSeconds;
        address[] members;
        uint256 currentIndex; // who receives the next payout
        uint256 nextPayoutTime;
        mapping(uint256 => mapping(address => bool)) hasDepositedForRound; // round -> member -> deposited
        uint256 round; // increments each payout
        bool active;
        bool openToJoin; // true when a cycle completed and membership can change
    }

    uint256 public nextId = 1;
    mapping(uint256 => Circle) private circles;

    event CircleCreated(uint256 indexed id, address indexed organizer, address token, uint256 contribution, uint256 period, address[] members);
    event Deposited(uint256 indexed id, uint256 indexed round, address indexed member, uint256 amount);
    event Payout(uint256 indexed id, uint256 indexed round, address indexed recipient, uint256 amount);
    event MemberJoined(uint256 indexed id, address indexed newMember);
    event OpenToJoinSet(uint256 indexed id, bool open);
    event Restarted(uint256 indexed id, uint256 nextPayoutTime);
    event Terminated(uint256 indexed id);
    event CycleCompleted(uint256 indexed id, uint256 completedRound);

    function createCircle(IERC20 token, address[] calldata members, uint256 contribution, uint256 periodSeconds) external returns (uint256 id) {
        require(address(token) != address(0), "token=0");
        require(members.length >= 2, "members<2");
        require(contribution > 0, "contribution=0");
        require(periodSeconds >= 60, "period too small");

        id = nextId++;
        Circle storage c = circles[id];
        c.organizer = msg.sender;
        c.token = token;
        c.contribution = contribution;
        c.periodSeconds = periodSeconds;
        c.members = members;
        c.currentIndex = 0;
        c.nextPayoutTime = block.timestamp + periodSeconds;
        c.round = 0;
        c.active = true;
        c.openToJoin = false;

        emit CircleCreated(id, msg.sender, address(token), contribution, periodSeconds, members);
    }

    function getCircle(uint256 id) external view returns (
        address organizer,
        address token,
        uint256 contribution,
        uint256 periodSeconds,
        address[] memory members,
        uint256 currentIndex,
        uint256 nextPayoutTime,
        uint256 round,
        bool active,
        bool openToJoin
    ) {
        Circle storage c = circles[id];
        organizer = c.organizer;
        token = address(c.token);
        contribution = c.contribution;
        periodSeconds = c.periodSeconds;
        members = c.members;
        currentIndex = c.currentIndex;
        nextPayoutTime = c.nextPayoutTime;
        round = c.round;
        active = c.active;
        openToJoin = c.openToJoin;
    }

    function totalCircles() external view returns (uint256) {
        if (nextId == 0) return 0; // shouldn't happen
        return nextId - 1;
    }

    function deposit(uint256 id) external {
        Circle storage c = circles[id];
        require(c.active, "inactive");
        require(_isMember(c, msg.sender), "not member");
        require(!c.openToJoin, "join window open");
        require(!c.hasDepositedForRound[c.round][msg.sender], "already");
        require(c.token.transferFrom(msg.sender, address(this), c.contribution), "transferFrom fail");
        c.hasDepositedForRound[c.round][msg.sender] = true;
        emit Deposited(id, c.round, msg.sender, c.contribution);
    }

    function canPayout(uint256 id) public view returns (bool) {
        Circle storage c = circles[id];
        if (!c.active) return false;
        if (block.timestamp < c.nextPayoutTime) return false;
        // Ensure every member has deposited for this round
        for (uint256 i = 0; i < c.members.length; i++) {
            if (!c.hasDepositedForRound[c.round][c.members[i]]) return false;
        }
        return true;
    }

    function payout(uint256 id) external {
        Circle storage c = circles[id];
        require(canPayout(id), "not ready");
        address recipient = c.members[c.currentIndex];
        uint256 pot = c.contribution * c.members.length;
        require(c.token.transfer(recipient, pot), "transfer fail");
        emit Payout(id, c.round, recipient, pot);

        // advance state
        c.round += 1;
        c.currentIndex = (c.currentIndex + 1) % c.members.length;
        // If a cycle just completed, open join window and pause schedule
        if (c.currentIndex == 0) {
            c.openToJoin = true;
            c.nextPayoutTime = 0;
            emit CycleCompleted(id, c.round);
            emit OpenToJoinSet(id, true);
        } else {
            c.nextPayoutTime = block.timestamp + c.periodSeconds;
        }
    }

    function setOpenToJoin(uint256 id, bool open) external {
        Circle storage c = circles[id];
        require(msg.sender == c.organizer, "not organizer");
        require(c.active, "inactive");
        // Only allow opening when at cycle boundary
        if (open) {
            require(c.currentIndex == 0, "not boundary");
        }
        c.openToJoin = open;
        // When opening, pause schedule; when closing via restart, schedule is set separately
        if (open) {
            c.nextPayoutTime = 0;
        }
        emit OpenToJoinSet(id, open);
    }

    function joinCircle(uint256 id) external {
        Circle storage c = circles[id];
        require(c.active, "inactive");
        require(c.openToJoin, "not open");
        require(!_isMember(c, msg.sender), "already member");
        // Safe to join only at cycle boundary: currentIndex must be 0
        require(c.currentIndex == 0, "not boundary");
        c.members.push(msg.sender);
        emit MemberJoined(id, msg.sender);
    }

    function restart(uint256 id) external {
        Circle storage c = circles[id];
        require(c.active, "inactive");
        require(msg.sender == c.organizer, "not organizer");
        // Must be at cycle boundary to restart
        require(c.currentIndex == 0, "not boundary");
        // Close join window and set next payout schedule
        c.openToJoin = false;
        c.nextPayoutTime = block.timestamp + c.periodSeconds;
        emit OpenToJoinSet(id, false);
        emit Restarted(id, c.nextPayoutTime);
    }

    function terminate(uint256 id) external {
        Circle storage c = circles[id];
        require(msg.sender == c.organizer, "not organizer");
        // Safer to terminate only at boundary (everybody got their payout)
        require(c.currentIndex == 0, "not boundary");
        c.active = false;
        emit Terminated(id);
    }

    function _isMember(Circle storage c, address a) internal view returns (bool) {
        for (uint256 i = 0; i < c.members.length; i++) {
            if (c.members[i] == a) return true;
        }
        return false;
    }
}
