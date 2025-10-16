"use client";
import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import routerAbi from "@/lib/abis/PaymentRouter.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

export default function FeedPage() {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<any[]>([]);

  const eventSig = useMemo(() => {
    // keccak256("PaymentSent(address,address,address,uint256,string,uint256)")
    return "0x3d7578bfb1c7bf56f1cd1a2c0a4a493e27d5b9b6cd2eb3aa2ce6b438ac0d3f5f";
  }, []);

  useEffect(() => {
    let unwatch: any;
    (async () => {
      if (!publicClient) return;
      // read last 2000 blocks
      const latest = await publicClient.getBlockNumber();
      const fromBlock = latest - 2000n > 0n ? latest - 2000n : 0n;
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

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Public Feed</h2>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className="border rounded p-3 text-sm break-all">
            <div><strong>From:</strong> {e.args?.from}</div>
            <div><strong>To:</strong> {e.args?.to}</div>
            <div><strong>Token:</strong> {e.args?.token}</div>
            <div><strong>Amount:</strong> {e.args?.amount?.toString?.()}</div>
            <div><strong>Message:</strong> {e.args?.message}</div>
            <div><strong>Time:</strong> {new Date(Number(e.args?.timestamp) * 1000).toLocaleString()}</div>
          </div>
        ))}
        {events.length === 0 && <div>No events yet.</div>}
      </div>
    </div>
  );
}
