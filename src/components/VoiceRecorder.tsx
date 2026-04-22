import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, RotateCcw } from "lucide-react";

interface VoiceRecorderProps {
  label?: string;
}

const VoiceRecorder = ({ label = "Record yourself" }: VoiceRecorderProps) => {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("recorded");
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setState("recording");

      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch {
      console.error("Microphone access denied");
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const playRecording = useCallback(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.play();
  }, [audioUrl]);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    setDuration(0);
    setIsPlaying(false);
  }, [audioUrl]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

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

        {state === "recorded" && (
          <motion.div
            key="recorded"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={playRecording}
              disabled={isPlaying}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md disabled:opacity-50"
              aria-label="Play recording"
            >
              <Play className="w-5 h-5" />
            </motion.button>
            <span className="font-fredoka text-sm text-muted-foreground">{formatTime(duration)}</span>
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
    </div>
  );
};

export default VoiceRecorder;
