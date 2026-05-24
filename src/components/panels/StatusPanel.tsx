import { useGame } from '../../context/GameContext';
import { RANK_COLORS, RANK_LABELS, RankTier } from '../../types/game';
import { Diamond } from 'lucide-react';

export default function StatusPanel() {
  const { state } = useGame();
  const p = state.player;
  const hpPct = p.hp / p.maxHp;
  const sanPct = p.san / p.maxSan;
  const rankColor = RANK_COLORS[p.rank];
  const rankLabel = RANK_LABELS[p.rank];
  const isLowHp = hpPct < 0.3;
  const isCriticalSan = sanPct < 0.4;

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 0, fontFamily: 'JetBrains Mono, monospace' }}>
      {/* Header */}
      <div style={{ background: 'rgba(196,30,58,0.06)', borderBottom: '1px solid rgba(196,30,58,0.12)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#c41e3a', fontSize: 14, fontWeight: 'bold', letterSpacing: 4 }}>界门终端</div>
          <div style={{ color: 'rgba(196,30,58,0.4)', fontSize: 9 }}>GATE TERMINAL // STATUS</div>
        </div>
        <div style={{ color: 'rgba(126,200,227,0.5)', fontSize: 8, textAlign: 'right' }}>SESSION<br /><span style={{ color: '#7ec8e3' }}>ACTIVE</span></div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* HP Section */}
        <Section title="躯体生命" subtitle="HP" color="#c41e3a" value={p.hp} max={p.maxHp} pct={hpPct} isLowHp={isLowHp}>
          <ECGWave chaotic={isLowHp} color="#c41e3a" />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444', fontSize: 7, marginTop: 4 }}>
            <span>BP: {isLowHp ? '128 ↑' : '72'}</span>
            <span>HRV: {isLowHp ? '12ms ↓' : '43ms'}</span>
            <span>SpO2: {isLowHp ? '91%' : '98%'}</span>
          </div>
        </Section>

        {/* SAN Section */}
        <Section title="精神理智" subtitle="SAN" color="#7b2fbe" value={p.san} max={p.maxSan} pct={sanPct} isCriticalSan={isCriticalSan}>
          <SANWave chaotic={isCriticalSan} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444', fontSize: 7, marginTop: 4 }}>
            <span>θ波: {isCriticalSan ? '18% ↓↓' : '37%'}</span>
            <span>δ波: {isCriticalSan ? '78% ↑↑' : '52%'}</span>
            {isCriticalSan && <span style={{ color: '#c41e3a' }}>⚠ 临界警告</span>}
          </div>
        </Section>

        {/* Rank + Currency */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ color: '#666', fontSize: 8, letterSpacing: 2 }}>当前阶位</div>
            <RankBadge rank={p.rank} />
            <div style={{ color: rankColor, fontSize: 10, letterSpacing: 3, opacity: 0.6 }}>{rankLabel}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ color: '#666', fontSize: 8, letterSpacing: 2 }}>诡币余额</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Diamond size={16} color="#f0c040" />
              <span style={{ color: '#f0c040', fontSize: 20, fontWeight: 'bold' }}>{p.currency.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Zone + Danger */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#666', fontSize: 8, letterSpacing: 2, marginBottom: 4 }}>当前征召区域</div>
              <div style={{ color: '#ccc', fontSize: 13 }}>{state.world.currentZone}</div>
              <div style={{ color: 'rgba(204,204,204,0.3)', fontSize: 8 }}>危险等级监控</div>
            </div>
            <DangerBar level={state.world.dangerLevel} />
          </div>
        </div>

        {/* Erosion */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <ErosionRing pct={p.erosion / 100} />
          <div>
            <div style={{ color: '#888', fontSize: 10, letterSpacing: 2 }}>侵蚀度</div>
            <div style={{ color: 'rgba(123,47,190,0.5)', fontSize: 8 }}>EROSION · {p.erosion < 30 ? '轻度' : p.erosion < 60 ? '中度' : '重度'}</div>
            <div style={{ color: '#666', fontSize: 8, marginTop: 4 }}>距下次侵蚀检定: 3次征召</div>
          </div>
        </div>

        {/* 6 Attributes */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: 14 }}>
          <div style={{ color: '#666', fontSize: 8, letterSpacing: 2, marginBottom: 10 }}>行契者属性</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <AttrItem label="体质" value={p.constitution} />
            <AttrItem label="精神" value={p.spirit} />
            <AttrItem label="灵感" value={p.inspiration} />
            <AttrItem label="敏捷" value={p.agility} />
            <AttrItem label="意志" value={p.willpower} />
            <AttrItem label="阴契" value={p.contractPower} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, color, value, max, pct, isDanger, children }: {
  title: string; subtitle: string; color: string; value: number; max: number; pct: number; children: React.ReactNode;
  isLowHp?: boolean; isCriticalSan?: boolean; isDanger?: boolean;
}) {
  const danger = pct < 0.3 || (subtitle === 'SAN' && pct < 0.4);
  return (
    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {subtitle === 'HP' ? <div style={{ width: 8, height: 8, background: color, clipPath: 'polygon(50% 0,100% 100%,0 100%)' }} /> :
            <div style={{ width: 8, height: 8, border: `1.5px solid ${color}`, transform: 'rotate(45deg)' }} />}
          <span style={{ color: '#888', fontSize: 10, letterSpacing: 2 }}>{title}</span>
          <span style={{ color: '#666', fontSize: 8 }}>{subtitle}</span>
          {danger && <span style={{ color: '#c41e3a', fontSize: 8, animation: 'pulse-dot 1s infinite' }}>⚠</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ color, fontSize: 26, fontWeight: 'bold' }}>{value}</span>
          <span style={{ color: `${color}66`, fontSize: 11 }}>/ {max}</span>
        </div>
      </div>
      <div style={{ height: 4, background: `${color}1a`, borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 2, transition: 'width 0.6s ease-out' }}>
          {danger && <div style={{ width: '100%', height: '100%', animation: 'pulse-dot 0.8s infinite', background: 'rgba(255,255,255,0.2)' }} />}
        </div>
      </div>
      {children}
    </div>
  );
}

