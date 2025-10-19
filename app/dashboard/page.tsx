"use client";
import { useAccount, useBalance, useReadContract } from "wagmi";
import repAbi from "@/lib/abis/SocialReputation.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircle, faCheck, faTimes, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient = "primary",
  delay = 0,
  trend = null 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: string;
  gradient?: "primary" | "secondary" | "accent";
  delay?: number;
  trend?: { value: string; positive: boolean } | null;
}) {
  const gradientClass = {
    primary: "from-indigo-500/20 to-purple-600/20 border-indigo-500/30",
    secondary: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
    accent: "from-emerald-500/20 to-teal-600/20 border-emerald-500/30"
  }[gradient];

  return (
    <div 
      className={`card p-6 bg-gradient-to-br ${gradientClass} border hover:scale-105 transition-all duration-500 animate-fadeInUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/80">{title}</h3>
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${
                trend.positive ? 'text-green-400' : 'text-red-400'
              }`}>
                <span>{trend.positive ? '↗' : '↘'}</span>
                <span>{trend.value}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/60">{subtitle}</div>
    </div>
  );
}

function QuickActionCard({ 
  title, 
  description, 
  icon, 
  href, 
  gradient = "primary",
  delay = 0 
}: { 
  title: string; 
  description: string; 
  icon: string; 
  href: string;
  gradient?: "primary" | "secondary" | "accent";
  delay?: number;
}) {
  const gradientClass = {
    primary: "from-indigo-500 to-purple-600",
    secondary: "from-cyan-500 to-blue-600",
    accent: "from-emerald-500 to-teal-600"
  }[gradient];

  return (
    <Link href={href} className="group block">
      <div 
        className={`card p-6 h-full transition-all duration-500 hover:scale-105 bg-gradient-to-br ${gradientClass} bg-opacity-10 border border-white/10 hover:border-white/20 animate-fadeInUp`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {description}
        </p>
        <div className="mt-4 flex items-center text-white/50 group-hover:text-white/80 transition-colors duration-300">
          <span className="text-sm font-medium">Open</span>
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function TransactionHistory() {
  const [transactions] = useState([
    { id: 1, type: 'sent', amount: '0.5 ETH', to: '0x1234...5678', time: '2 min ago', status: 'completed' },
    { id: 2, type: 'received', amount: '100 USDC', from: '0x8765...4321', time: '1 hour ago', status: 'completed' },
    { id: 3, type: 'sent', amount: '0.1 ETH', to: '0xabcd...efgh', time: '3 hours ago', status: 'pending' },
  ]);

  return (
    <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <Link href="/feed" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div 
            key={tx.id} 
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
            style={{ animationDelay: `${700 + index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'sent' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                <FontAwesomeIcon 
                  icon={tx.type === 'sent' ? faArrowUp : faArrowDown} 
                  className="text-sm" 
                />
              </div>
              <div>
                <div className="text-white font-medium">{tx.amount}</div>
                <div className="text-white/60 text-sm">
                  {tx.type === 'sent' ? `To ${tx.to}` : `From ${tx.from}`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-sm">{tx.time}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {tx.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: score } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "getScore",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });
  const { data: limit } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "maxBorrowable",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });
  const { data: stakeValue } = useReadContract({
    address: CONTRACT_ADDRESSES.socialReputation as `0x${string}`,
    abi: repAbi as any,
    functionName: "getUserStakeValue",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="text-white/70">Welcome back! Here's your account overview.</p>
      </div>

      {/* Wallet Info */}
      {address && (
        <div className="card p-6 mb-8 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 animate-fadeInUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-xl text-white" />
          </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Connected Wallet</h3>
                <p className="text-white/60 font-mono text-sm">{formatAddress(address)}</p>
                <p className="text-white/50 text-xs">{chain?.name || "Unknown Network"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCircle} className="w-3 h-3 text-green-500 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Connected</span>
            </div>
        </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="responsive-grid-2 mb-8">
        <MetricCard
          title="Balance"
          value={balance ? `${Number(balance.formatted).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${balance.symbol}` : "-"}
          subtitle="On Base Sepolia"
          icon="💰"
          gradient="primary"
          delay={0}
          trend={{ value: "+2.5%", positive: true }}
        />
        <MetricCard
          title="Reputation Score"
          value={score ? String(score) : "0"}
          subtitle="Grows with transactions & endorsements"
          icon="⭐"
          gradient="secondary"
          delay={100}
          trend={{ value: "+15", positive: true }}
        />
        <MetricCard
          title="Max Loan Limit"
          value={limit ? Number(limit).toLocaleString() : "0"}
          subtitle="Based on score & pool size"
          icon="🏦"
          gradient="accent"
          delay={200}
        />
        <MetricCard
          title="Pool Stake Value"
          value={stakeValue ? Number(stakeValue).toLocaleString() : "0"}
          subtitle="Withdrawable anytime"
          icon="💎"
          gradient="primary"
          delay={300}
        />
        </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-gradient">Quick Actions</span>
        </h2>
        <div className="responsive-grid-3">
          <QuickActionCard
            title="Send Money"
            description="Transfer funds instantly to any address with social messages."
            icon="💸"
            href="/send"
            gradient="primary"
            delay={0}
          />
          <QuickActionCard
            title="Activity Feed"
            description="View your complete transaction history and social interactions."
            icon="📊"
            href="/feed"
            gradient="secondary"
            delay={100}
          />
          <QuickActionCard
            title="Savings Circles"
            description="Join group savings with rotating payouts and community support."
            icon="🔄"
            href="/savings"
            gradient="accent"
            delay={200}
          />
          <QuickActionCard
            title="Reputation"
            description="Build your score, fund pools, and access micro-loans."
            icon="⭐"
            href="/reputation"
            gradient="primary"
            delay={300}
          />
          <QuickActionCard
            title="Emergency"
            description="Toggle fee-free mode and access emergency relief features."
            icon="🚨"
            href="/emergency"
            gradient="secondary"
            delay={400}
          />
          <QuickActionCard
            title="Voice Payments"
            description="Send payments using voice commands for accessibility."
            icon="🎤"
            href="/voice"
            gradient="accent"
            delay={500}
          />
        </div>
      </div>

      {/* Transaction History */}
      <div className="responsive-grid-2">
        <TransactionHistory />
        <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
          <h3 className="text-lg font-semibold text-white mb-6">Network Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCircle} className="w-3 h-3 text-green-500 animate-pulse" />
                <span className="text-white font-medium">Base Sepolia</span>
              </div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCircle} className="w-3 h-3 text-blue-500 animate-pulse" />
                <span className="text-white font-medium">Payment Router</span>
              </div>
              <span className="text-blue-400 text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCircle} className="w-3 h-3 text-purple-500 animate-pulse" />
                <span className="text-white font-medium">Reputation System</span>
              </div>
              <span className="text-purple-400 text-sm">Synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}