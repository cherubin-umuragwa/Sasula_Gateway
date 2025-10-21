"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faArrowRightArrowLeft,
  faGaugeHigh,
  faQrcode,
  faRss,
} from "@fortawesome/free-solid-svg-icons";

type NavItem = {
  href: string;
  label: string;
  icon: any;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: faHouse },
  { href: "/send", label: "Send", icon: faArrowRightArrowLeft },
  { href: "/dashboard", label: "Dash", icon: faGaugeHigh },
  { href: "/qr", label: "Scan", icon: faQrcode },
  { href: "/feed", label: "Feed", icon: faRss },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="w-full pb-[env(safe-area-inset-bottom)]">
        <div className="glass rounded-t-2xl backdrop-blur-xl border-t border-white/10 bg-white/5 dark:bg-black/30">
          <ul className="grid grid-cols-5">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center py-3 gap-1 transition-all duration-300 ${
                      active ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                    aria-label={item.label}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
