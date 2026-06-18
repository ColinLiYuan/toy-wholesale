'use client';

import { useState, useEffect } from 'react';
import { incomeService } from '@/services/income-service';
import type { Income } from '@/types/income';
import { INCOME_CATEGORIES } from '@/types/income';

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Income> | null>(null);
  const [form, setForm] = useState({ type: 'SALES', amount: 0, currency: 'CNY', category: '订单收入', incomeDate: new Date().toISOString().slice(0,10), description: '', incomeBy: '' });
  const [stats, setStats] = useState<{ total: Record<string,number>; monthTotal: Record<string,number> }>({ total: {}, monthTotal: {} });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/v1/incomes/stats');
      const json = await res.json();
      if (json.code === 200) setStats(json.data);
    } catch (e) { console.error(e); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await incomeService.list(undefined, page, 20);
      setIncomes(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); fetchData(); }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem?.id) {
        await incomeService.update(editItem.id, form);
      } else {
        await incomeService.create(form);
      }
      setShowModal(false); setEditItem(null);
      setForm({ type: 'SALES', amount: 0, currency: 'CNY', category: '订单收入', incomeDate: new Date().toISOString().slice(0,10), description: '', incomeBy: '' });
      fetchData();
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return;
    await incomeService.delete(id);
    fetchData();
  };

  const openEdit = (item: Income) => {
    setEditItem(item);
    setForm({ type: item.type, amount: item.amount, currency: item.currency || 'CNY', category: item.category, incomeDate: item.incomeDate, description: item.description || '', incomeBy: item.incomeBy || '' });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">收入管理</h1>
        <button onClick={() => { setEditItem(null); setForm({ type: 'SALES', amount: 0, currency: 'CNY', category: '订单收入', incomeDate: new Date().toISOString().slice(0,10), description: '', incomeBy: '' }); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ 新增收入</button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">本月收入</p>
          {Object.entries(stats.monthTotal || {}).map(([cur, amt]) => (
            <p key={cur} className="text-xl font-bold text-green-600">{cur === 'CNY' ? '¥' : '$'}{(amt||0).toLocaleString()}</p>
          ))}
          {!Object.keys(stats.monthTotal||{}).length && <p className="text-xl font-bold text-gray-400">0</p>}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">累计收入</p>
          {Object.entries(stats.total || {}).map(([cur, amt]) => (
            <p key={cur} className="text-xl font-bold text-gray-900">{cur === 'CNY' ? '¥' : '$'}{(amt||0).toLocaleString()}</p>
          ))}
          {!Object.keys(stats.total||{}).length && <p className="text-xl font-bold text-gray-400">0</p>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">日期</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">类型</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">分类</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">金额</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">描述</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">来源</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center text-gray-400">加载中...</td></tr>
            ) : incomes.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-gray-400">暂无收入记录</td></tr>
            ) : incomes.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{item.incomeDate}</td>
                <td className="px-4 py-2 text-sm">{item.type}</td>
                <td className="px-4 py-2 text-sm">{item.category}</td>
                <td className="px-4 py-2 text-sm text-right font-semibold">{item.currency} {item.amount?.toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-gray-500 max-w-[200px] truncate">{item.description || '-'}</td>
                <td className="px-4 py-2 text-xs text-gray-400">{item.source ? `${item.source}#${item.sourceId}` : '手动'}</td>
                <td className="px-4 py-2 text-sm space-x-2">
                  <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline">编辑</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">共 {totalElements} 条</span>
            <div className="flex gap-1">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-40">上一页</button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-40">下一页</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">{editItem?.id ? '编辑收入' : '新增收入'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="block text-xs font-medium">日期</label><input type="date" value={form.incomeDate} onChange={e => setForm({...form, incomeDate: e.target.value})} className="w-full border rounded px-2 py-1 text-sm" required /></div>
              <div><label className="block text-xs font-medium">类型</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border rounded px-2 py-1 text-sm"><option value="SALES">SALES</option><option value="COMMISSION">COMMISSION</option><option value="OTHER">OTHER</option></select></div>
              <div><label className="block text-xs font-medium">分类</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded px-2 py-1 text-sm">{INCOME_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
              <div className="flex gap-2">
                <div className="flex-1"><label className="block text-xs font-medium">金额</label><input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value) || 0})} className="w-full border rounded px-2 py-1 text-sm" required /></div>
                <div><label className="block text-xs font-medium">币种</label><select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="border rounded px-2 py-1 text-sm"><option value="CNY">CNY</option><option value="USD">USD</option></select></div>
              </div>
              <div><label className="block text-xs font-medium">描述</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded px-2 py-1 text-sm" /></div>
              <div><label className="block text-xs font-medium">录入人</label><input type="text" value={form.incomeBy} onChange={e => setForm({...form, incomeBy: e.target.value})} className="w-full border rounded px-2 py-1 text-sm" /></div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-1.5 border rounded text-sm">取消</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">{editItem?.id ? '保存' : '创建'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
