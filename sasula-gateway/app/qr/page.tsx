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
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">QR Payments</h2>
      <div className="grid gap-2">
        <input className="border rounded p-2" placeholder="Recipient 0x..." value={address} onChange={(e)=> setAddress(e.target.value)} />
        <input className="border rounded p-2" placeholder="Amount (ETH)" value={amount} onChange={(e)=> setAmount(e.target.value)} />
        <input className="border rounded p-2" placeholder="Message" value={message} onChange={(e)=> setMessage(e.target.value)} />
        <select className="border rounded p-2" value={tokenAddress} onChange={(e)=> setTokenAddress(e.target.value)}>
          <option value="">(Optional) ERC‑20 token from list...</option>
          {TOKENS.filter(t=> t.address !== "0x0000000000000000000000000000000000000000").map(t=> (
            <option key={t.symbol} value={t.address}>{t.symbol} - {t.name}</option>
          ))}
        </select>
        <button onClick={generate} className="rounded bg-blue-600 text-white px-3 py-2">Generate QR</button>
        {qr && <img src={qr} className="w-48 h-48" alt="qr" />}
      </div>
      <div className="border rounded p-3">
        <div className="font-medium mb-2">Scan QR</div>
        <video ref={videoRef} className="w-full max-h-64 rounded" />
        <div className="mt-2 flex gap-2">
          <button onClick={startScan} className="btn btn-primary">Start scan</button>
        </div>
      </div>
    </div>
  );
}
