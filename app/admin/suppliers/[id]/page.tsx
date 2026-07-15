'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supplierAdminService, visitRecordAdminService } from '@/services';
import type { Supplier, VisitRecord } from '@/types';
import CountrySelect from '@/components/CountrySelect';

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [supplier, setSupplier] = useState<Partial<Supplier>>({
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
    country: '',
    internalCode: '',
  });

  useEffect(() => {
    if (supplierId) {
      fetchSupplier();
      visitRecordAdminService.getAllVisitRecords(0, 200)
        .then(res => setVisitRecords((res.content || []).filter((r: VisitRecord) => r.supplier?.id === supplierId)))
        .catch(() => {});
    }
  }, [supplierId]);

  const fetchSupplier = async () => {
    try {
      setFetching(true);
      const data = await supplierAdminService.getSupplierById(supplierId);
      setSupplier(data);
    } catch (error) {
      console.error('Failed to fetch supplier:', error);
      alert('获取供应商信息失败');
      router.push('/admin/suppliers');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm('确定要保存更改吗？')) return;

    setLoading(true);
    try {
      await supplierAdminService.updateSupplier(supplierId, supplier);
      alert('更新成功');
      router.push('/admin/suppliers');
    } catch (error) {
      console.error('Failed to update supplier:', error);
      alert('更新失败');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/suppliers" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">编辑供应商</h1>
          <p className="text-gray-600 mt-1">修改供应商信息</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/suppliers"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            取消
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
            <input
              type="text"
              required
              value={supplier.name || ''}
              onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">内部编码</label>
            <input
              type="text"
              value={supplier.internalCode || ''}
              onChange={(e) => setSupplier({ ...supplier, internalCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">联系人</label>
            <input
              type="text"
              value={supplier.contactPerson || ''}
              onChange={(e) => setSupplier({ ...supplier, contactPerson: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
            <input
              type="text"
              value={supplier.phone || ''}
              onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">地址</label>
            <input
              type="text"
              value={supplier.address || ''}
              onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">国家</label>
            <CountrySelect
              value={supplier.country || ''}
              onChange={(code) => setSupplier({ ...supplier, country: code })}
            />
          </div>
        </div>
      </div>

      {supplierId > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">访问记录</h2>
            <Link href={`/admin/visit-records/new`}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              + 新增访问
            </Link>
          </div>
          {visitRecords.length === 0 ? (
            <p className="text-gray-500 text-sm">暂无访问记录</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">日期</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">被访人</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">地点</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">目的</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">记录人</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{r.visitDate || '-'}</td>
                    <td className="px-4 py-2">{r.visitedPerson || '-'}</td>
                    <td className="px-4 py-2">{r.location || '-'}</td>
                    <td className="px-4 py-2">{r.purpose || '-'}</td>
                    <td className="px-4 py-2">{r.createdBy || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
