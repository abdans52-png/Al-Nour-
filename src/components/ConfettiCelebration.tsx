import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ConfettiPiece {
  id: number;
  type: 'rectangle' | 'circle' | 'star' | 'diamond' | 'ribbon' | 'ring';
  x: number; // initial spread angle or position
  yOffset: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  xTarget: number;
  yTarget: number;
  delay: number;
  duration: number;
  scale: number;
  flipX: number;
}

const LUXURY_PALETTE = [
  '#F5D77F', // Champagne Gold
  '#C59B27', // Royal Gold
  '#E8D59E', // Pale Gold
  '#D4AF37', // Metallic Gold
  '#FFFFFF', // Pure Diamond White
  '#FFF8DC', // Silk Cream
  '#0F5A47', // Emerald Atelier Green
  '#8B1E3F', // Royal Ruby Red
  '#C0C0C0', // Platinum Silver
  '#F3E5AB', // Vanilla Gold
];

export const ConfettiCelebration: React.FC<{
  onComplete?: () => void;
  triggerKey?: number;
}> = ({ triggerKey = 0 }) => {
  const [isActive, setIsActive] = useState(true);

  // Re-activate whenever triggerKey changes
  useEffect(() => {
    setIsActive(true);
  }, [triggerKey]);

  // Generate 75 deterministic yet varied confetti pieces
  const pieces = useMemo<ConfettiPiece[]>(() => {
    const items: ConfettiPiece[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const types: ConfettiPiece['type'][] = ['rectangle', 'circle', 'star', 'diamond', 'ribbon', 'ring'];
      const type = types[i % types.length];
      const color = LUXURY_PALETTE[i % LUXURY_PALETTE.length];
      
      // Angle spread (-80deg to +80deg or radial burst)
      const angle = (Math.PI / 180) * (-90 + (Math.random() * 160 - 80));
      const distance = 250 + Math.random() * 650;
      
      const xTarget = Math.sin(angle) * distance + (Math.random() - 0.5) * 120;
      const yTarget = 400 + Math.random() * 600;

      items.push({
        id: i,
        type,
        x: (Math.random() - 0.5) * 40,
        yOffset: -20 + (Math.random() - 0.5) * 30,
        size: type === 'ribbon' ? 14 + Math.random() * 12 : 6 + Math.random() * 10,
        color,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 720,
        xTarget,
        yTarget,
        delay: Math.random() * 0.45,
        duration: 2.8 + Math.random() * 2.2,
        scale: 0.6 + Math.random() * 0.7,
        flipX: (Math.random() - 0.5) * 1440,
      });
    }

    return items;
  }, [triggerKey]);

  if (!isActive) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden print:hidden"
    >
      <AnimatePresence>
        {/* Central Lottie Shockwave Rings */}
        <div className="absolute top-28 sm:top-36 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* Shockwave ring 1 */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.9, borderColor: '#F5D77F' }}
            animate={{
              scale: [0.2, 3.2, 5.0],
              opacity: [0.9, 0.4, 0],
              borderWidth: ['3px', '1px', '0px']
            }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="w-24 h-24 rounded-full border border-[#D4AF37] absolute"
          />
          {/* Shockwave ring 2 */}
          <motion.div
            initial={{ scale: 0.1, opacity: 0.8, borderColor: '#C59B27' }}
            animate={{
              scale: [0.1, 2.5, 4.2],
              opacity: [0.8, 0.3, 0],
            }}
            transition={{ duration: 2.2, delay: 0.15, ease: 'easeOut' }}
            className="w-24 h-24 rounded-full border border-dashed border-[#F5D77F] absolute"
          />

          {/* Golden Ambient Aura Glow */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.8, 2.5], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="w-48 h-48 rounded-full bg-gradient-to-r from-[#C59B27]/40 via-[#F5D77F]/30 to-transparent blur-2xl absolute"
          />
        </div>

        {/* Confetti Particles */}
        <div className="absolute top-28 sm:top-36 left-1/2 -translate-x-1/2 w-0 h-0">
          {pieces.map((piece) => (
            <motion.div
              key={`confetti-piece-${triggerKey}-${piece.id}`}
              initial={{
                x: piece.x,
                y: piece.yOffset,
                opacity: 1,
                scale: 0,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
              }}
              animate={{
                x: [piece.x, piece.xTarget * 0.5, piece.xTarget + (Math.sin(piece.id) * 60)],
                y: [piece.yOffset, piece.yOffset - 120 - Math.random() * 80, piece.yTarget],
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0, piece.scale * 1.3, piece.scale, piece.scale * 0.9],
                rotate: [0, piece.rotation, piece.rotation + piece.rotationSpeed],
                rotateX: [0, piece.flipX, piece.flipX * 2],
                rotateY: [0, piece.flipX * 1.5, piece.flipX * 3],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: [0.16, 1, 0.3, 1], // Explosive pop with smooth flutter
                times: [0, 0.15, 0.4, 0.8, 1],
              }}
              style={{
                position: 'absolute',
                transformStyle: 'preserve-3d',
              }}
            >
              {piece.type === 'rectangle' && (
                <div
                  style={{
                    width: `${piece.size * 0.8}px`,
                    height: `${piece.size * 1.6}px`,
                    backgroundColor: piece.color,
                    borderRadius: '2px',
                    boxShadow: `0 0 6px ${piece.color}66`,
                  }}
                />
              )}

              {piece.type === 'ribbon' && (
                <div
                  style={{
                    width: `${piece.size * 0.4}px`,
                    height: `${piece.size * 2.2}px`,
                    background: `linear-gradient(135deg, ${piece.color}, #FFF)`,
                    borderRadius: '3px',
                    transform: 'skewY(20deg)',
                    boxShadow: `0 0 8px ${piece.color}88`,
                  }}
                />
              )}

              {piece.type === 'circle' && (
                <div
                  style={{
                    width: `${piece.size}px`,
                    height: `${piece.size}px`,
                    backgroundColor: piece.color,
                    borderRadius: '50%',
                    boxShadow: `0 0 5px ${piece.color}88`,
                  }}
                />
              )}

              {piece.type === 'ring' && (
                <div
                  style={{
                    width: `${piece.size * 1.2}px`,
                    height: `${piece.size * 1.2}px`,
                    border: `2px solid ${piece.color}`,
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                  }}
                />
              )}

              {piece.type === 'diamond' && (
                <div
                  style={{
                    width: `${piece.size}px`,
                    height: `${piece.size}px`,
                    backgroundColor: piece.color,
                    transform: 'rotate(45deg)',
                    boxShadow: `0 0 6px ${piece.color}77`,
                  }}
                />
              )}

              {piece.type === 'star' && (
                <svg
                  width={piece.size * 1.4}
                  height={piece.size * 1.4}
                  viewBox="0 0 24 24"
                  fill={piece.color}
                  style={{
                    filter: `drop-shadow(0 0 4px ${piece.color})`,
                  }}
                >
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};
