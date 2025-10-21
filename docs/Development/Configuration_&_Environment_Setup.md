# Configuration & Environment Setup

> Summary: All environment variables and configuration steps for local, test, and production environments. Links: [Deployment Guide](../Deployment & Operations/Deployment_Guide.md).

## Environment Files
- Copy `.env.example` to `.env` and fill values.

### Backend/Contracts
- `PRIVATE_KEY`: test wallet private key for deployments (never mainnet funds)
- `BASE_SEPOLIA_RPC_URL`: Base Sepolia RPC URL
- `BASESCAN_API_KEY`: optional for contract verification

### Frontend
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`: RPC URL used by the browser
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: from WalletConnect
- Contract addresses:
  - `NEXT_PUBLIC_CONTRACT_ADDRESS`
  - `NEXT_PUBLIC_EMERGENCY_MODE_ADDRESS`
  - `NEXT_PUBLIC_SOCIAL_REPUTATION_ADDRESS`
  - `NEXT_PUBLIC_SAVINGS_CIRCLES_ADDRESS`
  - `NEXT_PUBLIC_MINI_TOKEN_ADDRESS`
  - `NEXT_PUBLIC_USDC_ADDRESS` (optional)

## Local Setup
1. `npm install`
2. `cp .env.example .env` and edit values
3. Run tests: `npm run test`
4. (optional) Deploy to Base Sepolia and auto‑update .env:
   - `npm run deploy:base:env`

## Production Notes
- Use read‑only RPC for public pages; rotate keys.
- Configure CI to run tests and lint; avoid failing builds on lint during initial setup.
- Store secrets in encrypted CI variables; never commit secrets.
