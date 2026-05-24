export type RankTier = 'white' | 'yellow' | 'green' | 'blue' | 'purple' | 'gold' | 'red';

export const RANK_LABELS: Record<RankTier, string> = {
  white: '行者', yellow: '巡界者', green: '守门人',
  blue: '镇域使', purple: '封煞者', gold: '界主', red: '镇界者'
};

export const RANK_COLORS: Record<RankTier, string> = {
  white: '#e8e8e8', yellow: '#f0c040', green: '#4ade80',
  blue: '#7ec8e3', purple: '#7b2fbe', gold: '#f0c040', red: '#c41e3a'
};

export type EntityClass = 'white' | 'yellow' | 'green' | 'blue' | 'purple' | 'gold' | 'red';
export type BondStatus = 'active' | 'dormant' | 'backlash';

export interface ContractedEntity {
  id: string; codeName: string; trueName: string; class: EntityClass;
  bondStatus: BondStatus; cost: string; abilities: string[];
  power: number; agility: number; sanCost: number; boundSince: string;
  innerThoughts: string[]; avatar: string;
}

export interface Companion {
  id: string; name: string; role: string; status: string;
  innerThoughts: string[]; avatar: string;
}

export interface NpcState {
  id: string; name: string; role: string; location: string;
  innerThoughts: string[]; avatar: string;
}

export type DangerLevel = 1 | 2 | 3 | 4 | 5;
export type NodeThreat = 'safe' | 'low' | 'medium' | 'high' | 's_rank' | 'unknown';
export type MapLayer = 'global' | 'region' | 'poi';

export interface SubMapNode {
  id: string; name: string; x: number; y: number;
  threat: NodeThreat; isDiscovered: boolean; isNew: boolean; description: string;
}

export interface MapNode {
  id: string; name: string; zone: string; ring: 'inner' | 'buffer' | 'outer';
  x: number; y: number; threat: NodeThreat; isDiscovered: boolean; isNew: boolean;
  description: string; survivalRate: number; knownEntities: string[];
  subNodes: SubMapNode[]; parentId?: string;
}

export interface DiscoveredPoi {
  id: string; name: string; regionId: string; discoveredAt: string;
  source: 'llm' | 'manual'; threat: NodeThreat;
}

export type ItemCategory = 'equipment' | 'consumable' | 'rule' | 'medium' | 'corrupted';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'corrupted';

export interface InventoryItem {
  id: string; name: string; category: ItemCategory; rarity: ItemRarity;
  quantity: number; icon: string; description: string; effect?: string;
}

export interface LogEntry {
  id: string; date: string; zone: string; title: string; summary: string;
  choices: string[]; result: 'success' | 'failure' | 'escape' | 'ongoing'; isRead: boolean;
}

export interface PlayerState {
  name: string; codeName: string; hp: number; maxHp: number; san: number; maxSan: number;
  rank: RankTier; currency: number; erosion: number;
  constitution: number; spirit: number; inspiration: number;
  agility: number; willpower: number; contractPower: number;
  profession: string; joinedAt: string;
  missions: { success: number; failure: number; escape: number };
}

export type ForumTab = 'announcement' | 'auction' | 'survival' | 'discussion' | 'blackmarket';

export interface ForumPost {
  id: string; tab: ForumTab; title: string; author: string; content: string;
  timestamp: string; tags: string[]; isLocked: boolean;
}

export type PanelType = 'status' | 'contracts' | 'inventory' | 'forum' | 'map' | 'profile' | 'log';
export type FloatType = 'entity-detail' | 'inner-thoughts' | 'item-detail' | 'map-poi';
export type OverlayType = 'recruit-warning' | 'san-crisis';

export interface ToastItem {
  id: string; type: 'system' | 'warning' | 'success' | 'occult'; message: string;
}

export interface GameState {
  player: PlayerState;
  contracts: { entities: ContractedEntity[]; companions: Companion[]; activeNpcs: NpcState[] };
  world: {
    currentZone: string; dangerLevel: DangerLevel; mapNodes: MapNode[];
    discoveredPois: DiscoveredPoi[]; currentMapLayer: MapLayer;
    selectedRegionId: string | null; selectedPoiId: string | null;
  };
  inventory: InventoryItem[]; log: LogEntry[]; forumPosts: ForumPost[];
  ui: {
    activePanel: PanelType;
    activeFloat: FloatType | null;
    floatData: any; activeOverlay: OverlayType | null;
    toasts: ToastItem[]; sanCrisisLevel: number;
  };
}

export type GameAction =
  | { type: 'SET_PANEL'; panel: PanelType }
  | { type: 'OPEN_FLOAT'; floatType: FloatType; data: any }
  | { type: 'CLOSE_FLOAT' }
  | { type: 'SHOW_OVERLAY'; overlay: OverlayType }
  | { type: 'HIDE_OVERLAY' }
  | { type: 'ADD_TOAST'; toast: Omit<ToastItem, 'id'> }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'UPDATE_PLAYER'; partial: Partial<PlayerState> }
  | { type: 'UPDATE_SAN_CRISIS'; level: number }
  | { type: 'ADD_MAP_NODE'; node: MapNode }
  | { type: 'MARK_NODE_DISCOVERED'; nodeId: string }
  | { type: 'SET_MAP_LAYER'; layer: MapLayer; regionId?: string | null; poiId?: string | null }
  | { type: 'ADD_ITEM'; item: InventoryItem }
  | { type: 'ADD_LOG'; entry: LogEntry }
  | { type: 'MARK_LOG_READ'; id: string };
