import { motion } from "framer-motion";

export type MouthType = "bilabial" | "alveolar" | "labiodental" | "velar" | "palatal" | "glottal" | "lateral" | "retroflex" | "dental" | "postalveolar";

interface MouthDiagramProps {
  type: MouthType;
  voicing: "voiced" | "voiceless" | "nasal";
}

const VoicingIndicator = ({ voicing }: { voicing: string }) => (
  <>
    {(voicing === "voiced" || voicing === "nasal") && (
      <motion.g>
        <motion.path
          d="M 90 160 Q 95 155 100 160 Q 105 165 110 160"
          fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1, y: [0, -2, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        <text x="100" y="185" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="bold">
          VOICE ON
        </text>
      </motion.g>
    )}
    {voicing === "voiceless" && (
      <motion.g>
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i} cx={150 + i * 10} cy={110} r={3}
            fill="hsl(var(--muted-foreground) / 0.5)"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: [0, 0.8, 0], x: [0, 15, 30] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        <text x="100" y="185" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
          VOICE OFF
        </text>
      </motion.g>
    )}
    {voicing === "nasal" && (
      <motion.g>
        <motion.path
          d="M 100 60 L 100 45 L 95 35" fill="none"
          stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="3 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.path
          d="M 100 60 L 100 45 L 105 35" fill="none"
          stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="3 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <text x="100" y="28" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10">
          👃 air
        </text>
      </motion.g>
    )}
  </>
);

const FaceOutline = () => (
  <>
    <ellipse cx="100" cy="100" rx="85" ry="90" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
    <path d="M 95 65 Q 100 55 105 65" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
  </>
);

