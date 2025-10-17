"use client";
import { useState } from "react";
import QRCode from "qrcode";
import dynamic from "next/dynamic";
const QrReader = dynamic(() => import("react-qr-reader").then(m => m.QrReader), { ssr: false });

export default function QRPage() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [qr, setQr] = useState<string>("");

  async function generate() {
    const payload = JSON.stringify({ address, amount, message });
    const dataUrl = await QRCode.toDataURL(payload);
    setQr(dataUrl);
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
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) {
              try {
                const json = JSON.parse(result.getText());
                alert(`Scanned:\nAddress: ${json.address}\nAmount: ${json.amount}\nMessage: ${json.message}`);
              } catch (e) {
                alert(`Scanned text: ${result.getText()}`);
              }
            }
          }}
          containerStyle={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
