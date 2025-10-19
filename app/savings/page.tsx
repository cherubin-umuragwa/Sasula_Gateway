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
    <div className="min-h-[calc(100vh-120px)] p-4 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Savings Circles</h2>

      <div className="rounded-xl border p-4 bg-white/60 dark:bg-black/40 backdrop-blur space-y-3">
        <div className="font-semibold">Step 1 — Create a circle</div>
        <p className="text-sm opacity-80">Pick an ERC‑20 token, add members, set a contribution and a payout period. Everyone deposits each round; one member receives the pot per round.</p>
        <div className="grid gap-2">
          <input className="border rounded p-2 w-full" placeholder="Token address (ERC‑20)" value={token} onChange={(e)=> setToken(e.target.value)} />
          <input className="border rounded p-2 w-full" placeholder="Members (comma‑separated 0x...)" value={members} onChange={(e)=> setMembers(e.target.value)} />
          <input className="border rounded p-2 w-full" placeholder="Contribution (e.g. 1)" value={contribution} onChange={(e)=> setContribution(e.target.value)} />
          <input className="border rounded p-2 w-full" placeholder="Period seconds (≥ 60)" value={period} onChange={(e)=> setPeriod(e.target.value)} />
        </div>
        <button disabled={isPending||isLoading} onClick={createCircle} className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-500 transition">Create circle</button>
      </div>

      <div className="rounded-xl border p-4 bg-white/60 dark:bg-black/40 backdrop-blur space-y-3">
        <div className="font-semibold">Step 2 — Manage the current round</div>
        <p className="text-sm opacity-80">Enter the Circle ID to deposit your share or trigger payout when the period ends and everyone has deposited.</p>
        <input className="border rounded p-2 w-full" placeholder="Circle ID" value={circleId} onChange={(e)=> setCircleId(e.target.value)} />
        <div className="flex gap-2">
          <button disabled={isPending||isLoading} onClick={deposit} className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-500 transition">Deposit for this round</button>
          <button disabled={isPending||isLoading} onClick={payout} className="rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-500 transition">Payout to recipient</button>
        </div>
        <ul className="text-xs opacity-70 list-disc pl-5 space-y-1">
          <li>Each member must approve the SavingsCircles contract to spend the token once (in their wallet).</li>
          <li>Payout becomes available after the period elapses and all deposits are in.</li>
        </ul>
        {hash && <div className="text-xs break-all">Tx: {hash}</div>}
        {error && <div className="text-sm text-red-600">{error.message}</div>}
      </div>
    </div>
  );
}
