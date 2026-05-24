import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { GameState, GameAction, ToastItem, PanelType, FloatType, OverlayType } from '../types/game';
import { mockGameState } from '../data/mockData';

const initialState: GameState = mockGameState;

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PANEL':
      return { ...state, ui: { ...state.ui, activePanel: action.panel } };
    case 'OPEN_FLOAT':
      return { ...state, ui: { ...state.ui, activeFloat: action.floatType, floatData: action.data } };
    case 'CLOSE_FLOAT':
      return { ...state, ui: { ...state.ui, activeFloat: null, floatData: null } };
    case 'SHOW_OVERLAY':
      return { ...state, ui: { ...state.ui, activeOverlay: action.overlay } };
    case 'HIDE_OVERLAY':
      return { ...state, ui: { ...state.ui, activeOverlay: null } };
    case 'ADD_TOAST': {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      return { ...state, ui: { ...state.ui, toasts: [...state.ui.toasts, { ...action.toast, id }] } };
    }
    case 'REMOVE_TOAST':
      return { ...state, ui: { ...state.ui, toasts: state.ui.toasts.filter(t => t.id !== action.id) } };
    case 'UPDATE_PLAYER':
      return { ...state, player: { ...state.player, ...action.partial } };
    case 'UPDATE_SAN_CRISIS':
      return { ...state, ui: { ...state.ui, sanCrisisLevel: action.level } };
    case 'ADD_MAP_NODE':
      return { ...state, world: { ...state.world, mapNodes: [...state.world.mapNodes, action.node] } };
    case 'MARK_NODE_DISCOVERED':
      return { ...state, world: { ...state.world, mapNodes: state.world.mapNodes.map(n => n.id === action.nodeId ? { ...n, isDiscovered: true, isNew: false } : n) } };
    case 'SET_MAP_LAYER':
      return { ...state, world: { ...state.world, currentMapLayer: action.layer, selectedRegionId: action.regionId ?? null, selectedPoiId: action.poiId ?? null } };
    case 'ADD_ITEM':
      return { ...state, inventory: [...state.inventory, action.item] };
    case 'ADD_LOG':
      return { ...state, log: [action.entry, ...state.log] };
    case 'MARK_LOG_READ':
      return { ...state, log: state.log.map(l => l.id === action.id ? { ...l, isRead: true } : l) };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  setPanel: (p: PanelType) => void;
  openFloat: (t: FloatType, data: any) => void;
  closeFloat: () => void;
  showOverlay: (o: OverlayType) => void;
  hideOverlay: () => void;
  addToast: (t: Omit<ToastItem, 'id'>) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setPanel = useCallback((p: PanelType) => dispatch({ type: 'SET_PANEL', panel: p }), []);
  const openFloat = useCallback((t: FloatType, data: any) => dispatch({ type: 'OPEN_FLOAT', floatType: t, data }), []);
  const closeFloat = useCallback(() => dispatch({ type: 'CLOSE_FLOAT' }), []);
  const showOverlay = useCallback((o: OverlayType) => dispatch({ type: 'SHOW_OVERLAY', overlay: o }), []);
  const hideOverlay = useCallback(() => dispatch({ type: 'HIDE_OVERLAY' }), []);
  const addToast = useCallback((t: Omit<ToastItem, 'id'>) => dispatch({ type: 'ADD_TOAST', toast: t }), []);

  return (
    <GameContext.Provider value={{ state, dispatch, setPanel, openFloat, closeFloat, showOverlay, hideOverlay, addToast }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
