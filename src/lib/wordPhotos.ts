import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Real photos for word cards, fetched once per word via the backend and cached on the device.
// Pixabay image links expire after about a day, so the cache is keyed per day.
const CACHE_KEY = `word-photo-cache-${new Date().toISOString().slice(0, 10)}`;
try { Object.keys(localStorage).filter((k) => k.startsWith("word-photo-cache-") && k !== CACHE_KEY).forEach((k) => localStorage.removeItem(k)); } catch { /* ignore */ }
const read = (): Record<string, string | null> => { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; } };
const cache = read();
const pending = new Map<string, Promise<string | null>>();
let queue: string[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
const resolvers = new Map<string, (v: string | null) => void>();

const flush = async () => {
  timer = null;
  const words = queue.splice(0, 30);
  if (queue.length) timer = setTimeout(flush, 0);
  let photos: Record<string, string | null> = {};
  try {
    const { data } = await supabase.functions.invoke("get-word-photo", { body: { words } });
    photos = data?.photos ?? {};
  } catch { /* offline */ }
  for (const w of words) {
    const v = photos[w] ?? null;
    if (w in photos) { cache[w] = v; }
    resolvers.get(w)?.(v); resolvers.delete(w); pending.delete(w);
  }
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* full */ }
};

export const normWord = (w: string) => w.trim().toLowerCase().replace(/[^a-z' -]/g, "").replace(/-/g, " ").trim();

export const fetchWordPhoto = (raw: string): Promise<string | null> => {
  const w = normWord(raw);
  if (!w) return Promise.resolve(null);
  if (w in cache) return Promise.resolve(cache[w]);
  if (pending.has(w)) return pending.get(w)!;
  const p = new Promise<string | null>((res) => resolvers.set(w, res));
  pending.set(w, p); queue.push(w);
  if (!timer) timer = setTimeout(flush, 30);
  return p;
};

export const useWordPhoto = (word?: string) => {
  const w = word ? normWord(word) : "";
  const [url, setUrl] = useState<string | null | undefined>(w && w in cache ? cache[w] : undefined);
  useEffect(() => {
    if (!w) return;
    let live = true;
    if (w in cache) setUrl(cache[w]); else { setUrl(undefined); fetchWordPhoto(w).then((u) => live && setUrl(u)); }
    return () => { live = false; };
  }, [w]);
  return url; // undefined = loading, null = none found
};
