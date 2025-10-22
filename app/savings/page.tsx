"use client";
import { useEffect, useMemo, useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import scAbi from "@/lib/abis/SavingsCircles.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { parseEther } from "viem";

export default function SavingsPage() {
  const [token, setToken] = useState("");
  const [members, setMembers] = useState("");
  const [contribution, setContribution] = useState("");
  const [period, setPeriod] = useState("604800"); // default weekly
  const [frequency, setFrequency] = useState("weekly");
  const [circleId, setCircleId] = useState("");
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [autoPayout, setAutoPayout] = useState(false);

  const { data: totalCircles } = useReadContract({
    address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
    abi: scAbi as any,
    functionName: "totalCircles",
    args: [],
  });

  const ids = useMemo(() => {
    const n = Number(totalCircles || 0);
    return Array.from({ length: n }, (_, i) => i + 1);
  }, [totalCircles]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: circle } = useReadContract({
    address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
    abi: scAbi as any,
    functionName: "getCircle",
    args: [BigInt(selectedId || 0)],
    query: {
      enabled: !!selectedId,
    } as any,
  });

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

  function joinCircle() {
    writeContract({
      address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
      abi: scAbi as any,
      functionName: "joinCircle",
      args: [BigInt(circleId)],
    });
  }

  function restart() {
    writeContract({
      address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
      abi: scAbi as any,
      functionName: "restart",
      args: [BigInt(circleId)],
    });
  }

  function setOpen(open: boolean) {
    writeContract({
      address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
      abi: scAbi as any,
      functionName: "setOpenToJoin",
      args: [BigInt(circleId), open],
    });
  }

  function terminate() {
    writeContract({
      address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
      abi: scAbi as any,
      functionName: "terminate",
      args: [BigInt(circleId)],
    });
  }

  useEffect(() => {
    if (!hash) return;
    // Very simple heuristic: first circle id increments from 1
    setCreatedId(1);
  }, [hash]);

  useEffect(() => {
    if (!autoPayout) return;
    const timer = setInterval(() => {
      if (!circleId) return;
      writeContract({
        address: CONTRACT_ADDRESSES.savingsCircles as `0x${string}`,
        abi: scAbi as any,
        functionName: "payout",
        args: [BigInt(circleId)],
      });
    }, 12000); // try roughly every block
    return () => clearInterval(timer);
  }, [autoPayout, circleId, writeContract]);

  useEffect(() => {
    const map: Record<string, string> = { daily: "86400", weekly: "604800", monthly: "2592000" };
    setPeriod(map[frequency] || period);
  }, [frequency]);

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
        <p className="text-sm text-white/70">Pick a token, add members, set contribution and contribution frequency.</p>
        <div className="grid gap-3">
          <input className="input w-full" placeholder="Token address (ERC‑20)" value={token} onChange={(e)=> setToken(e.target.value)} />
          <input className="input w-full" placeholder="Members (comma‑separated 0x...)" value={members} onChange={(e)=> setMembers(e.target.value)} />
          <input className="input w-full" placeholder="Contribution (e.g. 1)" value={contribution} onChange={(e)=> setContribution(e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select className="input" value={frequency} onChange={(e)=> setFrequency(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom (seconds)</option>
            </select>
            <input className="input" placeholder="Custom seconds (≥60)" value={period} onChange={(e)=> setPeriod(e.target.value)} disabled={frequency!=='custom'} />
          </div>
        </div>
        <button disabled={isPending||isLoading} onClick={createCircle} className="btn btn-primary">Create circle</button>
        {createdId && <div className="text-xs text-white/70">Circle created. ID: {createdId}</div>}
      </div>

      <div className="card p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
        <div className="font-semibold text-white">Step 2 — Manage the current round</div>
        <p className="text-sm text-white/70">Deposit your share or trigger payout when eligible. Toggle auto-payout to keep distributing on schedule.</p>
        <input className="input w-full" placeholder="Circle ID" value={circleId} onChange={(e)=> setCircleId(e.target.value)} />
        <div className="flex flex-col sm:flex-row gap-3">
          <button disabled={isPending||isLoading} onClick={deposit} className="btn btn-secondary flex-1">Deposit for this round</button>
          <button disabled={isPending||isLoading} onClick={payout} className="btn btn-accent flex-1">Payout to recipient</button>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={autoPayout} onChange={(e)=> setAutoPayout(e.target.checked)} /> Auto-payout</label>
          <button className="btn btn-xs" onClick={()=> setOpen(true)}>Open to join</button>
          <button className="btn btn-xs" onClick={()=> restart() }>Restart</button>
          <button className="btn btn-xs btn-danger" onClick={()=> terminate() }>Terminate</button>
          <button className="btn btn-xs" onClick={joinCircle}>Join</button>
        </div>
        <ul className="text-xs text-white/70 list-disc pl-5 space-y-1">
          <li>Members must approve the contract to spend the token once.</li>
          <li>Payout available after period elapses and all deposits are in.</li>
          <li>Join window opens automatically after everyone has received one payout.</li>
        </ul>
        {hash && <div className="text-xs break-all">Tx: {hash}</div>}
        {error && <div className="text-sm text-red-400">{error.message}</div>}
      </div>

      <div className="card p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
        <div className="font-semibold text-white">Browse circles</div>
        <p className="text-sm text-white/70">Open circles can accept new members at cycle boundaries.</p>
        <div className="flex gap-2 items-center">
          <select className="input" value={selectedId ?? ''} onChange={(e)=> setSelectedId(Number(e.target.value)||null)}>
            <option value="">Select circle</option>
            {ids.map((i)=> <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        {circle && (
          <div className="text-xs text-white/80 space-y-1">
            <div><span className="text-white/60">Organizer:</span> {(circle as any)[0]}</div>
            <div><span className="text-white/60">Token:</span> {(circle as any)[1]}</div>
            <div><span className="text-white/60">Contribution:</span> {(circle as any)[2].toString()}</div>
            <div><span className="text-white/60">Period (s):</span> {(circle as any)[3].toString()}</div>
            <div><span className="text-white/60">Members:</span> {((circle as any)[4] as string[]).length}</div>
            <div><span className="text-white/60">Current index:</span> {(circle as any)[5].toString()}</div>
            <div><span className="text-white/60">Next payout time:</span> {(circle as any)[6].toString()}</div>
            <div><span className="text-white/60">Round:</span> {(circle as any)[7].toString()}</div>
            <div><span className="text-white/60">Active:</span> {(circle as any)[8] ? 'Yes' : 'No'}</div>
            <div><span className="text-white/60">Open to join:</span> {(circle as any)[9] ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
