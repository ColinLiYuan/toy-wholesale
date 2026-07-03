'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { quotationAdminService } from '@/services';
import type { Quotation } from '@/types';
import { countryName } from '@/lib/countries';

export default function QuotationPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchQuotations();
  }, [currentPage, statusFilter]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const status = statusFilter === 'ALL' ? undefined : statusFilter;
      const data = await quotationAdminService.getAllQuotations(currentPage, 20, 'createdAt', 'DESC', status);
      setQuotations(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除此报价单？此操作不可恢复！')) return;
    try {
      await quotationAdminService.deleteQuotation(id);
      fetchQuotations();
    } catch (error) {
      console.error('Failed to delete quotation:', error);
      alert('删除失败');
    }
  };

  const handleSend = async (id: number) => {
    if (!confirm('确认发送此报价单？发送后状态将变为"已发送"。')) return;
    try {
      await quotationAdminService.sendQuotation(id);
      fetchQuotations();
    } catch (error: any) {
      console.error('Failed to send quotation:', error);
      alert('发送失败: ' + error.message);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const statusLabels: Record<string, string> = {
      ACCEPTED: '接受',
      DECLINED: '拒绝',
      EXPIRED: '过期',
    };
    const label = statusLabels[newStatus] || newStatus;
    if (!confirm(`确认将报价单标记为"${label}"？`)) return;
    try {
      await quotationAdminService.updateQuotationStatus(id, newStatus);
      fetchQuotations();
    } catch (error: any) {
      console.error('Failed to update status:', error);
      alert('更新失败: ' + error.message);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      DRAFT: '草稿',
      SENT: '已发送',
      ACCEPTED: '已接受',
      DECLINED: '已拒绝',
      EXPIRED: '已过期',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SENT: 'bg-blue-100 text-blue-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      DECLINED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">报价单管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理客户产品报价单（{totalElements} 条记录）
          </p>
        </div>
        <Link
          href="/admin/quotation/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 新建报价单
        </Link>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">状态：</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="ALL">全部</option>
              <option value="DRAFT">草稿</option>
              <option value="SENT">已发送</option>
              <option value="ACCEPTED">已接受</option>
              <option value="DECLINED">已拒绝</option>
              <option value="EXPIRED">已过期</option>
            </select>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          加载中...
        </div>
      ) : quotations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          暂无报价单数据，点击"新建报价单"开始创建
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  报价单号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  总金额 (USD)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  有效期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {q.quotationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {q.title || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {q.distributor?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(q.status)}`}>
                      {getStatusText(q.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${q.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {q.validUntil ? formatDate(q.validUntil) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(q.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/quotation/${q.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      查看/编辑
                    </Link>
                    <button
                      onClick={() => quotationAdminService.exportPdf(q.id!, q.quotationNumber)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      导出PDF
                    </button>
                    {q.status === 'DRAFT' && (
                      <button
                        onClick={() => handleSend(q.id!)}
                        className="text-green-600 hover:text-green-900"
                      >
                        发送
                      </button>
                    )}
                    {q.status === 'SENT' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(q.id!, 'ACCEPTED')}
                          className="text-green-600 hover:text-green-900"
                        >
                          接受
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(q.id!, 'DECLINED')}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          拒绝
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(q.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm px-6 py-3">
          <span className="text-sm text-gray-600">
            第 {currentPage + 1} / {totalPages} 页，共 {totalElements} 条
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
