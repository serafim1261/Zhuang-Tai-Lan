import { useGame } from '../../context/GameContext';
import { MapNode, SubMapNode, NodeThreat } from '../../types/game';
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import { useState, useRef, useCallback, useMemo, WheelEvent, TouchEvent } from 'react';

const threatColors: Record<NodeThreat, string> = {
  safe: '#4ade80', low: '#7ec8e3', medium: '#f0c040', high: '#c41e3a', s_rank: '#ff4444', unknown: '#444'
};

const threatLabels: Record<NodeThreat, string> = {
  safe: '安全', low: '低风险', medium: '中风险', high: '高风险', s_rank: 'S级', unknown: '未知'
};

const ringColors: Record<string, string> = { inner: 'rgba(74,222,128,0.15)', buffer: 'rgba(126,200,227,0.12)', outer: 'rgba(196,30,58,0.1)' };
const ringStrokes: Record<string, string> = { inner: 'rgba(74,222,128,0.2)', buffer: 'rgba(126,200,227,0.18)', outer: 'rgba(196,30,58,0.15)' };

export default function MapPanel() {
  const { state, dispatch, openFloat } = useGame();
  const [zoom, setZoom] = useState(1);
  const { world } = state;
  const selectedNode = world.mapNodes.find(n => n.id === world.selectedRegionId);

  const goToRegion = (node: MapNode) => {
    dispatch({ type: 'SET_MAP_LAYER', layer: 'region', regionId: node.id });
  };

  const goBack = () => {
    dispatch({ type: 'SET_MAP_LAYER', layer: 'global', regionId: null, poiId: null });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: 'rgba(74,222,128,0.06)', borderBottom: '1px solid rgba(74,222,128,0.12)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {world.currentMapLayer !== 'global' && (
            <button onClick={goBack} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', gap: 4, minWidth: 36, minHeight: 36 }}>
              <ChevronLeft size={16} />
            </button>
          )}
          <div>
            <div style={{ color: '#4ade80', fontSize: 13, fontWeight: 'bold', letterSpacing: 3 }}>
              {world.currentMapLayer === 'global' ? '幽墟地图' : selectedNode?.name || '区域详情'}
            </div>
            <div style={{ color: 'rgba(74,222,128,0.4)', fontSize: 8 }}>VOID MAP // {zoom.toFixed(1)}x</div>
          </div>
        </div>
        {/* Zoom buttons — supplementary to wheel/pinch */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
            style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, color: '#888', cursor: 'pointer', fontSize: 16 }}>
            <Minus size={16} />
          </button>
          <button onClick={() => setZoom(z => Math.min(2.0, z + 0.1))}
            style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, color: '#888', cursor: 'pointer', fontSize: 16 }}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      {world.currentMapLayer === 'global' ? (
        <GlobalMap nodes={world.mapNodes} zoom={zoom} setZoom={setZoom} onNodeClick={goToRegion} />
      ) : selectedNode ? (
        <RegionMap node={selectedNode} onSubNodeClick={(sub) => openFloat('map-poi', sub)} />
      ) : null}
    </div>
  );
}

