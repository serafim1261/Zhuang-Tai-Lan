import { useGame } from '../../context/GameContext';
import { InventoryItem, ItemCategory, ItemRarity } from '../../types/game';
import { useState } from 'react';
import { Diamond, Pill, Scroll, Book, Skull } from 'lucide-react';

const categoryTabs: { id: ItemCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'equipment', label: '装备', icon: <Diamond size={12} />, color: '#7ec8e3' },
  { id: 'consumable', label: '消耗品', icon: <Pill size={12} />, color: '#4ade80' },
  { id: 'rule', label: '规则类', icon: <Book size={12} />, color: '#f0c040' },
  { id: 'medium', label: '媒介类', icon: <Scroll size={12} />, color: '#7b2fbe' },
  { id: 'corrupted', label: '污染类', icon: <Skull size={12} />, color: '#c41e3a' },
];

const rarityEffects: Record<ItemRarity, { border: string; glow: string; bg: string; label: string }> = {
  common: { border: '#555', glow: 'transparent', bg: 'rgba(85,85,85,0.06)', label: '普通' },
  rare: { border: '#7ec8e3', glow: 'rgba(126,200,227,0.2)', bg: 'rgba(126,200,227,0.04)', label: '稀有' },
  epic: { border: '#7b2fbe', glow: 'rgba(123,47,190,0.3)', bg: 'rgba(123,47,190,0.06)', label: '史诗' },
  legendary: { border: '#f0c040', glow: 'rgba(240,192,64,0.4)', bg: 'rgba(240,192,64,0.06)', label: '传说' },
  corrupted: { border: '#c41e3a', glow: 'rgba(196,30,58,0.3)', bg: 'rgba(196,30,58,0.04)', label: '污染' },
};

export default function InventoryPanel() {
  const { state, openFloat } = useGame();
  const [tab, setTab] = useState<ItemCategory>('equipment');
  const items = state.inventory.filter(i => i.category === tab);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: 'rgba(126,200,227,0.06)', borderBottom: '1px solid rgba(126,200,227,0.12)', padding: '14px 18px' }}>
        <div style={{ color: '#7ec8e3', fontSize: 14, fontWeight: 'bold', letterSpacing: 4 }}>行囊仓库</div>
        <div style={{ color: 'rgba(126,200,227,0.4)', fontSize: 9 }}>INVENTORY MANAGEMENT</div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'auto' }}>
        {categoryTabs.map(cat => {
          const count = state.inventory.filter(i => i.category === cat.id).length;
          return (
            <button key={cat.id} onClick={() => setTab(cat.id)}
              style={{
                flex: 1, minWidth: 60, padding: '10px 6px', fontSize: 9, letterSpacing: 2, cursor: 'pointer',
                background: 'transparent', border: 'none', borderBottom: tab === cat.id ? `2px solid ${cat.color}` : '2px solid transparent',
                color: tab === cat.id ? cat.color : '#555', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
              }}>
              {cat.icon}
              <span>{cat.label}</span>
              <span style={{ fontSize: 8, color: tab === cat.id ? cat.color : '#444' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {items.map(item => (
            <ItemCard key={item.id} item={item} onClick={() => openFloat('item-detail', item)} />
          ))}
        </div>
        {items.length === 0 && <Empty text="此分类为空" />}
      </div>
    </div>
  );
}

function ItemCard({ item, onClick }: { item: InventoryItem; onClick: () => void }) {
  const fx = rarityEffects[item.rarity];
  return (
    <div onClick={onClick} className="glass" style={{
      padding: 12, borderRadius: 6, cursor: 'pointer', borderLeft: `2px solid ${fx.border}`,
      transition: 'all 0.2s ease-out', position: 'relative', overflow: 'hidden'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = `0 0 12px ${fx.glow}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ color: '#ccc', fontSize: 11, fontWeight: 'bold', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        {item.quantity > 1 && (
          <span style={{ background: fx.bg, border: `1px solid ${fx.border}33`, color: fx.border, fontSize: 9, padding: '1px 6px', borderRadius: 2, flexShrink: 0, marginLeft: 6 }}>x{item.quantity}</span>
        )}
      </div>
      <div style={{ color: '#666', fontSize: 8, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: fx.border, fontSize: 8, letterSpacing: 1, opacity: 0.7 }}>{fx.label}</span>
        {item.effect && <span style={{ color: '#4ade80', fontSize: 8, opacity: 0.7 }}>{item.effect}</span>}
      </div>
      {/* Rarity glow line */}
      {item.rarity !== 'common' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${fx.border}00, ${fx.border}, ${fx.border}00)` }} />
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ textAlign: 'center', padding: 40, color: '#444', fontSize: 11 }}>{text}</div>;
}
