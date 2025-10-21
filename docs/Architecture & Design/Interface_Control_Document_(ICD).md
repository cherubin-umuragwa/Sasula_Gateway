# Interface Control Document (ICD)

> Summary: Defines interfaces between modules (frontend ↔ contracts) including inputs/outputs, data types, and events. Links: [System Design](./System_Design_Document.md), [API Documentation](../Development/API_Documentation.md).

## 1. Frontend ↔ Smart Contracts
- Transport: JSON‑RPC via wallet providers (Wagmi/Viem).
- Network: Base Sepolia (chainId 84532).

### 1.1 PaymentRouter
- Functions:
  - `payETH(address to, string message)` payable
  - `payERC20(address token, address to, uint256 amount, string message)`
- Events:
  - `PaymentSent(address from, address to, address token, uint256 amount, string message, uint256 timestamp)`

### 1.2 EmergencyMode
- Functions:
  - `setGlobalEmergency(bool active)` (authority)
  - `setRegionEmergency(bytes32 region, bool active)` (authority)
  - `isEmergency(bytes32 region) view returns (bool)`
- Events: `GlobalEmergencySet`, `RegionEmergencySet`, `AuthorityUpdated`

### 1.3 SocialReputation
- Functions:
  - `setAuthorizedCaller(address caller, bool allowed)` (admin)
  - `reportPayment(address from, address to, address token, uint256 amountNormalized1e18)` (authorized)
  - `fundPool(uint256 amount)` / `withdrawAmount(uint256 amount)` / `withdrawShares(uint256 shares)`
  - `borrow(uint256 amount)` / `repay(uint256 amount)`
  - `getScore(address user) view returns (uint256)`
- Events: `PaymentReported`, `Endorsed`, `Unendorsed`, `PoolFunded`, `PoolWithdrawn`, `Borrowed`, `Repaid`

### 1.4 SavingsCircles
- Functions:
  - `createCircle(IERC20 token, address[] members, uint256 contribution, uint256 periodSeconds) returns (uint256 id)`
  - `getCircle(uint256 id) view returns (...)`
  - `deposit(uint256 id)`
  - `canPayout(uint256 id) view returns (bool)`
  - `payout(uint256 id)`
- Events: `CircleCreated`, `Deposited`, `Payout`

## 2. Environment Variables ↔ Frontend
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`: RPC URL
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect
- Contract addresses:
  - `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_EMERGENCY_MODE_ADDRESS`, `NEXT_PUBLIC_SOCIAL_REPUTATION_ADDRESS`, `NEXT_PUBLIC_SAVINGS_CIRCLES_ADDRESS`, `NEXT_PUBLIC_MINI_TOKEN_ADDRESS`

## 3. Artifacts ↔ Frontend
- ABIs at `lib/abis/*.json` (copied from `artifacts`)
- Addresses from `.env` or `deployments/baseSepolia.json`

## 4. Notes
- For production, consider read-only provider for public pages and rate limiting.
- Consider subgraph for historical queries.
