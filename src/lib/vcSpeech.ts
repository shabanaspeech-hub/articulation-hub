import { vcAudioSources } from './vcAudioManifest';

let activeAudio: HTMLAudioElement | undefined;

export function stopVCSyllable() {
  if (!activeAudio) return;
  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = undefined;
}

export async function speakVCSyllable(target: string): Promise<void> {
  stopVCSyllable();
  window.speechSynthesis?.cancel();
  const src = vcAudioSources[target.toLowerCase()];
  if (!src) throw new Error('VC model audio is unavailable');
  const audio = new Audio(src);
  activeAudio = audio;
  audio.onended = () => {
    if (activeAudio === audio) activeAudio = undefined;
  };
  try {
    await audio.play();
  } catch (error) {
    if (activeAudio === audio) activeAudio = undefined;
    if (error instanceof DOMException && error.name === 'AbortError') return;
    throw error;
  }
}