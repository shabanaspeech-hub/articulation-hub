import { motion } from "framer-motion";
import type { MouthType } from "./MouthDiagram";

interface SpeakingFaceProps {
  type: MouthType;
  voicing: "voiced" | "voiceless" | "nasal";
  speaking: boolean;
  gender?: "girl" | "boy";
  size?: number;
}

/**
 * A friendly child face with visible lips, teeth and tongue that animates
 * while speaking. The inner mouth shape reflects articulator placement
 * (bilabial closure, tongue tip up, teeth on lip, etc.) so kids can copy it.
 */
const SpeakingFace = ({
  type,
  voicing,
  speaking,
  gender = "girl",
  size = 220,
}: SpeakingFaceProps) => {
  const skin = "#F6C9A4";
  const skinShade = "#E8B08A";
  const hair = gender === "girl" ? "#4A2C1A" : "#3A2213";
  const lip = "#D65E7A";
  const lipDark = "#B54460";
  const toothWhite = "#FFFFFF";
  const tongue = "#E88AA0";
  const gum = "#F4A9B4";

  // Per-phoneme mouth aperture cycle so kids see clear articulation
  const isBilabialClosed = type === "bilabial" && voicing === "nasal"; // M
  const isStop = type === "bilabial" || type === "alveolar" || type === "velar";
  const isFricative =
    type === "labiodental" ||
    type === "dental" ||
    type === "postalveolar" ||
    type === "glottal";

  const openLoop = !speaking
    ? { scaleY: 1, scaleX: 1 }
    : isBilabialClosed
      ? { scaleY: [1, 1.04, 1], scaleX: [1, 1.02, 1] }
      : isStop
        ? { scaleY: [0.9, 1.6, 0.9, 1.6, 0.9], scaleX: [1, 1.02, 1, 1.02, 1] }
        : isFricative
          ? { scaleY: [1.1, 1.25, 1.1], scaleX: [1, 1.02, 1] }
          : { scaleY: [0.95, 1.45, 1.0, 1.35, 0.95], scaleX: [1, 1.03, 1, 1.03, 1] };

  const jawDrop = !speaking
    ? { y: 0 }
    : isBilabialClosed
      ? { y: [0, -1, 0, 1, 0] }
      : isStop
        ? { y: [0, 4, 0, 4, 0] }
        : { y: [0, 3, 1, 3, 0] };


  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        role="img"
        aria-label="Animated speaking face"
      >
        {/* Hair back */}
        {gender === "girl" && (
          <ellipse cx="100" cy="105" rx="78" ry="82" fill={hair} />
        )}

        {/* Face */}
        <ellipse cx="100" cy="108" rx="66" ry="72" fill={skin} />
        {/* Cheeks */}
        <circle cx="58" cy="128" r="9" fill="#F49CA8" opacity="0.55" />
        <circle cx="142" cy="128" r="9" fill="#F49CA8" opacity="0.55" />

        {/* Hair front */}
        {gender === "girl" ? (
          <>
            <path
              d="M34 92 C34 46, 166 46, 166 92 C150 74, 128 68, 100 68 C72 68, 50 74, 34 92 Z"
              fill={hair}
            />
            {/* Side bangs */}
            <path d="M34 92 Q30 130 42 150 Q36 118 44 96 Z" fill={hair} />
            <path d="M166 92 Q170 130 158 150 Q164 118 156 96 Z" fill={hair} />
          </>
        ) : (
          <path
            d="M38 88 C46 58, 154 58, 162 88 C144 76, 128 74, 100 74 C72 74, 56 76, 38 88 Z"
            fill={hair}
          />
        )}

        {/* Eyes */}
        <g>
          <ellipse cx="76" cy="105" rx="7" ry="9" fill="#fff" />
          <ellipse cx="124" cy="105" rx="7" ry="9" fill="#fff" />
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
            style={{ transformOrigin: "100px 105px" }}
          >
            <circle cx="76" cy="107" r="3.6" fill="#2B1810" />
            <circle cx="124" cy="107" r="3.6" fill="#2B1810" />
            <circle cx="77.2" cy="105.5" r="1.2" fill="#fff" />
            <circle cx="125.2" cy="105.5" r="1.2" fill="#fff" />
          </motion.g>
          {/* Brows */}
          <path d="M66 92 Q76 88 86 92" stroke={hair} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M114 92 Q124 88 134 92" stroke={hair} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Nose */}
        <path d="M100 118 Q96 132 100 138 Q104 132 100 118" fill={skinShade} opacity="0.6" />

        {/* MOUTH GROUP — the star of the show */}
        <motion.g
          animate={humWiggle}
          transition={{ duration: 0.35, repeat: speaking ? Infinity : 0 }}
          style={{ transformOrigin: "100px 158px" }}
        >
          <motion.g
            animate={openLoop}
            transition={{ duration: 0.6, repeat: speaking ? Infinity : 0, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 158px" }}
          >
            <MouthShape
              type={type}
              voicing={voicing}
              lip={lip}
              lipDark={lipDark}
              tooth={toothWhite}
              tongue={tongue}
              gum={gum}
            />
          </motion.g>
        </motion.g>

        {/* Chin shadow */}
        <ellipse cx="100" cy="176" rx="26" ry="4" fill={skinShade} opacity="0.4" />
      </svg>

      {/* Speaking indicator sparkles */}
      {speaking && (
        <>
          <motion.div
            className="absolute -right-1 top-10 text-primary"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute right-2 top-6 text-primary/70"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
            </svg>
          </motion.div>
        </>
      )}
    </div>
  );
};

interface MouthShapeProps {
  type: MouthType;
  voicing: "voiced" | "voiceless" | "nasal";
  lip: string;
  lipDark: string;
  tooth: string;
  tongue: string;
  gum: string;
}

const MouthShape = ({ type, voicing, lip, lipDark, tooth, tongue, gum }: MouthShapeProps) => {
  // Coordinates centred around (100, 158) with mouth width ~ 52
  switch (type) {
    case "bilabial":
      // M (nasal) → closed. P/B → slight parting.
      if (voicing === "nasal") {
        return (
          <g>
            <path d="M74 158 Q100 154 126 158 Q100 162 74 158 Z" fill={lipDark} />
            <path d="M74 158 Q100 152 126 158" stroke={lip} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );
      }
      // W — rounded lips
      return (
        <g>
          <ellipse cx="100" cy="158" rx="14" ry="10" fill={lipDark} />
          <ellipse cx="100" cy="158" rx="14" ry="10" fill="none" stroke={lip} strokeWidth="3" />
          <ellipse cx="100" cy="158" rx="7" ry="4" fill="#3B0F1B" />
        </g>
      );
    case "labiodental":
      // F/V — top teeth on lower lip
      return (
        <g>
          <path d="M72 156 Q100 148 128 156 L128 160 L72 160 Z" fill={tooth} stroke={lipDark} strokeWidth="1.5" />
          {/* Tooth divisions */}
          {[82, 92, 100, 108, 118].map((x) => (
            <line key={x} x1={x} y1="152" x2={x} y2="160" stroke="#DADFE3" strokeWidth="1" />
          ))}
          <path d="M70 160 Q100 172 130 160 Q100 168 70 160 Z" fill={lip} />
        </g>
      );
    case "dental":
      // TH — tongue between teeth
      return (
        <g>
          <path d="M72 154 Q100 150 128 154 L128 158 L72 158 Z" fill={tooth} stroke={lipDark} strokeWidth="1.2" />
          <ellipse cx="100" cy="160" rx="16" ry="4" fill={tongue} />
          <path d="M70 164 Q100 172 130 164" stroke={lip} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case "alveolar":
    case "lateral":
      // T/D/N/S/Z/L — tongue tip up behind top teeth
      return (
        <g>
          <ellipse cx="100" cy="164" rx="24" ry="10" fill="#3B0F1B" />
          {/* Top teeth */}
          <rect x="80" y="152" width="40" height="7" rx="1.5" fill={tooth} stroke="#C9CED2" strokeWidth="0.6" />
          {[88, 96, 104, 112].map((x) => (
            <line key={x} x1={x} y1="152" x2={x} y2="159" stroke="#C9CED2" strokeWidth="0.8" />
          ))}
          {/* Tongue tip touching ridge */}
          <path d="M84 162 Q100 150 116 162 Q100 168 84 162 Z" fill={tongue} />
          {/* Bottom teeth peek */}
          <rect x="84" y="168" width="32" height="4" rx="1" fill={tooth} opacity="0.85" />
          {/* Lips outline */}
          <path d="M68 150 Q100 142 132 150" stroke={lip} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M68 172 Q100 182 132 172" stroke={lip} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case "postalveolar":
      // SH/CH/J — rounded, tongue slightly back
      return (
        <g>
          <ellipse cx="100" cy="158" rx="18" ry="11" fill="#3B0F1B" />
          <ellipse cx="100" cy="158" rx="18" ry="11" fill="none" stroke={lip} strokeWidth="3" />
          <rect x="86" y="150" width="28" height="5" rx="1" fill={tooth} />
          <ellipse cx="100" cy="163" rx="12" ry="4" fill={tongue} />
        </g>
      );
    case "palatal":
      // Y — smile, tongue high
      return (
        <g>
          <path d="M72 156 Q100 172 128 156" stroke={lipDark} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M74 158 Q100 168 126 158 Q100 162 74 158 Z" fill="#3B0F1B" />
          <rect x="84" y="156" width="32" height="4" rx="1" fill={tooth} opacity="0.9" />
          <ellipse cx="100" cy="163" rx="14" ry="3" fill={tongue} />
        </g>
      );
    case "velar":
      // K/G — back tongue lifted, mouth open
      return (
        <g>
          <ellipse cx="100" cy="162" rx="22" ry="12" fill="#3B0F1B" />
          <ellipse cx="100" cy="162" rx="22" ry="12" fill="none" stroke={lip} strokeWidth="3" />
          <rect x="82" y="153" width="36" height="6" rx="1.2" fill={tooth} />
          <rect x="82" y="170" width="36" height="5" rx="1.2" fill={tooth} opacity="0.9" />
          {/* Back of tongue humped up */}
          <path d="M84 172 Q100 156 116 172 Z" fill={tongue} />
          <path d="M84 172 Q100 158 116 172" stroke={gum} strokeWidth="1" fill="none" />
        </g>
      );
    case "glottal":
      // H — mouth wide open, relaxed tongue
      return (
        <g>
          <ellipse cx="100" cy="162" rx="20" ry="14" fill="#3B0F1B" />
          <ellipse cx="100" cy="162" rx="20" ry="14" fill="none" stroke={lip} strokeWidth="3" />
          <ellipse cx="100" cy="170" rx="14" ry="4" fill={tongue} />
        </g>
      );
    case "retroflex":
      // R — tongue curled back
      return (
        <g>
          <ellipse cx="100" cy="160" rx="20" ry="12" fill="#3B0F1B" />
          <ellipse cx="100" cy="160" rx="20" ry="12" fill="none" stroke={lip} strokeWidth="3" />
          <rect x="84" y="152" width="32" height="5" rx="1" fill={tooth} />
          <path d="M86 168 Q100 156 114 168 Q108 160 100 156 Q92 160 86 168 Z" fill={tongue} />
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx="100" cy="158" rx="16" ry="8" fill="#3B0F1B" />
          <ellipse cx="100" cy="158" rx="16" ry="8" fill="none" stroke={lip} strokeWidth="3" />
        </g>
      );
  }
};

export default SpeakingFace;
