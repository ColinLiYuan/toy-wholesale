'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const statusColorMap: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUOTING: 'bg-purple-100 text-purple-800',
  NEGOTIATING: 'bg-orange-100 text-orange-800',
  CONVERTED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [stats, setStats] = useState({
    newCount: 0,
    contactedCount: 0,
    quotingCount: 0,
    negotiatingCount: 0,
    convertedCount: 0,
    closedCount: 0,
  });

  useEffect(() => {
    fetchInquiries();
    fetchStats();
  }, [currentPage, statusFilter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      let response;
      if (statusFilter) {
        response = await inquiryAdminService.getInquiriesByStatus(statusFilter, currentPage, 20);
      } else {
        response = await inquiryAdminService.getAllInquiries(currentPage, 20);
      }
      setInquiries(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('获取询盘列表失败:', error);
      alert('获取询盘列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // 这里可以调用后端统计接口，暂时用前端计算
      const response = await inquiryAdminService.getAllInquiries(0, 1000);
      const allInquiries = response.content || [];
      
      const newCount = allInquiries.filter((i: Inquiry) => i.status === 'NEW').length;
      const contactedCount = allInquiries.filter((i: Inquiry) => i.status === 'CONTACTED').length;
      const quotingCount = allInquiries.filter((i: Inquiry) => i.status === 'QUOTING').length;
      const negotiatingCount = allInquiries.filter((i: Inquiry) => i.status === 'NEGOTIATING').length;
      const convertedCount = allInquiries.filter((i: Inquiry) => i.status === 'CONVERTED').length;
      const closedCount = allInquiries.filter((i: Inquiry) => i.status === 'CLOSED').length;

      setStats({
        newCount,
        contactedCount,
        quotingCount,
        negotiatingCount,
        convertedCount,
        closedCount,
      });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const handleViewDetail = (id: number) => {
    router.push(`/admin/inquiries/${id}`);
  };

  const handleAssignSalesperson = async (id: number) => {
    const salesperson = prompt('请输入销售人员姓名:');
    if (!salesperson) return;

    try {
      await inquiryAdminService.assignToSalesperson(id, salesperson);
      alert('分配成功');
      fetchInquiries();
    } catch (error) {
      console.error('分配失败:', error);
      alert('分配失败');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!confirm(`确认将状态更改为 "${statusMap[newStatus]}"？`)) return;

    try {
      await inquiryAdminService.updateInquiryStatus(id, newStatus);
      alert('状态更新成功');
      fetchInquiries();
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('更新状态失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除此询盘？此操作不可恢复！')) return;

    try {
      await inquiryAdminService.deleteInquiry(id);
      alert('删除成功');
      fetchInquiries();
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const handleConvertToLead = async (id: number) => {
    if (!confirm('确认将此询盘转化为潜客？')) return;

    try {
      await inquiryAdminService.convertToLead(id);
      alert('转化成功');
      fetchInquiries();
    } catch (error) {
      console.error('转化失败:', error);
      alert('转化失败');
    }
  };

  const handleCloseInquiry = async (id: number) => {
    if (!confirm('确认关闭此询盘？关闭后将无法恢复。')) return;

    try {
      await inquiryAdminService.updateInquiryStatus(id, 'CLOSED');
      alert('询盘已关闭');
      fetchInquiries();
    } catch (error) {
      console.error('关闭失败:', error);
      alert('关闭失败');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">询盘管理</h1>
        <p className="mt-2 text-sm text-gray-600">管理客户提交的询盘信息</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">新询盘</div>
          <div className="text-2xl font-bold text-blue-600">{stats.newCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">已联系</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.contactedCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">报价中</div>
          <div className="text-2xl font-bold text-purple-600">{stats.quotingCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">谈判中</div>
          <div className="text-2xl font-bold text-orange-600">{stats.negotiatingCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">已转化</div>
          <div className="text-2xl font-bold text-green-600">{stats.convertedCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">已关闭</div>
          <div className="text-2xl font-bold text-gray-600">{stats.closedCount}</div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">状态筛选:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="NEW">新询盘</option>
            <option value="CONTACTED">已联系</option>
            <option value="QUOTING">报价中</option>
            <option value="NEGOTIATING">谈判中</option>
            <option value="CONVERTED">已转化</option>
            <option value="CLOSED">已关闭</option>
          </select>
        </div>
      </div>

      {/* 询盘列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">加载中...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无询盘数据</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    询盘编号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产品数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    销售人员
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提交时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.inquiryNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{inquiry.customerName}</div>
                      <div className="text-sm text-gray-500">{inquiry.customerEmail}</div>
                      {inquiry.companyName && (
                        <div className="text-xs text-gray-400">{inquiry.companyName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inquiry.items?.length || 0} 个产品
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColorMap[inquiry.status || 'NEW']
                        }`}
                      >
                        {statusMap[inquiry.status || 'NEW']}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inquiry.assignedTo || '未分配'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(inquiry.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(inquiry.id!)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        查看
                      </button>
                      {!inquiry.assignedTo && (
                        <button
                          onClick={() => handleAssignSalesperson(inquiry.id!)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          分配
                        </button>
                      )}
                      {inquiry.status === 'NEW' && (
                        <button
                          onClick={() => handleUpdateStatus(inquiry.id!, 'CONTACTED')}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          标记已联系
                        </button>
                      )}
                      <button
                        onClick={() => handleConvertToLead(inquiry.id!)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        生成潜客
                      </button>
                      {inquiry.status !== 'CLOSED' && (
                        <button
                          onClick={() => handleCloseInquiry(inquiry.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          关闭
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  共 {totalElements} 条记录，第 {currentPage + 1} / {totalPages} 页
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
