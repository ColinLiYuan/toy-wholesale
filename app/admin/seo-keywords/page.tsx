'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { seoKeywordService, SeoKeyword } from '@/services';
import type { KeywordDetailDTO } from '@/types';

// 搜索意图映射
const intentMap: Record<string, { label: string; color: string }> = {
  C: { label: '商业', color: 'bg-blue-100 text-blue-800' },
  T: { label: '交易', color: 'bg-green-100 text-green-800' },
  I: { label: '信息', color: 'bg-yellow-100 text-yellow-800' },
  N: { label: '导航', color: 'bg-purple-100 text-purple-800' },
};

// 分类映射
const categoryMap: Record<string, string> = {
  core: '核心词',
  long_tail: '长尾词',
  article: '文章词',
  brand: '品牌词',
};

// 主题映射
const topicMap: Record<string, string> = {
  CLIT: '阴蒂相关',
  ANAL: '肛门相关',
  DILDO: '假阳具',
  COUPLES: '情侣用品',
  BEGINNER: '初学者',
  PREMATURE: '早泄相关',
  STAMINA: '耐力持久',
  WAND: '按摩棒',
  BULLET: '跳蛋/迷你震动器',
  RABBIT: '兔型双震',
  GSPOT: 'G点震动器',
  MASTURBATOR: '男用自慰器',
  COCKRING: '阴茎环',
  PROSTATE: '前列腺玩具',
  DISCREET: '隐蔽/静音',
  LUBE: '润滑液',
  CLEANER: '玩具清洁',
  BODYSAFE: '身体安全材料',
  PELVIC: '盆底肌训练',
  LIBIDO: '女性性欲',
  ORGASM: '女性高潮',
  NIPPLE: '乳头玩具',
  EDUCATION: '性教育科普',
};

// 状态映射
const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '未使用', color: 'bg-gray-100 text-gray-800' },
  1: { label: '已使用', color: 'bg-green-100 text-green-800' },
};

