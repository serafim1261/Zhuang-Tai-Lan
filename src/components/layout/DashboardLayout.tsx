import { useGame } from '../../context/GameContext';
import { PanelType } from '../../types/game';
import { Activity, Swords, Backpack, MessageCircle, Map, User, ScrollText } from 'lucide-react';
import StatusPanel from '../panels/StatusPanel';
import ContractPanel from '../panels/ContractPanel';
import InventoryPanel from '../panels/InventoryPanel';
import ForumPanel from '../panels/ForumPanel';
import MapPanel from '../panels/MapPanel';
import ProfilePanel from '../panels/ProfilePanel';
import LogPanel from '../panels/LogPanel';
import FloatManager from '../floats/FloatManager';
import OverlayManager from '../overlays/OverlayManager';
import ToastContainer from '../ui/Toast';
import React from 'react';

const navItems: { id: PanelType; icon: typeof Activity; label: string; color: string }[] = [
  { id: 'status', icon: Activity, label: '终端', color: '#c41e3a' },
  { id: 'contracts', icon: Swords, label: '契约', color: '#7b2fbe' },
  { id: 'inventory', icon: Backpack, label: '行囊', color: '#7ec8e3' },
  { id: 'forum', icon: MessageCircle, label: '论坛', color: '#f0c040' },
  { id: 'map', icon: Map, label: '地图', color: '#4ade80' },
  { id: 'profile', icon: User, label: '档案', color: '#7ec8e3' },
  { id: 'log', icon: ScrollText, label: '日志', color: '#888888' },
];

const panelComponents: Record<PanelType, React.ComponentType> = {
  status: StatusPanel, contracts: ContractPanel, inventory: InventoryPanel,
  forum: ForumPanel, map: MapPanel, profile: ProfilePanel, log: LogPanel,
};

export default function DashboardLayout() {
  const { state, setPanel } = useGame();
  const active = state.ui.activePanel;

  return (
    <div className="dashboard-root">
      {/* Top nav bar */}
      <nav style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0,
        padding: '6px 8px', background: '#0a0a14', borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 10, overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', msOverflowStyle: 'none'
      }}>
        {/* Logo — hide on very narrow screens */}
        <div className="nav-logo" style={{
          width: 30, height: 30, border: '1.5px solid #c41e3a', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 8, background: 'rgba(196,30,58,0.1)', flexShrink: 0
        }}>
          <span style={{ color: '#c41e3a', fontSize: 15, fontWeight: 'bold' }}>門</span>
        </div>

        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPanel(item.id)}
            title={item.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px',
              borderRadius: 4, cursor: 'pointer', transition: 'all 200ms ease-out',
              background: active === item.id ? 'rgba(255,255,255,0.06)' : 'transparent',
              border: 'none', color: active === item.id ? item.color : '#555',
              fontSize: 11, letterSpacing: 1, fontFamily: 'inherit',
              position: 'relative', flexShrink: 0, minWidth: 32, minHeight: 36,
              whiteSpace: 'nowrap'
            }}
          >
            <item.icon size={16} />
            <span className="nav-label" style={{ opacity: active === item.id ? 1 : 0.6 }}>{item.label}</span>
            {active === item.id && (
              <div style={{
                position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
                width: 18, height: 2, background: item.color, borderRadius: 1
              }} />
            )}
          </button>
        ))}

        {/* Spacer + SAN indicator */}
        <div style={{ flex: '1 0 8px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingRight: 4 }}>
          <span className="nav-label" style={{ color: '#666', fontSize: 9, letterSpacing: 1, whiteSpace: 'nowrap' }}>
            {state.player.codeName}
          </span>
          {state.ui.sanCrisisLevel > 0 && (
            <div style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: `rgba(123,47,190,${0.3 + state.ui.sanCrisisLevel * 0.7})`,
              border: `1px solid rgba(123,47,190,${0.4 + state.ui.sanCrisisLevel * 0.6})`,
              animation: 'pulse-dot 1.5s infinite'
            }} />
          )}
        </div>
      </nav>

      {/* Main content area */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {React.createElement(panelComponents[active])}
        <FloatManager />
        <OverlayManager />
        <ToastContainer />
      </main>
    </div>
  );
}
