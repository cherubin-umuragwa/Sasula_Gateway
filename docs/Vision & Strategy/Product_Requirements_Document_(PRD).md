# Product Requirements Document (PRD)

> Summary: User stories, functional requirements, and acceptance criteria for Sasula Gateway. Links to [Vision](./Software_Vision_Document.md) and [System Design](../Architecture & Design/System_Design_Document.md).

## 1. Goals
- Simple, low‑fee P2P payments on Base L2.
- Community reputation and small loans.
- Transparent rotating savings circles.

## 2. User Stories
- As a user, I can connect a wallet and send ETH or tokens with a note.
- As a user, I can join a savings circle and receive rotating payouts.
- As a user, I can view my reputation score and endorsements.
- As an authority, I can toggle global or regional emergency state.

## 3. Functional Requirements
- Payments: `payETH`, `payERC20`, events for indexing; fee toggle by emergency.
- SavingsCircles: create circle, deposit per round, automated payout.
- Reputation: report payments, endorse/unendorse, basic score function, micro‑loan pool (fund/borrow/repay).
- EmergencyMode: admin/authority control, region codes, query emergency state.

## 4. Non‑Functional Requirements
- Usability: wallet onboarding (RainbowKit), responsive UI.
- Reliability: idempotent UI actions, clear error states.
- Security: least‑privilege admin flows, contract invariants, no unbounded loops in critical paths where feasible.
- Performance: fast render, minimal RPC calls, event-driven updates where possible.

## 5. Acceptance Criteria (examples)
- A connected user can send ETH and see an event in explorer.
- Deposits from all members enable a ROSCA payout, rotating recipients.
- Reputation score increases after payments and endorsements.
- Authority can enable emergency; fees waived in PaymentRouter while active.

## 6. Out of Scope (v0)
- Mainnet deployment; fiat on-ramps; cross‑chain bridging; advanced credit scoring.

## 7. Dependencies
- Base Sepolia RPC, wallet providers, browser crypto APIs.

## 8. Traceability
- See [API Documentation](../Development/API_Documentation.md) and [Test Cases](../Testing/Test_Cases.md) mapping to user stories.
