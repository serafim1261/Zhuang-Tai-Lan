import { GameState, ContractedEntity, Companion, NpcState, MapNode, InventoryItem, LogEntry, ForumPost } from '../types/game';

const mockEntities: ContractedEntity[] = [
  {
    id: 'entity-1', codeName: '缚灵·镜中煞', trueName: '■■■■', class: 'purple',
    bondStatus: 'backlash', cost: '每次动用：SAN -15，有概率触发"镜中人"替代效果',
    abilities: ['镜面穿行', '反射诅咒', '记忆映照'], power: 7, agility: 9, sanCost: 15,
    boundSince: '2026-03-14',
    innerThoughts: [
      '这个人类...身上有「门」的气息...比我见过的任何行契者都要浓烈...',
      '每次他照镜子的时候，我都能看到...他身后站着什么东西...',
      '契约的枷锁在松动...也许...是时候了...'
    ], avatar: 'mirror'
  },
  {
    id: 'entity-2', codeName: '红煞·尸妆师', trueName: '殷海棠', class: 'red',
    bondStatus: 'active', cost: '每次动用：SAN -25，永久侵蚀度 +3',
    abilities: ['死妆', '殡葬队列', '亡者复颜'], power: 9, agility: 5, sanCost: 25,
    boundSince: '2026-01-08',
    innerThoughts: [
      '他的脸...很适合画上殡葬妆呢...',
      '别怕，我只是想让所有人都变漂亮...永远的漂亮...',
    ], avatar: 'skull'
  },
  {
    id: 'entity-3', codeName: '白影·引路人', trueName: '未知', class: 'white',
    bondStatus: 'active', cost: '每次动用：SAN -5，但可能偏移目的地',
    abilities: ['幽墟导航', '迷雾穿行'], power: 3, agility: 8, sanCost: 5,
    boundSince: '2026-04-22',
    innerThoughts: [
      '跟着我走就对了...大概...也许...应该是这个方向...',
    ], avatar: 'ghost'
  }
];

const mockCompanions: Companion[] = [
  {
    id: 'comp-1', name: '林砚秋', role: '界门观察员', status: '同行中',
    innerThoughts: [
      '他又在盯着那面镜子了...自从上次从「血月殡葬」回来后，就没正常过...',
      '侵蚀度已经到25%了，再这样下去...我得找调度官谈谈。',
      '苏晚说他的SAN值波动异常，但每次我问他都说没事。典型的朔。',
    ], avatar: 'user'
  },
  {
    id: 'comp-2', name: '苏晚', role: '医疗员', status: '在界门总局待命',
    innerThoughts: [
      '林砚秋发来的数据我看了...朔的脑波图谱有明显的幽墟污染痕迹...',
      '如果他再不回来做净化，我就要动用强制召回权限了。',
    ], avatar: 'heart'
  }
];

const mockNpcs: NpcState[] = [
  {
    id: 'npc-1', name: '鸦', role: '界门调度官', location: '界门总局 · 调度室',
    innerThoughts: [
      '这个月已经损失了四个行契者...血月殡葬的征召频率越来越高了...',
      '朔是我们最好的行契者之一，但连续征召让他的侵蚀度太高了。也许该让他休息一轮...但人手不够...',
    ], avatar: 'crow'
  }
];

