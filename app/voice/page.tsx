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
    // Multilingual intent extraction
    const t = transcript.trim();
    if (!t) return;
    const lower = t.toLowerCase();

    // English: "send 0.01 to 0x... message hello"
    const en = /send\s+([0-9.,]+)\s+(eth)?\s*to\s+(0x[a-f0-9]{40}).*?(message|note|msg)\s+(.+)$/i;
    // Swahili: "tuma 0.01 kwa 0x... ujumbe jambo"
    const sw = /tuma\s+([0-9.,]+)\s*(eth)?\s*kwa\s+(0x[a-f0-9]{40}).*?(ujumbe|message)\s+(.+)$/i;
    // French: "envoyer 0,01 à 0x... message bonjour"
    const fr = /envoyer\s+([0-9.,]+)\s*(eth)?\s*à\s+(0x[a-f0-9]{40}).*?(message|note)\s+(.+)$/i;

    const m = lower.match(en) || lower.match(sw) || lower.match(fr);
    if (m) {
      try {
        const amountRaw = m[1].replace(",", ".");
        const to = m[3] as `0x${string}`;
        const message = m[5];
        writeContract({
          address: CONTRACT_ADDRESSES.paymentRouter as `0x${string}`,
          abi: routerAbi as any,
          functionName: "payETH",
          args: [to, message],
          value: parseEther(amountRaw),
        });
        resetTranscript();
      } catch {}
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="responsive-container py-6 sm:py-8">
        <div className="card p-6">
          <div className="text-white/80">Browser does not support speech recognition.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-container py-6 sm:py-8">
      <div className="mb-6 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">Voice Payments</span>
        </h1>
        <p className="text-white/70">Send ETH with natural voice commands</p>
      </div>
      <div className="card p-6 space-y-4 animate-fadeInUp">
        <div className="flex flex-col sm:flex-row gap-3">
          <select className="input sm:w-60" value={lang} onChange={(e)=> setLang(e.target.value)}>
            <option value="en-US">English</option>
            <option value="sw-TZ">Swahili (Tanzania)</option>
            <option value="fr-FR">French</option>
          </select>
          {!listening ? (
            <button onClick={start} className="btn btn-primary sm:w-40">Start</button>
          ) : (
            <button onClick={stop} className="btn btn-secondary sm:w-40">Stop</button>
          )}
        </div>
        <div className="input whitespace-pre-wrap text-sm min-h-[120px]">
          {transcript || "Say: send 0.01 to 0x... message hello"}
        </div>
        {hash && (
          <div className="card p-4 bg-green-500/10 border border-green-500/20">
            <div className="text-sm">Tx: {hash}</div>
          </div>
        )}
      </div>
    </div>
  );
}
