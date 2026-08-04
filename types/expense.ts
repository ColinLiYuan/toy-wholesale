// ==================== 支出管理相关类型 ====================

export interface Expense {
  id: number;
  siteId?: string;
  type: string;       // PURCHASE / ADMIN / SALES / LOGISTICS / OTHER
  amount: number;
  currency?: string;  // CNY / USD
  category: string;
  expenseDate: string;
  description?: string;
  expenseBy?: string;
  source?: string;        // 来源类型：MANUAL / PURCHASE / ORDER
  sourceId?: number;      // 来源记录ID
  sourceNumber?: string;  // 来源单号（如 SO-xxx）
  tags?: string;
  syncStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 采购成本
export const PURCHASE_EXPENSE_CATEGORIES = [
  { value: '商品进货', label: '商品进货' },
  { value: '原材料', label: '原材料' },
  { value: '货品采购款', label: '货品采购款' },
];

// 管理费用
export const ADMIN_EXPENSE_CATEGORIES = [
  { value: '证照费用', label: '证照费用' },
  { value: '场地租金', label: '场地租金' },
  { value: '办公费', label: '办公费（手机/文具）' },
  { value: '服务器租赁', label: '服务器租赁' },
  { value: '宣传费', label: '宣传推广费' },
];

// 销售费用
export const SALES_EXPENSE_CATEGORIES = [
  { value: '快递箱', label: '快递箱' },
  { value: '产品包装袋', label: '产品包装袋' },
  { value: '产品礼盒', label: '产品礼盒' },
  { value: '快递袋', label: '快递袋' },
];

// 物流费用
export const LOGISTICS_EXPENSE_CATEGORIES = [
  { value: '快递运费', label: '快递运费' },
  { value: '配送费', label: '配送费' },
];

// 其他杂费
export const OTHER_EXPENSE_CATEGORIES = [
  { value: '维修', label: '维修' },
  { value: '差旅', label: '差旅' },
  { value: '招待', label: '招待' },
  { value: '报废', label: '报废' },
];

// type -> categories 映射
export const EXPENSE_TYPE_CATEGORIES: Record<string, { value: string; label: string }[]> = {
  PURCHASE: PURCHASE_EXPENSE_CATEGORIES,
  ADMIN: ADMIN_EXPENSE_CATEGORIES,
  SALES: SALES_EXPENSE_CATEGORIES,
  LOGISTICS: LOGISTICS_EXPENSE_CATEGORIES,
  OTHER: OTHER_EXPENSE_CATEGORIES,
};

// type -> 显示名称
export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  PURCHASE: '采购成本',
  ADMIN: '管理费用',
  SALES: '销售费用',
  LOGISTICS: '物流费用',
  OTHER: '其他杂费',
};

// 所有支持的支出类型
export const EXPENSE_TYPES = ['PURCHASE', 'ADMIN', 'SALES', 'LOGISTICS', 'OTHER'] as const;
