import { useGame } from '../../context/GameContext';
import { ContractedEntity, Companion, NpcState } from '../../types/game';
import { RANK_COLORS } from '../../types/game';
import { useState } from 'react';

export default function ContractPanel() {
  const { state, openFloat } = useGame();
  const [tab, setTab] = useState<'entities' | 'companions' | 'npcs'>('entities');
  const { entities, companions, activeNpcs } = state.contracts;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: 'rgba(123,47,190,0.06)', borderBottom: '1px solid rgba(123,47,190,0.12)', padding: '14px 18px' }}>
        <div style={{ color: '#7b2fbe', fontSize: 14, fontWeight: 'bold', letterSpacing: 4 }}>阴契管理</div>
        <div style={{ color: 'rgba(123,47,190,0.4)', fontSize: 9 }}>CONTRACT MANAGEMENT</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {(['entities', 'companions', 'npcs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px 0', fontSize: 10, letterSpacing: 2, cursor: 'pointer',
              background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid #7b2fbe' : '2px solid transparent',
              color: tab === t ? '#7b2fbe' : '#555', transition: 'all 0.2s'
            }}>
            {{ entities: '契约诡异', companions: '同伴', npcs: '当前角色' }[t]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {tab === 'entities' && entities.map(e => (
          <EntityCard key={e.id} entity={e} onClick={() => openFloat('entity-detail', e)} />
        ))}
        {tab === 'entities' && entities.length === 0 && <Empty text="无活跃阴契链接" />}

        {tab === 'companions' && companions.map(c => (
          <CompanionCard key={c.id} companion={c} onClick={() => openFloat('entity-detail', c)} />
        ))}
        {tab === 'companions' && companions.length === 0 && <Empty text="无同行同伴" />}

        {tab === 'npcs' && activeNpcs.map(n => (
          <NpcCard key={n.id} npc={n} onClick={() => openFloat('entity-detail', n)} />
        ))}
        {tab === 'npcs' && activeNpcs.length === 0 && <Empty text="当前无其他角色" />}
      </div>
    </div>
  );
}

function EntityCard({ entity, onClick }: { entity: ContractedEntity; onClick: () => void }) {
  const color = RANK_COLORS[entity.class];
  const statusColors = { active: '#4ade80', dormant: '#666', backlash: '#c41e3a' };
  const statusText = { active: '活跃', dormant: '沉睡', backlash: '反噬边缘' };
  return (
    <div onClick={onClick} className="glass" style={{
      padding: 14, borderRadius: 6, marginBottom: 10, cursor: 'pointer',
      borderLeft: `3px solid ${color}`,
      transition: 'all 0.2s ease-out',
      position: 'relative', overflow: 'hidden'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 0 16px ${color}33`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
      {/* Gradient border animation */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, ${color}, ${color}44, ${color})`,
        backgroundSize: '200% 100%', animation: 'border-flow 3s linear infinite'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ color: '#ccc', fontSize: 13, fontWeight: 'bold' }}>{entity.codeName}</div>
          <div style={{ color: '#666', fontSize: 9, marginTop: 2 }}>{entity.trueName}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[entity.bondStatus],
            animation: entity.bondStatus === 'backlash' ? 'pulse-dot 0.6s infinite' : entity.bondStatus === 'active' ? 'pulse-dot 2s infinite' : 'none' }} />
          <span style={{ color: statusColors[entity.bondStatus], fontSize: 8 }}>{statusText[entity.bondStatus]}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 9 }}>
        <span style={{ color: '#888' }}>力量: <span style={{ color: '#ccc' }}>{entity.power}</span></span>
        <span style={{ color: '#888' }}>敏捷: <span style={{ color: '#ccc' }}>{entity.agility}</span></span>
        <span style={{ color: '#888' }}>SAN消耗: <span style={{ color: '#ccc' }}>{entity.sanCost}</span></span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {entity.abilities.map(a => (
          <span key={a} style={{ padding: '2px 8px', background: `${color}15`, border: `1px solid ${color}33`, borderRadius: 2, color, fontSize: 8 }}>{a}</span>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8 }}>
        <span style={{ color: '#c41e3a', fontSize: 8, opacity: 0.7 }}>代价：{entity.cost}</span>
      </div>
    </div>
  );
}

function CompanionCard({ companion, onClick }: { companion: Companion; onClick: () => void }) {
  return (
    <div onClick={onClick} className="glass" style={{
      padding: 14, borderRadius: 6, marginBottom: 10, cursor: 'pointer',
      borderLeft: '3px solid #7ec8e3', transition: 'all 0.2s ease-out'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#ccc', fontSize: 13, fontWeight: 'bold' }}>{companion.name}</div>
          <div style={{ color: '#7ec8e3', fontSize: 9, opacity: 0.6 }}>{companion.role}</div>
        </div>
        <span style={{ color: '#4ade80', fontSize: 9 }}>{companion.status}</span>
      </div>
      <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8 }}>
        <span style={{ color: '#666', fontSize: 9, fontStyle: 'italic' }}>"{companion.innerThoughts[0].slice(0, 60)}..."</span>
      </div>
    </div>
  );
}

function NpcCard({ npc, onClick }: { npc: NpcState; onClick: () => void }) {
  return (
    <div onClick={onClick} className="glass" style={{
      padding: 14, borderRadius: 6, marginBottom: 10, cursor: 'pointer',
      borderLeft: '3px solid #f0c040', transition: 'all 0.2s ease-out'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
      <div style={{ color: '#ccc', fontSize: 13, fontWeight: 'bold' }}>{npc.name}</div>
      <div style={{ color: '#888', fontSize: 9 }}>{npc.role} · {npc.location}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ textAlign: 'center', padding: 40, color: '#444', fontSize: 11 }}>{text}</div>;
}
