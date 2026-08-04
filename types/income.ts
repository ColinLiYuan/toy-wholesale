export interface Income {
  id: number;
  siteId?: string;
  type: string;
  amount: number;
  currency: string;
  category: string;
  incomeDate: string;
  description?: string;
  incomeBy?: string;
  source?: string;
  sourceId?: number;
  sourceNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const INCOME_TYPES = ['SALES', 'COMMISSION', 'OTHER'] as const;

export const INCOME_CATEGORIES = [
  { value: '订单收入', label: '订单收入' },
  { value: '佣金收入', label: '佣金收入' },
  { value: '其他收入', label: '其他收入' },
];
