import { vcAudioSources } from './vcAudioManifest';
import { playRobustClip, stopActiveClip } from './clipPlayer';

export function stopVCSyllable() {
  stopActiveClip();
}

/** Resolves true when the fixed clip played, false when the caller should fall back. */
export async function speakVCSyllable(target: string): Promise<boolean> {
  const src = vcAudioSources[target.toLowerCase()];
  if (!src) return false;
  return playRobustClip(src);
}
