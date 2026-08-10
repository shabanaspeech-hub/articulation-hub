import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
};

const BUCKET = "therapist-videos";
const FOLDER = "defaults";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminKey = req.headers.get("x-admin-key") ?? "";
    const expected = Deno.env.get("ADMIN_VIDEO_KEY") ?? "";
    if (!expected || adminKey !== expected) {
      return new Response(JSON.stringify({ error: "Invalid owner key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const form = await req.formData();
    const storageKey = String(form.get("storageKey") ?? "");
    const file = form.get("file");

    if (!storageKey || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "Missing storageKey or file" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const base = storageKey.replace(/[^a-zA-Z0-9]+/g, "_");
    const type = file.type || "video/webm";
    const ext = type.includes("mp4") ? "mp4" : type.includes("quicktime") ? "mov" : "webm";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Remove any previously published variants for this sound
    const { data: existing } = await supabase.storage.from(BUCKET).list(FOLDER, {
      limit: 100,
      search: base,
    });
    const stale = (existing ?? [])
      .filter((f) => f.name.startsWith(`${base}.`))
      .map((f) => `${FOLDER}/${f.name}`);
    if (stale.length) await supabase.storage.from(BUCKET).remove(stale);

    const path = `${FOLDER}/${base}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: type, upsert: true });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, path }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
