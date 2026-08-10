/**
 * Hidden owner mode.
 *
 * Press Shift + A anywhere in the app to be prompted for the owner key.
 * The key is kept in sessionStorage only (never persisted) and is verified
 * server-side by the `publish-default-video` edge function.
 */
import { useEffect, useState } from "react";

const KEY_STORE = "articulation-hub-owner-key";

export const getOwnerKey = () => sessionStorage.getItem(KEY_STORE);
export const setOwnerKey = (key: string) => {
  sessionStorage.setItem(KEY_STORE, key);
  window.dispatchEvent(new Event("owner-mode-change"));
};
export const clearOwnerKey = () => {
  sessionStorage.removeItem(KEY_STORE);
  window.dispatchEvent(new Event("owner-mode-change"));
};

/** Ask for the key (used by the keyboard shortcut and the hidden tap target). */
export function promptOwnerKey() {
  if (getOwnerKey()) {
    clearOwnerKey();
    return;
  }
  const key = window.prompt("Owner key");
  if (key) setOwnerKey(key.trim());
}

/** True while an owner key is present in this tab. */
export function useOwnerMode() {
  const [active, setActive] = useState(() => Boolean(getOwnerKey()));

  useEffect(() => {
    const sync = () => setActive(Boolean(getOwnerKey()));
    window.addEventListener("owner-mode-change", sync);

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (!e.shiftKey || e.key.toLowerCase() !== "a") return;
      e.preventDefault();
      promptOwnerKey();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("owner-mode-change", sync);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return active;
}
