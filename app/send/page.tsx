"use client";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, erc20Abi } from "viem";
import routerAbi from "@/lib/abis/PaymentRouter.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { TOKENS } from "@/lib/tokenlist";
import { useSearchParams } from "next/navigation";

export default function SendPage() {
  const { address } = useAccount();
  const params = useSearchParams();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<"ETH" | "ERC20">("ETH");
  const [tokenAddress, setTokenAddress] = useState(CONTRACT_ADDRESSES.miniToken);

  useEffect(() => {
    const qpTo = params.get("to");
    const qpAmount = params.get("amount");
    const qpMessage = params.get("message");
    const qpToken = params.get("token");
    if (qpTo) setTo(qpTo);
    if (qpAmount) setAmount(qpAmount);
    if (qpMessage) setMessage(qpMessage);
    if (qpToken === "ETH" || qpToken === "ERC20") setToken(qpToken);
    const qpTokenAddress = params.get("tokenAddress");
    if (qpTokenAddress) setTokenAddress(qpTokenAddress as `0x${string}`);
  }, [params]);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: allowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, CONTRACT_ADDRESSES.paymentRouter as `0x${string}`],
    query: { enabled: token === "ERC20" && !!address && !!tokenAddress },
  });

  const needsApprove = token === "ERC20" && allowance !== undefined && BigInt(allowance as any) < BigInt(Math.floor(Number(amount || "0") * Math.pow(10, 18)));

  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { isLoading: isApproveMining, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  function onSend() {
    if (token === "ETH") {
      writeContract({
        address: CONTRACT_ADDRESSES.paymentRouter as `0x${string}`,
        abi: routerAbi as any,
        functionName: "payETH",
        args: [to as `0x${string}`, message],
        value: parseEther(amount),
      });
    } else {
      if (needsApprove) {
        writeApprove({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [CONTRACT_ADDRESSES.paymentRouter as `0x${string}`, BigInt(Math.floor(Number(amount) * Math.pow(10, 18)))],
        });
        return;
      }
      writeContract({
        address: CONTRACT_ADDRESSES.paymentRouter as `0x${string}`,
        abi: routerAbi as any,
        functionName: "payERC20",
        args: [tokenAddress as `0x${string}`, to as `0x${string}`, BigInt(Math.floor(Number(amount) * Math.pow(10, 18))), message],
      });
    }
  }

  return (
    <div className="responsive-container py-2 sm:py-4 space-y-3 sm:space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
      <h2 className="responsive-text font-semibold">Send Money</h2>
      <div className="responsive-grid">
        <select className="responsive-input" value={token} onChange={(e) => setToken(e.target.value as any)}>
          <option value="ETH">ETH</option>
          <option value="ERC20">ERC-20 (e.g., MiniToken/USDC)</option>
        </select>
        {token === "ERC20" && (
          <div className="responsive-grid">
            <select className="responsive-input" value={tokenAddress} onChange={(e)=> setTokenAddress(e.target.value as `0x${string}`)}>
              <option value="">Select token</option>
              {TOKENS.filter(t=> t.address !== "0x0000000000000000000000000000000000000000").map((t)=> (
                <option key={t.symbol} value={t.address}>{t.symbol} - {t.name}</option>
              ))}
            </select>
            <input className="responsive-input" placeholder="Or paste token address" value={tokenAddress} onChange={(e)=> setTokenAddress(e.target.value)} />
          </div>
        )}
        <input className="responsive-input" placeholder="Recipient 0x..." value={to} onChange={(e)=> setTo(e.target.value)} />
        <input className="responsive-input" placeholder="Amount" value={amount} onChange={(e)=> setAmount(e.target.value)} />
        <input className="responsive-input" placeholder="Message (optional)" value={message} onChange={(e)=> setMessage(e.target.value)} />
        <button onClick={onSend} disabled={isPending || isMining || isApproveMining} className="responsive-button bg-blue-600 text-white">
          {token === "ERC20" && needsApprove ? (isApproveMining ? "Approving..." : "Approve") : (isMining ? "Sending..." : "Send")}
        </button>
        {hash && <div className="text-xs sm:text-sm no-overflow">Tx: {hash}</div>}
        {error && <div className="text-xs sm:text-sm text-red-600">{error.message}</div>}
      </div>
    </div>
  );
}
