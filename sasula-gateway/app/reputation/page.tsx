"use client";
import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import repAbi from "@/lib/abis/SocialReputation.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { parseEther } from "viem";

export default function ReputationPage() {
  const { address } = useAccount();
  const [target, setTarget] = useState("");
  const [fund, setFund] = useState("");
  const [borrow, setBorrow] = useState("");
  const { data: score } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "getScore",
    args: [target || address || "0x0000000000000000000000000000000000000000"],
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Social Reputation</h2>

      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Endorse User</div>
        <input className="border rounded p-2 w-full" placeholder="Target 0x... (leave empty for self)" value={target} onChange={(e)=> setTarget(e.target.value)} />
        <div className="flex gap-2">
          <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "endorse", args: [(target || address) as `0x${string}`] })} className="rounded bg-blue-600 text-white px-3 py-2">Endorse</button>
          <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "unendorse", args: [(target || address) as `0x${string}`] })} className="rounded bg-gray-600 text-white px-3 py-2">Unendorse</button>
        </div>
      </div>

      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Your Score</div>
        <div className="text-2xl font-bold">{score?.toString?.() || "0"}</div>
      </div>

      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Micro-loans (using demo MiniToken)</div>
        <input className="border rounded p-2 w-full" placeholder="Fund pool amount" value={fund} onChange={(e)=> setFund(e.target.value)} />
        <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "fundPool", args: [parseEther(fund||"0")] })} className="rounded bg-blue-600 text-white px-3 py-2">Fund Pool</button>
        <input className="border rounded p-2 w-full" placeholder="Borrow amount" value={borrow} onChange={(e)=> setBorrow(e.target.value)} />
        <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "borrow", args: [parseEther(borrow||"0")] })} className="rounded bg-blue-600 text-white px-3 py-2">Borrow</button>
        <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "repay", args: [parseEther(borrow||"0")] })} className="rounded bg-green-600 text-white px-3 py-2">Repay</button>
      </div>
    </div>
  );
}
