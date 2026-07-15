'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { visitRecordAdminService } from '@/services';
import type { VisitRecord } from '@/types';

export default function VisitRecordsPage() {
  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchRecords();
  }, [currentPage, visitTypeFilter]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await visitRecordAdminService.getAllVisitRecords(
        currentPage,
        20,
        visitTypeFilter || undefined
      );
      setRecords(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch visit records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除此访问记录？此操作不可恢复！')) return;
    try {
      await visitRecordAdminService.deleteVisitRecord(id);
      fetchRecords();
    } catch (error) {
      console.error('Failed to delete visit record:', error);
      alert('删除失败');
    }
  };

  const getVisitTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      SUPPLIER_VISIT: '供应商拜访',
      CUSTOMER_VISIT: '客户拜访',
    };
    return typeMap[type] || type;
  };

  const getVisitTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      SUPPLIER_VISIT: 'bg-blue-100 text-blue-800',
      CUSTOMER_VISIT: 'bg-green-100 text-green-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  const getCompanyName = (record: VisitRecord): string => {
    if (record.visitType === 'SUPPLIER_VISIT' && record.supplier) {
      return record.supplier.name;
    }
    if (record.visitType === 'CUSTOMER_VISIT' && record.distributor) {
      return record.distributor.name;
    }
    return '-';
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">访问记录</h1>
          <p className="text-gray-600 mt-1">管理供应商拜访和客户拜访记录</p>
        </div>
        <Link
          href="/admin/visit-records/new"
          className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
        >
          ➕ 新增访问记录
        </Link>
      </div>

      {/* 筛选 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">访问类型</label>
            <select
              value={visitTypeFilter}
              onChange={(e) => {
                setVisitTypeFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            >
              <option value="">全部</option>
              <option value="SUPPLIER_VISIT">供应商拜访</option>
              <option value="CUSTOMER_VISIT">客户拜访</option>
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              共 {records.length} 条记录（总计 {totalElements} 条）
            </p>
          </div>
        </div>
      </div>

      {/* 访问记录列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">访问类型</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">公司</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">被访人</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">日期</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">地点</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">目的</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">记录人</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${getVisitTypeColor(record.visitType)}`}>
                          {getVisitTypeText(record.visitType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <h3 className="font-semibold text-gray-900">{getCompanyName(record)}</h3>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.visitedPerson || '-'}
                        {record.visitedPosition && (
                          <p className="text-xs text-gray-500">{record.visitedPosition}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(record.visitDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.location || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                        {record.purpose || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.createdBy || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/visit-records/${record.id}/edit`}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(record.id!)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  第 {currentPage + 1} 页，共 {totalPages} 页
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}

            {records.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">暂无访问记录</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
