'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productAdminService } from '@/services';
import type { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAdminService.getAllProducts(currentPage, 20);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此产品吗？')) return;
    try {
      await productAdminService.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('删除失败');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await productAdminService.toggleProductStatus(id, newStatus);
      fetchProducts();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('状态切换失败');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
                         product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
          <p className="text-gray-600 mt-1">管理所有产品信息</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
        >
          ➕ 添加新产品
        </Link>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索产品</label>
            <input
              type="text"
              placeholder="搜索产品名称或 SKU..."
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
              <option value="ACTIVE">上架</option>
              <option value="INACTIVE">下架</option>
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              共 {filteredProducts.length} 个产品
            </p>
          </div>
        </div>
      </div>

      {/* 产品列表 */}
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">图片</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">产品信息</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">品牌</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">价格</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">状态</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={product.image && product.image.startsWith('http') ? product.image : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${product.image}`}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          ${Number(product.currentPrice).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${
                          product.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleStatus(product.id, product.status)}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                          >
                            {product.status === 'ACTIVE' ? '下架' : '上架'}
                          </button>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">暂无产品数据</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
