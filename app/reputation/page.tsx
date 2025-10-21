"use client";
import { useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import repAbi from "@/lib/abis/SocialReputation.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { erc20Abi, parseEther, parseUnits, MaxUint256 } from "viem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faThumbsUp, faThumbsDown, faUserCheck, faUniversity, faCoins, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function ScoreCard({ score, delay = 0 }: { score: string; delay?: number }) {
  const scoreNum = parseInt(score) || 0;
  const level = scoreNum > 1000 ? "Expert" : scoreNum > 500 ? "Advanced" : scoreNum > 100 ? "Intermediate" : "Beginner";
  const color = scoreNum > 1000 ? "from-purple-500 to-pink-600" : scoreNum > 500 ? "from-blue-500 to-cyan-600" : scoreNum > 100 ? "from-green-500 to-emerald-600" : "from-gray-500 to-slate-600";

  return (
    <div 
      className={`card p-8 text-center bg-gradient-to-br ${color} bg-opacity-20 border border-white/10 animate-fadeInUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-6xl mb-4">
        <FontAwesomeIcon icon={faStar} className="text-6xl text-yellow-400" />
      </div>
      <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{score}</div>
      <div className="text-lg text-white/80 mb-2">Reputation Score</div>
      <div className="text-sm text-white/60">{level} Level</div>
      <div className="mt-4 w-full bg-white/20 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min((scoreNum / 1000) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}

function EndorseSection({ 
  target, 
  setTarget, 
  address, 
  isPending, 
  isLoading, 
  writeContract 
}: { 
  target: string; 
  setTarget: (target: string) => void;
  address: string | undefined;
  isPending: boolean;
  isLoading: boolean;
  writeContract: any;
}) {
  return (
    <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <FontAwesomeIcon icon={faThumbsUp} className="text-xl text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Endorse Users</h3>
          <p className="text-white/60 text-sm">Boost reputation scores in the community</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Target Address</label>
          <input 
            className="input w-full font-mono" 
            placeholder="0x... (leave empty for self-endorsement)" 
            value={target} 
            onChange={(e) => setTarget(e.target.value)} 
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button 
              disabled={isPending || isLoading} 
              onClick={() => writeContract({ 
                address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, 
                abi: repAbi as any, 
                functionName: "endorse", 
                args: [(target || address) as `0x${string}`] 
              })} 
              className="btn btn-primary py-3"
            >
              <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
              Endorse
            </button>
            <button 
              disabled={isPending || isLoading} 
              onClick={() => writeContract({ 
                address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, 
                abi: repAbi as any, 
                functionName: "unendorse", 
                args: [(target || address) as `0x${string}`] 
              })} 
              className="btn btn-outline py-3"
            >
              <FontAwesomeIcon icon={faThumbsDown} className="mr-2" />
              Unendorse
            </button>
            <button 
              disabled={isPending || isLoading} 
              onClick={() => writeContract({ 
                address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, 
                abi: repAbi as any, 
                functionName: "selfEndorse", 
                args: [] 
              })} 
              className="btn btn-accent py-3"
            >
              <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
              Self-Endorse
            </button>
        </div>
      </div>
    </div>
  );
}

function PoolSection({ 
  fund, 
  setFund, 
  borrow, 
  setBorrow, 
  decimals, 
  fundUnits, 
  needsApprove, 
  isApproving, 
  isApproveMining, 
  isPending, 
  isLoading, 
  loanToken, 
  stakeValue, 
  writeContract, 
  writeApprove 
}: {
  fund: string;
  setFund: (fund: string) => void;
  borrow: string;
  setBorrow: (borrow: string) => void;
  decimals: number;
  fundUnits: bigint;
  needsApprove: boolean;
  isApproving: boolean;
  isApproveMining: boolean;
  isPending: boolean;
  isLoading: boolean;
  loanToken: any;
  stakeValue: any;
  writeContract: any;
  writeApprove: any;
}) {
  return (
    <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <FontAwesomeIcon icon={faUniversity} className="text-xl text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Micro-Loans & Pool</h3>
          <p className="text-white/60 text-sm">Fund the community pool and access loans</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Funding Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Fund Pool Amount</label>
            <input 
              className="input w-full" 
              placeholder={`Amount (${decimals} decimals)`} 
              value={fund} 
              onChange={(e) => setFund(e.target.value)} 
            />
          </div>

          {needsApprove ? (
            <button
              disabled={isApproving || isApproveMining || !fund || Number(fund) <= 0 || !loanToken}
              onClick={() => writeApprove({
                address: loanToken as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                args: [CONTRACT_ADDRESSES.socialReputation as `0x${string}`, fundUnits],
              })}
              className="btn btn-accent w-full py-3"
            >
              {isApproving || isApproveMining ? "Approving..." : "Approve Token"}
            </button>
          ) : (
            <button
              disabled={isPending || isLoading || !fund || Number(fund) <= 0}
              onClick={() => writeContract({
                address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
                abi: repAbi as any,
                functionName: "fundPool",
                args: [fundUnits] 
              })}
              className="btn btn-primary w-full py-3"
            >
              {isPending || isLoading ? "Funding..." : "Fund Pool"}
            </button>
          )}
        </div>

        {/* Stake Value */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Your Stake Value:</span>
            <span className="text-white font-semibold">{stakeValue ? String(stakeValue) : "0"}</span>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Withdraw from Pool</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input 
              className="input" 
              placeholder="Withdraw amount" 
              value={borrow} 
              onChange={(e) => setBorrow(e.target.value)} 
            />
            <button 
              disabled={isPending || isLoading} 
              onClick={() => writeContract({ 
                address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, 
                abi: repAbi as any, 
                functionName: "withdrawAmount", 
                args: [BigInt(Math.floor(Number(borrow || "0") * Math.pow(10, decimals)))] 
              })} 
              className="btn btn-outline py-3"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Borrow/Repay Section */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Borrow & Repay</h4>
          <input 
            className="input w-full" 
            placeholder="Borrow amount" 
            value={borrow} 
            onChange={(e) => setBorrow(e.target.value)} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              disabled={isPending || isLoading} 
              onClick={() => writeContract({ 
                address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, 
                abi: repAbi as any, 
                functionName: "borrow", 
                args: [BigInt(Math.floor(Number(borrow || "0") * Math.pow(10, decimals)))] 
              })} 
              className="btn btn-primary py-3"
            >
              <FontAwesomeIcon icon={faCoins} className="mr-2" />
              Borrow
            </button>
            <button 
              disabled={isPending || isLoading} 
              onClick={() => writeContract({ 
                address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`, 
                abi: repAbi as any, 
                functionName: "repay", 
                args: [BigInt(Math.floor(Number(borrow || "0") * Math.pow(10, decimals)))] 
              })} 
              className="btn btn-secondary py-3"
            >
              <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
              Repay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReputationInfo() {
  return (
    <div className="card p-6 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
      <h3 className="text-lg font-semibold text-white mb-4">How Reputation Works</h3>
      <div className="space-y-3 text-sm text-white/70">
        <div className="flex items-start gap-3"><span className="text-green-400">—</span><span>Send and receive payments to increase your score</span></div>
        <div className="flex items-start gap-3"><span className="text-blue-400">—</span><span>Get endorsed by trusted community members</span></div>
        <div className="flex items-start gap-3"><span className="text-purple-400">—</span><span>Fund the community pool for reputation boost</span></div>
        <div className="flex items-start gap-3"><span className="text-yellow-400">—</span><span>Higher scores unlock larger micro-loan limits</span></div>
      </div>
    </div>
  );
}

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

  const { data: loanToken } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "loanToken",
    args: [],
  });

  const { data: tokenDecimals } = useReadContract({
    address: (loanToken as `0x${string}`) || undefined,
    abi: erc20Abi,
    functionName: "decimals",
    args: [],
    query: { enabled: !!loanToken },
  });

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
      return BigInt(Math.floor(Number(fund) * Math.pow(10, decimals)));
    } catch {
      return 0n;
    }
  }, [fund, decimals]);
  
  const allowanceReady = typeof allowance === "bigint";
  const currentAllowance: bigint = allowanceReady ? (allowance as bigint) : 0n;
  const needsApprove = useMemo(() => {
    if (fundUnits <= 0n) return false;
    if (!allowanceReady) return true;
    return currentAllowance < fundUnits;
  }, [allowanceReady, currentAllowance, fundUnits]);

  return (
    <div className="responsive-container py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">Social Reputation</span>
        </h1>
        <p className="text-white/70">Build your reputation and access micro-loans</p>
      </div>

      <div className="responsive-grid-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <ScoreCard score={score?.toString?.() || "0"} delay={0} />
          <EndorseSection 
            target={target}
            setTarget={setTarget}
            address={address}
            isPending={isPending}
            isLoading={isLoading}
            writeContract={writeContract}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PoolSection 
            fund={fund}
            setFund={setFund}
            borrow={borrow}
            setBorrow={setBorrow}
            decimals={decimals}
            fundUnits={fundUnits}
            needsApprove={needsApprove}
            isApproving={isApproving}
            isApproveMining={isApproveMining}
            isPending={isPending}
            isLoading={isLoading}
            loanToken={loanToken}
            stakeValue={stakeValue}
            writeContract={writeContract}
            writeApprove={writeApprove}
          />
          <ReputationInfo />
        </div>
      </div>
    </div>
  );
}