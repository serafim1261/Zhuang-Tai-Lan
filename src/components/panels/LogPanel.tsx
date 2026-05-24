import { useGame } from '../../context/GameContext';
import { LogEntry } from '../../types/game';
import { useState } from 'react';
import { Circle } from 'lucide-react';

const resultConfig: Record<string, { color: string; label: string }> = {
  success: { color: '#4ade80', label: '完成' },
  failure: { color: '#c41e3a', label: '失败' },
  escape: { color: '#7ec8e3', label: '逃离' },
  ongoing: { color: '#f0c040', label: '进行中' },
};

export default function LogPanel() {
  const { state } = useGame();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: 'rgba(136,136,136,0.06)', borderBottom: '1px solid rgba(136,136,136,0.12)', padding: '14px 18px' }}>
        <div style={{ color: '#888', fontSize: 14, fontWeight: 'bold', letterSpacing: 4 }}>幽墟日志</div>
        <div style={{ color: 'rgba(136,136,136,0.4)', fontSize: 9 }}>ABYSS LOGS // TIMELINE</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px 12px 28px' }}>
        {/* Timeline line */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: -13, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.05)' }} />

          {state.log.map(entry => {
            const expanded = expandedId === entry.id;
            const cfg = resultConfig[entry.result];
            return (
              <div key={entry.id} style={{ position: 'relative', marginBottom: 16 }}>
                {/* Timeline dot */}
                <div style={{ position: 'absolute', left: -17, top: 4, zIndex: 2 }}>
                  {entry.isRead ? (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, opacity: 0.5 }} />
                  ) : (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}`, animation: 'pulse-dot 2s infinite' }} />
                  )}
                </div>

                <div onClick={() => { if (!entry.isRead) entry.isRead = true; setExpandedId(expanded ? null : entry.id); }}
                  className="glass" style={{
                    padding: 14, borderRadius: 6, cursor: 'pointer', borderLeft: `2px solid ${cfg.color}33`,
                    transition: 'all 0.2s ease-out'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ color: '#666', fontSize: 9 }}>{entry.date}</div>
                    <span style={{ color: cfg.color, fontSize: 9, padding: '1px 8px', background: `${cfg.color}15`, borderRadius: 2 }}>{cfg.label}</span>
                  </div>
                  <div style={{ color: '#ccc', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>{entry.title}</div>
                  <div style={{ color: '#888', fontSize: 9, opacity: 0.6 }}>{entry.zone}</div>

                  {expanded && (
                    <div style={{ marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 10, animation: 'fade-in-up 0.3s ease-out' }}>
                      <div style={{ color: '#999', fontSize: 10, lineHeight: 1.6, marginBottom: 10 }}>{entry.summary}</div>
                      {entry.choices.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {entry.choices.map((c, i) => (
                            <span key={i} style={{ padding: '2px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, color: '#888', fontSize: 9 }}>{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
