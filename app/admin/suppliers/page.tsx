'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supplierAdminService } from '@/services';
import type { Supplier } from '@/types';
import { countryName } from '@/lib/countries';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierAdminService.getAllSuppliers(currentPage, 20);
      setSuppliers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除此供应商？此操作不可恢复！')) return;
    try {
      await supplierAdminService.deleteSupplier(id);
      fetchSuppliers();
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      alert('删除失败');
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (supplier.name && supplier.name.toLowerCase().includes(searchLower)) ||
      (supplier.internalCode && supplier.internalCode.toLowerCase().includes(searchLower)) ||
      (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchLower)) ||
      (supplier.phone && supplier.phone.includes(searchTerm))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">供应商管理</h1>
          <p className="text-gray-600 mt-1">管理产品供应商信息</p>
        </div>
        <Link
          href="/admin/suppliers/new"
          className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
        >
          ➕ 新建供应商
        </Link>
      </div>

      {/* 搜索 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索供应商</label>
            <input
              type="text"
              placeholder="搜索名称、编码、联系人或电话..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              共 {filteredSuppliers.length} 个供应商（总计 {totalElements} 个）
            </p>
          </div>
        </div>
      </div>

      {/* 供应商列表 */}
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">名称</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">内部编码</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">联系人</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">电话</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">国家</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{supplier.id}</td>
                      <td className="px-6 py-4">
                        <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.internalCode || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{supplier.contactPerson || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{supplier.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.country ? countryName(supplier.country) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/suppliers/${supplier.id}`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            查看
                          </Link>
                          <Link
                            href={`/admin/suppliers/${supplier.id}`}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                          >
                            编辑
                          </Link>
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

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">暂无供应商数据</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
