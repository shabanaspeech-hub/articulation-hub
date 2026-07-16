import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, RotateCcw, Save, Trash2, Check } from "lucide-react";

interface VoiceRecorderProps {
  label?: string;
  storageKey?: string;
}

interface SavedRecording {
  id: string;
  name: string;
  dataUrl: string;
  duration: number;
  createdAt: number;
}

const STORAGE_PREFIX = "articulation-hub:recording:";

const loadSaved = (key: string): SavedRecording[] => {
  if (!key || typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as SavedRecording[]) : [];
  } catch {
    return [];
  }
};

const persistSaved = (key: string, items: SavedRecording[]) => {
  if (!key || typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(items));
  } catch {
    // Quota exceeded — silently drop oldest
    if (items.length > 1) persistSaved(key, items.slice(1));
  }
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const VoiceRecorder = ({ label = "Record your voice", storageKey }: VoiceRecorderProps) => {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [saved, setSaved] = useState<SavedRecording[]>([]);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (storageKey) setSaved(loadSaved(storageKey));
  }, [storageKey]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setDuration(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setState("recorded");
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setState("recording");
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      console.error("Microphone access denied");
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const playUrl = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.play();
  }, []);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setState("idle");
    setDuration(0);
  }, [audioUrl]);

  const saveRecording = useCallback(async () => {
    if (!audioBlob || !storageKey) return;
    const dataUrl = await blobToDataUrl(audioBlob);
    const item: SavedRecording = {
      id: `${Date.now()}`,
      name: new Date().toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      dataUrl,
      duration,
      createdAt: Date.now(),
    };
    const next = [...saved, item].slice(-5); // keep last 5
    setSaved(next);
    persistSaved(storageKey, next);
    setJustSavedId(item.id);
    setTimeout(() => setJustSavedId(null), 1500);
    reset();
  }, [audioBlob, storageKey, saved, duration, reset]);

  const deleteSaved = useCallback(
    (id: string) => {
      const next = saved.filter((s) => s.id !== id);
      setSaved(next);
      if (storageKey) persistSaved(storageKey, next);
    },
    [saved, storageKey],
  );

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <p className="font-nunito text-xs text-muted-foreground">{label}</p>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.button
            key="record"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startRecording}
            className="w-14 h-14 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
            aria-label="Start recording"
          >
            <Mic className="w-6 h-6" />
          </motion.button>
        )}

        {state === "recording" && (
          <motion.div
            key="recording"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-14 h-14 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg cursor-pointer"
              onClick={stopRecording}
              aria-label="Stop recording"
            >
              <Square className="w-5 h-5" />
            </motion.div>
            <span className="font-fredoka text-sm text-destructive">{formatTime(duration)}</span>
          </motion.div>
        )}

        {state === "recorded" && audioUrl && (
          <motion.div
            key="recorded"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => playUrl(audioUrl)}
              className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
              aria-label="Play recording"
            >
              <Play className="w-5 h-5" />
            </motion.button>
            <span className="font-fredoka text-xs text-muted-foreground w-10 text-center">
              {formatTime(duration)}
            </span>
            {storageKey && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={saveRecording}
                className="w-11 h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md"
                aria-label="Save recording"
              >
                <Save className="w-5 h-5" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={reset}
              className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center"
              aria-label="Record again"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved recordings library */}
      {storageKey && saved.length > 0 && (
        <div className="w-full mt-1 flex flex-col gap-1.5">
          <p className="font-nunito text-[10px] uppercase tracking-wide text-muted-foreground text-center">
            Saved voices
          </p>
          {saved
            .slice()
            .reverse()
            .map((rec) => (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-secondary/50 rounded-xl px-2.5 py-1.5"
              >
                <button
                  onClick={() => playUrl(rec.dataUrl)}
                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
                  aria-label={`Play saved recording from ${rec.name}`}
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <span className="font-nunito text-xs text-foreground flex-1 truncate">
                  {rec.name}
                </span>
                {justSavedId === rec.id && <Check className="w-3.5 h-3.5 text-primary" />}
                <span className="font-nunito text-[10px] text-muted-foreground">
                  {formatTime(rec.duration)}
                </span>
                <button
                  onClick={() => deleteSaved(rec.id)}
                  className="w-7 h-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center justify-center"
                  aria-label="Delete recording"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
