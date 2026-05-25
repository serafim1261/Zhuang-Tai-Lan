import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AlertTriangle, Skull, Timer } from 'lucide-react';

export default function RecruitWarning() {
  const { state, dispatch } = useGame();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          dispatch({ type: 'HIDE_OVERLAY' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const isUrgent = countdown <= 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(4,4,10,0.94)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Pulsing edge glow */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: isUrgent ? 'inset 0 0 120px rgba(196,30,58,0.3)' : 'inset 0 0 80px rgba(196,30,58,0.15)',
        transition: 'box-shadow 0.5s'
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 4px)'
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Warning icon */}
        <div style={{ marginBottom: 20 }}>
          <Skull size={48} color="#c41e3a" opacity={0.8} style={{ animation: 'pulse-dot 1.5s infinite' }} />
        </div>

        {/* Warning text */}
        <div style={{ color: '#c41e3a', fontSize: 22, fontWeight: 'bold', letterSpacing: 6, marginBottom: 8 }}>
          ⚠ 征召警告 ⚠
        </div>
        <div style={{ color: 'rgba(196,30,58,0.5)', fontSize: 10, letterSpacing: 3, marginBottom: 30 }}>
          RECRUIT WARNING · VOID INCURSION
        </div>

        {/* Typewriter warning message */}
        <div style={{
          color: '#999', fontSize: 13, lineHeight: 1.8, maxWidth: 400, margin: '0 auto 40px',
          padding: '16px 20px', background: 'rgba(196,30,58,0.04)', border: '1px solid rgba(196,30,58,0.1)',
          borderRadius: 4, textAlign: 'left'
        }}>
          <div style={{ color: '#c41e3a', fontSize: 10, marginBottom: 8, letterSpacing: 2 }}>■■ 界门总局 · 强制征召令</div>
          行契者「{state.player.codeName}」，监测到血月殡葬区域异常波动。根据界门协议第七条，所有可调度行契者必须在30秒内确认进入。超时未确认将视为抗命。
        </div>

        {/* Countdown */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%', margin: '0 auto 30px',
          border: `3px solid ${isUrgent ? '#c41e3a' : 'rgba(196,30,58,0.3)'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: isUrgent ? 'rgba(196,30,58,0.1)' : 'rgba(196,30,58,0.03)',
          transition: 'all 0.3s',
          boxShadow: isUrgent ? '0 0 30px rgba(196,30,58,0.3)' : 'none'
        }}>
          <span style={{
            color: isUrgent ? '#c41e3a' : 'rgba(196,30,58,0.6)',
            fontSize: 40, fontWeight: 'bold',
            fontFamily: 'JetBrains Mono, monospace',
            animation: isUrgent ? 'glitch-shift 0.3s infinite' : 'none'
          }}>
            {countdown}
          </span>
          <span style={{ color: '#666', fontSize: 9, letterSpacing: 2 }}>秒</span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            onClick={() => dispatch({ type: 'HIDE_OVERLAY' })}
            style={{
              padding: '12px 28px', border: '1px solid #c41e3a', borderRadius: 4,
              background: 'rgba(196,30,58,0.1)', color: '#c41e3a', fontSize: 13,
              cursor: 'pointer', letterSpacing: 3, fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,30,58,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,30,58,0.1)'; }}
          >
            确认进入
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'UPDATE_PLAYER', partial: { san: Math.max(0, state.player.san - 20) } });
              dispatch({ type: 'HIDE_OVERLAY' });
            }}
            style={{
              padding: '12px 28px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
              background: 'transparent', color: '#888', fontSize: 13,
              cursor: 'pointer', letterSpacing: 3, fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#aaa'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#888'; }}
          >
            尝试抵抗 (消耗SAN -20)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
