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
    <div className="min-h-[calc(100vh-120px)] p-4 space-y-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">Public Feed</h2>
      <div className="space-y-3">
        {events.slice(page * pageSize, page * pageSize + pageSize).map((e, i) => (
          <div key={i} className="border rounded p-3 text-sm break-all">
            <div><strong>From:</strong> {e.args?.from}</div>
            <div><strong>To:</strong> {e.args?.to}</div>
            <div><strong>Token:</strong> {e.args?.token}</div>
            <div><strong>Amount:</strong> {formatAmount(e.args?.token as string, e.args?.amount as bigint)}</div>
            <div><strong>Message:</strong> {e.args?.message}</div>
            <div><strong>Time:</strong> {new Date(Number(e.args?.timestamp) * 1000).toLocaleString()}</div>
            <div className="mt-2 flex items-center gap-3">
              <button className="rounded bg-blue-600 text-white px-2 py-1" onClick={()=> like(e)}>Like ({social[keyOf(e)]?.likes || 0})</button>
              <form onSubmit={(ev)=> { ev.preventDefault(); const v = (ev.currentTarget as any).comment.value.trim(); if (v) { comment(e, v); (ev.currentTarget as any).reset(); } }} className="flex gap-2">
                <input name="comment" className="border rounded p-1" placeholder="Add comment" />
                <button className="rounded bg-gray-600 text-white px-2">Post</button>
              </form>
            </div>
            {(social[keyOf(e)]?.comments || []).length > 0 && (
              <div className="mt-2 space-y-1">
                {(social[keyOf(e)]?.comments || []).map((c, idx)=> (
                  <div key={idx} className="text-xs border-l-2 pl-2">{c}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        {events.length === 0 && <div>No events yet.</div>}
      </div>
      <div className="flex gap-2">
        <button disabled={page===0} onClick={()=> setPage((p)=> Math.max(0, p-1))} className="rounded border px-3 py-1">Prev</button>
        <button disabled={(page+1)*pageSize >= events.length} onClick={()=> setPage((p)=> p+1)} className="rounded border px-3 py-1">Next</button>
      </div>
    </div>
  );
}
