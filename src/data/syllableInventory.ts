// Syllable-shape word inventory (motor speech / apraxia hierarchy).
// Words are classified by their SPOKEN structure (General American unless tagged),
// not spelling. Clusters, rhotic vowels and extra syllables are kept out of the
// simpler shapes; dialect-dependent items carry a `dialect` note.

export type SyllableShape =
  | "CV" | "VC" | "C1V1C1V1" | "VCV" | "C1V1C1V2" | "CVC-harmony"
  | "CVC" | "C1V1C2V2" | "C1V1C2V2+CVC" | "CVCVCV" | "complex" | "phrase";

export type WordCategory = "animals" | "food" | "toys" | "home" | "family" | "actions" | "body" | "everyday";

export interface ShapeWord {
  word: string;
  shape: SyllableShape;
  category: WordCategory;
  emoji: string;
  dialect?: string;
}

export interface ShapeInfo { shape: SyllableShape; level: 1 | 2 | 3 | 4; notation: string; name: string }

export const SHAPES: ShapeInfo[] = [
  { shape: "CV", level: 1, notation: "CV", name: "Consonant + vowel" },
  { shape: "VC", level: 1, notation: "VC", name: "Vowel + consonant" },
  { shape: "C1V1C1V1", level: 1, notation: "C₁V₁C₁V₁", name: "Reduplicated" },
  { shape: "VCV", level: 2, notation: "VCV", name: "Vowel–consonant–vowel" },
  { shape: "C1V1C1V2", level: 2, notation: "C₁V₁C₁V₂", name: "Same consonant, new vowel" },
  { shape: "CVC-harmony", level: 2, notation: "C₁VC₁", name: "CVC with assimilation" },
  { shape: "CVC", level: 3, notation: "CVC", name: "Consonant–vowel–consonant" },
  { shape: "C1V1C2V2", level: 3, notation: "C₁V₁C₂V₂", name: "Variegated two-syllable" },
  { shape: "C1V1C2V2+CVC", level: 4, notation: "C₁V₁C₂V₂ + CVC", name: "Two words" },
  { shape: "CVCVCV", level: 4, notation: "CVCVCV", name: "Three syllables" },
  { shape: "complex", level: 4, notation: "Complex", name: "More complex words" },
  { shape: "phrase", level: 4, notation: "Phrase", name: "Functional phrases" },
];

export const shapeInfo = (s: SyllableShape) => SHAPES.find((x) => x.shape === s)!;

const w = (shape: SyllableShape, list: [string, WordCategory, string, string?][]): ShapeWord[] =>
  list.map(([word, category, emoji, dialect]) => ({ word, shape, category, emoji, ...(dialect ? { dialect } : {}) }));

const FLAP = "US: middle t sounds like a soft d";

