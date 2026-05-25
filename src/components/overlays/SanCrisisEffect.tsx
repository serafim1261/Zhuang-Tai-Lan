import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SanCrisisEffect() {
  const { state, dispatch } = useGame();
  const level = state.ui.sanCrisisLevel;
  const [glitchX, setGlitchX] = useState(0);
  const [showHallucination, setShowHallucination] = useState(false);

  useEffect(() => {
    if (level <= 0) return;
    const interval = setInterval(() => {
      if (level > 0.5) setGlitchX((Math.random() - 0.5) * level * 12);
      if (level > 0.7) setShowHallucination(Math.random() > 0.7);
    }, 200 + Math.random() * 400);
    return () => clearInterval(interval);
  }, [level]);

  if (level <= 0) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 90, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Purple edge vignette - always present */}
      {level > 0.2 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(123,47,190,${level * 0.3}) 100%)`,
          opacity: 0.5 + level * 0.5
        }} />
      )}

      {/* Enhanced scanlines */}
      {level > 0.3 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(0deg, rgba(123,47,190,${level * 0.06}) 0px, rgba(123,47,190,${level * 0.06}) 2px, transparent 2px, transparent 4px)`,
          opacity: 0.4 + level * 0.6
        }} />
      )}

      {/* Horizontal glitch shift */}
      {level > 0.5 && (
        <div style={{
          position: 'absolute', inset: 0,
          transform: `translateX(${glitchX}px)`,
          transition: 'transform 0.08s ease-out',
          background: 'transparent'
        }}>
          {/* Glitch lines */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', left: 0, right: 0, height: 1,
              top: `${20 + i * 30 + Math.random() * 10}%`,
              background: `rgba(123,47,190,${level * 0.4})`,
              transform: `scaleX(${0.3 + Math.random() * 0.7})`,
              opacity: Math.random() > 0.5 ? 1 : 0
            }} />
          ))}
        </div>
      )}

      {/* RGB Split / Chromatic aberration */}
      {level > 0.7 && (
        <div style={{
          position: 'absolute', inset: 0,
          textShadow: `${1 + level * 2}px 0 rgba(196,30,58,${level * 0.3}), -${1 + level * 2}px 0 rgba(126,200,227,${level * 0.3})`,
          pointerEvents: 'none'
        }} />
      )}

      {/* Hallucination floating text */}
      {level > 0.8 && showHallucination && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 + level * 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 70}%`,
              color: '#7b2fbe',
              fontSize: 14 + Math.random() * 10,
              fontFamily: 'inherit',
              letterSpacing: 4,
              fontStyle: 'italic',
              transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
            }}>
            {['它们在看...', '门开了...', '你不是你...', '过来...', '镜子里...', '闭嘴...'][Math.floor(Math.random() * 6)]}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Corner corruption */}
      {level > 0.6 && (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: 120, height: 80,
            background: 'linear-gradient(135deg, rgba(123,47,190,0.15) 0%, transparent 100%)',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)'
          }} />
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: 120, height: 80,
            background: 'linear-gradient(315deg, rgba(123,47,190,0.15) 0%, transparent 100%)',
            clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
          }} />
        </>
      )}
    </div>
  );
}
