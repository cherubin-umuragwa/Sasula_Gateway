"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass backdrop-blur-xl' : 'bg-transparent'
    }`}>
      <div className="responsive-container py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">🚀</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gradient">
                Sasula Gateway
              </h1>
              <p className="text-xs text-white/60 hidden sm:block">
                Decentralized Payments
              </p>
            </div>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                {theme === "dark" ? "🌞" : "🌙"}
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Network Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Base Sepolia</span>
            </div>

            {/* Connect Button */}
            <div className="relative">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}