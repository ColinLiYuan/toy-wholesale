'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { distributorAdminService } from '@/services';
import { Distributor, FollowUpRecord } from '@/types';

export default function DistributorDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [distributor, setDistributor] = useState<Distributor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Distributor>>({});
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([]);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState<Partial<FollowUpRecord>>({
    followUpType: 'EMAIL',
    result: 'NO_RESPONSE',
  });

  useEffect(() => {
    fetchDistributor();
    fetchFollowUpRecords();
  }, [params.id]);

  const fetchDistributor = async () => {
    setLoading(true);
    try {
      const data = await distributorAdminService.getDistributorById(parseInt(params.id!));
      if (data) {
        setDistributor(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Failed to fetch distributor:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowUpRecords = async () => {
    try {
      const data = await distributorAdminService.getFollowUpRecords(parseInt(params.id!), 0, 100);
      setFollowUpRecords(data.content || []);
    } catch (error) {
      console.error('Failed to fetch follow-up records:', error);
    }
  };

  const handleAddFollowUp = async () => {
    try {
      await distributorAdminService.addFollowUp(parseInt(params.id!), newFollowUp);
      setShowFollowUpForm(false);
      setNewFollowUp({ followUpType: 'EMAIL', result: 'NO_RESPONSE' });
      fetchFollowUpRecords();
      alert('跟进记录添加成功');
    } catch (error) {
      console.error('Failed to add follow-up:', error);
      alert('添加跟进记录失败');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await distributorAdminService.updateDistributor(distributor!.id!, formData);
      setDistributor(formData as Distributor);
      setIsEditing(false);
      alert('更新成功');
    } catch (error) {
      alert('更新失败，请稍后重试');
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">活跃</span>;
      case 'INACTIVE':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">未激活</span>;
      case 'SUSPENDED':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">暂停</span>;
      case 'BLACKLISTED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">黑名单</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">未知</span>;
    }
  };

  const getLevelBadge = (level?: string) => {
    switch (level) {
      case 'GOLD':
        return <span className="px-2 py-0.5 bg-yellow-500 text-white rounded text-xs">金牌经销商</span>;
      case 'SILVER':
        return <span className="px-2 py-0.5 bg-gray-400 text-white rounded text-xs">银牌经销商</span>;
      case 'BRONZE':
        return <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-xs">铜牌经销商</span>;
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

  const getFollowUpTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      EMAIL: '邮件',
      PHONE: '电话',
      MEETING: '会议',
      IM: '即时通讯',
      OTHER: '其他',
    };
    return typeMap[type] || type;
  };

  const getResultText = (result: string) => {
    const resultMap: Record<string, string> = {
      NO_RESPONSE: '无回复',
      INTERESTED: '有兴趣',
      REQUEST_QUOTE: '要求报价',
      NEGOTIATING: '谈判中',
      REJECTED: '拒绝',
    };
    return resultMap[result] || result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
      </div>
    );
  }

  if (!distributor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">经销商不存在</p>
        <Link href="/admin/distributors" className="text-[#00F2FE] hover:underline mt-4 inline-block">
          返回经销商列表
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{distributor.name}</h1>
          <p className="text-gray-600 mt-1">经销商详情</p>
        </div>
        <Link
          href="/admin/distributors"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          返回列表
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">经销商名称</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{distributor.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">经销商编码</label>
                  <p className="text-gray-900 font-mono">{distributor.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">客户类型</label>
                  {isEditing ? (
                    <select
                      name="customerType"
                      value={formData.customerType || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="REGULAR">正规经销商</option>
                      <option value="SMALL_BUSINESS">小B商户</option>
                      <option value="INDIVIDUAL">个人客户</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{getCustomerTypeLabel(distributor.customerType)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">经销商等级</label>
                  {isEditing ? (
                    <select
                      name="level"
                      value={formData.level || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="GOLD">金牌</option>
                      <option value="SILVER">银牌</option>
                      <option value="BRONZE">铜牌</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{distributor.level || '-'}</span>
                      {getLevelBadge(distributor.level)}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系人</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{distributor.contactPerson || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{distributor.phone || '-'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  />
                ) : (
                  <p className="text-blue-600">{distributor.email || '-'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">地址信息</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">国家</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{distributor.country || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">省份/州</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="region"
                      value={formData.region || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{distributor.region || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{distributor.city || '-'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{distributor.address || '-'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">其他信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司网址</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  />
                ) : (
                  <p className="text-blue-600">{distributor.website || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{distributor.description || '-'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">状态信息</h2>
            <div className="flex items-center justify-between py-4">
              <span className="text-gray-600">当前状态</span>
              {getStatusBadge(distributor.status)}
            </div>
            {distributor.creditRating && (
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <span className="text-gray-600">信用评级</span>
                <span className="font-semibold text-gray-900">{distributor.creditRating}</span>
              </div>
            )}
            {distributor.createdAt && (
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <span className="text-gray-600">创建时间</span>
                <span className="text-gray-900">{new Date(distributor.createdAt).toLocaleString()}</span>
              </div>
            )}
            {distributor.updatedAt && (
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <span className="text-gray-600">更新时间</span>
                <span className="text-gray-900">{new Date(distributor.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>


        </div>
      </div>

      {/* 跟进记录 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">跟进记录 ({followUpRecords.length})</h2>
          <button
            onClick={() => setShowFollowUpForm(!showFollowUpForm)}
            className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
          >
            {showFollowUpForm ? '取消' : '添加跟进'}
          </button>
        </div>

        {showFollowUpForm && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">新增跟进记录</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">跟进方式</label>
                <select
                  value={newFollowUp.followUpType || 'EMAIL'}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, followUpType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="EMAIL">邮件</option>
                  <option value="PHONE">电话</option>
                  <option value="MEETING">会议</option>
                  <option value="IM">即时通讯</option>
                  <option value="OTHER">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">跟进结果</label>
                <select
                  value={newFollowUp.result || 'NO_RESPONSE'}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, result: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="NO_RESPONSE">无回复</option>
                  <option value="INTERESTED">有兴趣</option>
                  <option value="REQUEST_QUOTE">要求报价</option>
                  <option value="NEGOTIATING">谈判中</option>
                  <option value="REJECTED">拒绝</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">跟进内容</label>
              <textarea
                value={newFollowUp.content || ''}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, content: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                placeholder="请输入跟进内容..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">下次行动建议</label>
              <input
                type="text"
                value={newFollowUp.nextAction || ''}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, nextAction: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                placeholder="例如：发送产品目录、安排样品等"
              />
            </div>
            <button
              onClick={handleAddFollowUp}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              提交
            </button>
          </div>
        )}

        <div className="space-y-4">
          {followUpRecords.map((record) => (
            <div key={record.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="inline-flex px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 mr-2">
                    {getFollowUpTypeText(record.followUpType || '')}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                    {getResultText(record.result || '')}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {record.createdAt ? new Date(record.createdAt).toLocaleString('zh-CN') : '-'}
                </span>
              </div>
              <p className="text-gray-900 mb-2 whitespace-pre-wrap">{record.content || '-'}</p>
              {record.nextAction && (
                <p className="text-sm text-gray-600">
                  <strong>下次行动：</strong>{record.nextAction}
                </p>
              )}
              {record.followUpBy && (
                <p className="text-xs text-gray-500 mt-2">
                  跟进人：{record.followUpBy}
                </p>
              )}
            </div>
          ))}
          {followUpRecords.length === 0 && (
            <p className="text-center text-gray-500 py-4">暂无跟进记录</p>
          )}
        </div>
      </div>
    </div>
  );
}
