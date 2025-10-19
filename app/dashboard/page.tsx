"use client";
import { useAccount, useBalance, useReadContract } from "wagmi";
import repAbi from "@/lib/abis/SocialReputation.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import Link from "next/link";

export default function Dashboard() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: score } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "getScore",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });
  const { data: limit } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "maxBorrowable",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });
  const { data: stakeValue } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "getUserStakeValue",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  return (
    <div className="responsive-container py-2 sm:py-4 space-y-3 sm:space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
      <h2 className="responsive-text font-bold">Overview</h2>
      <div className="responsive-grid-2">
        <div className="card p-3 sm:p-5 space-y-2">
          <div className="text-xs sm:text-sm opacity-70">Connected Wallet</div>
          <div className="font-mono text-xs sm:text-sm no-overflow">{address || "Not connected"}</div>
          <div className="text-xs sm:text-sm opacity-70">Network</div>
          <div className="text-xs sm:text-sm">{chain?.name || "-"}</div>
        </div>
        <div className="card p-3 sm:p-5 space-y-2">
          <div className="text-xs sm:text-sm opacity-70">Balance</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold">{balance ? `${Number(balance.formatted).toLocaleString(undefined,{ maximumFractionDigits: 6 })} ${balance.symbol}` : "-"}</div>
          <div className="text-xs opacity-70">On Base Sepolia</div>
        </div>
        <div className="card p-3 sm:p-5 space-y-2">
          <div className="text-xs sm:text-sm opacity-70">Reputation Score</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold">{score ? String(score) : "0"}</div>
          <div className="text-xs opacity-70">Grows with transactions, endorsements and pool funding.</div>
        </div>
        <div className="card p-3 sm:p-5 space-y-2">
          <div className="text-xs sm:text-sm opacity-70">Max Micro‑loan Limit</div>
          <div className="text-lg sm:text-xl md:text-2xl font-extrabold">{limit ? Number(limit).toLocaleString() : "0"}</div>
          <div className="text-xs opacity-70">Based on your current score and pool size.</div>
        </div>
        <div className="card p-3 sm:p-5 space-y-2 sm:col-span-2">
          <div className="text-xs sm:text-sm opacity-70">Your Pool Stake Value</div>
          <div className="text-lg sm:text-xl md:text-2xl font-extrabold">{stakeValue ? Number(stakeValue).toLocaleString() : "0"}</div>
          <div className="text-xs opacity-70">Withdraw anytime, full or partial.</div>
        </div>
      </div>
      <div className="responsive-grid-3">
        <Link className="responsive-button btn btn-primary" href="/send">Send</Link>
        <Link className="responsive-button btn btn-secondary" href="/feed">Feed</Link>
        <Link className="responsive-button btn btn-primary" href="/savings">Savings</Link>
        <Link className="responsive-button btn btn-secondary" href="/reputation">Reputation</Link>
        <Link className="responsive-button btn btn-primary" href="/emergency">Emergency</Link>
        <Link className="responsive-button btn btn-secondary" href="/voice">Voice</Link>
      </div>
    </div>
  );
}
