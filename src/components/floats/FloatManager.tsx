import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import EntityDetailCard from './EntityDetailCard';
import ItemDetailCard from './ItemDetailCard';
import MapPOIDetail from './MapPOIDetail';

export default function FloatManager() {
  const { state, closeFloat } = useGame();
  const { activeFloat, floatData } = state.ui;

  return (
    <AnimatePresence>
      {activeFloat && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={closeFloat}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, cursor: 'pointer' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass"
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: activeFloat === 'map-poi' ? 360 : 400, maxHeight: '80%',
              zIndex: 45, overflow: 'auto', borderRadius: 8,
              boxShadow: '0 0 40px rgba(0,0,0,0.6)', padding: 0
            }}
          >
            {/* Close button */}
            <button onClick={closeFloat} style={{
              position: 'absolute', top: 12, right: 12, zIndex: 2,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3, color: '#888', cursor: 'pointer', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={14} />
            </button>

            {activeFloat === 'entity-detail' && <EntityDetailCard data={floatData} />}
            {activeFloat === 'item-detail' && <ItemDetailCard data={floatData} />}
            {activeFloat === 'map-poi' && <MapPOIDetail data={floatData} />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
