'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { expenseAdminService } from '@/services/expense-service';
import type { Expense } from '@/types/expense';
import { EXPENSE_TYPE_LABELS, EXPENSE_TYPE_CATEGORIES } from '@/types/expense';

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const expenseType = searchParams.get('type') || 'ADMIN';

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const title = EXPENSE_TYPE_LABELS[expenseType] || expenseType;
  const categories = EXPENSE_TYPE_CATEGORIES[expenseType] || [];

  const [stats, setStats] = useState<{ total: Record<string,number>; monthTotal: Record<string,number> }>({ total: {}, monthTotal: {} });

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/v1/expenses/stats?type=${expenseType}`);
      const json = await res.json();
      if (json.code === 200) setStats(json.data);
    } catch (e) { console.error(e); }
  };

  const fetchExpenses = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await expenseAdminService.getAllExpenses(expenseType, pageNum, 20);
      setExpenses(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchExpenses(page);
  }, [page, expenseType]);

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这笔支出记录吗？')) return;
    try {
      await expenseAdminService.deleteExpense(id);
      fetchExpenses(page);
    } catch (err: any) {
      alert('删除失败: ' + (err.message || '未知错误'));
    }
  };

  const getCategoryLabel = (cat: string) => {
    const found = categories.find(c => c.value === cat);
    return found ? found.label : cat;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">共 {totalElements} 条记录</p>
        </div>
        <Link
          href={`/admin/expenses/new?type=${expenseType}`}
          className="px-4 py-2 bg-[#00F2FE] text-gray-900 rounded-lg font-semibold hover:bg-[#00d4e0] transition-colors"
        >
          + 新增支出
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">本月支出</p>
          {Object.entries(stats.monthTotal || {}).map(([cur, amt]) => (
            <p key={cur} className="text-xl font-bold text-red-600">{cur === 'CNY' ? '¥' : '$'}{(amt||0).toLocaleString()}</p>
          ))}
          {!Object.keys(stats.monthTotal||{}).length && <p className="text-xl font-bold text-gray-400">0</p>}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">累计支出</p>
          {Object.entries(stats.total || {}).map(([cur, amt]) => (
            <p key={cur} className="text-xl font-bold text-gray-900">{cur === 'CNY' ? '¥' : '$'}{(amt||0).toLocaleString()}</p>
          ))}
          {!Object.keys(stats.total||{}).length && <p className="text-xl font-bold text-gray-400">0</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">日期</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">分类</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">金额</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">备注</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">支出人</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">加载中...</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">暂无支出记录</td></tr>
            ) : expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{exp.expenseDate}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                    {getCategoryLabel(exp.category)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-red-600">
                  ¥{exp.amount?.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{exp.description || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exp.expenseBy || '-'}</td>
                <td className="px-6 py-4 text-sm text-right space-x-2">
                  <Link href={`/admin/expenses/${exp.id}`} className="text-blue-600 hover:underline">编辑</Link>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">上一页</button>
          <span className="px-3 py-1 text-sm text-gray-600">第 {page + 1} / {totalPages} 页</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">下一页</button>
        </div>
      )}
    </div>
  );
}
