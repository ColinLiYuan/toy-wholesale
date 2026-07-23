'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productAdminService, skuPurchasePriceService } from '@/services';
import { siteCan } from '@/lib/site-permissions';
import type { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // 进价面板
  const [pricePanel, setPricePanel] = useState<{ productId: number; productName: string; skus: any[]; prices: Record<number, any[]> } | null>(null);

  const openPricePanel = async (productId: number, productName: string) => {
    try {
      const product = await productAdminService.getProductById(productId);
      const skus = product.productSkus || [];
      const priceMap: Record<number, any[]> = {};
      await Promise.all(skus.filter((s: any) => s.id).map(async (s: any) => {
        try { priceMap[s.id] = await skuPurchasePriceService.getBySkuId(s.id); } catch { priceMap[s.id] = []; }
      }));
      setPricePanel({ productId, productName, skus, prices: priceMap });
    } catch { alert('加载进价失败'); }
  };
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
        {siteCan('products', 'create') && (
          <Link
            href="/admin/products/new"
            className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
          >
            ➕ 添加新产品
          </Link>
        )}
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
                          {siteCan('products', 'toggle_status') && (
                            <button
                              onClick={() => handleToggleStatus(product.id, product.status)}
                              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                            >
                              {product.status === 'ACTIVE' ? '下架' : '上架'}
                            </button>
                          )}
                          <button
                            onClick={() => openPricePanel(product.id, product.name || product.title || '')}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                          >
                            进价
                          </button>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            查看
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            编辑
                          </Link>
                          {siteCan('products', 'delete') && (
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              删除
                            </button>
                          )}
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

      {/* 进价面板 */}
      {pricePanel && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-40" onClick={() => setPricePanel(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{pricePanel.productName} — SKU进价</h2>
              <button onClick={() => setPricePanel(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6">
              {pricePanel.skus.length === 0 ? (
                <p className="text-gray-500">暂无SKU</p>
              ) : (
                pricePanel.skus.map((sku: any) => (
                  <div key={sku.id || sku.sku} className="mb-4 border rounded-lg">
                    <div className="bg-gray-50 px-4 py-2 font-medium text-sm">
                      {sku.sku || '未命名'} {sku.color ? `| ${sku.color}` : ''} | 库存: {sku.stock}
                    </div>
                    <div className="p-3">
                      {(pricePanel.prices[sku.id] || []).length === 0 ? (
                        <p className="text-gray-400 text-sm">暂无进价</p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-gray-500">
                              <th className="py-1">供应商</th><th className="py-1 text-right">进价</th><th className="py-1">币种</th><th className="py-1 text-right">MOQ</th><th className="py-1">备注</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pricePanel.prices[sku.id].map((p: any) => (
                              <tr key={p.id} className="border-t">
                                <td className="py-1">{p.supplier?.name || '-'}</td>
                                <td className="py-1 text-right font-medium">{p.purchasePrice?.toFixed(2)}</td>
                                <td className="py-1">{p.currency || 'CNY'}</td>
                                <td className="py-1 text-right">{p.moq || '-'}</td>
                                <td className="py-1 text-gray-500">{p.notes || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
