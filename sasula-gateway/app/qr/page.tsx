"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { BrowserQRCodeReader } from "@zxing/browser";
import { useEffect, useRef } from "react";

export default function QRPage() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [qr, setQr] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  async function generate() {
    const payload = JSON.stringify({ address, amount, message });
    const dataUrl = await QRCode.toDataURL(payload);
    setQr(dataUrl);
  }

  useEffect(() => {
    codeReaderRef.current = new BrowserQRCodeReader();
    return () => {
      codeReaderRef.current?.reset();
    };
  }, []);

  async function startScan() {
    try {
      if (!codeReaderRef.current) return;
      const result = await codeReaderRef.current.decodeOnceFromVideoDevice(undefined, videoRef.current!);
      try {
        const json = JSON.parse(result.getText());
        alert(`Scanned:\nAddress: ${json.address}\nAmount: ${json.amount}\nMessage: ${json.message}`);
      } catch {
        alert(`Scanned text: ${result.getText()}`);
      }
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
