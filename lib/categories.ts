// 产品分类配置 - 支持多站点 + 中英文
export interface CategoryItem {
  name: string;       // 中文名（admin 展示）
  nameEn: string;     // 英文名（前台展示）
  slug: string;
  priority?: number;
  coverImage?: string;
  description?: string;
  children?: CategoryItem[];
}

// ====================== toy (成人用品) ======================
const toyCategories: CategoryItem[] = [
  {
    name: '仿真倒模', nameEn: 'Realistic Life-size Series', slug: 'realistic-life-size', priority: 1.0,
    children: [
      { name: '全身倒模(TPE)', nameEn: 'Full Torsos (TPE)', slug: 'tpe-torsos' },
      { name: '硅胶高端款', nameEn: 'Silicone Premium', slug: 'silicone-torsos' },
      { name: '臀模', nameEn: 'Butt & Hip Models', slug: 'butt-masturbators' },
    ]
  },
  {
    name: '仿真阳具', nameEn: 'Realistic Dildos', slug: 'realistic-dildos', priority: 0.95,
    children: [
      { name: '双层密度', nameEn: 'Dual-Density', slug: 'dual-density' },
      { name: '吸盘底座', nameEn: 'Suction Cup', slug: 'suction-cup-dildos' },
      { name: '经典非振动', nameEn: 'Non-Vibrating', slug: 'classic-dildos' },
    ]
  },
  {
    name: '男用器具', nameEn: 'Male Masturbators', slug: 'male-masturbators', priority: 0.85,
    children: [
      { name: '手动飞机杯', nameEn: 'Manual Strokers', slug: 'manual-strokers' },
      { name: '电动杯系列', nameEn: 'Automatic Cups', slug: 'automatic-cups' },
      { name: '前列腺按摩', nameEn: 'Prostate Massagers', slug: 'prostate-massagers' },
      { name: '持久训练器', nameEn: 'Stamina Trainers', slug: 'stamina-trainers' },
    ]
  },
  {
    name: '振动器', nameEn: 'Vibrators & Tech', slug: 'vibrators', priority: 0.8,
    children: [
      { name: 'AV按摩棒', nameEn: 'Wand Vibrators', slug: 'wand-vibrators' },
      { name: 'G点振动器', nameEn: 'G-Spot Vibrators', slug: 'g-spot-vibrators' },
      { name: '兔子振动器', nameEn: 'Rabbit Vibrators', slug: 'rabbit-vibrators' },
      { name: '阴蒂刺激器', nameEn: 'Clitoral Stimulators', slug: 'clitoral-stimulators' },
      { name: '跳蛋', nameEn: 'Bullet Vibrators', slug: 'bullet-vibrators' },
      { name: 'APP控制玩具', nameEn: 'App-Controlled Toys', slug: 'app-controlled' },
    ]
  },
  {
    name: '肛交玩具', nameEn: 'Anal Toys', slug: 'anal-toys', priority: 0.75,
    children: [
      { name: '肛塞', nameEn: 'Butt Plugs', slug: 'butt-plugs' },
      { name: '拉珠', nameEn: 'Anal Beads', slug: 'anal-beads' },
    ]
  },
  {
    name: 'BDSM束缚', nameEn: 'BDSM & Bondage', slug: 'bdsm-bondage', priority: 0.7,
    children: [
      { name: '束缚带', nameEn: 'Restraints', slug: 'restraints' },
      { name: '鞭打玩具', nameEn: 'Impact Play', slug: 'impact-play' },
    ]
  },
];

