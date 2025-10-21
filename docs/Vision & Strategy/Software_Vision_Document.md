# Software Vision Document

> Summary: High-level vision for Sasula Gateway — a P2P payment and community finance dApp on Base Sepolia — including purpose, target users, and success criteria. Links to the [PRD](./Product_Requirements_Document_(PRD).md) and [System Design](../Architecture & Design/System_Design_Document.md).

## 1. Product Vision
Sasula Gateway is a decentralized, community-first P2P payments and micro‑finance application running on Base Sepolia (L2). It makes sending/receiving funds fast and inexpensive, enables community reputation and rotating savings circles (ROSCA), and provides an emergency mode to waive fees during crises.

## 2. Problem Statement
- Traditional money transfer is costly and slow across regions.
- Informal savings groups lack transparency and automation.
- Access to micro‑loans is limited without formal credit history.

## 3. Objectives
- Enable low‑fee, near‑instant P2P payments.
- Provide on‑chain reputation signals to unlock micro‑loans.
- Support rotating savings circles with transparent on‑chain rules.
- Allow authorities/NGOs to toggle emergency mode when needed.

## 4. Target Users
- Individuals sending money to friends/family.
- Community groups operating savings circles.
- NGOs or local authorities coordinating crisis response.
- Developers who want to integrate on‑chain payments and reputation.

## 5. Key Features
- PaymentRouter: Native ETH and ERC‑20 transfers with social messages/events.
- EmergencyMode: Authority‑controlled global/region emergency state.
- SocialReputation: Simple reputation metrics + micro‑loan pool.
- SavingsCircles: Minimal ROSCA implementation with rotating payouts.
- Next.js frontend using Wagmi + RainbowKit for wallet UX.

## 6. Principles & Non‑Goals
- Principles: Security, clarity, transparency, UX-first, low fees.
- Non‑Goals (current scope): Complex KYC, fiat ramps, advanced loan underwriting.

## 7. Success Metrics (examples)
- Median payment confirmation < 10s (L2).
- < $0.01 typical fee on testnet (gas proxy metric).
- Monthly active users in savings circles and micro‑loans.
- Support requests time to resolution.

## 8. Constraints & Risks
- Smart contract security and economic design.
- Wallet UX and user education.
- Testnet/Mainnet RPC reliability.

## 9. Roadmap Summary
See [Roadmap](../additional/Roadmap.md) for milestones and timelines. Architectural details in the [Software Architecture Document](../Architecture & Design/Software_Architecture_Document.md).

## 10. References
- Base L2: `https://base.org`
- Viem & Wagmi docs: `https://viem.sh`, `https://wagmi.sh`
- See [API Documentation](../Development/API_Documentation.md) for contract APIs.