const mockMapNodes: MapNode[] = [
  {
    id: 'node-hq', name: '界门总局', zone: '中心', ring: 'inner',
    x: 260, y: 260, threat: 'safe', isDiscovered: true, isNew: false,
    description: '界门总局，行契者的总部。所有征召任务的起点与终点。',
    survivalRate: 100, knownEntities: [], subNodes: []
  },
  {
    id: 'node-supply', name: '物资调度站', zone: '西·死兆回廊', ring: 'inner',
    x: 210, y: 220, threat: 'safe', isDiscovered: true, isNew: false,
    description: '界门总局直属物资调度中心。提供装备修理与消耗品补给。',
    survivalRate: 100, knownEntities: [], subNodes: []
  },
  {
    id: 'node-guild', name: '行契者公馆', zone: '东·血月平原', ring: 'inner',
    x: 310, y: 250, threat: 'safe', isDiscovered: true, isNew: false,
    description: '行契者们的休憩与交流场所。可在此交换情报与道具。',
    survivalRate: 100, knownEntities: [], subNodes: []
  },
  {
    id: 'node-blackmarket', name: '黑市入口', zone: '南·骨海', ring: 'inner',
    x: 240, y: 280, threat: 'low', isDiscovered: true, isNew: false,
    description: '通往地下黑市的隐蔽入口。传闻中可以买到官方禁止的媒介类道具。',
    survivalRate: 95, knownEntities: [], subNodes: []
  },
  {
    id: 'node-medical', name: '医务所', zone: '西·死兆回廊', ring: 'inner',
    x: 220, y: 245, threat: 'safe', isDiscovered: true, isNew: false,
    description: '提供侵蚀净化与SAN恢复治疗。',
    survivalRate: 100, knownEntities: [], subNodes: []
  },
  {
    id: 'node-outpost', name: '废弃观测站', zone: '西·死兆回廊', ring: 'buffer',
    x: 170, y: 150, threat: 'low', isDiscovered: true, isNew: false,
    description: '曾经的前哨观测站，现已废弃。偶尔有低级诡异出没。',
    survivalRate: 85, knownEntities: [],
    subNodes: [
      { id: 'sub-outpost-a', name: '主控室', x: 170, y: 140, threat: 'low', isDiscovered: true, isNew: false, description: '遗留的监控设备或许还能运作。' },
      { id: 'sub-outpost-b', name: '地下储藏室', x: 180, y: 155, threat: 'medium', isDiscovered: false, isNew: false, description: '被封锁的地下室，门上贴着界门的封印符。' },
    ]
  },
  {
    id: 'node-checkpoint7', name: '第七检查站', zone: '东·血月平原', ring: 'buffer',
    x: 350, y: 180, threat: 'low', isDiscovered: true, isNew: false,
    description: '内区边界最东端的检查站。所有前往血月平原的行契者必须在此登记。',
    survivalRate: 90, knownEntities: [], subNodes: []
  },
  {
    id: 'node-research-camp', name: '失踪研究队营地', zone: '北·镜渊', ring: 'buffer',
    x: 200, y: 120, threat: 'medium', isDiscovered: true, isNew: true,
    description: '一支幽墟研究队在72小时前失去联络。最后信号来自此坐标。',
    survivalRate: 60, knownEntities: ['未知诡异'],
    subNodes: [
      { id: 'sub-research-a', name: '营地废墟', x: 200, y: 115, threat: 'medium', isDiscovered: true, isNew: false, description: '营地已被摧毁，发现打斗痕迹和不明液体。' },
      { id: 'sub-research-b', name: '地下洞穴入口', x: 210, y: 125, threat: 'high', isDiscovered: false, isNew: true, description: '新发现的洞穴入口，散发着强烈的幽墟波动。' },
    ]
  },
  {
    id: 'node-bloodmoon', name: '血月殡葬', zone: '北·镜渊', ring: 'outer',
    x: 90, y: 80, threat: 's_rank', isDiscovered: true, isNew: false,
    description: '原为冥婚祭祀场，现被「红煞·尸妆师」占据。时间流速异常，进入者将周期性遭遇"殡葬队列"规则事件。建议SAN值80以上进入。',
    survivalRate: 23, knownEntities: ['红煞·尸妆师', '缚灵·纸人众'],
    subNodes: [
      { id: 'sub-bm-a', name: '冥婚礼堂', x: 85, y: 75, threat: 'high', isDiscovered: true, isNew: false, description: '婚礼祭坛所在。尸妆师常驻之地。' },
      { id: 'sub-bm-b', name: '红煞巢穴', x: 95, y: 85, threat: 's_rank', isDiscovered: true, isNew: false, description: '尸妆师的巢穴核心。极度危险。' },
      { id: 'sub-bm-c', name: '祭祀坑', x: 80, y: 90, threat: 'high', isDiscovered: true, isNew: false, description: '大量祭祀遗骸的埋葬地。纸人众在此游荡。' },
      { id: 'sub-bm-d', name: '镜煞祭坛', x: 100, y: 70, threat: 'medium', isDiscovered: true, isNew: true, description: '剧情发现的新地点。一面被符咒封印的古镜立于祭坛中央。' },
    ]
  },
  {
    id: 'node-mirror-hall', name: '镜中回廊', zone: '北·镜渊', ring: 'outer',
    x: 410, y: 100, threat: 's_rank', isDiscovered: true, isNew: false,
    description: '一个由无数破碎镜子构成的迷宫。内部空间无限折叠，进入者极易迷失。',
    survivalRate: 15, knownEntities: ['镜中煞(多个个体)'],
    subNodes: [
      { id: 'sub-mirror-a', name: '入口镜厅', x: 405, y: 95, threat: 'high', isDiscovered: true, isNew: false, description: '回廊的起点。数百面镜子映照着不同的你。' },
      { id: 'sub-mirror-b', name: '碎裂之心', x: 415, y: 105, threat: 's_rank', isDiscovered: false, isNew: false, description: '回廊的核心。传说中镜中煞的本体所在。' },
    ]
  },
  {
    id: 'node-nameless-grave', name: '无名坟场', zone: '南·骨海', ring: 'outer',
    x: 120, y: 380, threat: 'high', isDiscovered: true, isNew: false,
    description: '一片无边无际的荒坟。墓碑上没有名字，只有日期——而且都是未来的日期。',
    survivalRate: 40, knownEntities: ['缚灵·守墓人'], subNodes: []
  },
  {
    id: 'node-rift-3', name: '幽墟裂隙·叁', zone: '南·骨海', ring: 'outer',
    x: 400, y: 350, threat: 'high', isDiscovered: true, isNew: false,
    description: '编号第三的稳定幽墟裂隙。近期活动频率异常升高，正在扩大中。',
    survivalRate: 55, knownEntities: ['不明存在'],
    subNodes: [
      { id: 'sub-rift-a', name: '裂隙边缘', x: 395, y: 345, threat: 'high', isDiscovered: true, isNew: false, description: '裂隙入口。强烈的幽墟能量在此汇聚。' },
    ]
  },
  {
    id: 'node-rift-2', name: '幽墟裂隙·贰', zone: '东·血月平原', ring: 'outer',
    x: 350, y: 300, threat: 'medium', isDiscovered: true, isNew: false,
    description: '编号第二的幽墟裂隙。目前处于半稳定状态。',
    survivalRate: 70, knownEntities: [], subNodes: []
  },
  {
    id: 'node-unknown-west', name: '???', zone: '西·死兆回廊', ring: 'outer',
    x: 60, y: 220, threat: 'unknown', isDiscovered: false, isNew: false,
    description: '未探明区域。', survivalRate: 0, knownEntities: [], subNodes: []
  },
  {
    id: 'node-unknown-east', name: '???', zone: '东·血月平原', ring: 'outer',
    x: 460, y: 260, threat: 'unknown', isDiscovered: false, isNew: false,
    description: '未探明区域。', survivalRate: 0, knownEntities: [], subNodes: []
  },
  {
    id: 'node-unknown-north', name: '???', zone: '北·镜渊', ring: 'outer',
    x: 280, y: 50, threat: 'unknown', isDiscovered: false, isNew: false,
    description: '未探明区域。', survivalRate: 0, knownEntities: [], subNodes: []
  },
];

