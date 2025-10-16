"use client";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-8 gap-8">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-bold">Sasula Gateway</h1>
          <ConnectButton />
        </div>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/dashboard">Dashboard</Link>
          <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/send">Send</Link>
          <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/feed">Feed</Link>
          <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/savings">Savings</Link>
          <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/reputation">Reputation</Link>
          <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/emergency">Emergency</Link>
          <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/voice">Voice</Link>
          <Link className="rounded-lg p-4 border hover:bg-neutral-100 dark:hover:bg-neutral-900" href="/qr">QR</Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
