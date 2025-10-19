"use client";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

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
    }, 2800);
    return () => clearTimeout(t);
  }, [splashDone]);
  return (
    <div className="font-sans min-h-screen max-h-screen overflow-hidden">
      <main className="responsive-container py-4 sm:py-8 flex flex-col gap-6 sm:gap-10 max-h-[calc(100vh-120px)] overflow-y-auto">
        {!splashDone ? (
          <div className="w-full h-[40vh] sm:h-[50vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight">
              <Typewriter text="Hello, Welcome to Sasula Gateway" />
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base opacity-70">Fast, social payments for Africa on Base.</p>
          </div>
        ) : (
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">Sasula Gateway</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={()=> setTheme(theme === "dark" ? "light" : "dark")} className="responsive-button rounded-full border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">{theme === "dark" ? "🌞" : "🌙"}</button>
            <ConnectButton />
          </div>
        </div>
        )}
        {/* Removed Next.js logo for cleaner home */}
        {splashDone && (
          <>
            <section className="responsive-grid-3">
              <div className="hover-tile p-3 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold mb-1">Quick Actions</h3>
                <div className="responsive-grid-2">
                  <Link className="responsive-button btn btn-primary" href="/send">Send</Link>
                  <Link className="responsive-button btn btn-secondary" href="/qr">QR</Link>
                  <Link className="responsive-button btn btn-primary" href="/feed">Feed</Link>
                  <Link className="responsive-button btn btn-secondary" href="/voice">Voice</Link>
                </div>
              </div>
              <Link className="hover-tile p-3 sm:p-5" href="/dashboard">
                <h3 className="text-sm sm:text-base font-bold mb-1">Dashboard</h3>
                <p className="opacity-70 text-xs sm:text-sm">Balances, recent activity and shortcuts.</p>
              </Link>
              <Link className="hover-tile p-3 sm:p-5" href="/reputation">
                <h3 className="text-sm sm:text-base font-bold mb-1">Reputation & Loans</h3>
                <p className="opacity-70 text-xs sm:text-sm">Fund pool, borrow and grow your score.</p>
              </Link>
            </section>
            <section className="responsive-grid-2">
              <Link className="hover-tile p-3 sm:p-5" href="/savings">
                <h3 className="text-sm sm:text-base font-bold mb-1">Savings Circles</h3>
                <p className="opacity-70 text-xs sm:text-sm">Trustless group saving and rotating payouts.</p>
              </Link>
              <Link className="hover-tile p-3 sm:p-5" href="/emergency">
                <h3 className="text-sm sm:text-base font-bold mb-1">Emergency Relief</h3>
                <p className="opacity-70 text-xs sm:text-sm">Toggle fee-free mode and view aid centers.</p>
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
