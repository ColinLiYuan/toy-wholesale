'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { distributorAdminService } from '@/services';
import { Distributor } from '@/types';
import { formatPhoneWithCountryCode } from '@/lib/phone-formatter';
import { countryName } from '@/lib/countries';

export default function DistributorsPage() {
  const [loading, setLoading] = useState(true);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const fetchDistributors = async () => {
    setLoading(true);
    try {
      if (searchKeyword.trim()) {
        const result = await distributorAdminService.searchDistributors(searchKeyword.trim(), currentPage, 10);
        setDistributors(result.content);
        setTotalElements(result.totalElements);
        setTotalPages(result.totalPages);
        setIsSearching(true);
      } else {
        const result = await distributorAdminService.getActiveDistributors();
        setDistributors(result);
        setTotalElements(result.length);
        setTotalPages(1);
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Failed to fetch distributors:', error);
      setDistributors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchDistributors();
  };

  const handleReset = () => {
    setSearchKeyword('');
    setCustomerType('');
    setStatusFilter('');
    setCurrentPage(0);
    setIsSearching(false);
    fetchDistributors();
  };

  const filteredDistributors = distributors.filter(dist => {
    const typeMatch = !customerType || dist.customerType === customerType;
    const statusMatch = !statusFilter || dist.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">活跃</span>;
      case 'INACTIVE':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">未激活</span>;
      case 'SUSPENDED':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">暂停</span>;
      case 'BLACKLISTED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">黑名单</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">未知</span>;
    }
  };

  const getLevelBadge = (level?: string) => {
    switch (level) {
      case 'GOLD':
        return <span className="px-2 py-0.5 bg-yellow-500 text-white rounded text-xs">金牌</span>;
      case 'SILVER':
        return <span className="px-2 py-0.5 bg-gray-400 text-white rounded text-xs">银牌</span>;
      case 'BRONZE':
        return <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-xs">铜牌</span>;
      default:
        return null;
    }
  };

  const getCustomerTypeLabel = (type?: string) => {
    switch (type) {
      case 'REGULAR':
        return '正规经销商';
      case 'SMALL_BUSINESS':
        return '小B商户';
      case 'INDIVIDUAL':
        return '个人客户';
      default:
        return '未知';
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除经销商 "${name}" 吗？此操作无法撤销。`)) {
      return;
    }

    try {
      await distributorAdminService.deleteDistributor(id);
      setDistributors(prev => prev.filter(d => d.id !== id));
      alert('删除成功');
    } catch (error) {
      alert('删除失败，请稍后重试');
    }
  };

  const stats = {
    total: distributors.length,
    active: distributors.filter(d => d.status === 'ACTIVE').length,
    regular: distributors.filter(d => d.customerType === 'REGULAR').length,
    smallBusiness: distributors.filter(d => d.customerType === 'SMALL_BUSINESS' || d.customerType === 'INDIVIDUAL').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">经销商管理</h1>
          <p className="text-gray-600 mt-1">管理全球经销商网络和客户账户</p>
        </div>
        <Link
          href="/admin/distributors/new"
          className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
        >
          ➕ 添加新经销商
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">总经销商数</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">活跃经销商</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">正规经销商</p>
          <p className="text-2xl font-bold text-purple-600">{stats.regular}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">小B商户/个人</p>
          <p className="text-2xl font-bold text-orange-600">{stats.smallBusiness}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索经销商</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索公司名称、联系人、邮箱或电话..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
              >
                搜索
              </button>
              {searchKeyword && (
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  重置
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">客户类型</label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            >
              <option value="">所有类型</option>
              <option value="REGULAR">正规经销商</option>
              <option value="SMALL_BUSINESS">小B商户</option>
              <option value="INDIVIDUAL">个人客户</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            >
              <option value="">所有状态</option>
              <option value="ACTIVE">活跃</option>
              <option value="INACTIVE">未激活</option>
              <option value="SUSPENDED">暂停</option>
              <option value="BLACKLISTED">黑名单</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
          </div>
        ) : filteredDistributors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">没有找到匹配的经销商</p>
            <Link href="/admin/distributors/new" className="text-[#00F2FE] hover:underline">
              添加第一个经销商
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  共 {filteredDistributors.length} 条记录
                  {isSearching && <span className="ml-2 text-blue-600">(搜索结果)</span>}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">经销商</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系人</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系方式</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地区</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型/等级</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDistributors.map((distributor) => (
                    <tr key={distributor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{distributor.name}</p>
                          <p className="text-sm text-gray-500">编码: {distributor.code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{distributor.contactPerson}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {distributor.email && <p className="text-sm text-blue-600">{distributor.email}</p>}
                          {distributor.phone && <p className="text-sm text-gray-600">{formatPhoneWithCountryCode(distributor.phone)}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {distributor.country && <p className="text-sm text-gray-900">{countryName(distributor.country)}</p>}
                          {distributor.city && <p className="text-sm text-gray-500">{distributor.city}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{getCustomerTypeLabel(distributor.customerType)}</span>
                          {getLevelBadge(distributor.level)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(distributor.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/distributors/${distributor.id}`}
                            className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            查看
                          </Link>
                          <button
                            onClick={() => handleDelete(distributor.id!, distributor.name)}
                            className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
            {isSearching && totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  上一页
                </button>
                <span className="text-sm text-gray-600">
                  第 {currentPage + 1} / {totalPages} 页
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
