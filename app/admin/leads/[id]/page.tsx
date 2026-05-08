'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { leadAdminService } from '@/services';
import type { Lead, FollowUpRecord } from '@/types';

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = Number(params.id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([]);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState<Partial<FollowUpRecord>>({
    followUpType: 'EMAIL',
    result: 'NO_RESPONSE',
  });
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [showStatusHistory, setShowStatusHistory] = useState(false);

  useEffect(() => {
    if (leadId) {
      fetchLead();
      fetchFollowUpRecords();
      fetchStatusHistory();
    }
  }, [leadId]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const data = await leadAdminService.getLeadById(leadId);
      setLead(data);
      setFormData(data);
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      alert('获取潜客信息失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowUpRecords = async () => {
    try {
      const data = await leadAdminService.getFollowUpRecords(leadId, 0, 100);
      setFollowUpRecords(data.content || []);
    } catch (error) {
      console.error('Failed to fetch follow-up records:', error);
    }
  };

  const fetchStatusHistory = async () => {
    try {
      const data = await leadAdminService.getStatusHistory(leadId, 0, 100);
      setStatusHistory(data.content || []);
    } catch (error) {
      console.error('Failed to fetch status history:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await leadAdminService.updateLead(leadId, formData);
      setEditing(false);
      fetchLead();
      alert('更新成功');
    } catch (error) {
      console.error('Failed to update lead:', error);
      alert('更新失败');
    }
  };

  const handleAddFollowUp = async () => {
    try {
      await leadAdminService.addFollowUp(leadId, newFollowUp);
      setShowFollowUpForm(false);
      setNewFollowUp({ followUpType: 'EMAIL', result: 'NO_RESPONSE' });
      fetchFollowUpRecords();
      fetchLead();
      alert('跟进记录添加成功');
    } catch (error) {
      console.error('Failed to add follow-up:', error);
      alert('添加跟进记录失败');
    }
  };

  const handleQuickConvert = async () => {
    const customerType = prompt(
      `请选择客户类型（输入数字）：\n1. 正规经销商 (REGULAR)\n2. 小B商户 (SMALL_BUSINESS)\n3. 个人客户 (INDIVIDUAL)\n\n默认为小B商户`,
      '2'
    );
    
    if (customerType === null) return; // 用户取消
    
    const typeMap: Record<string, string> = {
      '1': 'REGULAR',
      '2': 'SMALL_BUSINESS',
      '3': 'INDIVIDUAL',
    };
    
    const selectedType = typeMap[customerType] || 'SMALL_BUSINESS';
    
    if (!lead) return;
    
    if (!confirm(`确定要将 "${lead.companyName || lead.contactPerson}" 快速转化为 ${selectedType} 类型的经销商吗？\n系统将自动生成账号和密码。`)) {
      return;
    }
    
    try {
      const result = await leadAdminService.quickConvertToDistributor(leadId, selectedType);
      
      // 显示生成的账号信息
      alert(
        `转化成功！\n\n` +
        `经销商ID: ${result.distributorId}\n` +
        `邮箱: ${result.email}\n` +
        `密码: ${result.password}\n` +
        `客户类型: ${result.customerTypeDescription}\n\n` +
        `请妥善保存账号信息并发送给客户。`
      );
      
      fetchLead();
    } catch (error: any) {
      console.error('Failed to convert lead:', error);
      alert('转化失败：' + error.message);
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

  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, string> = {
      HIGH: '高',
      MEDIUM: '中',
      LOW: '低',
    };
    return priorityMap[priority] || priority;
  };

  const getSourceText = (source: string) => {
    const sourceMap: Record<string, string> = {
      EMAIL: '邮件开发',
      EXHIBITION: '展会',
      WEBSITE: '网站询盘',
      REFERRAL: '推荐',
      COLD_CALL: '电话开发',
    };
    return sourceMap[source] || source;
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

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">潜客不存在</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/leads" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回潜客列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">潜客详情</h1>
          <p className="text-gray-600 mt-1">{lead.companyName || '未填写公司名称'}</p>
        </div>
        <div className="flex space-x-3">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
            >
              编辑
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(lead);
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
            </>
          )}
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
            {editing ? (
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.companyName || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">联系人</label>
            {editing ? (
              <input
                type="text"
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.contactPerson || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">职位</label>
            {editing ? (
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.position || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            {editing ? (
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.email || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
            {editing ? (
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.phone || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp/微信</label>
            {editing ? (
              <input
                type="text"
                value={formData.imAccount || ''}
                onChange={(e) => setFormData({ ...formData, imAccount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.imAccount || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">网站</label>
            {editing ? (
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              lead.website ? (
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {lead.website}
                </a>
              ) : (
                <p className="text-gray-900">-</p>
              )
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
            {editing ? (
              <select
                value={formData.status || 'NEW'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              >
                <option value="NEW">新线索</option>
                <option value="CONTACTED">已联系</option>
                <option value="INTERESTED">有意向</option>
                <option value="QUOTED">已报价</option>
                <option value="NEGOTIATING">谈判中</option>
                <option value="CONVERTED">已成交</option>
                <option value="INVALID">无效</option>
              </select>
            ) : (
              <span className="inline-flex px-3 py-1 text-sm rounded-full font-medium bg-blue-100 text-blue-800">
                {getStatusText(lead.status || 'NEW')}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
            {editing ? (
              <select
                value={formData.priority || 'MEDIUM'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              >
                <option value="HIGH">高</option>
                <option value="MEDIUM">中</option>
                <option value="LOW">低</option>
              </select>
            ) : (
              <span className="inline-flex px-3 py-1 text-sm rounded-full font-medium bg-yellow-100 text-yellow-800">
                {getPriorityText(lead.priority || 'MEDIUM')}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">来源</label>
            {editing ? (
              <select
                value={formData.source || ''}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              >
                <option value="">请选择</option>
                <option value="EMAIL">邮件开发</option>
                <option value="EXHIBITION">展会</option>
                <option value="WEBSITE">网站询盘</option>
                <option value="REFERRAL">推荐</option>
                <option value="COLD_CALL">电话开发</option>
              </select>
            ) : (
              <p className="text-gray-900">{getSourceText(lead.source || '')}</p>
            )}
          </div>
        </div>
      </div>

      {/* 地址信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">地址信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">国家</label>
            {editing ? (
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.country || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">省份/州</label>
            {editing ? (
              <input
                type="text"
                value={formData.region || ''}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.region || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
            {editing ? (
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.city || '-'}</p>
            )}
          </div>
        </div>
      </div>

      {/* 业务信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">业务信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">预计采购量</label>
            {editing ? (
              <input
                type="number"
                value={formData.estimatedQuantity || ''}
                onChange={(e) => setFormData({ ...formData, estimatedQuantity: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.estimatedQuantity || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">预算范围（USD）</label>
            {editing ? (
              <input
                type="text"
                value={formData.budgetRange || ''}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{lead.budgetRange || '-'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            {editing ? (
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{lead.notes || '-'}</p>
            )}
          </div>
        </div>
      </div>

      {/* 转化信息 */}
      {lead.isConverted && (
        <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-4">✅ 已转化为经销商</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-700">经销商ID</p>
              <p className="text-lg font-semibold text-green-900">{lead.convertedDistributorId}</p>
            </div>
            <div>
              <p className="text-sm text-green-700">转化时间</p>
              <p className="text-lg font-semibold text-green-900">
                {lead.convertedAt ? new Date(lead.convertedAt).toLocaleString('zh-CN') : '-'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href={`/admin/distributors/${lead.convertedDistributorId}`}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              查看经销商详情 →
            </Link>
          </div>
        </div>
      )}

      {/* 状态历史 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">状态变更历史</h2>
          <button
            onClick={() => setShowStatusHistory(!showStatusHistory)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showStatusHistory ? '收起' : '展开'}
          </button>
        </div>
        {showStatusHistory && (
          <div className="space-y-3">
            {statusHistory.map((history) => (
              <div key={history.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {getStatusText(history.oldStatus || '未知')}
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className="text-sm font-medium text-blue-600">
                      {getStatusText(history.newStatus)}
                    </span>
                  </div>
                  {history.changeReason && (
                    <p className="text-sm text-gray-600">原因：{history.changeReason}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    操作人：{history.operator || '系统'} | {history.createdAt ? new Date(history.createdAt).toLocaleString('zh-CN') : '-'}
                  </p>
                </div>
              </div>
            ))}
            {statusHistory.length === 0 && (
              <p className="text-center text-gray-500 py-4">暂无状态变更记录</p>
            )}
          </div>
        )}
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
