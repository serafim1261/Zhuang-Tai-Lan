import { useGame } from '../../context/GameContext';
import { RANK_COLORS } from '../../types/game';

export default function ProfilePanel() {
  const { state } = useGame();
  const p = state.player;
  const rankColor = RANK_COLORS[p.rank];

  const stats = [
    { label: '体质', value: p.constitution, sub: '影响HP上限与物理抗性' },
    { label: '精神', value: p.spirit, sub: '影响SAN上限与精神抗性' },
    { label: '灵感', value: p.inspiration, sub: '影响异常发现与隐匿感知' },
    { label: '敏捷', value: p.agility, sub: '影响回避率与行动速度' },
    { label: '意志', value: p.willpower, sub: '影响SAN恢复与侵蚀抵抗' },
    { label: '阴契', value: p.contractPower, sub: '影响契约实体强度与共鸣' },
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ background: 'rgba(126,200,227,0.06)', borderBottom: '1px solid rgba(126,200,227,0.12)', padding: '14px 18px' }}>
        <div style={{ color: '#7ec8e3', fontSize: 14, fontWeight: 'bold', letterSpacing: 4 }}>行契者档案</div>
        <div style={{ color: 'rgba(126,200,227,0.4)', fontSize: 9 }}>CONTRACTOR PROFILE</div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Identity */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: `2px solid ${rankColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: rankColor }}>{p.codeName}</div>
            <div>
              <div style={{ color: '#ccc', fontSize: 14, fontWeight: 'bold' }}>{p.name}</div>
              <div style={{ color: '#666', fontSize: 10 }}>代号：{p.codeName} · {p.profession}</div>
            </div>
          </div>
          <div style={{ color: '#666', fontSize: 9, letterSpacing: 1 }}>
            加入日期：{p.joinedAt} · 侵蚀度：{p.erosion}%
          </div>
        </div>

        {/* 6 Attributes */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: 16 }}>
          <div style={{ color: '#666', fontSize: 8, letterSpacing: 2, marginBottom: 12 }}>行契者属性</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#888', fontSize: 10, width: 36, flexShrink: 0 }}>{s.label}</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(s.value / 10) * 100}%`, background: `linear-gradient(90deg, ${rankColor}66, ${rankColor})`, borderRadius: 2, transition: 'width 0.6s ease-out' }} />
                </div>
                <span style={{ color: '#ccc', fontSize: 13, fontWeight: 'bold', width: 16, textAlign: 'right' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills section */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: 16 }}>
          <div style={{ color: '#666', fontSize: 8, letterSpacing: 2, marginBottom: 12 }}>能力树</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { name: '灵视感知', level: 3, desc: '感知幽墟波动与诡异存在' },
              { name: '契约共鸣', level: 2, desc: '加深与契约实体的联系' },
              { name: '幽墟生存', level: 4, desc: '在幽墟中维持理智与方向' },
              { name: '灵纹刻印', level: 2, desc: '制作与使用灵纹符咒' },
            ].map(skill => (
              <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(255,255,255,0.01)', borderRadius: 3 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i <= skill.level ? '#7ec8e3' : 'rgba(255,255,255,0.06)' }} />
                  ))}
                </div>
                <div>
                  <div style={{ color: '#ccc', fontSize: 10 }}>{skill.name}</div>
                  <div style={{ color: '#555', fontSize: 8 }}>{skill.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission history */}
        <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4, padding: 16 }}>
          <div style={{ color: '#666', fontSize: 8, letterSpacing: 2, marginBottom: 12 }}>征召记录</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ade80', fontSize: 22, fontWeight: 'bold' }}>{p.missions.success}</div>
              <div style={{ color: '#666', fontSize: 9 }}>成功</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#c41e3a', fontSize: 22, fontWeight: 'bold' }}>{p.missions.failure}</div>
              <div style={{ color: '#666', fontSize: 9 }}>失败</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#7ec8e3', fontSize: 22, fontWeight: 'bold' }}>{p.missions.escape}</div>
              <div style={{ color: '#666', fontSize: 9 }}>逃离</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
