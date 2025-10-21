# Coding Style Guide

> Summary: Conventions for Solidity, TypeScript/React, and documentation to ensure readability and safety.

## General Principles
- Prefer clarity over cleverness; name things descriptively.
- Guard clauses over deep nesting; avoid unnecessary try/catch.
- Keep comments focused on non-obvious rationale and invariants.

## Solidity
- Compiler: `pragma solidity ^0.8.24;`
- Enable optimizer with reasonable runs (e.g., 200).
- Emit events for state-changing actions with off‑chain significance.
- Use `unchecked {}` only where safe and justified.
- Avoid unbounded loops in critical paths; document where acceptable (e.g., ROSCA members small N).
- Separate admin/authority concerns via modifiers.

## TypeScript / React (Next.js App Router)
- Use function components and hooks; avoid unnecessary state.
- Strongly type public APIs; avoid `any`.
- Keep components small; colocate styles; prefer composition.
- Use `wagmi` for chain interactions and `viem` for utilities.
- Keep environment reads behind `process.env.NEXT_PUBLIC_*` for browser.

## Project
- Lint with ESLint 9, follow Next.js recommendations.
- Tests with Hardhat + Chai; aim for clear, behavior‑driven specs.
- Documentation in `/docs` with cross‑links and summaries.
