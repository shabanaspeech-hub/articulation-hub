// Registry of real word images. Falls back to emoji when not present.
// Images live in /public/words/<slug>.png so they're served as static assets.
const AVAILABLE = new Set<string>([
  "apple","ball","balloon","banana","bat","bear","bed","bee","bird","boat",
  "book","bus","butterfly","cake","car","cat","cow","dog","duck","egg",
  "key","kite","leaf","lion","milk","moon","mouse","pig","pizza","rabbit",
  "star","sun","tree","turtle","umbrella",
]);

export const getWordImage = (word: string): string | null => {
  if (!word) return null;
  const slug = word.trim().toLowerCase().replace(/[^a-z]/g, "");
  return AVAILABLE.has(slug) ? `/words/${slug}.png` : null;
};
