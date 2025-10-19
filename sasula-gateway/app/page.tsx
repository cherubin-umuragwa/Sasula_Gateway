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
    <div className="font-sans min-h-screen p-4 sm:p-8 gap-8 max-w-4xl mx-auto">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {!splashDone ? (
          <div className="w-full h-[50vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              <Typewriter text="Hello, Welcome to Sasula Gateway" />
            </h1>
            <p className="mt-3 opacity-70">Fast, social payments for Africa on Base.</p>
          </div>
        ) : (
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Sasula Gateway</h1>
          <div className="flex items-center gap-3">
            <button onClick={()=> setTheme(theme === "dark" ? "light" : "dark")} className="rounded-full border px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">{theme === "dark" ? "🌞" : "🌙"}</button>
            <ConnectButton />
          </div>
        </div>
        )}
        {/* Removed Next.js logo for cleaner home */}
        {splashDone && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/send", label: "Send" },
            { href: "/feed", label: "Feed" },
            { href: "/savings", label: "Savings" },
            { href: "/reputation", label: "Reputation" },
            { href: "/emergency", label: "Emergency" },
            { href: "/voice", label: "Voice" },
            { href: "/qr", label: "QR" },
          ].map((i) => (
            <Link key={i.href} className="hover-tile p-4 text-center" href={i.href}>{i.label}</Link>
          ))}
        </div>
        )}
      </main>
    </div>
  );
}
