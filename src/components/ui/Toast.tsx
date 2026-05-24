import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ShieldAlert, AlertTriangle, CheckCircle, Skull } from 'lucide-react';

const toastConfig = {
  system: { icon: ShieldAlert, border: '#7ec8e3', bg: 'rgba(126,200,227,0.08)' },
  warning: { icon: AlertTriangle, border: '#c41e3a', bg: 'rgba(196,30,58,0.08)' },
  success: { icon: CheckCircle, border: '#4ade80', bg: 'rgba(74,222,128,0.06)' },
  occult: { icon: Skull, border: '#7b2fbe', bg: 'rgba(123,47,190,0.08)' },
};

export default function ToastContainer() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    state.ui.toasts.forEach(t => {
      const timer = setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id: t.id }), 3000);
      return () => clearTimeout(timer);
    });
  }, [state.ui.toasts, dispatch]);

  return (
    <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      <AnimatePresence>
        {state.ui.toasts.map(t => {
          const cfg = toastConfig[t.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={t.id}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="glass"
              style={{
                padding: '10px 18px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10,
                borderLeft: `2px solid ${cfg.border}`, background: cfg.bg,
                boxShadow: `0 0 16px ${cfg.border}22`, minWidth: 280, pointerEvents: 'auto'
              }}
            >
              <Icon size={14} color={cfg.border} />
              <span style={{ color: '#ccc', fontSize: 12, letterSpacing: 1 }}>{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
