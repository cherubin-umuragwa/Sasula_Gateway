"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { useEffect, useRef } from "react";
import { TOKENS } from "@/lib/tokenlist";
import { useRouter } from "next/navigation";

export default function QRPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [qr, setQr] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  async function generate() {
    // If tokenAddress present, encode ERC20 token; else default to ETH
    const payload = JSON.stringify({ address, amount, message, token: tokenAddress ? "ERC20" : "ETH", tokenAddress: tokenAddress || undefined });
    const dataUrl = await QRCode.toDataURL(payload);
    setQr(dataUrl);
  }

  useEffect(() => {
    codeReaderRef.current = new BrowserQRCodeReader();
    return () => {
      try {
        controlsRef.current?.stop();
        if (videoRef.current && (videoRef.current.srcObject as MediaStream | null)) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((t) => t.stop());
          videoRef.current.srcObject = null;
        }
      } catch {}
    };
  }, []);

  async function startScan() {
    try {
      if (!codeReaderRef.current) return;
      // Start continuous decode and stop as soon as a result is received
      controlsRef.current = await codeReaderRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result, err, controls) => {
          if (result) {
            try {
              const json = JSON.parse(result.getText());
              const params = new URLSearchParams();
              if (json.address) params.set("to", json.address);
              if (json.amount) params.set("amount", String(json.amount));
              if (json.message) params.set("message", String(json.message));
              if (json.token === "ERC20") {
                params.set("token", "ERC20");
                if (json.tokenAddress) params.set("tokenAddress", String(json.tokenAddress));
              } else {
                params.set("token", "ETH");
              }
              controls.stop();
              router.push(`/send?${params.toString()}`);
            } catch {
              // Not JSON, just show text
              alert(`Scanned text: ${result.getText()}`);
              controls.stop();
            }
          }
        }
      );
    } catch (e) {
      console.error(e);
      alert("Unable to access camera. Please allow camera permissions.");
    }
  }

  return (
    <div className="responsive-container py-6 sm:py-8">
      <div className="mb-8 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">QR Payments</span>
        </h1>
        <p className="text-white/70">Generate or scan a QR to prefill payments</p>
      </div>

      <div className="responsive-grid-2 gap-8">
        {/* Generator */}
        <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Generate Payment QR</h3>
          <div className="space-y-4">
            <input className="input" placeholder="Recipient 0x..." value={address} onChange={(e)=> setAddress(e.target.value)} />
            <input className="input" placeholder="Amount (ETH)" value={amount} onChange={(e)=> setAmount(e.target.value)} />
            <input className="input" placeholder="Message" value={message} onChange={(e)=> setMessage(e.target.value)} />
            <select className="input" value={tokenAddress} onChange={(e)=> setTokenAddress(e.target.value)}>
              <option value="">(Optional) ERC‑20 token from list...</option>
              {TOKENS.filter(t=> t.address !== "0x0000000000000000000000000000000000000000").map(t=> (
                <option key={t.symbol} value={t.address}>{t.symbol} - {t.name}</option>
              ))}
            </select>
            <button onClick={generate} className="btn btn-primary w-full">Generate QR</button>
            {qr && (
              <div className="flex justify-center pt-4">
                <img src={qr} className="w-48 h-48 rounded-xl border border-white/10" alt="qr" />
              </div>
            )}
          </div>
        </div>

        {/* Scanner */}
        <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Scan Payment QR</h3>
          <div className="space-y-3">
            <video ref={videoRef} className="w-full max-h-64 rounded-xl border border-white/10" />
            <button onClick={startScan} className="btn btn-secondary w-full">Start scan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
