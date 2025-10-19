"use client";
import { useAccount, useBalance } from "wagmi";
import Link from "next/link";

export default function Dashboard() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5 space-y-2">
          <div className="text-sm opacity-70">Connected Wallet</div>
          <div className="font-mono text-sm break-all truncate">{address || "Not connected"}</div>
          <div className="text-sm opacity-70">Network</div>
          <div>{chain?.name || "-"}</div>
        </div>
        <div className="card p-5 space-y-2">
          <div className="text-sm opacity-70">Balance</div>
          <div className="text-3xl font-extrabold">{balance ? `${balance.formatted} ${balance.symbol}` : "-"}</div>
          <div className="text-xs opacity-70">On Base Sepolia</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link className="btn btn-primary" href="/send">Send</Link>
        <Link className="btn btn-secondary" href="/feed">Feed</Link>
        <Link className="btn btn-primary" href="/savings">Savings</Link>
        <Link className="btn btn-secondary" href="/reputation">Reputation</Link>
        <Link className="btn btn-primary" href="/emergency">Emergency</Link>
        <Link className="btn btn-secondary" href="/voice">Voice</Link>
      </div>
    </div>
  );
}
