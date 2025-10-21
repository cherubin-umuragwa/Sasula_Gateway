"use client";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatEther, formatUnits, zeroAddress } from "viem";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { useLikesComments } from "./likesStore";

export default function FeedPage() {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [decimalsMap, setDecimalsMap] = useState<Record<string, number>>({});
  const { data: social, like, comment, keyOf } = useLikesComments();

  useEffect(() => {
    let unwatch: any;
    (async () => {
      if (!publicClient) return;
      // read last N blocks
      const latest = await publicClient.getBlockNumber();
      const fromBlock = latest - 8000n > 0n ? latest - 8000n : 0n;
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESSES.paymentRouter as `0x${string}`,
        fromBlock,
        toBlock: latest,
        event: {
          type: "event",
          name: "PaymentSent",
          inputs: [
            { name: "from", type: "address", indexed: true },
            { name: "to", type: "address", indexed: true },
            { name: "token", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
            { name: "message", type: "string", indexed: false },
            { name: "timestamp", type: "uint256", indexed: false },
          ],
          anonymous: false,
        } as any,
      });
      setEvents(logs.reverse());

      unwatch = await publicClient.watchEvent({
        address: CONTRACT_ADDRESSES.paymentRouter as `0x${string}`,
        event: {
          type: "event",
          name: "PaymentSent",
          inputs: [
            { name: "from", type: "address", indexed: true },
            { name: "to", type: "address", indexed: true },
            { name: "token", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
            { name: "message", type: "string", indexed: false },
            { name: "timestamp", type: "uint256", indexed: false },
          ],
          anonymous: false,
        } as any,
        onLogs: (logs) => setEvents((prev) => [...logs.reverse(), ...prev]),
      });
    })();
    return () => { if (unwatch) unwatch(); };
  }, [publicClient]);

  useEffect(() => {
    (async () => {
      if (!publicClient) return;
      const slice = events.slice(page * pageSize, page * pageSize + pageSize);
      const tokens = Array.from(new Set(slice.map((e) => (e.args?.token as string)?.toLowerCase()).filter(Boolean)));
      const toFetch = tokens.filter((t) => t !== zeroAddress && decimalsMap[t] === undefined);
      if (toFetch.length === 0) return;
      const erc20DecimalsAbi = [{ type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] }];
      const entries: [string, number][] = [];
      for (const t of toFetch) {
        try {
          const d = await publicClient.readContract({ address: t as `0x${string}`, abi: erc20DecimalsAbi as any, functionName: "decimals" });
          entries.push([t, Number(d)]);
        } catch {
          entries.push([t, 18]);
        }
      }
      setDecimalsMap((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    })();
  }, [publicClient, events, page]);

  function formatAmount(token: string, amount: bigint) {
    const t = (token || "").toLowerCase();
    if (!t || t === zeroAddress) return `${formatEther(amount)} ETH`;
    const dec = decimalsMap[t] ?? 18;
    return `${formatUnits(amount, dec)}`;
  }

  return (
    <div className="responsive-container py-6 sm:py-8 max-w-5xl">
      <div className="mb-6 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">Public Feed</span>
        </h1>
        <p className="text-white/70">Live stream of payments with social interactions</p>
      </div>

      <div className="space-y-4">
        {events.slice(page * pageSize, page * pageSize + pageSize).map((e, i) => (
          <div key={i} className="card p-4 animate-fadeInUp">
            <div className="grid sm:grid-cols-2 gap-2 text-sm break-all">
              <div><span className="text-white/60">From:</span> <span className="font-mono">{e.args?.from}</span></div>
              <div><span className="text-white/60">To:</span> <span className="font-mono">{e.args?.to}</span></div>
              <div><span className="text-white/60">Token:</span> <span className="font-mono">{e.args?.token}</span></div>
              <div><span className="text-white/60">Amount:</span> {formatAmount(e.args?.token as string, e.args?.amount as bigint)}</div>
              <div className="sm:col-span-2"><span className="text-white/60">Message:</span> {e.args?.message}</div>
              <div className="text-white/60">{new Date(Number(e.args?.timestamp) * 1000).toLocaleString()}</div>
            </div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
              <button className="btn btn-primary px-3 py-2" onClick={()=> like(e)}>Like ({social[keyOf(e)]?.likes || 0})</button>
              <form onSubmit={(ev)=> { ev.preventDefault(); const v = (ev.currentTarget as any).comment.value.trim(); if (v) { comment(e, v); (ev.currentTarget as any).reset(); } }} className="flex gap-2 w-full sm:w-auto">
                <input name="comment" className="input flex-1" placeholder="Add comment" />
                <button className="btn btn-outline px-3">Post</button>
              </form>
            </div>
            {(social[keyOf(e)]?.comments || []).length > 0 && (
              <div className="mt-3 space-y-1">
                {(social[keyOf(e)]?.comments || []).map((c, idx)=> (
                  <div key={idx} className="text-xs border-l-2 pl-2 border-white/20">{c}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        {events.length === 0 && <div className="text-white/60">No events yet.</div>}
      </div>
      <div className="flex gap-2 mt-4">
        <button disabled={page===0} onClick={()=> setPage((p)=> Math.max(0, p-1))} className="btn btn-outline px-3 py-2">Prev</button>
        <button disabled={(page+1)*pageSize >= events.length} onClick={()=> setPage((p)=> p+1)} className="btn btn-secondary px-3 py-2">Next</button>
      </div>
    </div>
  );
}
