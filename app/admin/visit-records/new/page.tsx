'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { visitRecordAdminService, supplierService, supplierAdminService, distributorAdminService } from '@/services';
import type { VisitRecord, Supplier, Distributor } from '@/types';

export default function NewVisitRecordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<VisitRecord>>({
    visitType: 'SUPPLIER_VISIT',
    supplierId: undefined,
    distributorId: undefined,
    visitedPerson: '',
    visitedPosition: '',
    visitedContact: '',
    visitDate: '',
    location: '',
    purpose: '',
    summary: '',
    nextAction: '',
    createdBy: '',
  });
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // 加载供应商和经销商列表
  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [supplierResult, distributorResult] = await Promise.all([
          supplierAdminService.getAllSuppliers(0, 200),
          distributorAdminService.getActiveDistributors().catch(() => [] as Distributor[]),
        ]);
        setSuppliers(supplierResult.content || (Array.isArray(supplierResult) ? supplierResult : []));
        setDistributors(Array.isArray(distributorResult) ? distributorResult : []);
      } catch (error) {
        console.error('Failed to load options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 构造提交数据
      const submitData: Partial<VisitRecord> = {
        visitType: formData.visitType,
        visitedPerson: formData.visitedPerson,
        visitedPosition: formData.visitedPosition,
        visitedContact: formData.visitedContact,
        visitDate: formData.visitDate,
        location: formData.location,
        purpose: formData.purpose,
        summary: formData.summary,
        nextAction: formData.nextAction,
        createdBy: formData.createdBy,
      };

      if (formData.visitType === 'SUPPLIER_VISIT') {
        submitData.supplierId = formData.supplierId;
      } else {
        submitData.distributorId = formData.distributorId;
      }

      await visitRecordAdminService.createVisitRecord(submitData);
      alert('访问记录创建成功');
      router.push('/admin/visit-records');
    } catch (error: any) {
      console.error('Failed to create visit record:', error);

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
          <Link href="/admin/visit-records" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回访问记录列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新增访问记录</h1>
          <p className="text-gray-600 mt-1">记录供应商拜访或客户拜访信息</p>
        </div>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {/* 访问类型 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">访问类型</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">访问类型 *</label>
                <select
                  required
                  value={formData.visitType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visitType: e.target.value as 'SUPPLIER_VISIT' | 'CUSTOMER_VISIT',
                      supplierId: undefined,
                      distributorId: undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="SUPPLIER_VISIT">供应商拜访</option>
                  <option value="CUSTOMER_VISIT">客户拜访</option>
                </select>
              </div>

              {/* 根据访问类型显示对应的下拉框 */}
              {formData.visitType === 'SUPPLIER_VISIT' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">供应商</label>
                  <select
                    value={formData.supplierId || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierId: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    disabled={loadingOptions}
                  >
                    <option value="">-- 选择供应商 --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">客户（经销商）</label>
                  <select
                    value={formData.distributorId || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, distributorId: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    disabled={loadingOptions}
                  >
                    <option value="">-- 选择客户 --</option>
                    {distributors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}{d.country ? ` (${d.country})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* 被访人信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">被访人信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">被访人</label>
                <input
                  type="text"
                  value={formData.visitedPerson || ''}
                  onChange={(e) => setFormData({ ...formData, visitedPerson: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入被访人姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">职位</label>
                <input
                  type="text"
                  value={formData.visitedPosition || ''}
                  onChange={(e) => setFormData({ ...formData, visitedPosition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入被访人职位"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">联系方式</label>
                <input
                  type="text"
                  value={formData.visitedContact || ''}
                  onChange={(e) => setFormData({ ...formData, visitedContact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="电话/微信/WhatsApp"
                />
              </div>
            </div>
          </div>

          {/* 访问详情 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">访问详情</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">访问日期</label>
                <input
                  type="date"
                  value={formData.visitDate || ''}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">地点</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入访问地点"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">目的</label>
                <input
                  type="text"
                  value={formData.purpose || ''}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入访问目的"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">总结</label>
                <textarea
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入访问总结..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">下一步行动</label>
                <input
                  type="text"
                  value={formData.nextAction || ''}
                  onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入下一步行动"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">记录人</label>
                <input
                  type="text"
                  value={formData.createdBy || ''}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入记录人姓名"
                />
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/admin/visit-records"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : '创建访问记录'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
