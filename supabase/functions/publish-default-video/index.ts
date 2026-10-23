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

    const bad = (msg: string) =>
      new Response(JSON.stringify({ error: msg }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    if (!storageKey || storageKey.length > 100 || !(file instanceof File)) {
      return bad("Missing storageKey or file");
    }

    const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
    if (file.size === 0 || file.size > MAX_BYTES) {
      return bad("Video must be smaller than 50 MB");
    }

    const ALLOWED: Record<string, string> = {
      "video/webm": "webm",
      "video/mp4": "mp4",
      "video/quicktime": "mov",
    };
    const type = (file.type || "video/webm").split(";")[0].trim().toLowerCase();
    const ext = ALLOWED[type];
    if (!ext) return bad("Only WebM, MP4 or MOV videos are allowed");

    // Verify the file's actual content matches a video container signature
    const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const isWebm = head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3;
    const isIsoBmff = String.fromCharCode(...head.slice(4, 8)) === "ftyp";
    if ((ext === "webm" && !isWebm) || (ext !== "webm" && !isIsoBmff)) {
      return bad("File content is not a valid video");
    }

    const base = storageKey.replace(/[^a-zA-Z0-9]+/g, "_").slice(0, 80);

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