const MouthDiagram = ({ type, voicing }: MouthDiagramProps) => {
  const renderMouth = () => {
    switch (type) {
      case "bilabial":
        return (
          <>
            <motion.path
              d="M 60 110 Q 80 100 100 102 Q 120 100 140 110"
              fill="hsl(var(--destructive) / 0.6)" stroke="hsl(var(--destructive))" strokeWidth="2.5"
              initial={{ d: "M 60 110 Q 80 100 100 102 Q 120 100 140 110" }}
              animate={{ d: "M 60 108 Q 80 98 100 100 Q 120 98 140 108" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.path
              d="M 60 112 Q 80 118 100 120 Q 120 118 140 112"
              fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2.5"
              initial={{ d: "M 60 112 Q 80 118 100 120 Q 120 118 140 112" }}
              animate={{ d: "M 60 110 Q 80 112 100 112 Q 120 112 140 110" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.line
              x1="70" y1="110" x2="130" y2="110"
              stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="4 3"
              initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </>
        );

      case "labiodental":
        return (
          <>
            {/* Upper teeth */}
            <path d="M 80 102 L 85 97 L 90 102 L 95 97 L 100 102 L 105 97 L 110 102 L 115 97 L 120 102"
              fill="none" stroke="hsl(var(--background))" strokeWidth="2.5" />
            {/* Lower lip touching upper teeth */}
            <motion.path
              d="M 60 112 Q 80 118 100 115 Q 120 118 140 112"
              fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2.5"
              initial={{ d: "M 60 112 Q 80 118 100 115 Q 120 118 140 112" }}
              animate={{ d: "M 60 108 Q 80 106 100 103 Q 120 106 140 108" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <text x="100" y="80" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">
                teeth on lip
              </text>
            </motion.g>
          </>
        );

      case "velar":
        return (
          <>
            {/* Open mouth */}
            <path d="M 60 105 Q 80 95 100 97 Q 120 95 140 105" fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <path d="M 60 110 Q 80 125 100 128 Q 120 125 140 110" fill="hsl(var(--destructive) / 0.4)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <ellipse cx="100" cy="112" rx="30" ry="10" fill="hsl(var(--foreground) / 0.15)" />
            {/* Tongue back raised */}
            <motion.path
              d="M 70 130 Q 80 125 90 120 Q 100 115 110 105 Q 115 100 120 100"
              fill="hsl(var(--destructive) / 0.3)" stroke="hsl(var(--destructive) / 0.7)" strokeWidth="2"
              initial={{ d: "M 70 130 Q 80 125 90 120 Q 100 118 110 112 Q 115 108 120 108" }}
              animate={{ d: "M 70 130 Q 80 125 90 118 Q 100 110 110 100 Q 115 97 120 97" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <text x="120" y="80" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">
                tongue back ↑
              </text>
            </motion.g>
          </>
        );

      case "glottal":
        return (
          <>
            {/* Wide open mouth */}
            <path d="M 60 105 Q 80 90 100 92 Q 120 90 140 105" fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <path d="M 60 112 Q 80 130 100 135 Q 120 130 140 112" fill="hsl(var(--destructive) / 0.4)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <ellipse cx="100" cy="115" rx="30" ry="14" fill="hsl(var(--foreground) / 0.15)" />
            {/* Air flow arrows */}
            <motion.g>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i} cx={100} cy={115 - i * 12} r={3}
                  fill="hsl(var(--primary) / 0.5)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0], y: [0, -15, -30] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </motion.g>
            <text x="100" y="80" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">
              open — push air
            </text>
          </>
        );

      case "palatal":
      case "postalveolar":
        return (
          <>
            <path d="M 60 105 Q 80 95 100 97 Q 120 95 140 105" fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <path d="M 60 110 Q 80 125 100 128 Q 120 125 140 110" fill="hsl(var(--destructive) / 0.4)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <ellipse cx="100" cy="112" rx="30" ry="10" fill="hsl(var(--foreground) / 0.15)" />
            {/* Tongue raised to palate */}
            <motion.path
              d="M 70 125 Q 80 118 90 108 Q 95 100 100 97 Q 105 100 110 108 Q 120 118 130 125"
              fill="hsl(var(--destructive) / 0.3)" stroke="hsl(var(--destructive) / 0.7)" strokeWidth="2"
              initial={{ d: "M 70 125 Q 80 120 90 112 Q 95 105 100 103 Q 105 105 110 112 Q 120 120 130 125" }}
              animate={{ d: "M 70 125 Q 80 116 90 106 Q 95 98 100 95 Q 105 98 110 106 Q 120 116 130 125" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <text x="100" y="78" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">
                tongue up to roof
              </text>
            </motion.g>
          </>
        );

      case "lateral":
        return (
          <>
            <path d="M 60 105 Q 80 95 100 97 Q 120 95 140 105" fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <path d="M 60 110 Q 80 125 100 128 Q 120 125 140 110" fill="hsl(var(--destructive) / 0.4)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <ellipse cx="100" cy="112" rx="30" ry="10" fill="hsl(var(--foreground) / 0.15)" />
            {/* Tongue tip up, air sides */}
            <motion.path
              d="M 70 125 Q 80 118 90 108 Q 95 100 100 97 Q 105 100 110 108 Q 120 118 130 125"
              fill="hsl(var(--destructive) / 0.3)" stroke="hsl(var(--destructive) / 0.7)" strokeWidth="2"
              animate={{ d: "M 70 125 Q 80 116 90 106 Q 95 98 100 95 Q 105 98 110 106 Q 120 116 130 125" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            {/* Air flow arrows on sides */}
            {[-1, 1].map((side) => (
              <motion.circle
                key={side} cx={100 + side * 25} cy={115} r={3}
                fill="hsl(var(--primary) / 0.5)"
                animate={{ opacity: [0, 0.8, 0], x: [0, side * 10, side * 20] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            ))}
            <text x="100" y="78" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">
              tongue up — air sides
            </text>
          </>
        );

      case "retroflex":
        return (
          <>
            <path d="M 60 105 Q 80 95 100 97 Q 120 95 140 105" fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <path d="M 60 110 Q 80 125 100 128 Q 120 125 140 110" fill="hsl(var(--destructive) / 0.4)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            <ellipse cx="100" cy="112" rx="30" ry="10" fill="hsl(var(--foreground) / 0.15)" />
            {/* Tongue curled back */}
            <motion.path
              d="M 70 125 Q 80 120 90 115 Q 95 108 98 103 Q 100 98 103 95"
              fill="none" stroke="hsl(var(--destructive) / 0.7)" strokeWidth="3"
              animate={{ d: "M 70 125 Q 80 118 90 112 Q 95 105 98 100 Q 100 95 103 92" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <text x="100" y="78" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">
              tongue curled back
            </text>
          </>
        );

      case "dental":
        return (
          <>
            {/* Upper teeth */}
            <path d="M 80 102 L 85 97 L 90 102 L 95 97 L 100 102 L 105 97 L 110 102 L 115 97 L 120 102"
              fill="none" stroke="hsl(var(--background))" strokeWidth="2.5" />
            {/* Lower lip */}
            <path d="M 60 112 Q 80 120 100 122 Q 120 120 140 112" fill="hsl(var(--destructive) / 0.4)" stroke="hsl(var(--destructive))" strokeWidth="2" />
            {/* Tongue between teeth */}
            <motion.path
              d="M 85 110 Q 95 105 100 100 Q 105 105 115 110"
              fill="hsl(var(--destructive) / 0.3)" stroke="hsl(var(--destructive) / 0.7)" strokeWidth="2"
              animate={{ d: "M 85 108 Q 95 102 100 97 Q 105 102 115 108" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <text x="100" y="80" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">
              tongue between teeth
            </text>
          </>
        );

      default:
        // Fallback to alveolar
        return renderAlveolar();
    }
  };

  const renderAlveolar = () => (
    <>
      <path d="M 60 105 Q 80 95 100 97 Q 120 95 140 105" fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2" />
      <path d="M 60 110 Q 80 125 100 128 Q 120 125 140 110" fill="hsl(var(--destructive) / 0.4)" stroke="hsl(var(--destructive))" strokeWidth="2" />
      <ellipse cx="100" cy="112" rx="30" ry="10" fill="hsl(var(--foreground) / 0.15)" />
      <motion.path
        d="M 85 100 L 90 97 L 95 100 L 100 97 L 105 100 L 110 97 L 115 100"
        fill="none" stroke="hsl(var(--background))" strokeWidth="2.5"
        initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.path
        d="M 70 125 Q 80 120 90 110 Q 95 100 100 98 Q 105 100 110 110 Q 120 120 130 125"
        fill="hsl(var(--destructive) / 0.3)" stroke="hsl(var(--destructive) / 0.7)" strokeWidth="2"
        initial={{ d: "M 70 125 Q 80 120 90 115 Q 95 108 100 105 Q 105 108 110 115 Q 120 120 130 125" }}
        animate={{ d: "M 70 125 Q 80 118 90 108 Q 95 100 100 98 Q 105 100 110 108 Q 120 118 130 125" }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <line x1="100" y1="80" x2="100" y2="92" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--primary))" />
          </marker>
        </defs>
        <text x="100" y="75" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">
          tongue tip
        </text>
      </motion.g>
    </>
  );

  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <FaceOutline />
        {type === "alveolar" ? renderAlveolar() : renderMouth()}
        <VoicingIndicator voicing={voicing} />
      </svg>
    </div>
  );
};

export default MouthDiagram;
