# Module README: `scripts/`

> Summary: Hardhat deployment utilities.

## Files
- `deploy.ts`: deploys contracts, writes `deployments/<network>.json`, optionally updates `.env` when `UPDATE_ENV=true`.

## Usage
```bash
TS_NODE_PROJECT=tsconfig.hardhat.json npx hardhat run scripts/deploy.ts --network baseSepolia
# or via npm scripts
npm run deploy:base
npm run deploy:base:env
```
