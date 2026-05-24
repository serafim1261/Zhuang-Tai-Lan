import { InventoryItem, ItemRarity } from '../../types/game';
import { Diamond } from 'lucide-react';

const rarityConfig: Record<ItemRarity, { border: string; glow: string; bg: string; label: string }> = {
  common: { border: '#555', glow: 'transparent', bg: 'rgba(85,85,85,0.06)', label: '普通' },
  rare: { border: '#7ec8e3', glow: 'rgba(126,200,227,0.2)', bg: 'rgba(126,200,227,0.04)', label: '稀有' },
  epic: { border: '#7b2fbe', glow: 'rgba(123,47,190,0.3)', bg: 'rgba(123,47,190,0.06)', label: '史诗' },
  legendary: { border: '#f0c040', glow: 'rgba(240,192,64,0.4)', bg: 'rgba(240,192,64,0.06)', label: '传说' },
  corrupted: { border: '#c41e3a', glow: 'rgba(196,30,58,0.3)', bg: 'rgba(196,30,58,0.04)', label: '污染' },
};

const categoryLabels: Record<string, string> = {
  equipment: '装备', consumable: '消耗品', rule: '规则类', medium: '媒介类', corrupted: '污染类'
};

export default function ItemDetailCard({ data }: { data: InventoryItem }) {
  const fx = rarityConfig[data.rarity];
  return (
    <div style={{ padding: 20, position: 'relative' }}>
      {/* Rarity glow border */}
      {data.rarity !== 'common' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${fx.border}00, ${fx.border}, ${fx.border}00)` }} />
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: fx.bg, border: `2px solid ${fx.border}33`,
            boxShadow: data.rarity !== 'common' ? `0 0 20px ${fx.glow}` : 'none'
          }}>
            <Diamond size={24} color={fx.border} />
          </div>
        </div>
        <div style={{ color: '#ccc', fontSize: 14, fontWeight: 'bold', marginBottom: 2 }}>{data.name}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 9 }}>
          <span style={{ color: fx.border }}>{fx.label}</span>
          <span style={{ color: '#666' }}>{categoryLabels[data.category]}</span>
          <span style={{ color: '#666' }}>x{data.quantity}</span>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: 12, background: 'rgba(255,255,255,0.015)', borderRadius: 4, marginBottom: 14 }}>
        <div style={{ color: '#888', fontSize: 10, lineHeight: 1.6 }}>{data.description}</div>
      </div>

      {/* Effect */}
      {data.effect && (
        <div style={{ padding: 12, background: 'rgba(74,222,128,0.04)', borderLeft: '2px solid rgba(74,222,128,0.3)', borderRadius: 3, marginBottom: 14 }}>
          <div style={{ color: '#666', fontSize: 8, letterSpacing: 1, marginBottom: 4 }}>效果</div>
          <div style={{ color: '#4ade80', fontSize: 10 }}>{data.effect}</div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {data.category === 'equipment' && (
          <button className="glass" style={{ flex: 1, padding: '10px 0', border: '1px solid rgba(126,200,227,0.2)', borderRadius: 4, background: 'transparent', color: '#7ec8e3', fontSize: 11, cursor: 'pointer', letterSpacing: 2 }}>装备</button>
        )}
        {data.category === 'consumable' && (
          <button className="glass" style={{ flex: 1, padding: '10px 0', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 4, background: 'transparent', color: '#4ade80', fontSize: 11, cursor: 'pointer', letterSpacing: 2 }}>使用</button>
        )}
        {(data.category === 'rule' || data.category === 'medium') && (
          <button className="glass" style={{ flex: 1, padding: '10px 0', border: '1px solid rgba(240,192,64,0.2)', borderRadius: 4, background: 'transparent', color: '#f0c040', fontSize: 11, cursor: 'pointer', letterSpacing: 2 }}>激活</button>
        )}
        <button className="glass" style={{ padding: '10px 16px', border: '1px solid rgba(196,30,58,0.15)', borderRadius: 4, background: 'transparent', color: '#666', fontSize: 11, cursor: 'pointer' }}>丢弃</button>
      </div>
    </div>
  );
}
