# Admin Guide

> Summary: Admin/authority tasks such as toggling emergency mode and configuring addresses.

## Roles
- Admin (contract deployer) and authorized authorities (set by admin).

## Emergency Mode
- Toggle global emergency in `EmergencyMode`:
  - `setGlobalEmergency(true|false)`
- Set region emergency:
  - `setRegionEmergency(bytes32("UG-Kampala"), true)`

## Contract Addresses
- Located in `deployments/baseSepolia.json` and environment variables.

## Wallet & Permissions
- Use a dedicated admin wallet; avoid reusing user wallets.
