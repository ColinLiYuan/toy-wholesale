'use client';

import { useState, useEffect } from 'react';

interface FinanceRecord {
  id: number;
  date: string;
  type: '收入' | '支出';
  amount: number;
  currency: string;
  category: string;
  description: string;
}

export default function FinancePage() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'ALL' | '收入' | '支出'>('ALL');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1100';
      const siteId = localStorage.getItem('admin_site_id') || '';
      const headers: Record<string, string> = siteId ? { 'X-Site-Id': siteId } : {};
      const [expRes, incRes] = await Promise.all([
        fetch(`${base}/api/v1/expenses?page=0&size=500`, { headers }),
        fetch(`${base}/api/v1/incomes?page=0&size=500`, { headers }),
      ]);
      const expenses = expRes.ok ? (await expRes.json()).data?.content || [] : [];
      const incomes = incRes.ok ? (await incRes.json()).data?.content || [] : [];

      const all: FinanceRecord[] = [
        ...expenses.map((e: any) => ({ id: e.id, date: e.expenseDate, type: '支出' as const, amount: e.amount, currency: e.currency || 'CNY', category: e.category, description: e.notes || '' })),
        ...incomes.map((i: any) => ({ id: i.id, date: i.incomeDate, type: '收入' as const, amount: i.amount, currency: i.currency || 'CNY', category: i.category, description: i.description || '' })),
      ];
      all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(all);

      const inc = incomes.reduce((s: number, i: any) => s + (i.amount || 0), 0);
      const exp = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);
      setTotalIncome(inc);
      setTotalExpense(exp);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = typeFilter === 'ALL' ? records : records.filter(r => r.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">财务流水</h1>
          <p className="mt-1 text-sm text-gray-500">收支汇总与明细</p>
        </div>
      </div>

      {/* 汇总卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500">总收入</p>
          <p className="text-2xl font-bold text-green-600">¥{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500">总支出</p>
          <p className="text-2xl font-bold text-red-600">¥{totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500">结余</p>
          <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ¥{(totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      {/* 筛选 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">类型：</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
            <option value="ALL">全部</option>
            <option value="收入">收入</option>
            <option value="支出">支出</option>
          </select>
        </div>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">加载中...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">分类</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">金额</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={`${r.type}-${r.id}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{r.date}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${r.type === '收入' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{r.category}</td>
                  <td className={`px-4 py-2 text-sm text-right font-medium ${r.type === '收入' ? 'text-green-600' : 'text-red-600'}`}>
                    {r.currency === 'USD' ? '$' : '¥'}{r.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">{r.description || '-'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无记录</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
