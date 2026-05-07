'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { leadAdminService } from '@/services';
import type { Lead } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statistics, setStatistics] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchLeads();
    fetchStatistics();
  }, [currentPage, statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      let data;
      if (statusFilter === 'ALL') {
        data = await leadAdminService.getAllLeads(currentPage, 20);
      } else {
        data = await leadAdminService.getLeadsByStatus(statusFilter, currentPage, 20);
      }
      setLeads(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await leadAdminService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此潜客吗？')) return;
    try {
      await leadAdminService.deleteLead(id);
      fetchLeads();
      fetchStatistics();
    } catch (error) {
      console.error('Failed to delete lead:', error);
      alert('删除失败');
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await leadAdminService.updateLeadStatus(leadId, newStatus);
      fetchLeads();
      fetchStatistics();
      alert('状态更新成功');
    } catch (error: any) {
      console.error('Failed to update status:', error);
      alert('状态更新失败：' + error.message);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      NEW: '新线索',
      CONTACTED: '已联系',
      INTERESTED: '有意向',
      QUOTED: '已报价',
      NEGOTIATING: '谈判中',
      CONVERTED: '已成交',
      INVALID: '无效',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800',
      CONTACTED: 'bg-yellow-100 text-yellow-800',
      INTERESTED: 'bg-green-100 text-green-800',
      QUOTED: 'bg-purple-100 text-purple-800',
      NEGOTIATING: 'bg-orange-100 text-orange-800',
      CONVERTED: 'bg-teal-100 text-teal-800',
      INVALID: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, string> = {
      HIGH: '高',
      MEDIUM: '中',
      LOW: '低',
    };
    return priorityMap[priority] || priority;
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      HIGH: 'bg-red-100 text-red-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-green-100 text-green-800',
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-800';
  };

  // 定义状态流转规则
  const statusTransitions: Record<string, string[]> = {
    NEW: ['CONTACTED', 'INVALID'],
    CONTACTED: ['INTERESTED', 'INVALID'],
    INTERESTED: ['QUOTED', 'INVALID'],
    QUOTED: ['NEGOTIATING', 'INVALID'],
    NEGOTIATING: ['CONVERTED', 'INVALID'],
    CONVERTED: [],
    INVALID: [],
  };

  // 获取当前状态可流转的下一个状态
  const getNextStatusOptions = (currentStatus: string) => {
    return statusTransitions[currentStatus] || [];
  };

  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (lead.companyName && lead.companyName.toLowerCase().includes(searchLower)) ||
      (lead.contactPerson && lead.contactPerson.toLowerCase().includes(searchLower)) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
      (lead.phone && lead.phone.includes(searchTerm))
    );
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">潜客管理</h1>
          <p className="text-gray-600 mt-1">管理销售线索和潜在客户</p>
        </div>
        <Link
          href="/admin/leads/new"
          className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
        >
          ➕ 添加新潜客
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">新线索</p>
          <p className="text-2xl font-bold text-blue-600">{statistics.new || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">已联系</p>
          <p className="text-2xl font-bold text-yellow-600">{statistics.contacted || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">有意向</p>
          <p className="text-2xl font-bold text-green-600">{statistics.interested || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">已报价</p>
          <p className="text-2xl font-bold text-purple-600">{statistics.quoted || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">谈判中</p>
          <p className="text-2xl font-bold text-orange-600">{statistics.negotiating || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">已成交</p>
          <p className="text-2xl font-bold text-teal-600">{statistics.converted || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">无效</p>
          <p className="text-2xl font-bold text-gray-600">{statistics.invalid || 0}</p>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索潜客</label>
            <input
              type="text"
              placeholder="搜索公司名称、联系人、邮箱或电话..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态筛选</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            >
              <option value="ALL">所有状态</option>
              <option value="NEW">新线索</option>
              <option value="CONTACTED">已联系</option>
              <option value="INTERESTED">有意向</option>
              <option value="QUOTED">已报价</option>
              <option value="NEGOTIATING">谈判中</option>
              <option value="CONVERTED">已成交</option>
              <option value="INVALID">无效</option>
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              共 {filteredLeads.length} 个潜客
            </p>
          </div>
        </div>
      </div>

      {/* 潜客列表 */}
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">公司信息</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">联系人</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">联系方式</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">状态</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">优先级</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">来源</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{lead.companyName || '-'}</h3>
                          {lead.website && (
                            <a 
                              href={lead.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {lead.website}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{lead.contactPerson || '-'}</p>
                          {lead.position && (
                            <p className="text-xs text-gray-500">{lead.position}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {lead.email && <p className="text-gray-900">{lead.email}</p>}
                          {lead.phone && <p className="text-gray-600">{lead.phone}</p>}
                          {lead.imAccount && <p className="text-xs text-gray-500">IM: {lead.imAccount}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(lead.status || 'NEW')}`}>
                            {getStatusText(lead.status || 'NEW')}
                          </span>
                          {getNextStatusOptions(lead.status || 'NEW').length > 0 && (
                            <select
                              value=""
                              onChange={(e) => e.target.value && handleStatusChange(lead.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                            >
                              <option value="">切换状态</option>
                              {getNextStatusOptions(lead.status || 'NEW').map(status => (
                                <option key={status} value={status}>
                                  {getStatusText(status)}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${getPriorityColor(lead.priority || 'MEDIUM')}`}>
                          {getPriorityText(lead.priority || 'MEDIUM')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.source || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            查看
                          </Link>
                          <button
                            onClick={() => handleDelete(lead.id)}
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

            {filteredLeads.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">暂无潜客数据</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
