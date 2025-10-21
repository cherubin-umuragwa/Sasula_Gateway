"use client";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import scAbi from "@/lib/abis/SavingsCircles.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { parseEther } from "viem";

export default function SavingsPage() {
  const [token, setToken] = useState("");
  const [members, setMembers] = useState("");
  const [contribution, setContribution] = useState("");
  const [period, setPeriod] = useState("60");
  const [circleId, setCircleId] = useState("");
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });

  function createCircle() {
    const memberArr = members.split(",").map((m) => m.trim()).filter(Boolean);
    writeContract({
      address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
      abi: scAbi as any,
      functionName: "createCircle",
      args: [token as `0x${string}`, memberArr as any, parseEther(contribution || "0"), BigInt(period)],
    });
  }

  function deposit() {
    writeContract({
      address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
      abi: scAbi as any,
      functionName: "deposit",
      args: [BigInt(circleId)],
    });
  }

  function payout() {
    writeContract({
      address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
      abi: scAbi as any,
      functionName: "payout",
      args: [BigInt(circleId)],
    });
  }

  return (
    <div className="responsive-container py-6 sm:py-8 max-w-3xl">
      <div className="mb-6 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">Savings Circles</span>
        </h1>
        <p className="text-white/70">Trustless group savings with rotating payouts</p>
      </div>

      <div className="card p-6 space-y-4 animate-fadeInUp">
        <div className="font-semibold text-white">Step 1 — Create a circle</div>
        <p className="text-sm text-white/70">Pick a token, add members, set contribution and payout period.</p>
        <div className="grid gap-3">
          <input className="input w-full" placeholder="Token address (ERC‑20)" value={token} onChange={(e)=> setToken(e.target.value)} />
          <input className="input w-full" placeholder="Members (comma‑separated 0x...)" value={members} onChange={(e)=> setMembers(e.target.value)} />
          <input className="input w-full" placeholder="Contribution (e.g. 1)" value={contribution} onChange={(e)=> setContribution(e.target.value)} />
          <input className="input w-full" placeholder="Period seconds (≥ 60)" value={period} onChange={(e)=> setPeriod(e.target.value)} />
        </div>
        <button disabled={isPending||isLoading} onClick={createCircle} className="btn btn-primary">Create circle</button>
      </div>

      <div className="card p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
        <div className="font-semibold text-white">Step 2 — Manage the current round</div>
        <p className="text-sm text-white/70">Deposit your share or trigger payout when eligible.</p>
        <input className="input w-full" placeholder="Circle ID" value={circleId} onChange={(e)=> setCircleId(e.target.value)} />
        <div className="flex flex-col sm:flex-row gap-3">
          <button disabled={isPending||isLoading} onClick={deposit} className="btn btn-secondary flex-1">Deposit for this round</button>
          <button disabled={isPending||isLoading} onClick={payout} className="btn btn-accent flex-1">Payout to recipient</button>
        </div>
        <ul className="text-xs text-white/70 list-disc pl-5 space-y-1">
          <li>Members must approve the contract to spend the token once.</li>
          <li>Payout available after period elapses and all deposits are in.</li>
        </ul>
        {hash && <div className="text-xs break-all">Tx: {hash}</div>}
        {error && <div className="text-sm text-red-400">{error.message}</div>}
      </div>
    </div>
  );
}
