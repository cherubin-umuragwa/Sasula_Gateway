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
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Emergency Mode</h2>
      <div className="space-y-3">
        <div className="border rounded p-3">
          <div className="font-medium">Global Emergency</div>
          <div className="flex gap-2 mt-2">
            <select className="border rounded p-2" value={String(globalOn)} onChange={(e)=> setGlobalOn(e.target.value === 'true')}>
              <option value="false">Off</option>
              <option value="true">On</option>
            </select>
            <button disabled={isPending || isLoading} onClick={setGlobal} className="rounded bg-blue-600 text-white px-3 py-2">Set</button>
          </div>
        </div>
        <div className="border rounded p-3">
          <div className="font-medium">Region Emergency</div>
          <input className="border rounded p-2 mt-2 w-full" placeholder="Region (e.g., UG-Kampala)" value={regionCode} onChange={(e)=> setRegionCode(e.target.value)} />
          <div className="flex gap-2 mt-2">
            <select className="border rounded p-2" value={String(regionOn)} onChange={(e)=> setRegionOn(e.target.value === 'true')}>
              <option value="false">Off</option>
              <option value="true">On</option>
            </select>
            <button disabled={isPending || isLoading} onClick={setRegion} className="rounded bg-blue-600 text-white px-3 py-2">Set</button>
          </div>
        </div>
        {hash && <div className="text-sm">Tx: {hash}</div>}
        {error && <div className="text-sm text-red-600">{error.message}</div>}
      </div>
      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Aid Map (demo markers)</div>
        <div className="h-[300px]">
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
