'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { incomeService } from '@/services/income-service';
import type { Income } from '@/types/income';
import { INCOME_CATEGORIES } from '@/types/income';

export default function IncomesPage() {
  const searchParams = useSearchParams();
  const incomeType = searchParams.get('type') || '';
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [stats, setStats] = useState<{ total: Record<string,number>; monthTotal: Record<string,number> }>({ total: {}, monthTotal: {} });

  const fetchStats = async () => {
    try {
      const siteId = localStorage.getItem('admin_site_id') || '';
      const res = await fetch('/api/v1/incomes/stats', { headers: siteId ? { 'X-Site-Id': siteId } : {} });
      const json = await res.json();
      if (json.code === 200) setStats(json.data);
    } catch (e) { console.error(e); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await incomeService.list(incomeType || undefined, page, 20);
      setIncomes(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); fetchData(); }, [page, incomeType]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">收入管理</h1>
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
                <td className="px-4 py-2 text-xs text-gray-500">{item.sourceNumber || (item.source ? `${item.source}#${item.sourceId}` : '手动')}</td>
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

    </div>
  );
}
