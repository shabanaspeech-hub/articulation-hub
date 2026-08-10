/**
 * Universal (owner-provided) therapist model videos.
 *
 * These live remotely in the `therapist-videos` storage bucket under the
 * `defaults/` folder, so every user on every device sees the same clip and it
 * survives deployments and rebuilds. They are read-only for app users:
 * recording/uploading only ever writes to the user's own local copy, and
 * deleting a custom clip simply falls back to the default again.
 */
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "therapist-videos";
const FOLDER = "defaults";

/** "isolated:P" -> "isolated_P" (safe object name prefix) */
export const defaultVideoName = (storageKey: string) =>
  storageKey.replace(/[^a-zA-Z0-9]+/g, "_");

const cache = new Map<string, string | null>();

/**
 * Returns a playable URL for the universal default clip of this sound,
 * or null when the owner has not published one yet.
 */
export async function getDefaultVideoUrl(storageKey: string): Promise<string | null> {
  if (cache.has(storageKey)) return cache.get(storageKey) ?? null;

  const base = defaultVideoName(storageKey);
  try {
    const { data, error } = await supabase.storage.from(BUCKET).list(FOLDER, {
      limit: 100,
      search: base,
    });
    if (error || !data?.length) {
      cache.set(storageKey, null);
      return null;
    }
    const match = data.find((f) => f.name.startsWith(`${base}.`)) ?? null;
    if (!match) {
      cache.set(storageKey, null);
      return null;
    }
    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(`${FOLDER}/${match.name}`, 60 * 60 * 24);
    const url = signed?.signedUrl ?? null;
    cache.set(storageKey, url);
    return url;
  } catch {
    cache.set(storageKey, null);
    return null;
  }
}
