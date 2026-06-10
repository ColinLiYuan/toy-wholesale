'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { expenseAdminService } from '@/services/expense-service';
import type { Expense } from '@/types/expense';
import { EXPENSE_TYPE_LABELS, EXPENSE_TYPE_CATEGORIES } from '@/types/expense';

export default function NewExpensePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expenseType = searchParams.get('type') || 'ADMIN';

  const [saving, setSaving] = useState(false);
  const label = EXPENSE_TYPE_LABELS[expenseType] || expenseType;
  const categories = EXPENSE_TYPE_CATEGORIES[expenseType] || [];
  const title = `新增${label}支出`;

  const [formData, setFormData] = useState<Partial<Expense>>({
    type: expenseType,
    expenseDate: new Date().toISOString().split('T')[0],
    category: categories[0]?.value || '',
    amount: 0,
    description: '',
    expenseBy: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) {
      alert('请输入有效的金额');
      return;
    }
    if (!formData.expenseDate) {
      alert('请选择日期');
      return;
    }

    setSaving(true);
    try {
      await expenseAdminService.createExpense(formData);
      alert('支出记录创建成功');
      router.push(`/admin/expenses?type=${expenseType}`);
    } catch (err: any) {
      alert('创建失败: ' + (err.userMessage || err.message || '未知错误'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/admin/expenses?type=${expenseType}`} className="text-blue-600 hover:underline mb-2 inline-block">
          ← 返回列表
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期 <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={formData.expenseDate || ''}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类 <span className="text-red-500">*</span></label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">金额 <span className="text-red-500">*</span></label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">支出人</label>
            <input
              type="text"
              value={formData.expenseBy || ''}
              onChange={(e) => setFormData({ ...formData, expenseBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              placeholder="经手人"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            placeholder="用途说明"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/admin/expenses?type=${expenseType}`} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">取消</Link>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#00F2FE] text-gray-900 rounded-lg font-semibold hover:bg-[#00d4e0] transition-colors disabled:opacity-50">
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
