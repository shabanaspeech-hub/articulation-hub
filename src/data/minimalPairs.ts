// Minimal pair contrast sets (shown after Sentences). Each pair differs by one sound.
export interface MinimalPair { a: { word: string; image: string }; b: { word: string; image: string } }
export interface MinimalPairSet { sounds: [string, string]; pairs: MinimalPair[] }

const p = (aw: string, ai: string, bw: string, bi: string): MinimalPair => ({ a: { word: aw, image: ai }, b: { word: bw, image: bi } });

export const minimalPairSets: MinimalPairSet[] = [
  { sounds: ["p", "b"], pairs: [p("pear", "🍐", "bear", "🐻"), p("pig", "🐷", "big", "🐘"), p("pea", "🫛", "bee", "🐝"), p("pat", "✋", "bat", "🦇"), p("pin", "📌", "bin", "🗑️")] },
  { sounds: ["m", "n"], pairs: [p("mail", "✉️", "nail", "💅"), p("mice", "🐭", "nice", "😊"), p("me", "🙋", "knee", "🦵"), p("mat", "🧘", "gnat", "🦟"), p("mine", "⛏️", "nine", "9️⃣")] },
  { sounds: ["l", "r"], pairs: [p("light", "💡", "right", "👉"), p("lake", "🏞️", "rake", "🧹"), p("lock", "🔒", "rock", "🪨"), p("lip", "👄", "rip", "✂️"), p("lead", "🐕", "read", "📖")] },
  { sounds: ["r", "v"], pairs: [p("rest", "😴", "vest", "🦺"), p("rain", "🌧️", "vane", "🌬️"), p("rat", "🐀", "vat", "🛢️"), p("row", "🚣", "vow", "💍"), p("rice", "🍚", "vice", "🔧")] },
  { sounds: ["k", "t"], pairs: [p("key", "🔑", "tea", "🍵"), p("cap", "🧢", "tap", "🚰"), p("cop", "👮", "top", "🔝"), p("cake", "🎂", "take", "🤲"), p("cub", "🐻", "tub", "🛁")] },
  { sounds: ["g", "d"], pairs: [p("goat", "🐐", "dote", "💕"), p("gate", "🚪", "date", "📅"), p("gum", "🍬", "dumb", "🤐"), p("go", "🟢", "dough", "🥖"), p("guy", "👦", "dye", "🎨")] },
  { sounds: ["sh", "s"], pairs: [p("shoe", "👟", "Sue", "👧"), p("ship", "🚢", "sip", "🥤"), p("she", "👩", "sea", "🌊"), p("shell", "🐚", "sell", "💰"), p("shy", "🙈", "sigh", "😮‍💨")] },
];

export const getMinimalPairSets = (soundId: string) => minimalPairSets.filter(s => s.sounds.includes(soundId.toLowerCase()));

export const getMinimalPairs = (soundId: string) =>
  getMinimalPairSets(soundId).flatMap(s => s.pairs.map(pair => ({ ...pair, sounds: s.sounds })));
