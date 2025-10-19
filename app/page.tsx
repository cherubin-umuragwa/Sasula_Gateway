"use client";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import Link from "next/link";

function Typewriter({ text }: { text: string }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setOut(text.slice(0, i++));
      if (i > text.length) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [text]);
  return <span>{out}</span>;
}

function FloatingCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div 
      className="animate-float hover-lift"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function FeatureCard({ 
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
        className={`card p-6 h-full transition-all duration-500 hover:scale-105 bg-gradient-to-br ${gradientClass} bg-opacity-10 border border-white/10`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {description}
        </p>
        <div className="mt-4 flex items-center text-white/50 group-hover:text-white/80 transition-colors duration-300">
          <span className="text-sm font-medium">Explore</span>
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function StatsCard({ value, label, icon, delay = 0 }: { value: string; label: string; icon: string; delay?: number }) {
  return (
    <div 
      className="card p-6 text-center animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gradient mb-1">{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
  );
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [splashDone, setSplashDone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const seen = localStorage.getItem("sasula_splash_seen");
    return seen === "1";
  });

  useEffect(() => {
    if (splashDone) return;
    const t = setTimeout(() => {
      setSplashDone(true);
      localStorage.setItem("sasula_splash_seen", "1");
    }, 3500);
    return () => clearTimeout(t);
  }, [splashDone]);

  return (
    <div className="min-h-screen max-h-screen overflow-hidden">
      <main className="responsive-container py-6 sm:py-8 max-h-[calc(100vh-120px)] overflow-y-auto">
        {!splashDone ? (
          <div className="w-full h-[60vh] sm:h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-8 mb-8 animate-glow">
                <span className="text-4xl">🚀</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              <span className="text-gradient">
                <Typewriter text="Welcome to Sasula Gateway" />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              The future of decentralized payments for Africa. Fast, secure, and social.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Live on Base Sepolia</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Multi-token Support</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Social Payments</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
              <div className="animate-fadeInLeft">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                  <span className="text-gradient">Sasula Gateway</span>
                </h1>
                <p className="text-white/70 text-lg">Empowering Africa through decentralized finance</p>
              </div>
              <div className="flex items-center gap-4 animate-fadeInRight">
                <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                  className="btn btn-outline px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300"
                >
                  {theme === "dark" ? "🌞" : "🌙"}
                </button>
                <ConnectButton />
              </div>
            </div>

            {/* Stats Section */}
            <div className="responsive-grid-4 mb-12">
              <StatsCard value="2.5K+" label="Active Users" icon="👥" delay={0} />
              <StatsCard value="$50K+" label="Volume Processed" icon="💰" delay={100} />
              <StatsCard value="99.9%" label="Uptime" icon="⚡" delay={200} />
              <StatsCard value="24/7" label="Support" icon="🛡️" delay={300} />
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
                <span className="text-gradient">Quick Actions</span>
              </h2>
              <div className="responsive-grid-4">
                <FloatingCard delay={0}>
                  <Link href="/send" className="group block">
                    <div className="card p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💸</div>
                      <h3 className="text-lg font-semibold mb-2">Send Money</h3>
                      <p className="text-white/60 text-sm">Transfer funds instantly</p>
                    </div>
                  </Link>
                </FloatingCard>
                <FloatingCard delay={0.2}>
                  <Link href="/qr" className="group block">
                    <div className="card p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📱</div>
                      <h3 className="text-lg font-semibold mb-2">QR Scanner</h3>
                      <p className="text-white/60 text-sm">Scan to pay quickly</p>
                    </div>
                  </Link>
                </FloatingCard>
                <FloatingCard delay={0.4}>
                  <Link href="/feed" className="group block">
                    <div className="card p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
                      <h3 className="text-lg font-semibold mb-2">Activity Feed</h3>
                      <p className="text-white/60 text-sm">Track your transactions</p>
                    </div>
                  </Link>
                </FloatingCard>
                <FloatingCard delay={0.6}>
                  <Link href="/voice" className="group block">
                    <div className="card p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎤</div>
                      <h3 className="text-lg font-semibold mb-2">Voice Payments</h3>
                      <p className="text-white/60 text-sm">Pay with your voice</p>
                    </div>
                  </Link>
                </FloatingCard>
              </div>
            </div>

            {/* Main Features */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
                <span className="text-gradient">Core Features</span>
              </h2>
              <div className="responsive-grid-3">
                <FeatureCard
                  title="Dashboard"
                  description="Monitor your balances, recent activity, and access quick shortcuts to all features."
                  icon="📈"
                  href="/dashboard"
                  gradient="primary"
                  delay={0}
                />
                <FeatureCard
                  title="Reputation & Loans"
                  description="Build your reputation score, fund the community pool, and access micro-loans."
                  icon="⭐"
                  href="/reputation"
                  gradient="secondary"
                  delay={200}
                />
                <FeatureCard
                  title="Savings Circles"
                  description="Join trustless group savings with rotating payouts and community support."
                  icon="🔄"
                  href="/savings"
                  gradient="accent"
                  delay={400}
                />
              </div>
            </div>

            {/* Emergency & Advanced Features */}
            <div className="responsive-grid-2">
              <FeatureCard
                title="Emergency Relief"
                description="Toggle fee-free mode during emergencies and access aid center information."
                icon="🚨"
                href="/emergency"
                gradient="accent"
                delay={0}
              />
              <div className="card p-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Built for Africa</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Designed specifically for the African market with local payment methods, 
                  low fees, and mobile-first approach.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">Mobile First</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">Low Fees</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">Fast</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">Secure</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}