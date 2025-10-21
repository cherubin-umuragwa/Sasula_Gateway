import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import TopBar from "./components/TopBar";
import ThemeClient from "./theme-client";
import BottomNav from "./components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sasula Gateway",
  description: "Modern decentralized payments miniapp UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeClient>
          <Providers>
            <TopBar />
            <main className="pt-20 min-h-screen pb-24">
              {children}
            </main>
            <BottomNav />
          </Providers>
        </ThemeClient>
      </body>
    </html>
  );
}
