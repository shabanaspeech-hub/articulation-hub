import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SyllableShapeBrowser from "@/components/SyllableShapeBrowser";

const SyllableShapes = () => (
  <div className="min-h-[100dvh] bg-[#eafbf9] px-3 py-3 sm:px-6">
    <header className="mx-auto mb-3 flex max-w-5xl items-center gap-3">
      <Link to="/" aria-label="Back to sounds" className="rounded-full bg-card p-2 shadow"><ArrowLeft className="h-5 w-5" /></Link>
      <h1 className="font-fredoka text-2xl font-bold text-primary">Syllable Shapes</h1>
    </header>
    <main className="mx-auto max-w-5xl"><SyllableShapeBrowser /></main>
  </div>
);

export default SyllableShapes;
