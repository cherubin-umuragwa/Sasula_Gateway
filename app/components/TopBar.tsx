"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/40 dark:bg-black/30 border-b">
      <div className="responsive-container py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-violet-600" />
          <span className="font-extrabold tracking-tight text-sm sm:text-lg">Sasula Gateway</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="responsive-button btn btn-secondary"
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
