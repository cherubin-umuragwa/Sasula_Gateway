"use client";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import emAbi from "@/lib/abis/EmergencyMode.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

export default function EmergencyPage() {
  const [globalOn, setGlobalOn] = useState(false);
  const [regionCode, setRegionCode] = useState("UG-Kampala");
  const [regionOn, setRegionOn] = useState(false);
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  function setGlobal() {
    writeContract({
      address: CONTRACT_ADDRESSES.emergencyMode as `0x${string}`,
      abi: emAbi as any,
      functionName: "setGlobalEmergency",
      args: [globalOn],
    });
  }
  function setRegion() {
    const regionBytes32 = `0x${Buffer.from(regionCode, 'utf8').toString('hex').padEnd(64, '0')}` as `0x${string}`;
    writeContract({
      address: CONTRACT_ADDRESSES.emergencyMode as `0x${string}`,
      abi: emAbi as any,
      functionName: "setRegionEmergency",
      args: [regionBytes32, regionOn],
    });
  }

  return (
    <div className="responsive-container py-6 sm:py-8 max-w-5xl">
      <div className="mb-6 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">Emergency Mode</span>
        </h1>
        <p className="text-white/70">Toggle fee-free mode globally or by region</p>
      </div>
      <div className="responsive-grid-2 gap-6">
        <div className="card p-6 space-y-4 animate-fadeInUp">
          <div className="font-medium text-white">Global Emergency</div>
          <div className="flex gap-3">
            <select className="input sm:w-48" value={String(globalOn)} onChange={(e)=> setGlobalOn(e.target.value === 'true')}>
              <option value="false">Off</option>
              <option value="true">On</option>
            </select>
            <button disabled={isPending || isLoading} onClick={setGlobal} className="btn btn-primary">Set</button>
          </div>
          {hash && <div className="text-xs break-all">Tx: {hash}</div>}
          {error && <div className="text-xs text-red-400">{error.message}</div>}
        </div>
        <div className="card p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
          <div className="font-medium text-white">Region Emergency</div>
          <input className="input w-full" placeholder="Region (e.g., UG-Kampala)" value={regionCode} onChange={(e)=> setRegionCode(e.target.value)} />
          <div className="flex gap-3">
            <select className="input sm:w-48" value={String(regionOn)} onChange={(e)=> setRegionOn(e.target.value === 'true')}>
              <option value="false">Off</option>
              <option value="true">On</option>
            </select>
            <button disabled={isPending || isLoading} onClick={setRegion} className="btn btn-secondary">Set</button>
          </div>
        </div>
      </div>
      <div className="card p-6 mt-6 animate-fadeInUp" style={{ animationDelay: '250ms' }}>
        <div className="font-medium text-white mb-3">Aid Map (demo markers)</div>
        <div className="h-[320px] rounded-xl overflow-hidden border border-white/10">
          <MapContainer center={[0.3476, 32.5825]} zoom={6} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[0.3476, 32.5825]}>
              <Popup>Kampala Aid Distribution Center</Popup>
            </Marker>
            <Marker position={[0.3136, 32.5811]}>
              <Popup>Family relief pickup</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
