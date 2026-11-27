import { useMemo, useState } from "react";
import { Search, Volume2 } from "lucide-react";
import { SHAPES, SHAPE_WORDS, filterShapeWords, shapeInfo, SyllableShape, WordCategory, ShapeWord } from "@/data/syllableInventory";
import { speakPhoneticText } from "@/lib/speech";

const CATEGORIES: WordCategory[] = ["animals", "food", "toys", "home", "family", "actions", "body", "everyday"];
const speak = (word: string) => speakPhoneticText(word.replace(/-/g, " "), { rate: 0.6 });

const chip = (on: boolean) =>
  `rounded-full px-3 py-1 font-fredoka font-semibold text-sm whitespace-nowrap transition-all ${on ? "bg-primary text-primary-foreground shadow" : "bg-card/80 text-primary hover:bg-card"}`;

const SyllableShapeBrowser = ({ soundId }: { soundId?: string } = {}) => {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<number | null>(null);
  const [shape, setShape] = useState<SyllableShape | null>(null);
  const [category, setCategory] = useState<WordCategory | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [deck, setDeck] = useState<ShapeWord[] | null>(null);
  const [i, setI] = useState(0);

  const results = useMemo(() => filterShapeWords({ soundId, query, level, shape, category }), [soundId, query, level, shape, category]);
  const keyOf = (x: ShapeWord) => `${x.shape}:${x.word}`;
  const toggle = (x: ShapeWord) => setSelected((s) => (s.includes(keyOf(x)) ? s.filter((k) => k !== keyOf(x)) : [...s, keyOf(x)]));
  const start = () => {
    const picked = selected.length ? SHAPE_WORDS.filter((x) => selected.includes(keyOf(x))) : results;
    if (picked.length) { setDeck(picked); setI(0); }
  };

  if (deck) {
    const cur = deck[i];
    const info = shapeInfo(cur.shape);
    return (
      <div className="w-full max-w-3xl flex flex-col items-center gap-3 my-auto">
        <button
          onClick={() => speak(cur.word)}
          className="relative w-[min(36rem,calc(var(--stage-w,100vw)-1rem),calc(100dvh-11rem))] aspect-square rounded-[2rem] bg-card shadow-2xl flex flex-col items-center justify-center gap-2 p-4"
        >
          <span className="absolute top-3 left-3 rounded-full bg-primary text-primary-foreground px-3 py-1 font-fredoka font-bold text-base sm:text-lg">{info.notation}</span>
          <span className="absolute top-3 right-3 rounded-full bg-primary/10 text-primary px-3 py-1 font-nunito font-bold text-sm capitalize">{cur.category}</span>
          <span className="text-[min(14rem,30vw,28dvh)] leading-none">{cur.emoji}</span>
          <span className="font-fredoka font-bold text-primary text-4xl sm:text-6xl">{cur.word}</span>
          <span className="flex items-center gap-1 font-nunito text-muted-foreground text-sm"><Volume2 className="w-4 h-4" /> Level {info.level} · {info.name}</span>
          {cur.dialect && <span className="font-nunito text-xs text-muted-foreground">{cur.dialect}</span>}
        </button>
        <div className="flex items-center gap-3">
          <button className={chip(false)} disabled={i === 0} onClick={() => setI(i - 1)}>‹ back</button>
          <span className="font-fredoka text-primary">{i + 1}/{deck.length}</span>
          <button className={chip(true)} disabled={i >= deck.length - 1} onClick={() => setI(i + 1)}>next ›</button>
          <button className={chip(false)} onClick={() => setDeck(null)}>word list</button>
        </div>
      </div>
    );
  }

  const visibleShapes = SHAPES.filter((s) => !level || s.level === level);
  return (
    <div className="w-full max-w-4xl h-full flex flex-col gap-2 rounded-3xl bg-card/70 backdrop-blur p-3 shadow-lg min-h-0">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-full bg-card px-3 py-1.5 shadow-inner">
          <Search className="w-4 h-4 text-primary" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search words…" aria-label="Search words" className="flex-1 bg-transparent outline-none font-nunito" />
        </div>
        <button onClick={start} className={chip(true)}>practice {selected.length ? `selected (${selected.length})` : `all (${results.length})`}</button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
        <button className={chip(level === null)} onClick={() => { setLevel(null); setShape(null); }}>all levels</button>
        {[1, 2, 3, 4].map((l) => <button key={l} className={chip(level === l)} onClick={() => { setLevel(l); setShape(null); }}>level {l}</button>)}
      </div>
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
        <button className={chip(shape === null)} onClick={() => setShape(null)}>all shapes</button>
        {visibleShapes.map((s) => <button key={s.shape} className={chip(shape === s.shape)} onClick={() => setShape(s.shape)}>{s.notation}</button>)}
      </div>
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
        <button className={chip(category === null)} onClick={() => setCategory(null)}>all topics</button>
        {CATEGORIES.map((c) => <button key={c} className={chip(category === c)} onClick={() => setCategory(c)}>{c}</button>)}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 content-start pb-2">
        {results.map((x) => {
          const on = selected.includes(keyOf(x));
          return (
            <div key={keyOf(x)} className={`rounded-2xl bg-card p-2 shadow flex flex-col gap-1 border-2 ${on ? "border-primary" : "border-transparent"}`}>
              <div className="flex items-center justify-between gap-1">
                <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 font-fredoka font-bold text-xs">{shapeInfo(x.shape).notation}</span>
                <input type="checkbox" checked={on} onChange={() => toggle(x)} aria-label={`Select ${x.word}`} className="w-5 h-5 accent-[hsl(var(--primary))]" />
              </div>
              <button onClick={() => speak(x.word)} className="flex items-center gap-2 text-left">
                <span className="text-3xl">{x.emoji}</span>
                <span className="font-fredoka font-bold text-primary text-lg leading-tight">{x.word}</span>
              </button>
              <span className="font-nunito text-xs text-muted-foreground capitalize">{x.category}{x.dialect ? " · dialect note" : ""}</span>
            </div>
          );
        })}
        {results.length === 0 && <p className="col-span-full text-center font-nunito text-muted-foreground p-6">No words match.</p>}
      </div>
    </div>
  );
};

export default SyllableShapeBrowser;
