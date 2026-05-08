'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { inquiryAdminService } from '@/services';
import type { Inquiry } from '@/types';

const statusMap: Record<string, string> = {
  NEW: '新询盘',
  CONTACTED: '已联系',
  QUOTING: '报价中',
  NEGOTIATING: '谈判中',
  CONVERTED: '已转化',
  CLOSED: '已关闭',
};

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = Number(params.id);

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiry();
  }, [inquiryId]);

  const fetchInquiry = async () => {
    try {
      setLoading(true);
      const data = await inquiryAdminService.getInquiryById(inquiryId);
      setInquiry(data);
    } catch (error) {
      console.error('获取询盘详情失败:', error);
      alert('获取询盘详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!confirm(`确认将状态更改为 "${statusMap[newStatus]}"？`)) return;

    try {
      await inquiryAdminService.updateInquiryStatus(inquiryId, newStatus);
      alert('状态更新成功');
      fetchInquiry();
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('更新状态失败');
    }
  };

  const handleAssignSalesperson = async () => {
    const salesperson = prompt('请输入销售人员姓名:');
    if (!salesperson) return;

    try {
      await inquiryAdminService.assignToSalesperson(inquiryId, salesperson);
      alert('分配成功');
      fetchInquiry();
    } catch (error) {
      console.error('分配失败:', error);
      alert('分配失败');
    }
  };

  const handleDelete = async () => {
    if (!confirm('确认删除此询盘？此操作不可恢复！')) return;

    try {
      await inquiryAdminService.deleteInquiry(inquiryId);
      alert('删除成功');
      router.push('/admin/inquiries');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const handleConvertToLead = async () => {
    if (!confirm('确认将此询盘转化为潜客？')) return;

    try {
      await inquiryAdminService.convertToLead(inquiryId);
      alert('转化成功');
    } catch (error) {
      console.error('转化失败:', error);
      alert('转化失败');
    }
  };

  const handleCloseInquiry = async () => {
    if (!confirm('确认关闭此询盘？关闭后将无法恢复。')) return;

    try {
      await inquiryAdminService.updateInquiryStatus(inquiryId, 'CLOSED');
      alert('询盘已关闭');
      router.push('/admin/inquiries');
    } catch (error) {
      console.error('关闭失败:', error);
      alert('关闭失败');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  const parseSpecifications = (specStr?: string) => {
    if (!specStr) return null;
    try {
      return JSON.parse(specStr);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">询盘不存在</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-blue-600 hover:text-blue-900"
      >
        ← 返回列表
      </button>

      {/* 标题和状态 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">询盘详情</h1>
          <p className="mt-2 text-sm text-gray-600">编号: {inquiry.inquiryNumber}</p>
        </div>
        <div className="flex gap-2">
          <select
            value={inquiry.status || 'NEW'}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NEW">新询盘</option>
            <option value="CONTACTED">已联系</option>
            <option value="QUOTING">报价中</option>
            <option value="NEGOTIATING">谈判中</option>
            <option value="CONVERTED">已转化</option>
            <option value="CLOSED">已关闭</option>
          </select>
          {!inquiry.assignedTo && (
            <button
              onClick={handleAssignSalesperson}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              分配销售人员
            </button>
          )}
          <button
            onClick={handleConvertToLead}
            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
          >
            生成潜客
          </button>
          {inquiry.status !== 'CLOSED' && (
            <button
              onClick={handleCloseInquiry}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              关闭询盘
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：客户信息和询盘信息 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 客户信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">客户信息</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">姓名</label>
                <div className="text-sm font-medium text-gray-900">{inquiry.customerName}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">邮箱</label>
                <div className="text-sm font-medium text-gray-900">{inquiry.customerEmail}</div>
              </div>
              {inquiry.customerPhone && (
                <div>
                  <label className="text-sm text-gray-500">电话/WhatsApp</label>
                  <div className="text-sm font-medium text-gray-900">{inquiry.customerPhone}</div>
                </div>
              )}
              {inquiry.companyName && (
                <div>
                  <label className="text-sm text-gray-500">公司名称</label>
                  <div className="text-sm font-medium text-gray-900">{inquiry.companyName}</div>
                </div>
              )}
              {inquiry.country && (
                <div>
                  <label className="text-sm text-gray-500">国家</label>
                  <div className="text-sm font-medium text-gray-900">{inquiry.country}</div>
                </div>
              )}
            </div>
          </div>

          {/* 询盘信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">询盘信息</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">状态</label>
                <div className="text-sm font-medium text-gray-900">
                  {statusMap[inquiry.status || 'NEW']}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">来源</label>
                <div className="text-sm font-medium text-gray-900">{inquiry.source || '-'}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">销售人员</label>
                <div className="text-sm font-medium text-gray-900">
                  {inquiry.assignedTo || '未分配'}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">提交时间</label>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(inquiry.createdAt)}
                </div>
              </div>
              {inquiry.contactedAt && (
                <div>
                  <label className="text-sm text-gray-500">首次联系时间</label>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(inquiry.contactedAt)}
                  </div>
                </div>
              )}
              {inquiry.convertedAt && (
                <div>
                  <label className="text-sm text-gray-500">转化时间</label>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(inquiry.convertedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 客户留言 */}
          {inquiry.message && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">客户留言</h2>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {inquiry.message}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：询单项列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              感兴趣的产品 ({inquiry.items?.length || 0})
            </h2>

            {inquiry.items && inquiry.items.length > 0 ? (
              <div className="space-y-4">
                {inquiry.items.map((item, index) => {
                  const specs = parseSpecifications(item.specifications);
                  return (
                    <div
                      key={item.id || index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* 产品图片 */}
                        {item.productImage && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                          </div>
                        )}

                        {/* 产品信息 */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                {item.productName || `产品 #${item.productId}`}
                              </h3>
                              {item.skuId && (
                                <p className="text-sm text-gray-500 mt-1">SKU ID: {item.skuId}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                数量: {item.quantity}
                              </div>
                            </div>
                          </div>

                          {/* 规格快照 */}
                          {specs && Object.keys(specs).length > 0 && (
                            <div className="mt-3">
                              <label className="text-xs text-gray-500">产品规格:</label>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {Object.entries(specs).map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {key}: {String(value)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 备注 */}
                          {item.notes && (
                            <div className="mt-3">
                              <label className="text-xs text-gray-500">客户备注:</label>
                              <p className="mt-1 text-sm text-gray-700">{item.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                暂无产品信息
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
