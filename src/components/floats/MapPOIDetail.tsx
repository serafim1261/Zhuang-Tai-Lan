import { SubMapNode, NodeThreat } from '../../types/game';

const threatColors: Record<NodeThreat, string> = {
  safe: '#4ade80', low: '#7ec8e3', medium: '#f0c040', high: '#c41e3a', s_rank: '#ff4444', unknown: '#444'
};

const threatLabels: Record<NodeThreat, string> = {
  safe: '安全', low: '低风险', medium: '中风险', high: '高风险', s_rank: 'S级', unknown: '未知'
};

export default function MapPOIDetail({ data }: { data: SubMapNode }) {
  const color = threatColors[data.threat];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ borderBottom: `2px solid ${color}33`, paddingBottom: 12, marginBottom: 16 }}>
        <div style={{ color: '#ccc', fontSize: 16, fontWeight: 'bold', marginBottom: 2 }}>{data.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
          <span style={{ color, fontSize: 10 }}>{threatLabels[data.threat]}</span>
          {data.isNew && <span style={{ color: '#f0c040', fontSize: 9, padding: '1px 6px', background: 'rgba(240,192,64,0.1)', border: '1px solid rgba(240,192,64,0.2)', borderRadius: 2 }}>NEW</span>}
          {!data.isDiscovered && <span style={{ color: '#444', fontSize: 9 }}>未探明</span>}
        </div>
      </div>

      <div style={{ padding: 12, background: 'rgba(255,255,255,0.015)', borderRadius: 4, marginBottom: 16 }}>
        <div style={{ color: '#888', fontSize: 10, lineHeight: 1.6 }}>{data.description}</div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 12, marginBottom: 16 }}>
        <div style={{ color: '#666', fontSize: 9, letterSpacing: 1, marginBottom: 8 }}>坐标信息</div>
        <div style={{ color: '#888', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}>
          X: {data.x.toFixed(1)} · Y: {data.y.toFixed(1)}
        </div>
      </div>

      <button className="glass" style={{
        width: '100%', padding: '12px 0', border: `1px solid ${color}33`, borderRadius: 4,
        background: `${color}10`, color, fontSize: 12, cursor: 'pointer', letterSpacing: 3,
        transition: 'all 0.2s'
      }}
        onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; }}>
        前往探索
      </button>
    </div>
  );
}