export default function SeoKeywordsPage() {
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  // URL关联功能状态
  const [showUrlLinkModal, setShowUrlLinkModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [pageType, setPageType] = useState<number>(1); // 默认产品页
  const [availableKeywordsForLink, setAvailableKeywordsForLink] = useState<SeoKeyword[]>([]);
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>([]);
  const [linkLoading, setLinkLoading] = useState(false);
  const [keywordSearchTerm, setKeywordSearchTerm] = useState(''); // 关键词搜索

  // Tab 切换
  const [activeTab, setActiveTab] = useState<'keywords' | 'mappings'>('keywords');

  // 映射查询状态
  const [mappingUrl, setMappingUrl] = useState('');
  const [mappingResults, setMappingResults] = useState<KeywordDetailDTO[]>([]);
  const [mappingLoading, setMappingLoading] = useState(false);
  const [mappingSearched, setMappingSearched] = useState(false);
  const [unlinkLoading, setUnlinkLoading] = useState<Record<number, boolean>>({});

  // 加载关键词列表
  const loadKeywords = async () => {
    setLoading(true);
    try {
      let response;
      
      // 使用通用搜索接口，支持多条件筛选
      const params: any = { page: currentPage, size: 20 };
      if (searchKeyword) params.keyword = searchKeyword;
      if (statusFilter) params.status = Number(statusFilter);
      if (topicFilter) params.topic = topicFilter;
      if (categoryFilter) params.category = categoryFilter;
      
      response = await seoKeywordService.searchKeywordsWithFilters(params);
      
      setKeywords(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error: any) {
      console.error('Failed to load keywords:', error);
      console.error('Error details:', error.message, error.response?.status);
      alert('加载失败：' + (error.message || '未知错误'));
      setKeywords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeywords();
  }, [currentPage, statusFilter, topicFilter, categoryFilter]);

  // 删除关键词
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此关键词吗？此操作不可恢复。')) {
      return;
    }

    try {
      await seoKeywordService.deleteKeyword(id);
      alert('删除成功');
      loadKeywords();
    } catch (error: any) {
      console.error('Failed to delete keyword:', error);
      alert('删除失败：' + (error.message || '未知错误'));
    }
  };

  // 打开URL关联模态框
  const handleOpenUrlLinkModal = async () => {
    setShowUrlLinkModal(true);
    setUrlInput('');
    setSelectedKeywordIds([]);
    setKeywordSearchTerm('');
    
    // 加载所有关键词（包括已使用和未使用的）
    try {
      const response = await seoKeywordService.getAllKeywords(0, 200);
      setAvailableKeywordsForLink(response.content);
    } catch (error) {
      console.error('Failed to load keywords:', error);
    }
  };

  // 切换关键词选择
  const toggleKeywordSelection = (keywordId: number) => {
    setSelectedKeywordIds(prev => 
      prev.includes(keywordId) 
        ? prev.filter(id => id !== keywordId)
        : [...prev, keywordId]
    );
  };

  // 过滤关键词（根据搜索词）
  const filteredKeywords = availableKeywordsForLink.filter(keyword => {
    if (!keywordSearchTerm) return true;
    const searchLower = keywordSearchTerm.toLowerCase();
    return (
      keyword.keyword.toLowerCase().includes(searchLower) ||
      (keyword.category && keyword.category.toLowerCase().includes(searchLower)) ||
      (keyword.intent && keyword.intent.toLowerCase().includes(searchLower))
    );
  });

  // 确认关联关键词到URL
  const handleLinkKeywordsToUrl = async () => {
    if (!urlInput.trim()) {
      alert('请输入页面URL');
      return;
    }
    
    if (selectedKeywordIds.length === 0) {
      alert('请至少选择一个关键词');
      return;
    }

    setLinkLoading(true);
    try {
      const result = await seoKeywordService.linkKeywordsToUrl({
        pageUrl: urlInput.trim(),
        pageType,
        keywordIds: selectedKeywordIds,
      });
      
      alert(`成功关联 ${result.linkedCount} 个关键词到 URL: ${urlInput}`);
      setShowUrlLinkModal(false);
      setUrlInput('');
      setSelectedKeywordIds([]);
      loadKeywords(); // 刷新列表
    } catch (error: any) {
      console.error('Failed to link keywords:', error);
      alert('关联失败：' + (error.message || '未知错误'));
    } finally {
      setLinkLoading(false);
    }
  };

  // 查询映射（按URL查关联关键词）
  const handleSearchMappings = async () => {
    if (!mappingUrl.trim()) {
      alert('请输入页面URL');
      return;
    }
    setMappingLoading(true);
    setMappingSearched(true);
    try {
      const results = await seoKeywordService.getKeywordsByUrl(mappingUrl.trim());
      setMappingResults(results || []);
    } catch (error: any) {
      console.error('Failed to search mappings:', error);
      alert('查询失败：' + (error.message || '未知错误'));
      setMappingResults([]);
    } finally {
      setMappingLoading(false);
    }
  };

  // 取消单个关键词与URL的关联
  const handleUnlinkKeyword = async (keywordId: number) => {
    if (!confirm('确定要取消该关键词与此URL的关联吗？')) return;
    setUnlinkLoading(prev => ({ ...prev, [keywordId]: true }));
    try {
      // 调用后端删除该关键词的所有映射（通过unlinkByUrl做不到单个）
      // 后端 unlinkByUrl 删的是该URL的所有关联，所以这里我们用 delete
      // 但后端只有 unlinkByUrl(url) 和 deleteByKeywordId(keywordId)
      // 暂时用 unlinkByUrl 重新关联保留的关键词
      await seoKeywordService.unlinkKeywordsFromUrl(mappingUrl.trim());
      // 重新关联除了被删除关键词之外的其他关键词
      const remainingIds = mappingResults
        .filter(k => k.id !== keywordId)
        .map(k => k.id);
      if (remainingIds.length > 0) {
        await seoKeywordService.linkKeywordsToUrl({
          pageUrl: mappingUrl.trim(),
          keywordIds: remainingIds,
        });
      }
      setMappingResults(prev => prev.filter(k => k.id !== keywordId));
    } catch (error: any) {
      console.error('Failed to unlink keyword:', error);
      alert('取消关联失败：' + (error.message || '未知错误'));
    } finally {
      setUnlinkLoading(prev => ({ ...prev, [keywordId]: false }));
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO 关键字管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理关键词库与页面映射关系
          </p>
        </div>
        {activeTab === 'keywords' && (
          <div className="flex gap-3">
            <button
              onClick={handleOpenUrlLinkModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🔗 通过 URL 关联关键词
            </button>
            <Link
              href="/admin/seo-keywords/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 新建关键词
            </Link>
          </div>
        )}
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'keywords'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          关键词库
        </button>
        <button
          onClick={() => setActiveTab('mappings')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'mappings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          映射查询
        </button>
      </div>

      {/* ========== Tab 1: 关键词库 ========== */}
      {activeTab === 'keywords' && (
      <>
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">总关键词数</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalElements}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">未使用</p>
          <p className="mt-2 text-2xl font-bold text-gray-600">
            {keywords.filter(k => k.status === 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">已使用</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {keywords.filter(k => k.status === 1).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">高优先级</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {keywords.filter(k => (k.kd || 0) < 30 && (k.volume || 0) > 1000).length}
          </p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索关键词..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadKeywords()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(0); // 重置到第一页
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有分类</option>
            {Object.entries(categoryMap).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0); // 重置到第一页
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有状态</option>
            <option value="0">未使用</option>
            <option value="1">已使用</option>
          </select>
          <select
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              setCurrentPage(0); // 重置到第一页
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有主题</option>
            {Object.entries(topicMap).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={loadKeywords}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
          <button
            onClick={() => {
              setSearchKeyword('');
              setStatusFilter('');
              setTopicFilter('');
              setCategoryFilter('');
              setCurrentPage(0);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            重置
          </button>
        </div>
      </div>

      {/* 关键词列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : keywords.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">暂无关键词数据</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关键词</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">搜索量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">意图</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">添加时间</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keywords.map((keyword) => (
                  <tr key={keyword.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                      {keyword.notes && (
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{keyword.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {keyword.volume ? keyword.volume.toLocaleString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {keyword.kd !== undefined && keyword.kd !== null ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            keyword.kd < 30 ? 'bg-green-100 text-green-800' :
                            keyword.kd < 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {keyword.kd}
                          </span>
                        ) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {keyword.intent && intentMap[keyword.intent] ? (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${intentMap[keyword.intent].color}`}>
                          {intentMap[keyword.intent].label}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {keyword.category ? categoryMap[keyword.category] || keyword.category : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {keyword.topic ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {topicMap[keyword.topic] || keyword.topic}
                          </span>
                        ) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[keyword.status || 0]?.color}`}>
                        {statusMap[keyword.status || 0]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(keyword.addedAt || '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/seo-keywords/${keyword.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(keyword.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  显示第 {(currentPage) * 20 + 1} - {Math.min((currentPage + 1) * 20, totalElements)} 条，共 {totalElements} 条
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    第 {currentPage + 1} / {totalPages} 页
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* URL 关联关键词模态框 */}
      {showUrlLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">通过 URL 关联关键词</h2>
              <button
                onClick={() => setShowUrlLinkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* URL 输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  页面 URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="例如：/products/adult-toy-xxx 或 https://example.com/products/xxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">支持完整 URL 或相对路径</p>
              </div>

              {/* 页面类型选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  页面类型
                </label>
                <select
                  value={pageType}
                  onChange={(e) => setPageType(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={1}>产品页</option>
                  <option value={2}>博客文章</option>
                  <option value={3}>分类页</option>
                  <option value={4}>其他</option>
                </select>
              </div>

              {/* 关键词选择 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    选择关键词 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    已选择 {selectedKeywordIds.length} 个 / 共 {availableKeywordsForLink.length} 个
                  </span>
                </div>
                
                {/* 搜索框 */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="搜索关键词、分类或意图..."
                    value={keywordSearchTerm}
                    onChange={(e) => setKeywordSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                {availableKeywordsForLink.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <p>暂无关键词数据</p>
                    <p className="text-sm mt-2">请先创建新的关键词</p>
                  </div>
                ) : filteredKeywords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <p>没有找到匹配的关键词</p>
                    <p className="text-sm mt-2">尝试其他搜索词</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">选择</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">关键词</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">搜索量</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">难度</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredKeywords.map((keyword) => (
                          <tr key={keyword.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleKeywordSelection(keyword.id)}>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedKeywordIds.includes(keyword.id)}
                                onChange={() => {}}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                keyword.status === 0 ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {keyword.status === 0 ? '未使用' : '已使用'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {keyword.volume ? keyword.volume.toLocaleString() : '-'}
                            </td>
                            <td className="px-4 py-3">
                              {keyword.kd !== undefined && keyword.kd !== null ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  keyword.kd < 30 ? 'bg-green-100 text-green-800' :
                                  keyword.kd < 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {keyword.kd}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {keyword.category ? categoryMap[keyword.category] || keyword.category : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowUrlLinkModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={linkLoading}
              >
                取消
              </button>
              <button
                onClick={handleLinkKeywordsToUrl}
                disabled={linkLoading || selectedKeywordIds.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {linkLoading ? '关联中...' : `确认关联 (${selectedKeywordIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* ========== Tab 2: 映射查询 ========== */}
      {activeTab === 'mappings' && (
      <div className="space-y-6">
        {/* URL 查询 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">按 URL 查询关联关键词</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={mappingUrl}
              onChange={(e) => setMappingUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchMappings()}
              placeholder="输入页面 URL，如 /blog/xxx 或完整地址"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearchMappings}
              disabled={mappingLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {mappingLoading ? '查询中...' : '查询'}
            </button>
          </div>
        </div>

        {/* 查询结果 */}
        {mappingLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">查询中...</p>
          </div>
        ) : mappingSearched ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {mappingResults.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">该 URL 没有关联任何关键词</p>
                <button
                  onClick={() => { setActiveTab('keywords'); handleOpenUrlLinkModal(); }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  🔗 去关联关键词
                </button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm text-gray-600">
                    URL: <span className="font-mono text-gray-900">{mappingUrl}</span>
                    <span className="ml-4">共 {mappingResults.length} 个关联关键词</span>
                  </p>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关键词</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">搜索量</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">意图</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mappingResults.map((kw) => (
                      <tr key={kw.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{kw.keyword}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {kw.volume ? kw.volume.toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {kw.kd !== undefined && kw.kd !== null ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              kw.kd < 30 ? 'bg-green-100 text-green-800' :
                              kw.kd < 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>{kw.kd}</span>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {kw.intent && intentMap[kw.intent] ? (
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${intentMap[kw.intent].color}`}>
                              {intentMap[kw.intent].label}
                            </span>
                          ) : <span className="text-sm text-gray-500">-</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {kw.category ? categoryMap[kw.category] || kw.category : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleUnlinkKeyword(kw.id)}
                            disabled={unlinkLoading[kw.id]}
                            className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                          >
                            {unlinkLoading[kw.id] ? '取消中...' : '取消关联'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-400">输入 URL 并点击查询，查看该页面关联的关键词</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
