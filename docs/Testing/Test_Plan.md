# Test Plan

> Summary: Approach, scope, and responsibilities for testing Sasula Gateway.

## Scope
- Smart contracts: unit tests for PaymentRouter, EmergencyMode, SocialReputation, SavingsCircles, MiniToken.
- Frontend: basic integration smoke tests (manual for now) around send, savings, reputation pages.

## Strategy
- Unit tests in Hardhat with Chai.
- Aim for happy‑path coverage and revert cases.
- Gas reporter and coverage tools configured where applicable.

## Environments
- Local Hardhat, then Base Sepolia testnet for end‑to‑end checks.

## Entry/Exit Criteria
- All unit tests passing; basic manual flows verified on testnet.

## Roles & Responsibilities
- Developers write tests and fix regressions before merging.

## References
- See [Test Cases](./Test_Cases.md) mapped to PRD stories.
