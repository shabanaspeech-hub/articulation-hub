import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import MouthDiagram, { type MouthType } from "./MouthDiagram";
import VoiceRecorder from "./VoiceRecorder";
import { getIsolationSpeechText, getPhoneticRepetitionText, speakPhoneticText } from "@/lib/speech";

interface SoundMovementCardProps {
  sound: string;
  currentIndex: number;
}

interface MovementData {
  cue: string;
  mouthDesc: string;
  repetition: string;
  mouthSteps: string[];
  lipCue: string;
  mouthType: MouthType;
  voicing: "voiced" | "voiceless" | "nasal";
}

const soundMovementData: Record<string, MovementData> = {
  M: {
    cue: "Close your lips and hum mmm",
    mouthDesc: "Lips pressed together with gentle pressure, voice ON, air through nose",
    repetition: "mmmm, mmmm, mmmm",
    mouthSteps: [
      "😶 Press lips together gently but firmly",
      "💨 Feel pressure building behind lips",
      "👃 Air flows through your nose",
      "🔊 Turn voice ON and hold: mmmm",
    ],
    lipCue: "Lips closed tight — hum mmm",
    mouthType: "bilabial",
    voicing: "nasal",
  },
  B: {
    cue: "Put lips together, then POP them open for ba",
    mouthDesc: "Lips pressed together, then burst open with voice ON",
    repetition: "ba, ba, ba, ba",
    mouthSteps: [
      "😶 Press lips together",
      "💨 Build up air behind lips",
      "🔊 Voice ON — feel throat buzz",
      "💥 POP lips open: ba",
    ],
    lipCue: "Lips together — POP open",
    mouthType: "bilabial",
    voicing: "voiced",
  },
  P: {
    cue: "Lips together, then pop a quiet p",
    mouthDesc: "Lips pressed together, quick air release, voice OFF",
    repetition: "p, p, p, p",
    mouthSteps: [
      "😶 Press lips together tightly",
      "💨 Build up air pressure behind lips",
      "🔇 Voice stays OFF — keep it quiet",
      "💨 POP lips open: p",
    ],
    lipCue: "Lips together — pop a quiet p",
    mouthType: "bilabial",
    voicing: "voiceless",
  },
  T: {
    cue: "Tap your tongue tip lightly for t",
    mouthDesc: "Tongue tip taps the ridge behind top teeth, voice OFF",
    repetition: "t, t, t, t",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Touch the bumpy ridge behind top teeth",
      "🔇 Voice stays OFF",
      "👅 Tap tongue down quickly: t",
    ],
    lipCue: "Tongue tip UP — tap the bumpy spot",
    mouthType: "alveolar",
    voicing: "voiceless",
  },
  D: {
    cue: "Tap your tongue and turn your voice ON!",
    mouthDesc: "Tongue tip taps ridge behind top teeth, voice ON",
    repetition: "da, da, da, da",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Touch the bumpy ridge behind top teeth",
      "🔊 Voice ON — feel throat buzz",
      "👅 Tap tongue down: da",
    ],
    lipCue: "Tongue tip UP — voice ON — tap",
    mouthType: "alveolar",
    voicing: "voiced",
  },
  N: {
    cue: "Tongue up, hum through your nose nnn",
    mouthDesc: "Tongue tip up on ridge, voice ON, air through nose",
    repetition: "nnnn, nnnn, nnnn",
    mouthSteps: [
      "👅 Lift tongue tip UP",
      "📍 Press on bumpy ridge behind top teeth",
      "👃 Air flows through your nose",
      "🔊 Voice ON — hold: nnnn",
    ],
    lipCue: "Tongue up — air through nose — hum",
    mouthType: "alveolar",
    voicing: "nasal",
  },
  K: {
    cue: "Push the back of your tongue up, then release k",
    mouthDesc: "Back of tongue pushes up to soft palate, voice OFF, quick release",
    repetition: "k, k, k, k",
    mouthSteps: [
      "👅 Push the BACK of tongue up high",
      "📍 Touch the soft back part of the roof",
      "🔇 Voice stays OFF",
      "💨 Drop tongue quickly: k",
    ],
    lipCue: "Tongue back UP — drop for k",
    mouthType: "velar",
    voicing: "voiceless",
  },
  G: {
    cue: "Back of tongue up — voice ON — ga",
    mouthDesc: "Back of tongue to soft palate, voice ON, release",
    repetition: "ga, ga, ga, ga",
    mouthSteps: [
      "👅 Push the BACK of tongue up high",
      "📍 Touch the soft back part of the roof",
      "🔊 Voice ON — feel throat buzz",
      "💨 Drop tongue: ga",
    ],
    lipCue: "Tongue back UP — voice ON — drop",
    mouthType: "velar",
    voicing: "voiced",
  },
  F: {
    cue: "Bite your bottom lip gently and blow fffff",
    mouthDesc: "Top teeth rest on lower lip, blow air through, voice OFF",
    repetition: "fffff, fffff, fffff",
    mouthSteps: [
      "😬 Top teeth on bottom lip gently",
      "💨 Blow air through teeth and lip",
      "🔇 Voice stays OFF",
      "💨 Hold steady: fffff",
    ],
    lipCue: "Teeth on lip — blow air — fff",
    mouthType: "labiodental",
    voicing: "voiceless",
  },
  V: {
    cue: "Teeth on lip — turn your voice ON and buzz!",
    mouthDesc: "Top teeth on lower lip, voice ON, air flows through",
    repetition: "vvv, vvv, vvv, vvv",
    mouthSteps: [
      "😬 Top teeth on bottom lip gently",
      "💨 Blow air through teeth and lip",
      "🔊 Voice ON — feel the buzz",
      "🔊 Hold steady: vvvvvvvv",
    ],
    lipCue: "Teeth on lip — voice ON — vvv",
    mouthType: "labiodental",
    voicing: "voiced",
  },
  S: {
    cue: "Tongue behind teeth — blow like a snake!",
    mouthDesc: "Tongue tip behind top teeth, narrow air stream, voice OFF",
    repetition: "sss, sss, sss, sss",
    mouthSteps: [
      "👅 Tongue tip behind top teeth (not touching)",
      "😁 Teeth close together — small gap",
      "🔇 Voice stays OFF",
      "💨 Blow air through: sssssss",
    ],
    lipCue: "Tongue behind teeth — blow sss",
    mouthType: "alveolar",
    voicing: "voiceless",
  },
  Z: {
    cue: "Same as S but turn your voice ON — buzz!",
    mouthDesc: "Tongue tip behind top teeth, voice ON, buzzing sound",
    repetition: "zzz, zzz, zzz, zzz",
    mouthSteps: [
      "👅 Tongue tip behind top teeth (not touching)",
      "😁 Teeth close together — small gap",
      "🔊 Voice ON — feel the buzz",
      "🔊 Blow air and buzz: zzzzzzz",
    ],
    lipCue: "Tongue behind teeth — voice ON — zzz",
    mouthType: "alveolar",
    voicing: "voiced",
  },
  H: {
    cue: "Open your mouth and breathe out haa",
    mouthDesc: "Mouth open, soft breath from throat, like fogging a mirror",
    repetition: "haa, haa, haa, haa",
    mouthSteps: [
      "😮 Open mouth wide",
      "🔇 Voice stays OFF or very light",
      "💨 Push soft air out from deep in throat",
      "💨 Gentle breathy model: haa",
    ],
    lipCue: "Mouth open — soft breath — haa",
    mouthType: "glottal",
    voicing: "voiceless",
  },
  W: {
    cue: "Round your lips tight like blowing a candle!",
    mouthDesc: "Lips rounded tightly, voice ON, glide to next vowel",
    repetition: "wuh, wuh, wuh, wuh",
    mouthSteps: [
      "😗 Round lips into a small circle",
      "🔊 Voice ON — feel throat buzz",
      "👅 Tongue stays low and relaxed",
      "😮 Glide lips open: wuh",
    ],
    lipCue: "Lips round — voice ON — glide open",
    mouthType: "bilabial",
    voicing: "voiced",
  },
  Y: {
    cue: "Smile big and push tongue up — yuh!",
    mouthDesc: "Tongue high and forward, lips spread in smile, voice ON",
    repetition: "yuh, yuh, yuh, yuh",
    mouthSteps: [
      "😁 Spread lips into a big smile",
      "👅 Push tongue up high and forward",
      "🔊 Voice ON",
      "😮 Glide tongue down: yuh",
    ],
    lipCue: "Smile — tongue up — glide — yuh",
    mouthType: "palatal",
    voicing: "voiced",
  },
  L: {
    cue: "Tongue tip UP behind your teeth — hold it!",
    mouthDesc: "Tongue tip touches ridge behind top teeth, air flows over sides",
    repetition: "llll, llll, llll, llll",
    mouthSteps: [
      "👅 Lift tongue tip UP to bumpy ridge",
      "📍 Hold tongue tip there — don't let go!",
      "🔊 Voice ON",
      "💨 Air flows over the SIDES of tongue: lll",
    ],
    lipCue: "Tongue tip UP and hold — lll",
    mouthType: "lateral",
    voicing: "voiced",
  },
  R: {
    cue: "Curl your tongue back — like a growl!",
    mouthDesc: "Tongue curled back or bunched up, voice ON, steady sound",
    repetition: "rrrr, rrrr, rrrr, rrrr",
    mouthSteps: [
      "👅 Curl tongue tip back (or bunch tongue up)",
      "📍 Tongue sides touch back teeth",
      "🔊 Voice ON",
      "🔊 Hold steady: rrrrrrr",
    ],
    lipCue: "Tongue curled back — voice ON — rrr",
    mouthType: "retroflex",
    voicing: "voiced",
  },
  J: {
    cue: "Tongue up — push then slide — voice ON!",
    mouthDesc: "Tongue tip to ridge, push then slide into 'zh', voice ON",
    repetition: "juh, juh, juh, juh",
    mouthSteps: [
      "👅 Lift tongue to bumpy ridge",
      "📍 Push tongue against ridge",
      "🔊 Voice ON — feel buzz",
      "💨 Release and slide: juh!",
    ],
    lipCue: "Tongue up — push — slide — juh",
    mouthType: "postalveolar",
    voicing: "voiced",
  },
  CH: {
    cue: "Tongue up — push then slide — like a train!",
    mouthDesc: "Tongue tip to ridge, push then slide into 'sh', voice OFF",
    repetition: "cha, cha, cha, cha",
    mouthSteps: [
      "👅 Lift tongue to bumpy ridge",
      "📍 Push tongue firmly against ridge",
      "🔇 Voice stays OFF",
      "💨 Release and slide: ch! ch! ch!",
    ],
    lipCue: "Tongue up — push — slide — ch",
    mouthType: "postalveolar",
    voicing: "voiceless",
  },
  SH: {
    cue: "Tongue back a little — round lips — shhhh!",
    mouthDesc: "Tongue slightly behind ridge, lips rounded, voice OFF",
    repetition: "shhh, shhh, shhh, shhh",
    mouthSteps: [
      "👅 Tongue slightly behind the bumpy ridge",
      "😗 Round lips into a circle",
      "🔇 Voice stays OFF",
      "💨 Blow air through: shhhhhh",
    ],
    lipCue: "Tongue back — lips round — shhh",
    mouthType: "postalveolar",
    voicing: "voiceless",
  },
  TH: {
    cue: "Stick tongue between your teeth and blow!",
    mouthDesc: "Tongue tip between top and bottom teeth, air flows over tongue",
    repetition: "thhh, thhh, thhh, thhh",
    mouthSteps: [
      "👅 Stick tongue tip between your teeth",
      "😬 Teeth rest gently on tongue",
      "🔇 Voice stays OFF (voiceless TH)",
      "💨 Blow air over tongue: thhhh",
    ],
    lipCue: "Tongue between teeth — blow — thh",
    mouthType: "dental",
    voicing: "voiceless",
  },
};

