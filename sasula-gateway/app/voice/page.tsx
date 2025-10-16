"use client";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import routerAbi from "@/lib/abis/PaymentRouter.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

export default function VoicePage() {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });
  const [lang, setLang] = useState("en-US");

  function start() {
    SpeechRecognition.startListening({ continuous: true, language: lang });
  }
  function stop() {
    SpeechRecognition.stopListening();
  }

  useEffect(() => {
    // Very simple command pattern: "send 0.01 to 0xabc... message hello"
    const lower = transcript.toLowerCase();
    if (lower.includes("send") && lower.includes("to") && lower.includes("message")) {
      try {
        const amountMatch = lower.match(/send\s+([0-9.]+)/);
        const toMatch = lower.match(/to\s+(0x[a-f0-9]{40})/);
        const msgMatch = lower.match(/message\s+(.+)$/);
        if (amountMatch && toMatch && msgMatch) {
          const amount = amountMatch[1];
          const to = toMatch[1] as `0x${string}`;
          const message = msgMatch[1];
          writeContract({
            address: CONTRACT_ADDRESSES.paymentRouter as `0x${string}`,
            abi: routerAbi as any,
            functionName: "payETH",
            args: [to, message],
            value: parseEther(amount),
          });
          resetTranscript();
        }
      } catch {}
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-4">Browser does not support speech recognition.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Voice Payments</h2>
      <div className="flex gap-2">
        <select className="border rounded p-2" value={lang} onChange={(e)=> setLang(e.target.value)}>
          <option value="en-US">English</option>
          <option value="sw-TZ">Swahili (Tanzania)</option>
          <option value="fr-FR">French</option>
        </select>
        {!listening ? (
          <button onClick={start} className="rounded bg-blue-600 text-white px-3 py-2">Start</button>
        ) : (
          <button onClick={stop} className="rounded bg-red-600 text-white px-3 py-2">Stop</button>
        )}
      </div>
      <div className="border rounded p-3 whitespace-pre-wrap text-sm min-h-[100px]">{transcript || "Say: send 0.01 to 0x... message hello"}</div>
      {hash && <div className="text-sm">Tx: {hash}</div>}
    </div>
  );
}
