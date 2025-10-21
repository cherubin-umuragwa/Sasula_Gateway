"use client";
import Link from "next/link";
import { useAccount, useBalance } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faQrcode,
  faRss,
  faMicrophone,
  faStar,
  faPiggyBank,
  faTriangleExclamation,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

function ActionCard({ href, title, subtitle, icon, gradient = "primary", delay = 0 }: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient?: "primary" | "secondary" | "accent";
  delay?: number;
}) {
  const gradientClass = {
    primary: "from-indigo-500/20 to-purple-600/20 border-indigo-500/30",
    secondary: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
    accent: "from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
  }[gradient];
  return (
    <Link href={href} className="block">
      <div
        className={`card p-6 bg-gradient-to-br ${gradientClass} border hover:scale-[1.02] transition-all duration-300 animate-fadeInUp`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="text-base font-semibold">{title}</div>
            <div className="text-sm text-white/60">{subtitle}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeatureTile({ href, title, description, icon, gradient = "primary", delay = 0 }: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient?: "primary" | "secondary" | "accent";
  delay?: number;
}) {
  const gradientClass = {
    primary: "from-indigo-500 to-purple-600",
    secondary: "from-cyan-500 to-blue-600",
    accent: "from-emerald-500 to-teal-600",
  }[gradient];
  return (
    <Link href={href} className="group block">
      <div
        className={`card p-6 h-full bg-gradient-to-br ${gradientClass} bg-opacity-10 border border-white/10 hover:border-white/20 transition-all duration-300 animate-fadeInUp`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });

  const formattedBalance = balance
    ? `${Number(balance.formatted).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${balance.symbol}`
    : "-";

  return (
    <div className="responsive-container py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">
          <span className="text-gradient">Sasula</span>
        </h1>
        <p className="text-white/70">Your app home for social crypto payments</p>
      </div>

      {/* Wallet Overview */}
      <div className="card p-6 mb-8 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 animate-fadeInUp">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm text-white/60">Connected Wallet</div>
            <div className="text-lg font-semibold">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
            </div>
            <div className="text-white/60 text-sm">{chain?.name || "Base Sepolia"}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/60">Balance</div>
              <div className="text-white font-semibold">{formattedBalance}</div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4"><span className="text-gradient">Quick Actions</span></h2>
        <div className="responsive-grid-2">
          <ActionCard
            href="/send"
            title="Send Money"
            subtitle="Transfer funds instantly"
            icon={<FontAwesomeIcon icon={faPaperPlane} className="text-lg" />}
            gradient="primary"
            delay={0}
          />
          <ActionCard
            href="/qr"
            title="Scan to Pay"
            subtitle="Scan or generate QR"
            icon={<FontAwesomeIcon icon={faQrcode} className="text-lg" />}
            gradient="secondary"
            delay={100}
          />
          <ActionCard
            href="/feed"
            title="Activity Feed"
            subtitle="See recent transactions"
            icon={<FontAwesomeIcon icon={faRss} className="text-lg" />}
            gradient="accent"
            delay={200}
          />
          <ActionCard
            href="/voice"
            title="Voice Payments"
            subtitle="Pay with your voice"
            icon={<FontAwesomeIcon icon={faMicrophone} className="text-lg" />}
            gradient="primary"
            delay={300}
          />
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4"><span className="text-gradient">Explore</span></h2>
        <div className="responsive-grid-3">
          <FeatureTile
            href="/reputation"
            title="Reputation"
            description="Build your score and unlock credit"
            icon={<FontAwesomeIcon icon={faStar} className="text-base" />}
            gradient="secondary"
            delay={0}
          />
          <FeatureTile
            href="/savings"
            title="Savings Circles"
            description="Group savings with rotating payouts"
            icon={<FontAwesomeIcon icon={faPiggyBank} className="text-base" />}
            gradient="accent"
            delay={100}
          />
          <FeatureTile
            href="/emergency"
            title="Emergency Mode"
            description="Enable fee-free relief mode"
            icon={<FontAwesomeIcon icon={faTriangleExclamation} className="text-base" />}
            gradient="primary"
            delay={200}
          />
        </div>
      </div>

      {/* App Tips */}
      <div className="card p-6 animate-fadeInUp" style={{ animationDelay: "400ms" }}>
        <h3 className="text-lg font-semibold mb-3">Tips</h3>
        <div className="text-sm text-white/70">Use the bottom navigation to access core features anywhere in the app.</div>
      </div>
    </div>
  );
}