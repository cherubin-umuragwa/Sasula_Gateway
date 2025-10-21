# Sasula Gateway — P2P Payments, Reputation, and Savings on Base

> A decentralized, community‑first payment and micro‑finance dApp running on Base Sepolia. Send ETH/tokens with notes, build social reputation, and participate in rotating savings circles (ROSCA). Includes an emergency mode to waive fees during crises.

[Docs Home](./docs) · [Vision](./docs/Vision%20&%20Strategy/Software_Vision_Document.md) · [PRD](./docs/Vision%20&%20Strategy/Product_Requirements_Document_(PRD).md) · [Architecture](./docs/Architecture%20&%20Design/Software_Architecture_Document.md) · [API](./docs/Development/API_Documentation.md) · [Contribution Guide](./docs/additional/Contribution_Guide.md)

## What is this project?
Sasula Gateway is a Next.js + Solidity application enabling:
- Low‑fee, near‑instant P2P payments on Base L2
- On‑chain social reputation and basic micro‑loans
- Rotating savings circles (ROSCA)
- Authority‑controlled emergency mode for fee waivers

## Key Features
- **Payments**: `payETH` / `payERC20` with social message events
- **Reputation**: endorsements, activity metrics, pool funding and loans
- **Savings**: create circles, deposit per round, timed payouts
- **Emergency Mode**: toggle global/region emergencies (future integration with router)
- **Modern UX**: Wallet onboarding with RainbowKit, Wagmi hooks, Tailwind UI

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind
- **Web3**: Wagmi, Viem, RainbowKit
- **Smart Contracts**: Solidity 0.8.24, Hardhat, Ethers v6
- **Tests**: Hardhat + Chai
- **Infra/Tools**: Vercel, ESLint 9, TypeScript 5, Basescan

## Installation & Setup
1. Install dependencies
```bash
npm install
```
2. Configure environment
```bash
cp .env.example .env
# Fill PRIVATE_KEY, BASE_SEPOLIA_RPC_URL, optional BASESCAN_API_KEY
# Fill NEXT_PUBLIC_* contract addresses after deploy (or use deploy:base:env)
```
3. Run tests
```bash
npm run test
```
4. Start the dev server
```bash
npm run dev
```

## Deployments
- Deploy contracts to Base Sepolia and record addresses
```bash
npm run deploy:base
# or auto‑update .env with addresses
npm run deploy:base:env
```
- See `deployments/baseSepolia.json` for the latest addresses.

## Environment Variables
See full list in [Configuration & Environment Setup](./docs/Development/Configuration_&_Environment_Setup.md). Common keys:
- `PRIVATE_KEY`, `BASE_SEPOLIA_RPC_URL`, `BASESCAN_API_KEY`
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_EMERGENCY_MODE_ADDRESS`, `NEXT_PUBLIC_SOCIAL_REPUTATION_ADDRESS`, `NEXT_PUBLIC_SAVINGS_CIRCLES_ADDRESS`, `NEXT_PUBLIC_MINI_TOKEN_ADDRESS`, `NEXT_PUBLIC_USDC_ADDRESS`

## Project Structure
```
app/                 # Next.js App Router pages and components
contracts/           # Solidity contracts
scripts/             # Hardhat deploy & utilities
deployments/         # Network → addresses map
lib/                 # ABIs and helpers
test/                # Hardhat tests
```

## How to Contribute
Please read the [Contribution Guide](./docs/additional/Contribution_Guide.md) and the [Coding Style Guide](./docs/Development/Coding_Style_Guide.md).

## License
MIT — see [License & Terms of Use](./docs/Security%20&%20Legal/License_&_Terms_of_Use.md).

## Contact
- Email: [To be filled]
- Website: `https://sasula-gateway.vercel.app`

## Credits
- Built with Base, Wagmi, Viem, RainbowKit, Next.js

## Badges
- Build: [To be wired with CI]
- License: MIT
- Version: 0.1.1
