# API Documentation (Smart Contracts)

> Summary: On-chain contract APIs, parameters, and example interactions for Sasula Gateway. Links: [ICD](../Architecture & Design/Interface_Control_Document_(ICD).md), [System Design](../Architecture & Design/System_Design_Document.md).

## Networks
- Base Sepolia (chainId 84532)
- Addresses recorded in `deployments/baseSepolia.json` and in environment variables.

## Common Types
- `address`: 20‑byte account/contract address
- `uint256`: 256‑bit unsigned integer
- `bytes32`: 32‑byte fixed array

## PaymentRouter
- Address: `${NEXT_PUBLIC_CONTRACT_ADDRESS}`
- ABI: `lib/abis/PaymentRouter.json`
- Functions:
  - `payETH(address to, string message)` payable
  - `payERC20(address token, address to, uint256 amount, string message)`
  - `setEmergencyActive(bool active)` (admin)
  - `setFlatEthFeeWei(uint256 newFee)` (admin)
- Events:
  - `PaymentSent(address from, address to, address token, uint256 amount, string message, uint256 timestamp)`
- Example (ETH):
```ts
import { writeContract } from 'wagmi/actions'
await writeContract({
  abi: PaymentRouterAbi,
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  functionName: 'payETH',
  args: [recipient, 'thanks!'],
  value: parseEther('0.01'),
})
```

## EmergencyMode
- Address: `${NEXT_PUBLIC_EMERGENCY_MODE_ADDRESS}`
- Functions: `setGlobalEmergency(bool)`, `setRegionEmergency(bytes32,bool)`, `isEmergency(bytes32)`

## SocialReputation
- Address: `${NEXT_PUBLIC_SOCIAL_REPUTATION_ADDRESS}`
- Functions: `setAuthorizedCaller(address,bool)`, `reportPayment(address,address,address,uint256)`, `fundPool(uint256)`, `withdrawAmount(uint256)`, `withdrawShares(uint256)`, `borrow(uint256)`, `repay(uint256)`, `getScore(address)`

## SavingsCircles
- Address: `${NEXT_PUBLIC_SAVINGS_CIRCLES_ADDRESS}`
- Functions: `createCircle(IERC20,address[],uint256,uint256)`, `getCircle(uint256)`, `deposit(uint256)`, `canPayout(uint256)`, `payout(uint256)`

## Notes
- For ERC‑20 amounts, use token decimals (often 6 or 18). Normalize to 1e18 for reputation scoring when reporting payments.
- Use a block explorer (Basescan) to view emitted events.
