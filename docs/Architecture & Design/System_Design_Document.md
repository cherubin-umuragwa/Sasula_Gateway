# System Design Document

> Summary: Detailed design for modules, contracts, and UX interactions. Links: [Architecture](./Software_Architecture_Document.md), [ICD](./Interface_Control_Document_(ICD).md), [API Documentation](../Development/API_Documentation.md).

## Contract Design
- PaymentRouter: minimal state, event-driven history, optional fees; future: consult `EmergencyMode` on-chain.
- EmergencyMode: admin + authorities; region map keyed by `bytes32` codes like `bytes32("UG-Kampala")`.
- SocialReputation: metrics, endorsements, pool shares, borrow/repay with flat interest (demo).
- SavingsCircles: per-circle struct, deposits-per-round, timed payouts rotating through members.

## Frontend Design
- App Router pages map to features; hooks use Wagmi/Viem.
- Contract addresses loaded from env via `lib/contracts.ts`.

## State & Events
- Minimal on-chain state; rely on events for history (`PaymentSent`, circle `Deposited/Payout`, reputation events).

## Error Handling
- UI to surface revert reasons; guard clauses in contracts (`require`).

## Extensibility
- Plug-in token lists via `lib/tokenlist.ts`.
- Optional subgraph for indexing.

## Cross-References
- See [API Documentation](../Development/API_Documentation.md) for function surfaces.
- See [User Manual](../User & Training/User_Manual.md) for flows.