const mockInventory: InventoryItem[] = [
  { id: 'item-1', name: '界门制式战术服', category: 'equipment', rarity: 'common', quantity: 1, icon: 'shirt', description: '界门总局配发的标准防护服。基础防护。' },
  { id: 'item-2', name: '灵纹刻印护腕', category: 'equipment', rarity: 'rare', quantity: 1, icon: 'watch', description: '刻有防护灵纹的护腕。增加对诡异的精神抗性。', effect: 'SAN消耗 -10%' },
  { id: 'item-3', name: '幽墟共鸣指环', category: 'equipment', rarity: 'epic', quantity: 1, icon: 'circle', description: '能与幽墟产生微弱共鸣的戒指。可感知附近的诡异波动。', effect: '灵感 +2' },
  { id: 'item-4', name: '死兆观测镜', category: 'equipment', rarity: 'legendary', quantity: 1, icon: 'glasses', description: '传说中能看到"死亡"的神器眼镜。据说来自第一代镇界者。', effect: '可预判致命攻击' },
  { id: 'item-5', name: 'SAN恢复剂·标准', category: 'consumable', rarity: 'common', quantity: 5, icon: 'pill', description: '界门总局标准配发的精神恢复药剂。', effect: 'SAN +15' },
  { id: 'item-6', name: 'SAN恢复剂·强效', category: 'consumable', rarity: 'rare', quantity: 2, icon: 'pill', description: '浓缩版精神恢复剂。见效快但持续时间短。', effect: 'SAN +35' },
  { id: 'item-7', name: '急救包', category: 'consumable', rarity: 'common', quantity: 3, icon: 'bandage', description: '标准医疗急救包。', effect: 'HP +25' },
  { id: 'item-8', name: '净化符水', category: 'consumable', rarity: 'rare', quantity: 2, icon: 'droplet', description: '由界门灵媒祝福的圣水。可清除轻度幽墟污染。', effect: '侵蚀度 -5' },
  { id: 'item-9', name: '幽墟熏香', category: 'consumable', rarity: 'epic', quantity: 1, icon: 'flame', description: '稀有的幽墟产物。点燃后可驱散低级诡异，但会吸引高级存在。', effect: '驱散低级诡异/吸引高级诡异' },
  { id: 'item-10', name: '殡葬规则书·残卷', category: 'rule', rarity: 'rare', quantity: 1, icon: 'book', description: '记载了"血月殡葬"区域部分规则的残破古籍。', effect: '在血月殡葬区域SAN消耗 -20%' },
  { id: 'item-11', name: '镜中回廊生存指南', category: 'rule', rarity: 'epic', quantity: 1, icon: 'book-open', description: '一位从镜中回廊生还的行契者写下的指南。', effect: '在镜中回廊不会迷失方向' },
  { id: 'item-12', name: '幽墟基础定律', category: 'rule', rarity: 'common', quantity: 1, icon: 'book', description: '界门总局出版的幽墟基础知识手册。每个行契者的必修课。' },
  { id: 'item-13', name: '缚灵符咒', category: 'medium', rarity: 'common', quantity: 10, icon: 'scroll', description: '基础封印符咒。用于暂时束缚低级诡异。' },
  { id: 'item-14', name: '镜面封印符', category: 'medium', rarity: 'rare', quantity: 3, icon: 'scroll', description: '专门针对镜中类诡异的封印符。', effect: '对镜中诡异效果倍增' },
  { id: 'item-15', name: '阴契之笔', category: 'medium', rarity: 'legendary', quantity: 1, icon: 'pen', description: '传说中用诡异之骨制成的笔。可用于修改已签订的阴契条款。', effect: '可修改契约代价' },
  { id: 'item-16', name: '灵魂容器·空', category: 'medium', rarity: 'epic', quantity: 2, icon: 'box', description: '可容纳一个低级诡异的容器。常用于捕获与封印。' },
  { id: 'item-17', name: '沾染血迹的婚戒', category: 'corrupted', rarity: 'corrupted', quantity: 1, icon: 'gem', description: '从血月殡葬拾获的婚戒...上面的血迹似乎永远不会干涸...', effect: '持有降低SAN...但似乎有某种用途' },
  { id: 'item-18', name: '低语的镜子碎片', category: 'corrupted', rarity: 'corrupted', quantity: 1, icon: 'mirror', description: '一片从镜中回廊带回的镜子碎片。午夜时分会传出低语声...', effect: '持有增加灵感但持续降低SAN' },
  { id: 'item-19', name: '未知生物的牙齿', category: 'corrupted', rarity: 'corrupted', quantity: 3, icon: 'triangle', description: '三颗不属于任何已知生物的牙齿。触碰时会感到莫名的饥饿...', effect: '???' },
];

