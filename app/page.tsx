"use client";
import { useEffect, useState } from "react";
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
        className={`card p-8 h-full transition-all duration-500 hover:scale-105 bg-gradient-to-br ${gradientClass} bg-opacity-10 border border-white/10 hover:border-white/20`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 mb-6 group-hover:scale-110 transition-transform duration-300">
          <div className="text-3xl font-bold text-white">{icon}</div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </h3>
        <p className="text-white/70 text-base leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {description}
        </p>
        <div className="mt-6 flex items-center text-white/50 group-hover:text-white/80 transition-colors duration-300">
          <span className="text-sm font-medium">Explore</span>
          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      className="card p-8 text-center animate-fadeInUp bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-4 font-bold text-gradient">{icon}</div>
      <div className="text-3xl font-bold text-gradient mb-2">{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-8">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 animate-glow">
            <div className="text-4xl font-bold text-white">SG</div>
          </div>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="text-gradient">
            <Typewriter text="Sasula Gateway" />
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-12">
          The future of decentralized payments for Africa. Fast, secure, and social payments on Base blockchain.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center space-x-3 text-white/60">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live on Base Sepolia</span>
          </div>
          <div className="flex items-center space-x-3 text-white/60">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Multi-token Support</span>
          </div>
          <div className="flex items-center space-x-3 text-white/60">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Social Payments</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/send" className="btn btn-primary px-8 py-4 text-lg">
            Start Sending
          </Link>
          <Link href="/dashboard" className="btn btn-outline px-8 py-4 text-lg">
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <div className="py-20 bg-gradient-to-r from-white/5 to-white/10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Platform Statistics</span>
          </h2>
          <p className="text-white/70 text-lg">Trusted by thousands of users across Africa</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard value="2.5K+" label="Active Users" icon="2.5K" delay={0} />
          <StatsCard value="$50K+" label="Volume Processed" icon="$50K" delay={100} />
          <StatsCard value="99.9%" label="Uptime" icon="99.9%" delay={200} />
          <StatsCard value="24/7" label="Support" icon="24/7" delay={300} />
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Core Features</span>
          </h2>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Everything you need for modern decentralized payments and financial services
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Instant Payments"
            description="Send and receive payments instantly with social messages. Support for ETH and ERC-20 tokens with minimal fees."
            icon="PAY"
            href="/send"
            gradient="primary"
            delay={0}
          />
          <FeatureCard
            title="Social Reputation"
            description="Build your reputation score through transactions and endorsements. Access micro-loans based on your community standing."
            icon="REP"
            href="/reputation"
            gradient="secondary"
            delay={200}
          />
          <FeatureCard
            title="Savings Circles"
            description="Join trustless group savings with rotating payouts. Community-driven financial services for collective growth."
            icon="SAVE"
            href="/savings"
            gradient="accent"
            delay={400}
          />
        </div>
      </div>
    </div>
  );
}

function QuickActionsSection() {
  return (
    <div className="py-20 bg-gradient-to-r from-white/5 to-white/10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Quick Actions</span>
          </h2>
          <p className="text-white/70 text-lg">Get started with these essential features</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FloatingCard delay={0}>
            <Link href="/send" className="group block">
              <div className="card p-8 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
                <div className="text-5xl mb-6 font-bold text-gradient group-hover:scale-110 transition-transform duration-300">SEND</div>
                <h3 className="text-xl font-semibold mb-2">Send Money</h3>
                <p className="text-white/60 text-sm">Transfer funds instantly</p>
              </div>
            </Link>
          </FloatingCard>
          
          <FloatingCard delay={0.2}>
            <Link href="/qr" className="group block">
              <div className="card p-8 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                <div className="text-5xl mb-6 font-bold text-gradient group-hover:scale-110 transition-transform duration-300">QR</div>
                <h3 className="text-xl font-semibold mb-2">QR Scanner</h3>
                <p className="text-white/60 text-sm">Scan to pay quickly</p>
              </div>
            </Link>
          </FloatingCard>
          
          <FloatingCard delay={0.4}>
            <Link href="/feed" className="group block">
              <div className="card p-8 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30">
                <div className="text-5xl mb-6 font-bold text-gradient group-hover:scale-110 transition-transform duration-300">FEED</div>
                <h3 className="text-xl font-semibold mb-2">Activity Feed</h3>
                <p className="text-white/60 text-sm">Track your transactions</p>
              </div>
            </Link>
          </FloatingCard>
          
          <FloatingCard delay={0.6}>
            <Link href="/voice" className="group block">
              <div className="card p-8 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30">
                <div className="text-5xl mb-6 font-bold text-gradient group-hover:scale-110 transition-transform duration-300">VOICE</div>
                <h3 className="text-xl font-semibold mb-2">Voice Payments</h3>
                <p className="text-white/60 text-sm">Pay with your voice</p>
              </div>
            </Link>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
}

function CTASection() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="card p-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30">
          <h2 className="text-4xl font-bold mb-6 text-white">Built for Africa</h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Designed specifically for the African market with local payment methods, 
            low fees, and mobile-first approach. Empowering communities through 
            decentralized finance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">Mobile First</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">Low Fees</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">Fast</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">Secure</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">Social</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn btn-primary px-8 py-4 text-lg">
              Get Started
            </Link>
            <Link href="/emergency" className="btn btn-outline px-8 py-4 text-lg">
              Emergency Relief
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
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
    <div className="min-h-screen">
      {!splashDone ? (
        <div className="w-full h-screen flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-12 mb-8 animate-glow">
              <div className="text-6xl font-bold text-white">SG</div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gradient">
              <Typewriter text="Welcome to Sasula Gateway" />
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            The future of decentralized payments for Africa. Fast, secure, and social.
          </p>
        </div>
      ) : (
        <>
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <QuickActionsSection />
          <CTASection />
        </>
      )}
    </div>
  );
}