export type TokenInfo = {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
};

// Base Sepolia token list (extend as needed)
export const TOKENS: TokenInfo[] = [
  {
    symbol: "USDC",
    name: "USD Coin (Test)",
    // Example placeholder; replace with official Base Sepolia USDC test address if available
    address: (process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    decimals: 6,
  },
  {
    symbol: "MINI",
    name: "MiniToken (Demo)",
    address: (process.env.NEXT_PUBLIC_MINI_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    decimals: 18,
  },
];
