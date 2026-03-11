import { motion } from "framer-motion";

interface MouthDiagramProps {
  type: "bilabial" | "alveolar";
  voicing: "voiced" | "voiceless" | "nasal";
}

const MouthDiagram = ({ type, voicing }: MouthDiagramProps) => {
  if (type === "bilabial") {
    return (
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Face outline */}
          <ellipse cx="100" cy="100" rx="85" ry="90" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
          
          {/* Nose */}
          <path d="M 95 65 Q 100 55 105 65" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
          
          {/* Upper lip */}
          <motion.path
            d="M 60 110 Q 80 100 100 102 Q 120 100 140 110"
            fill="hsl(var(--destructive) / 0.6)"
            stroke="hsl(var(--destructive))"
            strokeWidth="2.5"
            initial={{ d: "M 60 110 Q 80 100 100 102 Q 120 100 140 110" }}
            animate={{ d: "M 60 108 Q 80 98 100 100 Q 120 98 140 108" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Lower lip - pressed against upper for bilabial */}
          <motion.path
            d="M 60 112 Q 80 118 100 120 Q 120 118 140 112"
            fill="hsl(var(--destructive) / 0.5)"
            stroke="hsl(var(--destructive))"
            strokeWidth="2.5"
            initial={{ d: "M 60 112 Q 80 118 100 120 Q 120 118 140 112" }}
            animate={{ d: "M 60 110 Q 80 112 100 112 Q 120 112 140 110" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          />

          {/* Lip press indicator */}
          <motion.line
            x1="70" y1="110" x2="130" y2="110"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray="4 3"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          />

          {/* Voicing indicator */}
          {(voicing === "voiced" || voicing === "nasal") && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Throat vibration waves */}
              <motion.path
                d="M 90 160 Q 95 155 100 160 Q 105 165 110 160"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1, y: [0, -2, 0] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
              <text x="100" y="185" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="bold">
                VOICE ON
              </text>
            </motion.g>
          )}

          {/* Nasal airflow */}
          {voicing === "nasal" && (
            <motion.g>
              <motion.path
                d="M 100 60 L 100 45 L 95 35"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="3 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.path
                d="M 100 60 L 100 45 L 105 35"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="3 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <text x="100" y="28" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10">
                👃 air
              </text>
            </motion.g>
          )}

          {/* Air puff for voiceless */}
          {voicing === "voiceless" && (
            <motion.g>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={150 + i * 10}
                  cy={110}
                  r={3}
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
        </svg>
      </div>
    );
  }

  // Alveolar (T/D/N)
  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Face outline - side view */}
        <ellipse cx="100" cy="100" rx="85" ry="90" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
        
        {/* Open mouth */}
        <path d="M 60 105 Q 80 95 100 97 Q 120 95 140 105" fill="hsl(var(--destructive) / 0.5)" stroke="hsl(var(--destructive))" strokeWidth="2" />
        <path d="M 60 110 Q 80 125 100 128 Q 120 125 140 110" fill="hsl(var(--destructive) / 0.4)" stroke="hsl(var(--destructive))" strokeWidth="2" />
        
        {/* Mouth cavity */}
        <ellipse cx="100" cy="112" rx="30" ry="10" fill="hsl(var(--foreground) / 0.15)" />
        
        {/* Teeth ridge (alveolar ridge) */}
        <motion.path
          d="M 85 100 L 90 97 L 95 100 L 100 97 L 105 100 L 110 97 L 115 100"
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="2.5"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Tongue touching ridge */}
        <motion.path
          d="M 70 125 Q 80 120 90 110 Q 95 100 100 98 Q 105 100 110 110 Q 120 120 130 125"
          fill="hsl(var(--destructive) / 0.3)"
          stroke="hsl(var(--destructive) / 0.7)"
          strokeWidth="2"
          initial={{ d: "M 70 125 Q 80 120 90 115 Q 95 108 100 105 Q 105 108 110 115 Q 120 120 130 125" }}
          animate={{ d: "M 70 125 Q 80 118 90 108 Q 95 100 100 98 Q 105 100 110 108 Q 120 118 130 125" }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Arrow showing tongue tip touching ridge */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
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

        {/* Voicing indicator */}
        {(voicing === "voiced" || voicing === "nasal") && (
          <motion.g>
            <motion.path
              d="M 90 160 Q 95 155 100 160 Q 105 165 110 160"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
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
          <text x="100" y="185" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
            VOICE OFF
          </text>
        )}

        {voicing === "nasal" && (
          <motion.g>
            <motion.path
              d="M 100 60 L 100 45 L 95 35"
              fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="3 2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <text x="100" y="28" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10">
              👃 air
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
};

export default MouthDiagram;