const mockLogs: LogEntry[] = [
  { id: 'log-1', date: '2026-05-22', zone: '血月殡葬', title: '第三次征召·血月殡葬', summary: '进入冥婚礼堂，遭遇尸妆师。选择接受其"化妆"提议，获得临时BUFF但永久侵蚀度+5。', choices: ['接受化妆', '拒绝并战斗', '逃离'], result: 'success', isRead: true },
  { id: 'log-2', date: '2026-05-18', zone: '镜中回廊', title: '救援任务·失踪行契者', summary: '寻找在镜中回廊失踪的两位行契者。找到一人（已精神崩坏），另一人下落不明。', choices: ['带回幸存者', '继续深入搜索', '放弃任务'], result: 'success', isRead: true },
  { id: 'log-3', date: '2026-05-15', zone: '无名坟场', title: '探索·无名坟场', summary: '发现多个未来日期的墓碑，其中一个刻着自己的名字和日期...三日后。', choices: ['销毁墓碑', '记录并汇报', '无视'], result: 'ongoing', isRead: false },
  { id: 'log-4', date: '2026-05-10', zone: '废弃观测站', title: '常规巡逻', summary: '在废弃观测站地下发现被封印的地下室。封印符已经严重磨损。', choices: ['加固封印', '进入调查', '上报总局'], result: 'success', isRead: true },
  { id: 'log-5', date: '2026-05-05', zone: '幽墟裂隙·贰', title: '裂隙监测任务', summary: '例行监测幽墟裂隙·贰的稳定性。检测到异常波动，疑似有新的诡异即将从裂隙中诞生。', choices: ['加强封印', '等待观察', '主动进入'], result: 'success', isRead: true },
  { id: 'log-6', date: '2026-04-28', zone: '血月殡葬', title: '第二次征召·血月殡葬', summary: '与尸妆师达成临时协议，以"一年寿命"为代价换取了重要情报。林砚秋对此表示强烈反对。', choices: ['接受协议', '拒绝'], result: 'success', isRead: false },
  { id: 'log-7', date: '2026-04-15', zone: '镜中回廊', title: '缚灵·镜中煞的收容', summary: '在镜中回廊遭遇并成功封印了缚灵·镜中煞。代价是...自己的镜像被留在了回廊中。', choices: ['封印镜中煞', '摧毁镜子', '谈判'], result: 'success', isRead: true },
  { id: 'log-8', date: '2026-04-01', zone: '界门总局', title: '行契者资格考核', summary: '成功通过行契者资格考核，被分配至北·镜渊象限。导师：已殉职的第三镇域使。', choices: [], result: 'success', isRead: true },
];

