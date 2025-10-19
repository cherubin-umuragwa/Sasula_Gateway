"use client";
import { useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import repAbi from "@/lib/abis/SocialReputation.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { erc20Abi, parseEther, parseUnits, MaxUint256 } from "viem";

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

  const { data: stakeValue } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "getUserStakeValue",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Read loan token address from the contract
  const { data: loanToken } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "loanToken",
    args: [],
  });

  // Read decimals of loan token (default 18 if not available)
  const { data: tokenDecimals } = useReadContract({
    address: (loanToken as `0x${string}`) || undefined,
    abi: erc20Abi,
    functionName: "decimals",
    args: [],
    query: { enabled: !!loanToken },
  });

  // Read allowance for SocialReputation to spend user's token
  const { data: allowance } = useReadContract({
    address: (loanToken as `0x${string}`) || undefined,
    abi: erc20Abi,
    functionName: "allowance",
    args: [
      (address as `0x${string}`) || "0x0000000000000000000000000000000000000000",
      CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    ],
    query: { enabled: !!address && !!loanToken },
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { writeContract: writeApprove, data: approveHash, isPending: isApproving } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });
  const { isLoading: isApproveMining } = useWaitForTransactionReceipt({ hash: approveHash });

  const decimals = useMemo(() => (typeof tokenDecimals === "number" ? tokenDecimals : 18), [tokenDecimals]);
  const fundUnits = useMemo(() => {
    try {
      if (!fund) return 0n;
      return parseUnits(fund, decimals);
    } catch {
      return 0n;
    }
  }, [fund, decimals]);
  const allowanceReady = typeof allowance === "bigint";
  const currentAllowance: bigint = allowanceReady ? (allowance as bigint) : 0n;
  const needsApprove = useMemo(() => {
    if (fundUnits <= 0n) return false;
    // If we haven't loaded allowance yet, default to requiring approve to guide the user
    if (!allowanceReady) return true;
    return currentAllowance < fundUnits;
  }, [allowanceReady, currentAllowance, fundUnits]);

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Social Reputation</h2>

      <div className="rounded-xl border p-4 bg-white/60 dark:bg-black/40 backdrop-blur space-y-3">
        <div className="font-semibold">Your Score</div>
        <p className="text-sm opacity-80">Your reputation grows when you transact and receive endorsements from the community. Higher scores unlock larger micro‑loans.</p>
        <div className="text-3xl font-extrabold">{score?.toString?.() || "0"}</div>
      </div>

      <div className="rounded-xl border p-4 bg-white/60 dark:bg-black/40 backdrop-blur space-y-3">
        <div className="font-semibold">Endorse a user</div>
        <p className="text-sm opacity-80">Endorse trusted contacts to boost their score. You can withdraw your endorsement later.</p>
        <input className="border rounded p-2 w-full" placeholder="Target 0x... (leave empty for self)" value={target} onChange={(e)=> setTarget(e.target.value)} />
        <div className="flex gap-2">
          <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "endorse", args: [(target || address) as `0x${string}`] })} className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-500 transition">Endorse</button>
          <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "unendorse", args: [(target || address) as `0x${string}`] })} className="rounded-lg bg-gray-700 text-white px-4 py-2 hover:bg-gray-600 transition">Unendorse</button>
          <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "selfEndorse", args: [] })} className="rounded-lg bg-purple-600 text-white px-4 py-2 hover:bg-purple-500 transition">Self‑endorse (once)</button>
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-white/60 dark:bg-black/40 backdrop-blur space-y-3">
        <div className="font-semibold">Micro‑loans</div>
        <p className="text-sm opacity-80">Fund the community pool, then eligible users can borrow and repay with a small interest. Your stake grows with pool gains. Demo uses MiniToken.</p>
        <div className="grid gap-2">
          <input className="border rounded p-2 w-full" placeholder={`Fund pool amount (${decimals} decimals)`} value={fund} onChange={(e)=> setFund(e.target.value)} />

          {needsApprove ? (
            <button
              disabled={isApproving||isApproveMining || !fund || Number(fund) <= 0 || !loanToken}
              onClick={()=> writeApprove({
                address: loanToken as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                // approve exactly needed amount (or could use MaxUint256 for unlimited)
                args: [CONTRACT_ADDRESSES.socialReputation as `0x${string}`, fundUnits],
              })}
              className="rounded-lg bg-purple-600 text-white px-4 py-2 hover:bg-purple-500 transition disabled:opacity-50"
            >
              {isApproving||isApproveMining ? "Approving..." : "Approve token"}
            </button>
          ) : (
            <button
              disabled={isPending||isLoading || !fund || Number(fund) <= 0}
              onClick={()=> writeContract({
                address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
                abi: repAbi as any,
                functionName: "fundPool",
                args: [fundUnits] })}
              className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-500 transition disabled:opacity-50"
            >
              {isPending||isLoading ? "Funding..." : "Fund Pool"}
            </button>
          )}
          <div className="text-sm opacity-80">Your current stake value (withdrawable): {stakeValue ? String(stakeValue) : "0"}</div>
          <div className="flex gap-2">
            <input className="border rounded p-2 w-full" placeholder="Withdraw amount" value={borrow} onChange={(e)=> setBorrow(e.target.value)} />
            <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "withdrawAmount", args: [parseEther(borrow||"0")] })} className="rounded-lg bg-gray-700 text-white px-4 py-2 hover:bg-gray-600 transition">Withdraw</button>
          </div>
          <input className="border rounded p-2 w-full" placeholder="Borrow amount" value={borrow} onChange={(e)=> setBorrow(e.target.value)} />
          <div className="flex gap-2">
            <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "borrow", args: [parseEther(borrow||"0")] })} className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-500 transition">Borrow</button>
            <button disabled={isPending||isLoading} onClick={()=> writeContract({ address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, abi: repAbi as any, functionName: "repay", args: [parseEther(borrow||"0")] })} className="rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-500 transition">Repay</button>
          </div>
        </div>
      </div>
    </div>
  );
}
