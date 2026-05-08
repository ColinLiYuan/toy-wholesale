'use client';

import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 调用API获取订单列表
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">询价单管理</h1>
          <p className="text-gray-600 mt-1">管理所有询价单，支持报价、确认等业务流程</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">总订单数</p>
          <p className="text-2xl font-bold text-blue-600">-</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">待报价</p>
          <p className="text-2xl font-bold text-yellow-600">-</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">已报价</p>
          <p className="text-2xl font-bold text-purple-600">-</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">已确认</p>
          <p className="text-2xl font-bold text-green-600">-</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">临时订单</p>
          <p className="text-2xl font-bold text-orange-600">-</p>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索订单</label>
            <input
              type="text"
              placeholder="搜索订单编号、经销商名称..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">订单状态</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent">
              <option value="">所有状态</option>
              <option value="PENDING">待报价</option>
              <option value="QUOTED">已报价</option>
              <option value="CONFIRMED">已确认</option>
              <option value="CANCELLED">已取消</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">订单来源</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent">
              <option value="">所有来源</option>
              <option value="CART_SUBMIT">购物车提交</option>
              <option value="ADMIN_CREATED">后台创建</option>
              <option value="QUICK_ORDER">快速下单</option>
            </select>
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">订单管理功能开发中...</p>
            <p className="text-sm text-gray-400">即将上线，敬请期待</p>
          </div>
        )}
      </div>
    </div>
  );
}
