"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/40 dark:bg-black/30 border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600" />
          <span className="font-extrabold tracking-tight text-lg">Sasula Gateway</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="btn btn-secondary px-3 py-1"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
