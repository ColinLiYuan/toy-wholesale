'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supplierAdminService } from '@/services';
import type { Supplier } from '@/types';
import { getSiteId } from '@/lib/api-client';
import CountrySelect from '@/components/CountrySelect';

export default function NewSupplierPage() {
  const router = useRouter();

  const currentSite = typeof window !== 'undefined' ? getSiteId() : 'toy';

  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
    country: '',
    internalCode: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supplierAdminService.createSupplier(formData);
      alert('供应商创建成功');
      router.push('/admin/suppliers');
    } catch (error: any) {
      console.error('Failed to create supplier:', error);

      let errorMessage = '创建失败';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`创建失败：${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/suppliers" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回供应商列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新建供应商</h1>
          <p className="text-gray-600 mt-1">填写供应商基本信息</p>
        </div>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {/* 基本信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入供应商名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">内部编码</label>
                <input
                  type="text"
                  value={formData.internalCode || ''}
                  onChange={(e) => setFormData({ ...formData, internalCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="如 WS, PF, DM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">联系人</label>
                <input
                  type="text"
                  value={formData.contactPerson || ''}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入联系人姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入电话号码"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">地址</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入供应商地址"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">国家</label>
                <CountrySelect
                  value={formData.country || ''}
                  onChange={(code) => setFormData({ ...formData, country: code })}
                />
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/admin/suppliers"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : '创建供应商'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