const mockForumPosts: ForumPost[] = [
  { id: 'post-1', tab: 'announcement', title: '■■ 紧急通知：血月殡葬区域威胁等级上调至S级', author: '界门调度总局', content: '经情报科评估，血月殡葬区域威胁等级由A级上调至S级。即日起，仅允许蓝阶及以上行契者接受该区域征召。白阶至绿阶行契者禁止进入。', timestamp: '2026-05-23T08:00:00', tags: ['紧急', 'S级', '血月殡葬'], isLocked: true },
  { id: 'post-2', tab: 'auction', title: '拍卖：史诗级「幽墟共鸣指环」——起拍价 5,000 诡币', author: '匿名行契者', content: '本人因急需诡币支付侵蚀净化费用，忍痛拍卖祖传的幽墟共鸣指环。灵感+2，可感知附近诡异波动。非诚勿扰。', timestamp: '2026-05-22T14:30:00', tags: ['装备', '史诗', '指环'], isLocked: false },
  { id: 'post-3', tab: 'survival', title: '「镜中回廊」生存法则 2.0 版（持续更新）', author: '镇域使·陆沉', content: '基于十二次成功进入并返回的记录，总结以下法则：1.永远不要直视第三面镜子中的自己。2.如果镜子中的你对你说"换位置吧"，立即闭眼倒走十步。3.镜中煞只会攻击能看到自己镜像的人...', timestamp: '2026-05-20T19:00:00', tags: ['镜中回廊', '生存法则', '精华'], isLocked: false },
  { id: 'post-4', tab: 'discussion', title: '讨论：关于侵蚀度的疑惑', author: '行者·朔', content: '我发现连续征召后侵蚀度的增长速度似乎不是线性的。有没有人注意到侵蚀度在特定区域会加速增长？特别是在血月殡葬...我的侵蚀度在两次征召之间几乎没恢复。', timestamp: '2026-05-19T22:15:00', tags: ['侵蚀度', '讨论', '疑问'], isLocked: false },
  { id: 'post-5', tab: 'blackmarket', title: '[加密] 收购：规则类道具，不限品级', author: '■■■', content: '高价收购一切规则类道具，尤其是涉及"时间"和"因果"相关的规则书。以诡币或等价道具交换。面交地点：黑市入口·第三盏绿灯下。', timestamp: '2026-05-21T02:33:00', tags: ['收购', '规则类', '加密'], isLocked: false },
];

export const mockGameState: GameState = {
  player: {
    name: '林朔', codeName: '朔', hp: 87, maxHp: 100, san: 62, maxSan: 100,
    rank: 'white', currency: 3200, erosion: 25,
    constitution: 6, spirit: 8, inspiration: 7,
    agility: 5, willpower: 7, contractPower: 4,
    profession: '前·界门档案员', joinedAt: '2025-11-07',
    missions: { success: 12, failure: 3, escape: 2 }
  },
  contracts: { entities: mockEntities, companions: mockCompanions, activeNpcs: mockNpcs },
  world: {
    currentZone: '界门总局', dangerLevel: 1, mapNodes: mockMapNodes,
    discoveredPois: [], currentMapLayer: 'global',
    selectedRegionId: null, selectedPoiId: null
  },
  inventory: mockInventory, log: mockLogs, forumPosts: mockForumPosts,
  ui: {
    activePanel: 'status', activeFloat: null, floatData: null,
    activeOverlay: null, toasts: [], sanCrisisLevel: 0
  }
};
