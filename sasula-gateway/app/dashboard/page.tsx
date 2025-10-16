"use client";
import { useAccount, useBalance } from "wagmi";
import Link from "next/link";

export default function Dashboard() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="rounded-lg border p-4 space-y-1">
        <div><strong>Address:</strong> {address || "Not connected"}</div>
        <div><strong>Network:</strong> {chain?.name || "-"}</div>
        <div><strong>Balance:</strong> {balance ? `${balance.formatted} ${balance.symbol}` : "-"}</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/send">Send</Link>
        <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/feed">Feed</Link>
        <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/savings">Savings</Link>
      </div>
    </div>
  );
}
