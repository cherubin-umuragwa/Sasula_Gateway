"use client";
import { useEffect, useState } from "react";

export function useLikesComments() {
  const [data, setData] = useState<Record<string, { likes: number; comments: string[] }>>({});
  useEffect(() => {
    const raw = localStorage.getItem("sasula_feed_social");
    if (raw) setData(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("sasula_feed_social", JSON.stringify(data));
  }, [data]);
  function keyOf(log: any) {
    return `${log.transactionHash}-${log.logIndex}`;
  }
  function like(log: any) {
    const k = keyOf(log);
    setData((prev) => ({ ...prev, [k]: { likes: (prev[k]?.likes || 0) + 1, comments: prev[k]?.comments || [] } }));
  }
  function comment(log: any, text: string) {
    const k = keyOf(log);
    setData((prev) => ({ ...prev, [k]: { likes: prev[k]?.likes || 0, comments: [...(prev[k]?.comments || []), text] } }));
  }
  return { data, like, comment, keyOf };
}
