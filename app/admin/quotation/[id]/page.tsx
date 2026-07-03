'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { quotationAdminService, distributorAdminService, productAdminService } from '@/services';
import type { Distributor, Product, Quotation } from '@/types';
import { countryName } from '@/lib/countries';

interface QuotationItemForm {
  productId: number;
  productName: string;
  productSku: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  notes: string;
}

export default function EditQuotationPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  const [formData, setFormData] = useState({
    distributorId: 0,
    title: '',
    validUntil: '',
    tradeTerms: '',
    sellerCompanyName: '',
    sellerAddress: '',
    sellerContactPerson: '',
    sellerPhone: '',
    sellerEmail: '',
    notes: '',
    internalNotes: '',
  });

  const [items, setItems] = useState<QuotationItemForm[]>([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qt, distList, prodList] = await Promise.all([
        quotationAdminService.getQuotationById(id),
        distributorAdminService.getActiveDistributors(),
        productAdminService.getAllProducts(0, 200),
      ]);
      setQuotation(qt);
      setDistributors(distList || []);
      setProducts(prodList?.content || []);

      setFormData({
        distributorId: qt.distributor?.id || qt.distributorId || 0,
        title: qt.title || '',
        validUntil: qt.validUntil ? qt.validUntil.split('T')[0] : '',
        tradeTerms: qt.tradeTerms || '',
        sellerCompanyName: qt.sellerCompanyName || '',
        sellerAddress: qt.sellerAddress || '',
        sellerContactPerson: qt.sellerContactPerson || '',
        sellerPhone: qt.sellerPhone || '',
        sellerEmail: qt.sellerEmail || '',
        notes: qt.notes || '',
        internalNotes: qt.internalNotes || '',
      });

      if (qt.items && qt.items.length > 0) {
        setItems(qt.items.map(i => ({
          productId: i.productId,
          productName: i.productName || '',
          productSku: i.productSku || '',
          productImage: i.productImage || '',
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          notes: i.notes || '',
        })));
      } else {
        setItems([{ productId: 0, productName: '', productSku: '', productImage: '', quantity: 1, unitPrice: 0, notes: '' }]);
      }
    } catch (error) {
      console.error('Failed to load quotation:', error);
      alert('加载报价单数据失败');
      router.push('/admin/quotation');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.unitPrice || 0);
  }, 0);

  const handleItemChange = (index: number, field: keyof QuotationItemForm, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };

    if (field === 'productId' && value) {
      const product = products.find(p => p.id === Number(value));
      if (product) {
        item.productName = product.name || '';
        item.productSku = product.sku || '';
        item.productImage = product.image || '';
        if (!item.unitPrice || item.unitPrice === 0) {
          item.unitPrice = product.currentPrice || 0;
        }
      }
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: 0, productName: '', productSku: '', productImage: '', quantity: 1, unitPrice: 0, notes: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.distributorId || formData.distributorId === 0) {
      alert('请选择客户（经销商）');
      return;
    }

    const validItems = items.filter(i => i.productId && i.productId > 0);
    if (validItems.length === 0) {
      alert('请至少添加一个产品');
      return;
    }

    try {
      setSaving(true);
      await quotationAdminService.updateQuotation(id, {
        distributorId: formData.distributorId,
        title: formData.title || undefined,
        validUntil: formData.validUntil || undefined,
        tradeTerms: formData.tradeTerms || undefined,
        sellerCompanyName: formData.sellerCompanyName || undefined,
        sellerAddress: formData.sellerAddress || undefined,
        sellerContactPerson: formData.sellerContactPerson || undefined,
        sellerPhone: formData.sellerPhone || undefined,
        sellerEmail: formData.sellerEmail || undefined,
        notes: formData.notes || undefined,
        internalNotes: formData.internalNotes || undefined,
        items: validItems.map(i => ({
          productId: i.productId,
          productName: i.productName,
          productSku: i.productSku,
          productImage: i.productImage,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          notes: i.notes || undefined,
        })),
      });
      alert('报价单更新成功！');
      router.push('/admin/quotation');
    } catch (error: any) {
      console.error('Failed to update quotation:', error);
      alert('更新失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!quotation) return;
    if (!confirm('确认发送此报价单？发送后将通知客户。')) return;
    try {
      await quotationAdminService.sendQuotation(id);
      alert('报价单已发送！');
      loadData();
    } catch (error: any) {
      alert('发送失败: ' + error.message);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    const statusLabels: Record<string, string> = {
      ACCEPTED: '接受',
      DECLINED: '拒绝',
      EXPIRED: '过期',
    };
    const label = statusLabels[newStatus] || newStatus;
    if (!confirm(`确认将此报价单标记为"${label}"？`)) return;
    try {
      await quotationAdminService.updateQuotationStatus(id, newStatus);
      alert(`报价单已${label}`);
      loadData();
    } catch (error: any) {
      alert('更新失败: ' + error.message);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      DRAFT: '草稿', SENT: '已发送', ACCEPTED: '已接受', DECLINED: '已拒绝', EXPIRED: '已过期',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        加载报价单数据中...
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="text-center py-12 text-gray-500">
        报价单不存在或已被删除
        <div className="mt-4">
          <Link href="/admin/quotation" className="text-blue-600 hover:text-blue-900">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            编辑报价单 — {quotation.quotationNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            状态：{getStatusText(quotation.status)} | 创建时间：{quotation.createdAt ? new Date(quotation.createdAt).toLocaleString('zh-CN') : '-'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => quotationAdminService.exportPdf(id, quotation.quotationNumber)}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
          >
            导出PDF
          </button>
          {quotation.status === 'DRAFT' && (
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              发送报价单
            </button>
          )}
          {quotation.status === 'SENT' && (
            <>
              <button
                onClick={() => handleUpdateStatus('ACCEPTED')}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                标记为已接受
              </button>
              <button
                onClick={() => handleUpdateStatus('DECLINED')}
                className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
              >
                标记为已拒绝
              </button>
              <button
                onClick={() => handleUpdateStatus('EXPIRED')}
                className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
              >
                标记为已过期
              </button>
            </>
          )}
          <Link
            href="/admin/quotation"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            返回列表
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                客户（经销商）<span className="text-red-500">*</span>
              </label>
              <select
                value={formData.distributorId}
                onChange={(e) => setFormData({ ...formData, distributorId: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
              >
                <option value={0}>-- 请选择客户 --</option>
                {distributors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code}) - {countryName(d.country || '') || '-'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">报价单标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">有效期</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">对外备注</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">内部备注</label>
              <textarea
                value={formData.internalNotes}
                onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">贸易模式</label>
              <select
                value={formData.tradeTerms}
                onChange={(e) => setFormData({ ...formData, tradeTerms: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">-- 选择贸易术语 --</option>
                <option value="FOB">FOB - 船上交货</option>
                <option value="CIF">CIF - 成本+保险+运费</option>
                <option value="EXW">EXW - 工厂交货</option>
                <option value="CFR">CFR - 成本+运费</option>
                <option value="DDP">DDP - 完税后交货</option>
              </select>
            </div>
          </div>
        </div>

        {/* 卖家信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">卖家信息（显示在报价单上）</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
              <input type="text" value={formData.sellerCompanyName}
                onChange={(e) => setFormData({ ...formData, sellerCompanyName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">地址</label>
              <input type="text" value={formData.sellerAddress}
                onChange={(e) => setFormData({ ...formData, sellerAddress: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">联系人</label>
              <input type="text" value={formData.sellerContactPerson}
                onChange={(e) => setFormData({ ...formData, sellerContactPerson: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
              <input type="text" value={formData.sellerPhone}
                onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input type="text" value={formData.sellerEmail}
                onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        {/* 产品明细 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">产品明细</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + 添加产品
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-3">
                    <label className="block text-xs text-gray-500 mb-1">产品 <span className="text-red-500">*</span></label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                    >
                      <option value={0}>-- 选择产品 --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.sku ? `(${p.sku})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">数量</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">单价(USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">小计</label>
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-900 bg-gray-50 rounded-md">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">备注</label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                      placeholder="可选"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">产品信息</label>
                    <div className="text-xs text-gray-600 bg-gray-50 rounded-md px-2 py-1.5 truncate">
                      {item.productName || '未选择'}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-2 py-1.5 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                      disabled={items.length <= 1}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 合计 */}
          <div className="mt-4 flex justify-end">
            <div className="bg-gray-50 rounded-lg px-6 py-3">
              <span className="text-sm text-gray-600">报价总额：</span>
              <span className="text-lg font-semibold text-blue-600 ml-2">
                ${totalAmount.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/quotation"
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '保存中...' : '保存修改'}
          </button>
        </div>
      </form>
    </div>
  );
}
