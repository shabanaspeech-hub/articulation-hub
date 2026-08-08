import { useEffect, useState } from "react";
import logo from "@/assets/spectraspeech-logo.png";

/**
 * SpectraSpeech Articulation Hub launch splash.
 * Shows once per app launch, fades out automatically.
 */
const SplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fade = window.setTimeout(() => setFading(true), 1600);
    const hide = window.setTimeout(() => setVisible(false), 2200);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <img
        src={logo}
        alt="SpectraSpeech logo"
        width={816}
        height={816}
        className="w-40 h-40 sm:w-56 sm:h-56 object-contain animate-scale-in drop-shadow-xl"
      />
      <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: "Fredoka, sans-serif" }}>
        SpectraSpeech
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground font-semibold">Articulation Hub</p>
    </div>
  );
};

export default SplashScreen;
