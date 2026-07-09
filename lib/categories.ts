// 产品分类配置 - 成人用品批发分类（支持多级嵌套）
export interface CategoryItem {
  name: string;
  slug: string;
  priority?: number;
  coverImage?: string;  // 分类封面图
  description?: string;  // 分类描述
  children?: CategoryItem[];  // 子分类
}

// 重构建议：突出“仿真”与“材质”核心卖点
export const categories: CategoryItem[] = [
  {
    name: 'Realistic Life-size Series', // 核心：半身倒模/臀模（重货，高利润）
    slug: 'realistic-life-size',
    priority: 1.0,
    coverImage: 'https://cdn.example.com/cat/torso-realistic.jpg',
    description: 'High-end TPE & Silicone torsos with realistic skin texture.',
    children: [
      { name: 'Full Torsos (TPE)', slug: 'tpe-torsos' }, // 按材质分，批发商算成本最快
      { name: 'Silicone Premium Models', slug: 'silicone-torsos' }, // 硅胶是高端线
      { name: 'Butt & Hip Models', slug: 'butt-masturbators' }  // 臀模是爆款子类
    ]
  },
  {
    name: 'Realistic Dildos', // 仿真阳具（独立类目，非简单振动器）
    slug: 'realistic-dildos',
    priority: 0.95,
    coverImage: 'https://cdn.example.com/cat/dildo-realistic.jpg',
    description: 'Ultra-realistic textures and dual-density technology.',
    children: [
      { name: 'Dual-Density (Soft Skin)', slug: 'dual-density' }, // 卖点：内硬外软
      { name: 'Suction Cup Base', slug: 'suction-cup-dildos' },   // 卖点：吸盘
      { name: 'Non-Vibrating Classics', slug: 'classic-dildos' } // 区分带电和不带电
    ]
  },
  {
    name: 'Male Masturbators', // 传统男用器具（如飞机杯、前列腺按摩）
    slug: 'male-masturbators',
    priority: 0.85,
    children: [
      { name: 'Manual Strokers', slug: 'manual-strokers' },
      { name: 'Automatic Cup Series', slug: 'automatic-cups' },
      { name: 'Prostate Massagers', slug: 'prostate-massagers' }
    ]
  },
  {
    name: 'Vibrators & Tech', // 振动器（归为电子技术类）
    slug: 'vibrators',
    priority: 0.8,
    children: [
      { name: 'Wand Vibrators', slug: 'wand-vibrators' },
      { name: 'G-Spot Vibrators', slug: 'g-spot-vibrators' },
      { name: 'Rabbit Vibrators', slug: 'rabbit-vibrators' },
      { name: 'Bullet Vibrators', slug: 'bullet-vibrators' },
      { name: 'App-Controlled Toys', slug: 'app-controlled' }
    ]
  },
  {
    name: 'BDSM & Bondage', // 原有分类保留，优先级放后
    slug: 'bdsm-bondage',
    priority: 0.7
  }
];

// 辅助函数：根据 slug 查找分类
export const findCategoryBySlug = (slug: string): CategoryItem | undefined => {
  for (const category of categories) {
    if (category.slug === slug) return category;
    if (category.children) {
      const child = category.children.find(c => c.slug === slug);
      if (child) return child;
    }
  }
  return undefined;
};

// 辅助函数：获取父分类
export const getParentCategory = (childSlug: string): CategoryItem | undefined => {
  for (const category of categories) {
    if (category.children?.some(child => child.slug === childSlug)) {
      return category;
    }
  }
  return undefined;
};

// 辅助函数：获取所有叶子节点（没有子分类的分类）
export const getLeafCategories = (): CategoryItem[] => {
  const leaves: CategoryItem[] = [];
  categories.forEach(category => {
    if (!category.children || category.children.length === 0) {
      leaves.push(category);
    } else {
      category.children.forEach(child => leaves.push(child));
    }
  });
  return leaves;
};