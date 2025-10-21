"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faCircle } from "@fortawesome/free-solid-svg-icons";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full">
        <div className="glass rounded-b-2xl backdrop-blur-xl border-b border-white/10 bg-white/5 dark:bg-black/30 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-xl font-bold text-white">SG</div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                Sasula Gateway
              </h1>
              <p className="text-xs text-white/60 hidden sm:block">
                Decentralized Payments
              </p>
            </div>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {theme === "dark" ? (
                  <FontAwesomeIcon 
                    icon={faSun} 
                    className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-300" 
                  />
                ) : (
                  <FontAwesomeIcon 
                    icon={faMoon} 
                    className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform duration-300" 
                  />
                )}
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Network Status */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Base Sepolia</span>
            </div>

            {/* Connect Button */}
            <div className="relative">
              <ConnectButton />
            </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}