export const SHAPE_WORDS: ShapeWord[] = [
  ...w("CV", [
    ["me", "family", "🙋"], ["no", "everyday", "🙅"], ["go", "actions", "🏃"], ["bye", "everyday", "👋"],
    ["hi", "everyday", "🙂"], ["boo", "toys", "👻"], ["see", "actions", "👀"], ["shoe", "home", "👟"],
    ["two", "everyday", "✌️"], ["key", "home", "🔑"], ["toe", "body", "🦶"], ["pie", "food", "🥧"],
    ["bee", "animals", "🐝"], ["cow", "animals", "🐄"], ["moo", "animals", "🐮"], ["tea", "food", "🍵"],
    ["knee", "body", "🦵"], ["zoo", "animals", "🦁"], ["day", "everyday", "☀️"], ["bow", "toys", "🎀"],
  ]),
  ...w("VC", [
    ["up", "actions", "⬆️"], ["in", "everyday", "📥"], ["on", "everyday", "💡"], ["eat", "actions", "🍽️"],
    ["out", "everyday", "🚪"], ["off", "everyday", "📴"], ["egg", "food", "🥚"], ["ice", "food", "🧊"],
    ["itch", "body", "🤚"], ["oat", "food", "🌾"], ["ache", "body", "🤕"], ["oak", "home", "🌳"],
  ]),
  ...w("C1V1C1V1", [
    ["mama", "family", "👩"], ["papa", "family", "👨"], ["dada", "family", "👨"], ["nana", "family", "👵"],
    ["bye-bye", "everyday", "👋"], ["boo-boo", "body", "🩹"], ["choo-choo", "toys", "🚂"], ["moo-moo", "animals", "🐄"],
    ["yo-yo", "toys", "🪀"], ["tutu", "toys", "🩰"], ["no-no", "everyday", "🙅"], ["cocoa", "food", "☕"],
  ]),
  ...w("VCV", [
    ["uh-oh", "everyday", "😮"], ["okay", "everyday", "👌"], ["emu", "animals", "🐦"], ["away", "actions", "🏃"],
    ["achoo", "body", "🤧"], ["oboe", "toys", "🎵"], ["ahoy", "toys", "🏴‍☠️"], ["Ava", "family", "👧"],
  ]),
  ...w("C1V1C1V2", [
    ["mommy", "family", "👩"], ["daddy", "family", "👨"], ["baby", "family", "👶"], ["puppy", "animals", "🐶"],
    ["cookie", "food", "🍪"], ["nanny", "family", "👵"], ["poppy", "home", "🌺"], ["mummy", "family", "👩", "UK word for mommy"],
  ]),
  ...w("CVC-harmony", [
    ["pop", "toys", "🎈"], ["mom", "family", "👩"], ["dad", "family", "👨"], ["bib", "home", "👶"],
    ["peep", "animals", "🐥"], ["toot", "toys", "🎺"], ["cake", "food", "🎂"], ["kick", "actions", "⚽"],
    ["cook", "actions", "👩‍🍳"], ["pup", "animals", "🐶"], ["mum", "family", "👩", "UK word for mom"],
  ]),
  ...w("CVC", [
    ["dog", "animals", "🐕"], ["cat", "animals", "🐈"], ["bus", "toys", "🚌"], ["hat", "home", "🎩"],
    ["cup", "home", "🥤"], ["bed", "home", "🛏️"], ["fish", "animals", "🐟"], ["pig", "animals", "🐷"],
    ["sun", "everyday", "☀️"], ["boat", "toys", "⛵"], ["book", "toys", "📖"], ["soap", "home", "🧼"],
    ["sock", "home", "🧦"], ["bike", "toys", "🚲"], ["moon", "everyday", "🌙"], ["duck", "animals", "🦆"],
    ["nose", "body", "👃"], ["feet", "body", "🦶"], ["juice", "food", "🧃"], ["ball", "toys", "⚽"],
  ]),
  ...w("C1V1C2V2", [
    ["bunny", "animals", "🐰"], ["pony", "animals", "🐴"], ["money", "everyday", "💰"], ["happy", "everyday", "😊"],
    ["coffee", "food", "☕"], ["teddy", "toys", "🧸"], ["tummy", "body", "🤰"], ["doggie", "animals", "🐶"],
    ["honey", "food", "🍯"], ["jelly", "food", "🍮"], ["belly", "body", "🫃"], ["movie", "everyday", "🎬"],
    ["hippo", "animals", "🦛"], ["sofa", "home", "🛋️"], ["taco", "food", "🌮"], ["kitty", "animals", "🐱", FLAP],
    ["potty", "home", "🚽", FLAP],
  ]),
  ...w("C1V1C2V2+CVC", [
    ["puppy dog", "animals", "🐶"], ["bunny hop", "actions", "🐰"], ["happy cat", "animals", "😺"],
    ["honey pot", "food", "🍯"], ["kitty cat", "animals", "🐱", FLAP], ["teddy bed", "toys", "🧸"],
  ]),
  ...w("CVCVCV", [
    ["banana", "food", "🍌"], ["potato", "food", "🥔", FLAP], ["tomato", "food", "🍅", "UK: to-mah-to; US: to-may-do"],
    ["domino", "toys", "🁣"], ["pajama", "home", "👕"], ["Panama", "everyday", "🌎"],
  ]),
  ...w("complex", [
    ["penguin", "animals", "🐧"], ["dinosaur", "animals", "🦕"], ["umbrella", "home", "☂️"], ["butterfly", "animals", "🦋"],
    ["ladybug", "animals", "🐞"], ["elephant", "animals", "🐘"], ["caterpillar", "animals", "🐛"], ["helicopter", "toys", "🚁"],
  ]),
  ...w("phrase", [
    ["want more", "everyday", "➕"], ["my turn", "everyday", "🙋"], ["bye mama", "family", "👋"], ["open it", "actions", "📦"],
    ["help me", "actions", "🆘"], ["go out", "actions", "🚪"], ["all done", "everyday", "✅"], ["more please", "everyday", "🙏"],
  ]),
];

export const filterShapeWords = (opts: { query?: string; level?: number | null; shape?: SyllableShape | null; category?: WordCategory | null }) => {
  const q = (opts.query ?? "").trim().toLowerCase();
  return SHAPE_WORDS.filter((x) =>
    (!q || x.word.toLowerCase().includes(q)) &&
    (!opts.level || shapeInfo(x.shape).level === opts.level) &&
    (!opts.shape || x.shape === opts.shape) &&
    (!opts.category || x.category === opts.category),
  );
};
