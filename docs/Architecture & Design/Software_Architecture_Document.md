# Software Architecture Document

> Summary: End‑to‑end architecture including contracts, frontend, and network topology. Links: [System Design](./System_Design_Document.md), [ICD](./Interface_Control_Document_(ICD).md), [API Documentation](../Development/API_Documentation.md).

## Overview
- Frontend: Next.js 15 (App Router), Tailwind, Wagmi, RainbowKit.
- Blockchain: Base Sepolia (chainId 84532) via RPC.
- Smart Contracts: PaymentRouter, EmergencyMode, SocialReputation, SavingsCircles, MiniToken (demo).

## Components
1. Web App (Next.js)
   - Pages: `app/send`, `app/savings`, `app/reputation`, `app/emergency`, `app/qr`, `app/feed`, `app/dashboard`, `app/voice`.
   - Wallet: Wagmi + RainbowKit configured in `app/providers.tsx`.
2. Contracts (Solidity)
   - PaymentRouter: ETH/ERC‑20 transfers, fees, events.
   - EmergencyMode: global/region switch, authorities.
   - SocialReputation: metrics, endorsements, micro‑loans.
   - SavingsCircles: ROSCA lifecycle.
3. Off‑chain
   - No dedicated backend. Indexing can be done via explorers/subgraphs (future).

## Data Flows
- User connects wallet → UI constructs tx → submit via wallet → contracts emit events → UI reflects state.
- Deploy script writes `deployments/baseSepolia.json` and can update `.env`.

## Security Considerations
- Admin/authority separation; avoid privileged misuse.
- Reentrancy not expected in current flows but consider guards if logic expands.
- Token approvals: guide users to revoke when not needed.

## Environments
- Local: Hardhat network/tests.
- Testnet: Base Sepolia.
- Prod: Base mainnet (future).

## References
- See [Configuration & Environment Setup](../Development/Configuration_&_Environment_Setup.md).
- See [Deployment Guide](../Deployment & Operations/Deployment_Guide.md).
