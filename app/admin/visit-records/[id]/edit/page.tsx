'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { visitRecordAdminService, supplierAdminService, distributorAdminService } from '@/services';
import type { VisitRecord, Supplier, Distributor } from '@/types';

export default function EditVisitRecordPage() {
  const router = useRouter();
  const params = useParams();
  const recordId = Number(params.id);

  const [formData, setFormData] = useState<Partial<VisitRecord>>({
    visitType: 'SUPPLIER_VISIT', supplierId: undefined, distributorId: undefined,
    visitedPerson: '', visitedPosition: '', visitedContact: '',
    visitDate: '', location: '', purpose: '', summary: '', nextAction: '', createdBy: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  useEffect(() => {
    Promise.all([
      visitRecordAdminService.getVisitRecordById(recordId),
      supplierAdminService.getAllSuppliers(0, 200),
      distributorAdminService.getActiveDistributors().catch(() => [] as Distributor[]),
    ]).then(([record, supRes, distRes]) => {
      setFormData({
        visitType: record.visitType,
        supplierId: record.supplierId || record.supplier?.id,
        distributorId: record.distributorId || record.distributor?.id,
        visitedPerson: record.visitedPerson || '',
        visitedPosition: record.visitedPosition || '',
        visitedContact: record.visitedContact || '',
        visitDate: record.visitDate || '',
        location: record.location || '',
        purpose: record.purpose || '',
        summary: record.summary || '',
        nextAction: record.nextAction || '',
        createdBy: record.createdBy || '',
      });
      setSuppliers(supRes.content || (Array.isArray(supRes) ? supRes : []));
      setDistributors(Array.isArray(distRes) ? distRes : []);
      setFetching(false);
    }).catch(err => { console.error(err); alert('加载失败'); router.push('/admin/visit-records'); });
  }, [recordId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData: any = { ...formData };
      if (submitData.visitType === 'SUPPLIER_VISIT') {
        delete submitData.distributorId;
      } else {
        delete submitData.supplierId;
      }
      await visitRecordAdminService.updateVisitRecord(recordId, submitData);
      alert('访问记录已更新');
      router.push('/admin/visit-records');
    } catch (error: any) {
      alert('更新失败: ' + (error.message || ''));
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="text-center py-12 text-gray-500">加载中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/visit-records" className="text-blue-600 hover:underline mb-2 inline-block">← 返回列表</Link>
          <h1 className="text-2xl font-bold text-gray-900">编辑访问记录</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">访问类型</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">访问类型 *</label>
                <select required value={formData.visitType}
                  onChange={(e) => setFormData({ ...formData, visitType: e.target.value as any, supplierId: undefined, distributorId: undefined })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="SUPPLIER_VISIT">供应商拜访</option>
                  <option value="CUSTOMER_VISIT">客户拜访</option>
                </select>
              </div>
              {formData.visitType === 'SUPPLIER_VISIT' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">供应商</label>
                  <select value={formData.supplierId || ''}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">-- 选择供应商 --</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">客户（经销商）</label>
                  <select value={formData.distributorId || ''}
                    onChange={(e) => setFormData({ ...formData, distributorId: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">-- 选择客户 --</option>
                    {distributors.map((d) => <option key={d.id} value={d.id}>{d.name}{d.country ? ` (${d.country})` : ''}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">被访人信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">被访人</label>
                <input type="text" value={formData.visitedPerson || ''} onChange={(e) => setFormData({ ...formData, visitedPerson: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">职位</label>
                <input type="text" value={formData.visitedPosition || ''} onChange={(e) => setFormData({ ...formData, visitedPosition: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">联系方式</label>
                <input type="text" value={formData.visitedContact || ''} onChange={(e) => setFormData({ ...formData, visitedContact: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">访问详情</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">访问日期</label>
                <input type="date" value={formData.visitDate || ''} onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">地点</label>
                <input type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">目的</label>
                <input type="text" value={formData.purpose || ''} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">总结</label>
                <textarea value={formData.summary || ''} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">下一步行动</label>
                <input type="text" value={formData.nextAction || ''} onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">记录人</label>
                <input type="text" value={formData.createdBy || ''} onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link href="/admin/visit-records" className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700">取消</Link>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] disabled:opacity-50">
              {loading ? '保存中...' : '保存修改'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
