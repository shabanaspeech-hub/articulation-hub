import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

/**
 * Lovable's managed OAuth broker serves /~oauth/initiate and /~oauth/callback
 * only on Lovable-hosted domains (*.lovable.app / *.lovableproject.com and
 * custom domains attached to the Lovable project). On any other host — e.g.
 * Vercel — those paths do not exist, so the redirect 404s.
 *
 * On non-Lovable hosts we therefore go straight to Supabase's own OAuth
 * endpoint, which redirects to Google and back to `redirectTo`.
 */
export const isLovableHost = () => {
  const h = window.location.hostname;
  return (
    h.endsWith(".lovable.app") ||
    h.endsWith(".lovableproject.com") ||
    h === "localhost" ||
    h === "127.0.0.1"
  );
};

export const signInWithGoogle = async (): Promise<{ error?: unknown }> => {
  const redirectTo = `${window.location.origin}/`;

  if (isLovableHost()) {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    return { error: result.error };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  return { error: error ?? undefined };
};
