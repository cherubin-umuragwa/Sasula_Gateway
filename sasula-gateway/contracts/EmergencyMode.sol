// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EmergencyMode
 * @dev Government-activated emergency controller; PaymentRouter can consult this to waive fees
 */
contract EmergencyMode {
    address public immutable admin;

    // Global emergency switch
    bool public globalEmergency;

    // Region-based emergency by code (e.g., bytes32("UG-Kampala"))
    mapping(bytes32 => bool) public regionEmergency;

    // Authorized government/NGO accounts allowed to toggle emergencies
    mapping(address => bool) public isAuthority;

    event AuthorityUpdated(address indexed authority, bool allowed);
    event GlobalEmergencySet(bool active, uint256 timestamp);
    event RegionEmergencySet(bytes32 indexed region, bool active, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyAuthority() {
        require(msg.sender == admin || isAuthority[msg.sender], "Only authority");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setAuthority(address authority, bool allowed) external onlyAdmin {
        isAuthority[authority] = allowed;
        emit AuthorityUpdated(authority, allowed);
    }

    function setGlobalEmergency(bool active) external onlyAuthority {
        globalEmergency = active;
        emit GlobalEmergencySet(active, block.timestamp);
    }

    function setRegionEmergency(bytes32 region, bool active) external onlyAuthority {
        regionEmergency[region] = active;
        emit RegionEmergencySet(region, active, block.timestamp);
    }

    function isEmergency(bytes32 region) external view returns (bool) {
        return globalEmergency || regionEmergency[region];
    }
}