function ECGWave({ chaotic, color }: { chaotic: boolean; color: string }) {
  const normalPath = 'M 0 14 L 40 14 L 48 14 L 52 8 L 56 22 L 60 14 L 80 14 L 88 14 L 92 4 L 96 26 L 100 14 L 120 14 L 128 14 L 132 10 L 136 20 L 140 14 L 160 14 L 168 14 L 172 6 L 176 24 L 180 14 L 200 14 L 208 14 L 212 12 L 216 18 L 220 14 L 240 14 L 248 14 L 252 8 L 256 22 L 260 14 L 280 14';
  const chaosPath = 'M 0 10 L 10 10 L 15 3 L 18 18 L 20 6 L 22 15 L 25 2 L 28 19 L 30 5 L 33 17 L 35 8 L 38 16 L 40 3 L 43 20 L 45 4 L 48 18 L 50 7 L 55 14 L 58 2 L 60 19 L 62 5 L 65 17 L 68 3 L 70 20 L 72 6 L 75 18 L 78 4 L 80 12 L 85 2 L 88 19 L 90 7 L 95 15 L 98 1 L 100 20 L 105 5 L 108 19 L 110 3 L 115 14 L 118 2 L 120 18 L 125 6 L 128 16 L 130 4 L 135 20 L 140 10 L 200 10 L 210 8 L 215 3 L 218 19 L 220 5 L 225 14 L 230 10 L 240 10 L 250 8 L 255 3 L 258 19 L 260 5 L 280 10';

  return (
    <svg width="100%" height="24" viewBox="0 0 280 24">
      <path d={chaotic ? chaosPath : normalPath} fill="none" stroke={color} strokeWidth="1.2" opacity={chaotic ? 0.8 : 0.6}>
        {chaotic && <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.6s" repeatCount="indefinite" />}
      </path>
    </svg>
  );
}

function SANWave({ chaotic }: { chaotic: boolean }) {
  return (
    <svg width="100%" height="24" viewBox="0 0 280 24">
      <path d="M 0 12 L 20 12 L 30 12 L 35 16 L 38 7 L 42 14 L 45 18 L 48 6 L 52 13 L 60 12 L 70 12 L 78 11 L 82 20 L 86 4 L 90 15 L 98 12 L 108 12 L 116 13 L 120 8 L 124 19 L 128 11 L 140 12 L 150 12 L 158 14 L 162 6 L 166 22 L 170 10 L 178 12 L 190 12 L 200 13 L 208 9 L 212 21 L 216 7 L 220 14 L 230 12 L 240 12 L 250 11 L 258 16 L 262 5 L 266 15 L 280 12"
        fill="none" stroke="rgba(123,47,190,0.6)" strokeWidth="1" opacity={chaotic ? 0.5 : 0.6}>
        {chaotic && <animate attributeName="opacity" values="0.5;0.9;0.3;0.7;0.5" dur="0.4s" repeatCount="indefinite" />}
      </path>
    </svg>
  );
}

function RankBadge({ rank }: { rank: RankTier }) {
  const color = RANK_COLORS[rank];
  const isHighRank = rank === 'gold' || rank === 'red';
  return (
    <svg viewBox="0 0 52 52" width="52" height="52">
      <circle cx="26" cy="26" r="22" fill="none" stroke={`${color}26`} strokeWidth="0.8" />
      <circle cx="26" cy="26" r="22" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="138" strokeDashoffset="35">
        <animate attributeName="stroke-dashoffset" values="35;42;35" dur="3s" repeatCount="indefinite" />
      </circle>
      {isHighRank && (
        <circle cx="26" cy="26" r="22" fill="none" stroke={`${color}26`} strokeWidth="0.6" strokeDasharray="20 8">
          <animate attributeName="stroke-dashoffset" values="0;28" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx="26" cy="26" r="14" fill="none" stroke={`${color}15`} strokeWidth="0.5" />
      <text x="26" y="31" fill={color} fontSize="18" textAnchor="middle" opacity="0.8">◈</text>
    </svg>
  );
}

function DangerBar({ level }: { level: number }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ display: 'flex', gap: 3, marginBottom: 4, justifyContent: 'flex-end' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ width: 10, height: 16, background: i <= level ? '#c41e3a' : 'rgba(196,30,58,0.15)', borderRadius: 1, transition: 'background 0.3s' }} />
        ))}
      </div>
      <span style={{ color: '#c41e3a', fontSize: 10, fontWeight: 'bold' }}>{['', 'Ⅰ · 安全', 'Ⅱ · 警戒', 'Ⅲ · 危险', 'Ⅳ · 高危', 'Ⅴ · 致命'][level]}</span>
    </div>
  );
}

function ErosionRing({ pct }: { pct: number }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference * (1 - pct);
  return (
    <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
      <svg viewBox="0 0 44 44" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle cx="22" cy="22" r="18" fill="none" stroke="#7b2fbe" strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#7b2fbe', fontSize: 11, fontWeight: 'bold' }}>{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}

function AttrItem({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.01)', borderRadius: 3 }}>
      <span style={{ color: '#888', fontSize: 10 }}>{label}</span>
      <span style={{ color: '#ccc', fontSize: 12, fontWeight: 'bold' }}>{value}</span>
    </div>
  );
}
