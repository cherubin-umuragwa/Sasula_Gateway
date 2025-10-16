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
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Savings Circles</h2>

      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Create Circle</div>
        <input className="border rounded p-2 w-full" placeholder="Token address (ERC-20)" value={token} onChange={(e)=> setToken(e.target.value)} />
        <input className="border rounded p-2 w-full" placeholder="Members (comma-separated 0x...)" value={members} onChange={(e)=> setMembers(e.target.value)} />
        <input className="border rounded p-2 w-full" placeholder="Contribution (e.g. 1)" value={contribution} onChange={(e)=> setContribution(e.target.value)} />
        <input className="border rounded p-2 w-full" placeholder="Period seconds (>=60)" value={period} onChange={(e)=> setPeriod(e.target.value)} />
        <button disabled={isPending||isLoading} onClick={createCircle} className="rounded bg-blue-600 text-white px-3 py-2">Create</button>
      </div>

      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Manage Round</div>
        <input className="border rounded p-2 w-full" placeholder="Circle ID" value={circleId} onChange={(e)=> setCircleId(e.target.value)} />
        <div className="flex gap-2">
          <button disabled={isPending||isLoading} onClick={deposit} className="rounded bg-blue-600 text-white px-3 py-2">Deposit</button>
          <button disabled={isPending||isLoading} onClick={payout} className="rounded bg-green-600 text-white px-3 py-2">Payout</button>
        </div>
      </div>
      {hash && <div className="text-sm">Tx: {hash}</div>}
      {error && <div className="text-sm text-red-600">{error.message}</div>}
    </div>
  );
}