// ====================== seric (液压件) ======================
const sericCategories: CategoryItem[] = [
  {
    name: '方向控制阀', nameEn: 'Directional Control Valves', slug: 'directional-control-valves', priority: 1.0,
    children: [
      { name: '电磁换向阀', nameEn: 'Solenoid Directional Valves', slug: 'solenoid-directional-valves',
        children: [
          { name: 'DSG系列', nameEn: 'DSG Series', slug: 'dsg-series' },
          { name: '4WE系列', nameEn: '4WE Series', slug: '4we-series' },
        ]
      },
      { name: '手动换向阀', nameEn: 'Manual Directional Valves', slug: 'manual-directional-valves' },
      { name: '液控换向阀', nameEn: 'Pilot Operated Directional Valves', slug: 'pilot-operated-directional-valves' },
      { name: '单向阀', nameEn: 'Check Valves', slug: 'check-valves' },
      { name: '叠加式方向阀', nameEn: 'Sandwich Valves (Directional)', slug: 'sandwich-valves-directional' },
    ]
  },
  {
    name: '压力控制阀', nameEn: 'Pressure Control Valves', slug: 'pressure-control-valves', priority: 0.95,
    children: [
      { name: '溢流阀', nameEn: 'Relief Valves', slug: 'relief-valves' },
      { name: '减压阀', nameEn: 'Reducing Valves', slug: 'reducing-valves' },
      { name: '顺序阀', nameEn: 'Sequence Valves', slug: 'sequence-valves' },
      { name: '压力开关', nameEn: 'Pressure Switches', slug: 'pressure-switches' },
    ]
  },
  {
    name: '流量控制阀', nameEn: 'Flow Control Valves', slug: 'flow-control-valves', priority: 0.9,
    children: [
      { name: '节流阀', nameEn: 'Throttle Valves', slug: 'throttle-valves' },
      { name: '调速阀(压力补偿)', nameEn: 'Flow Control Valves (PC)', slug: 'flow-control-valves-pc' },
      { name: '分流/集流阀', nameEn: 'Flow Divider/Combiner', slug: 'flow-divider-combiner' },
    ]
  },
  {
    name: '液压泵', nameEn: 'Hydraulic Pumps', slug: 'hydraulic-pumps', priority: 0.85,
    children: [
      { name: '齿轮泵', nameEn: 'Gear Pumps', slug: 'gear-pumps' },
      { name: '叶片泵', nameEn: 'Vane Pumps', slug: 'vane-pumps' },
      { name: '柱塞泵', nameEn: 'Piston Pumps', slug: 'piston-pumps' },
    ]
  },
  {
    name: '液压马达', nameEn: 'Hydraulic Motors', slug: 'hydraulic-motors', priority: 0.8,
    children: [
      { name: '摆线马达', nameEn: 'Orbital Motors', slug: 'orbital-motors',
        children: [
          { name: '丹佛斯同款', nameEn: 'Danfoss Equivalent', slug: 'danfoss-equivalent' },
        ]
      },
      { name: '齿轮马达', nameEn: 'Gear Motors', slug: 'gear-motors' },
      { name: '柱塞马达', nameEn: 'Piston Motors', slug: 'piston-motors' },
    ]
  },
  {
    name: '液压附件', nameEn: 'Hydraulic Accessories', slug: 'hydraulic-accessories', priority: 0.7,
    children: [
      { name: '过滤器', nameEn: 'Filters', slug: 'filters' },
      { name: '蓄能器', nameEn: 'Accumulators', slug: 'accumulators' },
      { name: '压力表', nameEn: 'Pressure Gauges', slug: 'pressure-gauges' },
      { name: '接头管件', nameEn: 'Fittings & Couplings', slug: 'fittings-couplings' },
      { name: '密封件', nameEn: 'Seals', slug: 'seals' },
    ]
  },
  {
    name: '叠加阀/插装阀', nameEn: 'Sandwich / Cartridge Valves', slug: 'sandwich-cartridge-valves', priority: 0.65,
    children: [
      { name: '叠加阀', nameEn: 'Sandwich Valves', slug: 'sandwich-valves' },
      { name: '插装阀', nameEn: 'Cartridge Valves', slug: 'cartridge-valves' },
    ]
  },
];

// ====================== 按站点获取分类 ======================
const allSiteCategories: Record<string, CategoryItem[]> = {
  toy: toyCategories,
  seric: sericCategories,
};

export function getSiteCategories(siteId?: string): CategoryItem[] {
  if (!siteId) return toyCategories;
  return allSiteCategories[siteId] || toyCategories;
}

// 辅助函数：获取父分类
export const getParentCategory = (childSlug: string): CategoryItem | undefined => {
  for (const category of toyCategories) {
    if (category.children?.some(child => child.slug === childSlug)) return category;
    for (const child of category.children || []) {
      if (child.children?.some(gc => gc.slug === childSlug)) return child;
    }
  }
  return undefined;
};

// 兼容旧代码
export const categories = toyCategories;

// 辅助函数：根据 slug 查找分类
export const findCategoryBySlug = (slug: string, siteId?: string): CategoryItem | undefined => {
  const cats = getSiteCategories(siteId);
  for (const category of cats) {
    if (category.slug === slug) return category;
    if (category.children) {
      for (const child of category.children) {
        if (child.slug === slug) return child;
        if (child.children) {
          const grandchild = child.children.find(c => c.slug === slug);
          if (grandchild) return grandchild;
        }
      }
    }
  }
  return undefined;
};

// 辅助函数：获取所有叶子节点
export const getLeafCategories = (siteId?: string): CategoryItem[] => {
  const leaves: CategoryItem[] = [];
  const cats = getSiteCategories(siteId);
  const collect = (items: CategoryItem[]) => {
    items.forEach(item => {
      if (!item.children || item.children.length === 0) leaves.push(item);
      else collect(item.children);
    });
  };
  collect(cats);
  return leaves;
};
