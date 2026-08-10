import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Upload,
  Circle,
  Square,
  RotateCcw,
  Trash2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveVideo, loadVideo, deleteVideo } from "@/lib/videoStore";
import { getDefaultVideoUrl } from "@/lib/defaultTherapistVideos";

interface TherapistVideoModelProps {
  /** Unique key per sound/activity, e.g. "isolated:P" */
  storageKey: string;
  /** Sound label shown in helper copy, e.g. "/p/" */
  soundLabel: string;
}

const PAUSE_OPTIONS = [1, 2, 3, 5];

const TherapistVideoModel = ({ storageKey, soundLabel }: TherapistVideoModelProps) => {
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [defaultUrl, setDefaultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [pauseSeconds, setPauseSeconds] = useState(2);
  const [muted, setMuted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoUrl = customUrl ?? defaultUrl;
  const isCustom = Boolean(customUrl);

  const playerRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const autoPlayRef = useRef(false);

  // Load the user's own clip (if any) plus the universal default for this sound
  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    setLoading(true);
    setCustomUrl(null);
    setDefaultUrl(null);

    Promise.all([
      loadVideo(storageKey).catch(() => null),
      getDefaultVideoUrl(storageKey).catch(() => null),
    ])
      .then(([blob, remote]) => {
        if (cancelled) return;
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setCustomUrl(objectUrl);
        }
        setDefaultUrl(remote);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [storageKey]);


  // Stop auto play when the clip or screen changes
  useEffect(() => {
    return () => {
      autoPlayRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const persist = useCallback(
    async (blob: Blob) => {
      await saveVideo(storageKey, blob);
      setCustomUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });

    },
    [storageKey]
  );

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      setRecording(true);
      // attach preview after render
      window.setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.srcObject = stream;
          previewRef.current.play().catch(() => {});
        }
      }, 0);

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecording(false);
        if (blob.size > 0) await persist(blob);
      };
      recorderRef.current = recorder;
      recorder.start();
    } catch {
      setRecording(false);
      setError("Camera access was blocked. Allow camera and microphone, or upload a video instead.");
    }
  };

  const stopRecording = () => recorderRef.current?.stop();

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }
    await persist(file);
  };

  const handleDelete = async () => {
    stopAutoPlay();
    await deleteVideo(storageKey);
    // Only the user's own clip is removed — the universal default comes back.
    setCustomUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };


  const replay = () => {
    const el = playerRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  };

  const stopAutoPlay = () => {
    autoPlayRef.current = false;
    setAutoPlay(false);
    setWaiting(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    playerRef.current?.pause();
  };

  const startAutoPlay = () => {
    autoPlayRef.current = true;
    setAutoPlay(true);
    replay();
  };

  const handleEnded = () => {
    if (!autoPlayRef.current) return;
    setWaiting(true);
    timerRef.current = window.setTimeout(() => {
      setWaiting(false);
      if (autoPlayRef.current) replay();
    }, pauseSeconds * 1000);
  };

  return (
    <div className="w-full bg-card rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-fredoka text-sm font-semibold text-foreground flex items-center gap-2">
          <Video className="w-4 h-4 text-primary" /> Therapist video model
        </p>
        <div className="flex items-center gap-2">
          {videoUrl && !recording && (
            <span className="font-nunito text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {isCustom ? "Your video" : "Default"}
            </span>
          )}
          {videoUrl && (
            <button
              onClick={() => setMuted((m) => !m)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>


      {recording ? (
        <div className="space-y-3">
          <video
            ref={previewRef}
            muted
            playsInline
            className="w-full aspect-video rounded-xl bg-black object-cover"
          />
          <Button onClick={stopRecording} className="w-full rounded-xl" variant="destructive">
            <Square className="w-4 h-4 mr-2" /> Stop recording
          </Button>
          <p className="font-nunito text-xs text-muted-foreground text-center">
            Keep it 2–3 seconds — model only the {soundLabel} sound.
          </p>
        </div>
      ) : loading ? (
        <div className="w-full aspect-video rounded-xl bg-muted animate-pulse" />
      ) : videoUrl ? (
        <div className="space-y-3">
          <motion.div whileTap={{ scale: 0.98 }} className="relative">
            <video
              ref={playerRef}
              src={videoUrl}
              playsInline
              muted={muted}
              onEnded={handleEnded}
              onClick={replay}
              className="w-full aspect-video rounded-xl bg-black object-cover cursor-pointer"
            />
            {waiting && (
              <div className="absolute inset-0 rounded-xl bg-background/70 flex flex-col items-center justify-center">
                <span className="font-fredoka text-lg text-primary">Your turn!</span>
                <span className="font-nunito text-xs text-muted-foreground">
                  Say {soundLabel}
                </span>
              </div>
            )}
          </motion.div>

          <div className="flex gap-2">
            <Button onClick={replay} variant="secondary" className="flex-1 rounded-xl">
              <RotateCcw className="w-4 h-4 mr-2" /> Replay
            </Button>
            <Button
              onClick={autoPlay ? stopAutoPlay : startAutoPlay}
              className="flex-1 rounded-xl"
              variant={autoPlay ? "destructive" : "default"}
            >
              {autoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {autoPlay ? "Stop auto play" : "Auto play"}
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-nunito text-xs text-muted-foreground flex items-center gap-1">
              <Repeat className="w-3 h-3" /> Pause for imitation:
            </span>
            {PAUSE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setPauseSeconds(s)}
                className={`px-2.5 py-1 rounded-lg font-nunito text-xs transition-colors ${
                  pauseSeconds === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                }`}
              >
                {s}s
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <Button onClick={startRecording} variant="outline" size="sm" className="flex-1 rounded-xl">
              <Circle className="w-3.5 h-3.5 mr-1.5" /> {isCustom ? "Re-record" : "Record my own"}
            </Button>
            <label className="flex-1">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
              <span className="w-full inline-flex items-center justify-center h-9 rounded-xl border border-input bg-background text-sm font-medium cursor-pointer hover:bg-accent/40">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> {isCustom ? "Replace" : "Upload mine"}
              </span>
            </label>
            {isCustom && (
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="rounded-xl text-destructive"
                aria-label="Delete my video and restore the default"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-full aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Video className="w-7 h-7" />
            <p className="font-nunito text-xs text-center px-4">
              Add a 2–3 second clip modelling only the {soundLabel} sound.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={startRecording} className="flex-1 rounded-xl">
              <Circle className="w-4 h-4 mr-2" /> Record video
            </Button>
            <label className="flex-1">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
              <span className="w-full inline-flex items-center justify-center h-10 rounded-xl border border-input bg-background text-sm font-medium cursor-pointer hover:bg-accent/40">
                <Upload className="w-4 h-4 mr-2" /> Upload
              </span>
            </label>
          </div>
        </div>
      )}

      {error && <p className="font-nunito text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default TherapistVideoModel;
