import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import RecruitWarning from './RecruitWarning';
import SanCrisisEffect from './SanCrisisEffect';

export default function OverlayManager() {
  const { state } = useGame();
  const { activeOverlay } = state.ui;

  return (
    <AnimatePresence>
      {activeOverlay === 'recruit-warning' && <RecruitWarning />}
      {activeOverlay === 'san-crisis' && <SanCrisisEffect />}
    </AnimatePresence>
  );
}
