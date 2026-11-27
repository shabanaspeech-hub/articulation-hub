import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

// Clinically precise search terms so short/ambiguous words return the right object.
const REFINE: Record<string, string> = {
  pea: "green peas pod", pie: "baked pie", tie: "necktie", tea: "cup of tea", bow: "ribbon bow",
  bay: "ocean bay", pop: "soap bubbles", bee: "honey bee", ape: "chimpanzee", up: "balloon sky up",
  boo: "ghost costume", moo: "cow", mama: "mother child", papa: "father child", dada: "father child",
  daddy: "father child", mommy: "mother child", baby: "baby", puppy: "puppy dog", key: "door key",
  bat: "baseball bat", top: "spinning top toy", cap: "baseball cap", map: "world map", mop: "cleaning mop",
  pen: "pen writing", pan: "frying pan", pin: "safety pin", pot: "cooking pot", nut: "walnut",
  net: "fishing net", kit: "first aid kit", cot: "baby crib", dot: "polka dots", eat: "child eating",
  go: "go green traffic light", no: "stop sign", toe: "toes feet", knee: "knee", nose: "child nose",
  eye: "human eye", ear: "human ear", hat: "hat", hot: "hot fire", web: "spider web", wig: "wig hair",
  hen: "hen chicken", ham: "ham meat", tub: "bathtub", cub: "bear cub", bib: "baby bib", gum: "chewing gum",
  bun: "bread bun", sun: "sun sky", fan: "electric fan", van: "van car", jam: "jam jar", jet: "jet airplane",
  zip: "zipper", shoe: "shoe", fish: "fish", thumb: "thumb up hand", run: "child running", sit: "child sitting",
  wash: "washing hands", hop: "child jumping", kiss: "kiss", hug: "hug", bye: "waving goodbye",
};

const Body = z.object({ words: z.array(z.string().trim().min(1).max(40).regex(/^[a-zA-Z' -]+$/)).min(1).max(30) });

const fetchOne = async (word: string, key: string): Promise<string | null> => {
  const w = word.toLowerCase();
  for (const q of [REFINE[w] ?? w, w, `${w}s`]) {
    const u = await search(q, w, key);
    if (u) return u;
  }
  return null;
};

const search = async (q: string, w: string, key: string): Promise<string | null> => {
  const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(q)}&image_type=photo&safesearch=true&per_page=10&order=popular&lang=en`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const d = await r.json();
  const hits: any[] = d?.hits ?? [];
  // Prefer images whose tags actually mention the word/term for relevance.
  const terms = q.split(" ").concat(w);
  const good = hits.find((h) => terms.some((t) => String(h.tags).toLowerCase().includes(t))) ?? hits[0];
  return good?.webformatURL ?? null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
  const key = Deno.env.get("PIXABAY_API_KEY");
  if (!key) return json({ error: "Photo service not configured" }, 500);
  const out: Record<string, string | null> = {};
  await Promise.all(parsed.data.words.map(async (w) => { out[w.toLowerCase()] = await fetchOne(w, key).catch(() => null); }));
  return json({ photos: out });
});