const allSounds = Object.keys(soundMovementData);

const SoundMovementCard = ({ sound, currentIndex }: SoundMovementCardProps) => {
  const upperSound = sound.toUpperCase();
  const data = soundMovementData[upperSound];

  if (!data) {
    return (
      <div className="practice-card flex flex-col items-center gap-4 p-8">
        <p className="font-nunito text-muted-foreground">
          Sound movement data not available for this sound.
        </p>
      </div>
    );
  }

  const speakSound = () => {
    speakPhoneticText(getIsolationSpeechText(upperSound), { rate: 0.4, pitch: 1 });
  };

  const speakRepetition = () => {
    speakPhoneticText(getPhoneticRepetitionText(upperSound, data.repetition), { rate: 0.35, pitch: 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="practice-card flex flex-col items-center gap-5 max-w-sm mx-auto"
    >
      {/* Animated Mouth Diagram */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={speakSound}
        className="relative cursor-pointer"
        aria-label={`Hear the ${sound} sound`}
      >
        <div className="rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 p-4 shadow-lg border-4 border-accent/30">
          <MouthDiagram type={data.mouthType} voicing={data.voicing} />
        </div>
        <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
          <Volume2 className="w-5 h-5" />
        </div>
        <div className="absolute top-2 left-2 font-fredoka text-3xl font-bold text-primary bg-background/80 rounded-xl px-3 py-1">
          {upperSound}
        </div>
      </motion.button>

      {/* Cue text */}
      <div className="text-center space-y-1">
        <h2 className="font-fredoka text-xl md:text-2xl font-bold text-foreground">
          {data.cue}
        </h2>
        <p className="font-nunito text-muted-foreground text-xs bg-secondary/50 rounded-full px-3 py-1 inline-block">
          {data.lipCue}
        </p>
      </div>

      {/* Mouth placement steps */}
      <div className="w-full bg-card rounded-2xl border border-border p-4 space-y-2">
        <p className="font-fredoka text-sm font-semibold text-foreground mb-2">👄 Mouth Placement:</p>
        {data.mouthSteps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-start gap-2"
          >
            <span className="font-nunito text-sm text-foreground">{step}</span>
          </motion.div>
        ))}
        <p className="font-nunito text-xs text-muted-foreground mt-2 italic">
          {data.mouthDesc}
        </p>
      </div>

      {/* Repetition drill */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={speakRepetition}
        className="bg-secondary rounded-2xl px-6 py-4 w-full text-center cursor-pointer"
      >
        <p className="font-fredoka text-2xl tracking-[0.3em] text-foreground">
          {data.repetition}
        </p>
        <p className="font-nunito text-xs text-muted-foreground mt-1">
          Tap to hear slow repetition
        </p>
      </motion.button>

      {/* Voice Recorder */}
      <VoiceRecorder label="🎙️ Now you try! Record yourself:" />
    </motion.div>
  );
};

export { allSounds as motorSpeechSounds };
export default SoundMovementCard;
