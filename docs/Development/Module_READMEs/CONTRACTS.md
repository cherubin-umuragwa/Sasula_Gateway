# Module README: `contracts/` (Solidity)

> Summary: Core contracts deployed to Base Sepolia.

## Files
- `PaymentRouter.sol`: ETH/ERC‑20 payments, optional fees, events.
- `EmergencyMode.sol`: global/region emergency switches and authorities.
- `SocialReputation.sol`: metrics, endorsements, pool shares, micro‑loans.
- `SavingsCircles.sol`: rotating savings circle (ROSCA) logic.
- `MiniToken.sol`: simple demo ERC‑20‑like token.

## Build & Test
```bash
npm run test
```

## Deploy
```bash
npm run deploy:base
npm run deploy:base:env
```