function GlobalMap({ nodes, zoom, setZoom, onNodeClick }: { nodes: MapNode[]; zoom: number; setZoom: (cb: (z: number) => number) => void; onNodeClick: (n: MapNode) => void }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [ambiguous, setAmbiguous] = useState<{ nodes: MapNode[]; cx: number; cy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPinchDist = useRef<number>(0);
  const viewSize = 520 / zoom;
  const center = 260;

  // Smart click: find all nodes near the click point in viewBox coords
  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    const threshold = 28 / zoom;
    const nearby = nodes.filter(n => {
      return Math.hypot(n.x - svgPt.x, n.y - svgPt.y) < threshold;
    }).sort((a, b) => {
      return Math.hypot(a.x - svgPt.x, a.y - svgPt.y) - Math.hypot(b.x - svgPt.x, b.y - svgPt.y);
    });
    if (nearby.length === 1) {
      onNodeClick(nearby[0]);
    } else if (nearby.length > 1) {
      setAmbiguous({ nodes: nearby, cx: e.clientX, cy: e.clientY });
    } else {
      setAmbiguous(null);
    }
  }, [nodes, zoom, onNodeClick]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(z => Math.max(0.4, Math.min(2.0, z + delta)));
  }, [setZoom]);

  // Pinch-to-zoom
  const getTouchDist = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      lastPinchDist.current = getTouchDist(e.touches);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getTouchDist(e.touches);
      if (lastPinchDist.current > 0) {
        const scale = dist / lastPinchDist.current;
        setZoom(z => Math.max(0.4, Math.min(2.0, z * scale)));
      }
      lastPinchDist.current = dist;
    }
  }, [setZoom]);

  const handleTouchEnd = useCallback(() => {
    lastPinchDist.current = 0;
  }, []);

  return (
    <div ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        flex: 1, overflow: 'auto', background: 'rgba(4,4,8,0.6)', position: 'relative',
        touchAction: 'none', overscrollBehavior: 'none'
      }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 2px, transparent 2px, transparent 4px)', zIndex: 2 }} />
      <div style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', overflow: 'hidden' }}>
        <svg viewBox={`${center - viewSize / 2} ${center - viewSize / 2} ${viewSize} ${viewSize}`} width="100%" height="100%" style={{ transition: 'all 0.2s ease-out' }} onClick={handleSvgClick}>
          {/* Concentric rings */}
          {['inner', 'buffer', 'outer'].map((ring, i) => {
            const r = 100 + i * 80;
            return (
              <g key={ring}>
                <circle cx={center} cy={center} r={r} fill="none" stroke={ringStrokes[ring]} strokeWidth={0.8} strokeDasharray="6 4" opacity={0.6}>
                  <animate attributeName="stroke-dashoffset" values="0;20" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx={center} cy={center} r={r} fill={ringColors[ring]} opacity={0.3} />
              </g>
            );
          })}

          {/* Sector dividers */}
          <line x1={center} y1={40} x2={center} y2={480} stroke="rgba(255,255,255,0.04)" strokeWidth={0.6} strokeDasharray="3 6" />
          <line x1={40} y1={center} x2={480} y2={center} stroke="rgba(255,255,255,0.04)" strokeWidth={0.6} strokeDasharray="3 6" />
          <line x1={center + 100} y1={center - 160} x2={center - 100} y2={center + 160} stroke="rgba(255,255,255,0.02)" strokeWidth={0.4} />
          <line x1={center - 100} y1={center - 160} x2={center + 100} y2={center + 160} stroke="rgba(255,255,255,0.02)" strokeWidth={0.4} />

          {/* Zone labels */}
          <text x={center} y={60} fill="rgba(255,255,255,0.08)" fontSize={10} textAnchor="middle">北·镜渊</text>
          <text x={center} y={478} fill="rgba(255,255,255,0.08)" fontSize={10} textAnchor="middle">南·骨海</text>
          <text x={60} y={center + 4} fill="rgba(255,255,255,0.08)" fontSize={10} textAnchor="middle">西·死兆回廊</text>
          <text x={460} y={center + 4} fill="rgba(255,255,255,0.08)" fontSize={10} textAnchor="middle">东·血月平原</text>

          {/* Grid lines */}
          {[80, 160, 240, 320, 400].map(pos => (
            <g key={pos}>
              <line x1={pos} y1={30} x2={pos} y2={490} stroke="rgba(255,255,255,0.015)" strokeWidth={0.4} />
              <line x1={30} y1={pos} x2={490} y2={pos} stroke="rgba(255,255,255,0.015)" strokeWidth={0.4} />
            </g>
          ))}

          {/* Map nodes */}
          {nodes.map(node => {
            const isHovered = hoveredNode === node.id;
            const color = threatColors[node.threat];
            const r = node.subNodes.length > 0 ? 10 : 6;
            return (
              <g key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}>
                {/* Glow ring on hover */}
                {isHovered && (
                  <circle cx={node.x} cy={node.y} r={r + 10} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4}>
                    <animate attributeName="r" values={`${r + 10};${r + 18};${r + 10}`} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.08;0.4" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Node body */}
                <circle cx={node.x} cy={node.y} r={r} fill={`${color}22`} stroke={color} strokeWidth={isHovered ? 2 : 1} opacity={node.isDiscovered ? 1 : 0.3}>
                  {node.isNew && <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />}
                </circle>
                {node.subNodes.length > 0 && <circle cx={node.x} cy={node.y} r={2.5} fill={color} opacity={0.7} />}
                {/* NEW badge — opacity-only animation to avoid SVG position drift */}
                {node.isNew && (
                  <text x={node.x} y={node.y - r - 8} fill={color} fontSize={7} fontWeight="bold" textAnchor="middle" style={{ animation: 'pulse-opacity 1s ease-in-out infinite' }}>NEW</text>
                )}
                {/* Name */}
                <text x={node.x} y={node.y + r + 14} fill={node.isDiscovered ? (isHovered ? color : '#888') : '#444'} fontSize={8} textAnchor="middle" opacity={0.85}>{node.name}</text>
              </g>
            );
          })}

          {/* Central hub */}
          <circle cx={center} cy={center} r={16} fill="rgba(74,222,128,0.05)" stroke="#4ade80" strokeWidth={1.2}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={center} cy={center} r={5} fill="#4ade80" opacity={0.8} />
          <text x={center} y={center + 30} fill="#4ade80" fontSize={8} textAnchor="middle" opacity={0.7}>界门总局</text>
        </svg>
      </div>

      {/* Wheel/pinch hint */}
      <div style={{ position: 'absolute', bottom: 10, right: 16, color: '#444', fontSize: 9, pointerEvents: 'none', zIndex: 3 }}>
        滚轮/双指缩放
      </div>

      {/* Ambiguous click picker */}
      {ambiguous && (
        <div style={{
          position: 'absolute', left: ambiguous.cx + 10, top: ambiguous.cy - 10,
          background: 'rgba(10,10,24,0.95)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
          padding: 8, zIndex: 100, minWidth: 160, maxHeight: 240, overflow: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
        }}>
          <div style={{ color: '#666', fontSize: 8, letterSpacing: 1, marginBottom: 6, paddingLeft: 4 }}>选择地点</div>
          {ambiguous.nodes.map(n => {
            const c = threatColors[n.threat];
            return (
              <div key={n.id}
                onClick={() => { onNodeClick(n); setAmbiguous(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
                  borderRadius: 4, cursor: 'pointer', color: '#bbb', fontSize: 11,
                  transition: 'background 0.1s', minHeight: 32
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{n.name}</span>
                <span style={{ color: '#555', fontSize: 8 }}>{threatLabels[n.threat]}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RegionMap({ node, onSubNodeClick }: { node: MapNode; onSubNodeClick: (sub: SubMapNode) => void }) {
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [ambiguous, setAmbiguous] = useState<{ subs: SubMapNode[]; cx: number; cy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPinchDist = useRef<number>(0);
  const threatColor = threatColors[node.threat];

  // Smart click for sub-nodes
  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    const threshold = 24 / zoom;
    const nearby = node.subNodes.filter(s => {
      return Math.hypot(s.x - svgPt.x, s.y - svgPt.y) < threshold;
    }).sort((a, b) => {
      return Math.hypot(a.x - svgPt.x, a.y - svgPt.y) - Math.hypot(b.x - svgPt.x, b.y - svgPt.y);
    });
    if (nearby.length === 1) {
      onSubNodeClick(nearby[0]);
    } else if (nearby.length > 1) {
      setAmbiguous({ subs: nearby, cx: e.clientX, cy: e.clientY });
    } else {
      setAmbiguous(null);
    }
  }, [node.subNodes, zoom, onSubNodeClick]);

  // Auto-calculate viewBox from actual data points so any dynamically generated
  // region renders correctly regardless of coordinate values.
  const viewBox = useMemo(() => {
    const allPoints = [
      { x: node.x, y: node.y },
      ...node.subNodes.map(s => ({ x: s.x, y: s.y })),
    ];
    const xs = allPoints.map(p => p.x);
    const ys = allPoints.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = 60;
    const w = Math.max(maxX - minX + pad * 2, 120);
    const h = Math.max(maxY - minY + pad * 2, 100);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    return { cx, cy, w, h };
  }, [node.x, node.y, node.subNodes]);

  const vbW = viewBox.w / zoom;
  const vbH = viewBox.h / zoom;
  const vbX = viewBox.cx - vbW / 2;
  const vbY = viewBox.cy - vbH / 2;

  // Region aura radius — covers all points plus some breathing room
  const auraR = Math.max(
    ...node.subNodes.map(s => Math.hypot(s.x - node.x, s.y - node.y)),
    30
  ) + 35;

  // Wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(z => Math.max(0.4, Math.min(3.0, z + delta)));
  }, []);

  // Pinch zoom
  const getTouchDist = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      lastPinchDist.current = getTouchDist(e.touches);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getTouchDist(e.touches);
      if (lastPinchDist.current > 0) {
        const scale = dist / lastPinchDist.current;
        setZoom(z => Math.max(0.4, Math.min(3.0, z * scale)));
      }
      lastPinchDist.current = dist;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastPinchDist.current = 0;
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', flexWrap: 'wrap', minHeight: 0 }}>
      {/* Info panel — fixed width on desktop, stacks above map on mobile */}
      <div style={{
        flex: '0 0 260px', minWidth: 200,
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: 14, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12
      }}>
        <div>
          <div style={{ color: threatColor, fontSize: 13, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 }}>{node.name}</div>
          <div style={{ color: '#666', fontSize: 9 }}>{node.zone} · {node.ring === 'inner' ? '内环' : node.ring === 'buffer' ? '缓冲带' : '外环'}</div>
        </div>

        <div className="glass" style={{ padding: 12, borderRadius: 4 }}>
          <div style={{ color: '#666', fontSize: 8, letterSpacing: 1, marginBottom: 8 }}>威胁评估</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: threatColor, boxShadow: `0 0 8px ${threatColor}` }} />
            <span style={{ color: threatColor, fontSize: 14, fontWeight: 'bold' }}>{threatLabels[node.threat]}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: 9 }}>
            <span>存活率</span>
            <span style={{ color: node.survivalRate > 60 ? '#4ade80' : node.survivalRate > 30 ? '#f0c040' : '#c41e3a' }}>{node.survivalRate}%</span>
          </div>
        </div>

        <div>
          <div style={{ color: '#888', fontSize: 9, marginBottom: 4 }}>区域描述</div>
          <div style={{ color: '#999', fontSize: 10, lineHeight: 1.6 }}>{node.description}</div>
        </div>

        {node.knownEntities.length > 0 && (
          <div>
            <div style={{ color: '#888', fontSize: 9, marginBottom: 6 }}>已知诡异</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {node.knownEntities.map(e => (
                <div key={e} style={{ padding: '5px 10px', background: 'rgba(123,47,190,0.06)', borderLeft: '2px solid #7b2fbe', borderRadius: 2, color: '#7b2fbe', fontSize: 10 }}>{e}</div>
              ))}
            </div>
          </div>
        )}

        {node.subNodes.length === 0 && (
          <div style={{ color: '#444', fontSize: 10, fontStyle: 'italic' }}>暂无详细地图数据</div>
        )}
      </div>

      {/* Region map — fills remaining space with zoom support */}
      <div style={{
        flex: 1, minWidth: 260, background: 'rgba(4,4,8,0.4)',
        position: 'relative', overflow: 'hidden', minHeight: 300
      }}>
        {/* Scan-line overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.008) 0px, rgba(255,255,255,0.008) 2px, transparent 2px, transparent 4px)', zIndex: 2 }} />

        {/* Zoom controls */}
        <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}>
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, color: '#888', cursor: 'pointer' }}>
            <Minus size={14} />
          </button>
          <span style={{ color: '#555', fontSize: 9, fontFamily: 'monospace', minWidth: 30, textAlign: 'center' }}>{zoom.toFixed(1)}x</span>
          <button onClick={() => setZoom(z => Math.min(3.0, z + 0.1))}
            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, color: '#888', cursor: 'pointer' }}>
            <Plus size={14} />
          </button>
        </div>

        {/* SVG container */}
        <div ref={containerRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ width: '100%', height: '100%', touchAction: 'none' }}>
          <svg viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} width="100%" height="100%" style={{ transition: 'all 0.15s ease-out' }} onClick={handleSvgClick}>
            {/* Region aura — pulsing circle around node center */}
            <circle cx={node.x} cy={node.y} r={auraR} fill={`${threatColor}06`} stroke={`${threatColor}15`} strokeWidth={1} strokeDasharray="5 4" opacity={0.6}>
              <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Thin radial grid centered on region */}
            {[0.4, 0.7, 1.0].map(ratio => (
              <circle key={ratio} cx={node.x} cy={node.y} r={auraR * ratio} fill="none" stroke={`${threatColor}08`} strokeWidth={0.4} />
            ))}

            {/* Sub-nodes */}
            {node.subNodes.map(sub => {
              const isHovered = hoveredSub === sub.id;
              const sc = threatColors[sub.threat];
              return (
                <g key={sub.id}
                  onMouseEnter={() => setHoveredSub(sub.id)}
                  onMouseLeave={() => setHoveredSub(null)}
                  style={{ cursor: 'pointer' }}>
                  {/* Transparent touch hit area */}
                  <circle cx={sub.x} cy={sub.y} r={18} fill="transparent" />
                  {/* Hover glow */}
                  {isHovered && (
                    <circle cx={sub.x} cy={sub.y} r={12} fill="none" stroke={sc} strokeWidth={1.5} opacity={0.4}>
                      <animate attributeName="r" values="12;18;12" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Node body */}
                  <circle cx={sub.x} cy={sub.y} r={isHovered ? 7 : 5} fill={`${sc}22`} stroke={sc} strokeWidth={isHovered ? 2 : 1} opacity={sub.isDiscovered ? 1 : 0.3}>
                    {sub.isNew && <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite" />}
                  </circle>
                  {/* NEW badge */}
                  {sub.isNew && (
                    <text x={sub.x} y={sub.y - 10} fill={sc} fontSize={6} fontWeight="bold" textAnchor="middle" style={{ animation: 'pulse-opacity 0.8s ease-in-out infinite' }}>NEW</text>
                  )}
                  {/* Name label */}
                  <text x={sub.x} y={sub.y + 12} fill={sub.isDiscovered ? (isHovered ? sc : '#888') : '#444'} fontSize={7} textAnchor="middle" opacity={0.85}>{sub.name}</text>
                </g>
              );
            })}

            {/* Connector lines from center to each sub-node */}
            {node.subNodes.map(sub => (
              <line key={`line-${sub.id}`} x1={node.x} y1={node.y} x2={sub.x} y2={sub.y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeDasharray="3 3" />
            ))}

            {/* Center marker */}
            <circle cx={node.x} cy={node.y} r={5} fill={`${threatColor}22`} stroke={threatColor} strokeWidth={1.2}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={node.x} cy={node.y} r={2} fill={threatColor} opacity={0.8} />
            <text x={node.x} y={node.y - 13} fill={threatColor} fontSize={8} textAnchor="middle" opacity={0.75}>{node.name}</text>
          </svg>
        </div>

        {/* Hint */}
        <div style={{ position: 'absolute', bottom: 10, right: 12, color: '#444', fontSize: 9, pointerEvents: 'none', zIndex: 3 }}>
          滚轮/双指缩放
        </div>

        {/* Ambiguous click picker */}
        {ambiguous && (
          <div style={{
            position: 'absolute', left: ambiguous.cx + 10, top: ambiguous.cy - 10,
            background: 'rgba(10,10,24,0.95)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
            padding: 8, zIndex: 100, minWidth: 160, maxHeight: 240, overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
          }}>
            <div style={{ color: '#666', fontSize: 8, letterSpacing: 1, marginBottom: 6, paddingLeft: 4 }}>选择地点</div>
            {ambiguous.subs.map(s => {
              const c = threatColors[s.threat];
              return (
                <div key={s.id}
                  onClick={() => { onSubNodeClick(s); setAmbiguous(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
                    borderRadius: 4, cursor: 'pointer', color: '#bbb', fontSize: 11,
                    transition: 'background 0.1s', minHeight: 32
                  }}
                  onMouseEnter={e2 => (e2.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={e2 => (e2.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{s.name}</span>
                  <span style={{ color: '#555', fontSize: 8 }}>{threatLabels[s.threat]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
