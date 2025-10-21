# Module README — `scripts/`

> Summary: Deployment and utility scripts for Hardhat.

## `deploy.ts`
- Deploys PaymentRouter, EmergencyMode, MiniToken, SocialReputation, SavingsCircles.
- Writes `deployments/{network}.json`.
- If `UPDATE_ENV=true`, updates `.env` with deployed addresses.

## Usage
```bash
npm run deploy:base
npm run deploy:base:env
```
