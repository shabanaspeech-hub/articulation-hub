import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "therapist-videos";
const FOLDER = "defaults";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** Returns a short-lived signed URL for the published default clip of one sound. */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const storageKey = typeof body?.storageKey === "string" ? body.storageKey : "";
    if (!storageKey || storageKey.length > 100) return json({ error: "Invalid storageKey" }, 400);

    const base = storageKey.replace(/[^a-zA-Z0-9]+/g, "_");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data } = await supabase.storage.from(BUCKET).list(FOLDER, { limit: 100, search: base });
    const match = (data ?? []).find((f) => f.name.startsWith(`${base}.`));
    if (!match) return json({ url: null });

    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(`${FOLDER}/${match.name}`, 60 * 60 * 6);
    return json({ url: signed?.signedUrl ?? null });
  } catch {
    return json({ error: "Could not load video" }, 500);
  }
});
