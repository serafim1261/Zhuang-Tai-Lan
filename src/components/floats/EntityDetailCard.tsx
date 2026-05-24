import { ContractedEntity, Companion, NpcState, RANK_COLORS } from '../../types/game';
import { ShieldAlert, Skull, Heart, Zap, Eye } from 'lucide-react';

interface Props { data: ContractedEntity | Companion | NpcState; }

export default function EntityDetailCard({ data }: Props) {
  const isEntity = 'class' in data && 'bondStatus' in data;
  const isCompanion = 'role' in data && 'status' in data && !('location' in data);
  const isNpc = 'location' in data;

  if (isEntity) {
    const entity = data as ContractedEntity;
    const color = RANK_COLORS[entity.class];
    const statusColors: Record<string, string> = { active: '#4ade80', dormant: '#666', backlash: '#c41e3a' };
    const statusText: Record<string, string> = { active: '活跃', dormant: '沉睡', backlash: '反噬边缘' };
    return (
      <div style={{ padding: 20 }}>
        <div style={{ borderBottom: `2px solid ${color}33`, paddingBottom: 12, marginBottom: 16 }}>
          <div style={{ color: '#ccc', fontSize: 16, fontWeight: 'bold', marginBottom: 2 }}>{entity.codeName}</div>
          <div style={{ color: '#666', fontSize: 10 }}>{entity.trueName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[entity.bondStatus],
              animation: entity.bondStatus === 'backlash' ? 'pulse-dot 0.6s infinite' : entity.bondStatus === 'active' ? 'pulse-dot 2s infinite' : 'none' }} />
            <span style={{ color: statusColors[entity.bondStatus], fontSize: 10 }}>{statusText[entity.bondStatus]}</span>
            <span style={{ color: '#444', fontSize: 9 }}>|</span>
            <span style={{ color, fontSize: 10 }}>绑定于 {entity.boundSince}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <StatBox label="力量" value={entity.power} color="#c41e3a" icon={<Zap size={12} />} />
          <StatBox label="敏捷" value={entity.agility} color="#7ec8e3" icon={<Eye size={12} />} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#888', fontSize: 10, marginBottom: 6, letterSpacing: 2 }}>能力</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {entity.abilities.map(a => (
              <span key={a} style={{ padding: '3px 10px', background: `${color}15`, border: `1px solid ${color}33`, borderRadius: 3, color, fontSize: 9 }}>{a}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#888', fontSize: 10, marginBottom: 6, letterSpacing: 2 }}>SAN消耗</div>
          <div style={{ color: '#7b2fbe', fontSize: 14, fontWeight: 'bold' }}>{entity.sanCost} <span style={{ fontSize: 10, opacity: 0.6 }}>每次动用</span></div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 12 }}>
          <div style={{ color: '#c41e3a', fontSize: 10, opacity: 0.7 }}>代价：{entity.cost}</div>
        </div>

        <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 12 }}>
          <div style={{ color: '#888', fontSize: 10, marginBottom: 8, letterSpacing: 2 }}>内心低语</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {entity.innerThoughts.map((t, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'rgba(123,47,190,0.04)', borderLeft: '2px solid rgba(123,47,190,0.3)', borderRadius: 3, color: '#999', fontSize: 10, fontStyle: 'italic', lineHeight: 1.5 }}>"{t}"</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isCompanion) {
    const comp = data as Companion;
    return (
      <div style={{ padding: 20 }}>
        <div style={{ borderBottom: '2px solid rgba(126,200,227,0.2)', paddingBottom: 12, marginBottom: 16 }}>
          <div style={{ color: '#ccc', fontSize: 16, fontWeight: 'bold', marginBottom: 2 }}>{comp.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ color: '#7ec8e3', fontSize: 10 }}>{comp.role}</span>
            <span style={{ color: '#4ade80', fontSize: 10 }}>{comp.status}</span>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ color: '#888', fontSize: 10, marginBottom: 8, letterSpacing: 2 }}>内心独白</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {comp.innerThoughts.map((t, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'rgba(126,200,227,0.04)', borderLeft: '2px solid rgba(126,200,227,0.3)', borderRadius: 3, color: '#999', fontSize: 10, fontStyle: 'italic', lineHeight: 1.5 }}>"{t}"</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isNpc) {
    const npc = data as NpcState;
    return (
      <div style={{ padding: 20 }}>
        <div style={{ borderBottom: '2px solid rgba(240,192,64,0.2)', paddingBottom: 12, marginBottom: 16 }}>
          <div style={{ color: '#ccc', fontSize: 16, fontWeight: 'bold', marginBottom: 2 }}>{npc.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ color: '#f0c040', fontSize: 10 }}>{npc.role}</span>
            <span style={{ color: '#666', fontSize: 9 }}>{npc.location}</span>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ color: '#888', fontSize: 10, marginBottom: 8, letterSpacing: 2 }}>内心独白</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {npc.innerThoughts.map((t, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'rgba(240,192,64,0.04)', borderLeft: '2px solid rgba(240,192,64,0.3)', borderRadius: 3, color: '#999', fontSize: 10, fontStyle: 'italic', lineHeight: 1.5 }}>"{t}"</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function StatBox({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div style={{ padding: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color }}>{icon}</span>
      <div>
        <div style={{ color: '#888', fontSize: 8 }}>{label}</div>
        <div style={{ color, fontSize: 18, fontWeight: 'bold' }}>{value}</div>
      </div>
    </div>
  );
}
