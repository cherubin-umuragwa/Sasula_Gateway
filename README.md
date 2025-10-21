# Sasula Gateway

A community-first, decentralized P2P payments and micro‑finance application on Base (Sepolia testnet). It enables fast, low‑fee transfers, rotating savings circles (ROSCA), basic on‑chain reputation, and an authority‑controlled emergency mode to waive fees during crises.

- **Website**: [To be filled]
- **Docs root**: see `/docs` (start with [Software Vision](docs/Vision & Strategy/Software_Vision_Document.md))
- **Contribute**: see [Contribution Guide](docs/Additional/Contribution_Guide.md)

## Key Features
- **P2P payments**: Send native ETH or ERC‑20 tokens with optional message; event‑driven history for indexing.
- **Emergency mode**: Admin/authority can waive fees globally or by region (future integration) to support crisis payments.
- **Reputation & micro‑loans**: Simple scoring from activity and endorsements; pooled token funding; borrow/repay with flat interest (demo).
- **Savings circles (ROSCA)**: Create a circle, deposit each round, payout rotates among members on schedule.
- **Modern Web3 UX**: Next.js 15, Wagmi + RainbowKit, Tailwind.

## Technology Stack
- **Frontend**: Next.js (App Router), React 19, Tailwind, TanStack Query, RainbowKit, Wagmi, Viem, Leaflet (maps), QR/voice utilities.
- **Smart Contracts**: Solidity 0.8.24, Hardhat, ethers v6, TypeChain; contracts: `PaymentRouter`, `EmergencyMode`, `SocialReputation`, `SavingsCircles`, `MiniToken`.
- **Network**: Base Sepolia (chainId 84532). Deployed addresses recorded in `deployments/baseSepolia.json`.
- **Tooling**: ESLint 9, TypeScript 5, solidity-coverage, hardhat-gas-reporter, Vercel for hosting.

## Getting Started (Local)
1) Install dependencies
```bash
npm install
```
2) Configure environment
```bash
cp .env.example .env
# Fill PRIVATE_KEY, BASE_SEPOLIA_RPC_URL, BASESCAN_API_KEY (optional)
# Fill NEXT_PUBLIC_* addresses after deployment or use deploy:base:env
```
3) Run the app
```bash
npm run dev
```
4) Run tests
```bash
npm run test
```

## Deployment
- Deploy contracts to Base Sepolia:
```bash
npm run deploy:base         # writes deployments/baseSepolia.json
npm run deploy:base:env     # also updates .env NEXT_PUBLIC_* addresses
```
- Frontend: deploy on Vercel; build command `npm run vercel-build`.

## Environment Variables
See full table in [Configuration & Environment Setup](docs/Development/Configuration_&_Environment_Setup.md). Common values:
- `PRIVATE_KEY`, `BASE_SEPOLIA_RPC_URL`, `BASESCAN_API_KEY`
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_EMERGENCY_MODE_ADDRESS`
- `NEXT_PUBLIC_SOCIAL_REPUTATION_ADDRESS`, `NEXT_PUBLIC_SAVINGS_CIRCLES_ADDRESS`
- `NEXT_PUBLIC_MINI_TOKEN_ADDRESS`, `NEXT_PUBLIC_USDC_ADDRESS`

## Project Structure
```
app/                 # Next.js app router pages and components
contracts/           # Solidity contracts
scripts/             # Hardhat deploy scripts
lib/                 # ABIs, contract address helpers, token list
deployments/         # Per-network deployed addresses
test/                # Hardhat tests
/docs                # Full documentation suite
```

## Contributing
Please read the [Contribution Guide](docs/Additional/Contribution_Guide.md) and the [Coding Style Guide](docs/Development/Coding_Style_Guide.md). Open PRs with a summary and test plan. Small, focused changes preferred.

## License
MIT by default; see [License & Terms](docs/Security & Legal/License_&_Terms_of_Use.md). If a different license applies, update the `LICENSE` file and docs accordingly.

## Contact
- Email: [To be filled]
- Social: [To be filled]

## Credits
- Built with Base, Wagmi, RainbowKit, Viem. Thanks to the open-source community.

## Badges
[To be added: build status, license, version]
