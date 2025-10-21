# Deployment Guide

> Summary: Steps to deploy contracts and run the Next.js app in production. Links: [Configuration & Environment Setup](../Development/Configuration_&_Environment_Setup.md).

## Prerequisites
- Node.js LTS, npm
- Wallet with Base Sepolia funds for gas (testnet)

## Deploy Contracts (Base Sepolia)
1. Configure `.env` (see config doc)
2. Run tests: `npm run test`
3. Deploy:
```bash
npm run deploy:base
```
4. Optional: auto‑write addresses into `.env`:
```bash
npm run deploy:base:env
```
5. Verify deployment outputs in `deployments/baseSepolia.json`

## Run Frontend (Production)
- Build: `npm run build`
- Start: `npm start`
- Vercel (recommended): auto‑build using `vercel.json` with `vercel-build` script.

## Rollback
- Retain previous `deployments/*.json` and environment configs.
- Re‑deploy prior tag; update `.env` to previous contract addresses.

## Monitoring
- Use Basescan for tx status and events.
- Add basic uptime checks to frontend.
