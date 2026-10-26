import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateVC, soundsData } from '@/data/soundsData';
import { vcAudioSources } from '@/lib/vcAudioManifest';
import { getVCPhonemes } from '@/lib/vcPhonemes';
import { speakVCSyllable, stopVCSyllable } from '@/lib/vcSpeech';

describe('VC consonant identity', () => {
  it.each([
    ['P', ['ap', 'op', 'ip', 'up', 'ep']],
    ['T', ['at', 'ot', 'it', 'ut', 'et']],
    ['B', ['ab', 'ob', 'ib', 'ub', 'eb']],
    ['D', ['ad', 'od', 'id', 'ud', 'ed']],
    ['M', ['am', 'om', 'im', 'um', 'em']],
    ['N', ['an', 'on', 'in', 'un', 'en']],
  ])('%s does not borrow another consonant', (sound, targets) => {
    const items = generateVC(sound as string);
    expect(items.map(item => item.syllable)).toEqual(targets);
    expect(items.map(item => item.display)).toEqual(targets);
  });

  it.each(soundsData.filter(s => s.kind !== 'vowel').map(s => s.sound))(
    '%s has whole-syllable audio for every VC item', sound => {
      for (const item of generateVC(sound)) {
        expect(item.syllable).toMatch(new RegExp(`^(a|i|oo|e|o|u)${sound.toLowerCase()}$`));
        expect(getVCPhonemes(item.syllable)).toBeDefined();
        expect(vcAudioSources[item.syllable]).toMatch(/vc-.*\.mp3$/);
      }
    },
  );

  it('encodes one vowel and the exact coda, not letter names', () => {
    expect(getVCPhonemes('ap')).toBe('ap');
    expect(getVCPhonemes('ip')).toBe('Ip');
    expect(getVCPhonemes('ep')).toBe('Ep');
    expect(getVCPhonemes('ot')).toBe('0t');
    expect(getVCPhonemes('it')).toBe('It');
    expect(getVCPhonemes('et')).toBe('Et');
    expect(getVCPhonemes('ab')).toBe('ab');
    expect(getVCPhonemes('ad')).toBe('ad');
    expect(getVCPhonemes('im')).toBe('Im');
    expect(getVCPhonemes('in')).toBe('In');
    expect(getVCPhonemes('ij')).toBe('IdZ');
    expect(getVCPhonemes('ooth')).toBe('u:T');
    expect(getVCPhonemes('ih')).toBe('I');
  });
});

describe('VC playback', () => {
  afterEach(() => { stopVCSyllable(); vi.unstubAllGlobals(); });

  it('plays a single fixed clip instead of asking TTS to read letters', async () => {
    const clips: { src: string; play: ReturnType<typeof vi.fn>; pause: ReturnType<typeof vi.fn>; currentTime: number }[] = [];
    vi.stubGlobal('Audio', class {
      play = vi.fn().mockResolvedValue(undefined);
      pause = vi.fn();
      currentTime = 0;
      constructor(public src: string) { clips.push(this); }
    });
    const speak = vi.fn();
    vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), speak });
    await speakVCSyllable('ip');
    expect(clips).toHaveLength(1);
    expect(clips[0].src).toBe(vcAudioSources.ip);
    expect(clips[0].play).toHaveBeenCalledOnce();
    expect(speak).not.toHaveBeenCalled();
    await speakVCSyllable('it');
    expect(clips[0].pause).toHaveBeenCalledOnce();
    expect(clips[1].src).toBe(vcAudioSources.it);
  });
});