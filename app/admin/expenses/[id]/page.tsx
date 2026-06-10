'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { expenseAdminService } from '@/services/expense-service';
import type { Expense } from '@/types/expense';
import { EXPENSE_TYPE_CATEGORIES } from '@/types/expense';

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await expenseAdminService.getExpenseById(id);
        setExpense(data);
      } catch (err: any) {
        alert('加载失败: ' + (err.message || '未知错误'));
        router.push('/admin/expenses');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!expense) return;
    if (!expense.amount || expense.amount <= 0) {
      alert('请输入有效的金额');
      return;
    }
    setSaving(true);
    try {
      await expenseAdminService.updateExpense(id, expense);
      alert('保存成功');
      router.push(`/admin/expenses?type=${expense.type || 'ADMIN'}`);
    } catch (err: any) {
      alert('保存失败: ' + (err.userMessage || err.message || '未知错误'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这笔支出记录吗？')) return;
    try {
      await expenseAdminService.deleteExpense(id);
      router.push(`/admin/expenses?type=${expense?.type || 'ADMIN'}`);
    } catch (err: any) {
      alert('删除失败: ' + (err.message || '未知错误'));
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
      </div>
    );
  }

  if (!expense) return null;

  const categories = EXPENSE_TYPE_CATEGORIES[expense.type] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/admin/expenses?type=${expense.type || 'ADMIN'}`} className="text-blue-600 hover:underline mb-2 inline-block">
          ← 返回列表
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">编辑支出</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input
              type="date"
              value={expense.expenseDate || ''}
              onChange={(e) => setExpense({ ...expense, expenseDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select
              value={expense.category || ''}
              onChange={(e) => setExpense({ ...expense, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">金额</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={expense.amount || ''}
              onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">支出人</label>
            <input
              type="text"
              value={expense.expenseBy || ''}
              onChange={(e) => setExpense({ ...expense, expenseBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
            value={expense.description || ''}
            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button onClick={handleDelete} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">删除</button>
          <div className="flex gap-3">
            <Link href={`/admin/expenses?type=${expense.type || 'ADMIN'}`} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">取消</Link>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#00F2FE] text-gray-900 rounded-lg font-semibold hover:bg-[#00d4e0] transition-colors disabled:opacity-50">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
