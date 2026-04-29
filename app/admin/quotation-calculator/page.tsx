'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QuoteItem {
  id: number;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number; // 出厂价 (RMB)
  weight: number; // 单个重量 (kg)
  volume: number; // 单个体积 (m³)
}

interface QuoteSettings {
  tradeTerm: string; // FOB, CIF, DDP, etc.
  destinationPort: string;
  freightCost: number; // 运费 (USD)
  insuranceRate: number; // 保险费率 (%)
  profitMargin: number; // 利润率 (%)
  exchangeRate: number; // 汇率 (USD/RMB)
  taxRebateRate: number; // 退税率 (%)
  packagingCost: number; // 包装费每件 (RMB)
  domesticFreight: number; // 国内运费 (RMB)
  otherCosts: number; // 其他费用 (RMB)
}

export default function QuotationCalculatorPage() {
  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: 1,
      productName: '',
      productCode: '',
      quantity: 0,
      unitPrice: 0,
      weight: 0,
      volume: 0,
    },
  ]);

  const [settings, setSettings] = useState<QuoteSettings>({
    tradeTerm: 'FOB',
    destinationPort: '',
    freightCost: 0,
    insuranceRate: 0.3,
    profitMargin: 20,
    exchangeRate: 7.25,
    taxRebateRate: 13,
    packagingCost: 2,
    domesticFreight: 0,
    otherCosts: 0,
  });

  const [showDetails, setShowDetails] = useState(false);

  // 添加新产品
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([
      ...items,
      {
        id: newId,
        productName: '',
        productCode: '',
        quantity: 0,
        unitPrice: 0,
        weight: 0,
        volume: 0,
      },
    ]);
  };

  // 删除产品
  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  // 更新产品
  const updateItem = (id: number, field: keyof QuoteItem, value: any) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 更新设置
  const updateSetting = (field: keyof QuoteSettings, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  // 计算总价
  const calculateTotal = () => {
    let totalFactoryCost = 0; // 总出厂成本
    let totalWeight = 0;
    let totalVolume = 0;
    let totalQuantity = 0;

    items.forEach(item => {
      totalFactoryCost += item.unitPrice * item.quantity;
      totalWeight += item.weight * item.quantity;
      totalVolume += item.volume * item.quantity;
      totalQuantity += item.quantity;
    });

    // 包装费
    const totalPackagingCost = settings.packagingCost * totalQuantity;

    // 国内运费分摊到每件
    const domesticFreightPerUnit = totalQuantity > 0 ? settings.domesticFreight / totalQuantity : 0;

    // 总成本 (RMB)
    const totalCostRMB = totalFactoryCost + totalPackagingCost + settings.domesticFreight + settings.otherCosts;

    // 退税金额 (RMB)
    const taxRebateAmount = totalFactoryCost * (settings.taxRebateRate / 100);

    // 净成本 (扣除退税后)
    const netCostRMB = totalCostRMB - taxRebateAmount;

    // 转换为 USD
    const netCostUSD = netCostRMB / settings.exchangeRate;

    // 根据贸易术语计算最终价格
    let finalPriceUSD = 0;
    let breakdown: { factoryCost: number; freight: number; insurance: number } = {
      factoryCost: 0,
      freight: 0,
      insurance: 0,
    };

    switch (settings.tradeTerm) {
      case 'EXW':
        finalPriceUSD = netCostUSD;
        breakdown = {
          factoryCost: netCostUSD,
          freight: 0,
          insurance: 0,
        };
        break;

      case 'FOB':
        // FOB = 净成本 + 国内费用（已包含在netCost中）
        finalPriceUSD = netCostUSD;
        breakdown = {
          factoryCost: netCostUSD,
          freight: 0,
          insurance: 0,
        };
        break;

      case 'CFR':
        // CFR = FOB + 海运费
        const cfrPrice = netCostUSD + settings.freightCost;
        finalPriceUSD = cfrPrice;
        breakdown = {
          factoryCost: netCostUSD,
          freight: settings.freightCost,
          insurance: 0,
        };
        break;

      case 'CIF':
        // CIF = CFR + 保险费
        const cfrBase = netCostUSD + settings.freightCost;
        const insuranceCost = cfrBase * (settings.insuranceRate / 100);
        finalPriceUSD = cfrBase + insuranceCost;
        breakdown = {
          factoryCost: netCostUSD,
          freight: settings.freightCost,
          insurance: insuranceCost,
        };
        break;

      case 'DAP':
      case 'DDP':
        // DDP = CIF + 目的港费用 + 关税等
        const cifBase = netCostUSD + settings.freightCost + (netCostUSD + settings.freightCost) * (settings.insuranceRate / 100);
        finalPriceUSD = cifBase; // 简化计算，实际需加上目的港费用
        breakdown = {
          factoryCost: netCostUSD,
          freight: settings.freightCost,
          insurance: cifBase - netCostUSD - settings.freightCost,
        };
        break;

      default:
        finalPriceUSD = netCostUSD;
    }

    // 加上利润
    const priceWithProfit = finalPriceUSD * (1 + settings.profitMargin / 100);

    // 单价
    const unitPriceUSD = totalQuantity > 0 ? priceWithProfit / totalQuantity : 0;

    return {
      totalQuantity,
      totalWeight,
      totalVolume,
      totalFactoryCost,
      totalPackagingCost,
      domesticFreightPerUnit,
      totalCostRMB,
      taxRebateAmount,
      netCostRMB,
      netCostUSD,
      finalPriceUSD,
      priceWithProfit,
      unitPriceUSD,
      breakdown,
    };
  };

  const calculation = calculateTotal();

  // 导出报价单
  const exportQuotation = () => {
    const data = {
      date: new Date().toLocaleDateString(),
      settings,
      items,
      calculation,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotation-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">出口报价计算器</h1>
              <p className="mt-2 text-sm text-gray-600">快速计算FOB/CIF/DDP等专业报价</p>
            </div>
            <Link
              href="/admin/trade-knowledge"
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              查看贸易术语说明
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Products & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trade Terms Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">贸易条款设置</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    贸易术语 *
                  </label>
                  <select
                    value={settings.tradeTerm}
                    onChange={(e) => updateSetting('tradeTerm', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EXW">EXW - 工厂交货</option>
                    <option value="FOB">FOB - 装运港船上交货</option>
                    <option value="CFR">CFR - 成本+运费</option>
                    <option value="CIF">CIF - 成本+保险+运费</option>
                    <option value="DAP">DAP - 目的地交货</option>
                    <option value="DDP">DDP - 完税后交货</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目的港/目的地
                  </label>
                  <input
                    type="text"
                    value={settings.destinationPort}
                    onChange={(e) => updateSetting('destinationPort', e.target.value)}
                    placeholder="例如: Los Angeles, USA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    海运费 (USD)
                  </label>
                  <input
                    type="number"
                    value={settings.freightCost}
                    onChange={(e) => updateSetting('freightCost', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    保险费率 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.insuranceRate}
                    onChange={(e) => updateSetting('insuranceRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    利润率 (%)
                  </label>
                  <input
                    type="number"
                    value={settings.profitMargin}
                    onChange={(e) => updateSetting('profitMargin', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    汇率 (USD/RMB)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.exchangeRate}
                    onChange={(e) => updateSetting('exchangeRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    退税率 (%)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRebateRate}
                    onChange={(e) => updateSetting('taxRebateRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    包装费每件 (RMB)
                  </label>
                  <input
                    type="number"
                    value={settings.packagingCost}
                    onChange={(e) => updateSetting('packagingCost', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    国内运费 (RMB)
                  </label>
                  <input
                    type="number"
                    value={settings.domesticFreight}
                    onChange={(e) => updateSetting('domesticFreight', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    其他费用 (RMB)
                  </label>
                  <input
                    type="number"
                    value={settings.otherCosts}
                    onChange={(e) => updateSetting('otherCosts', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">产品清单</h2>
                <button
                  onClick={addItem}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  添加产品
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">产品 #{index + 1}</h3>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">产品名称</label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                          placeholder="产品名称"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">产品编号</label>
                        <input
                          type="text"
                          value={item.productCode}
                          onChange={(e) => updateItem(item.id, 'productCode', e.target.value)}
                          placeholder="SKU/编号"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">数量</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">出厂价 (RMB)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">单重 (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.weight}
                          onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">单体积 (m³)</label>
                        <input
                          type="number"
                          step="0.001"
                          value={item.volume}
                          onChange={(e) => updateItem(item.id, 'volume', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Calculation Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">报价结果</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">总数量</span>
                  <span className="font-semibold text-gray-900">{calculation.totalQuantity.toLocaleString()} pcs</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">总重量</span>
                  <span className="font-semibold text-gray-900">{calculation.totalWeight.toFixed(2)} kg</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">总体积</span>
                  <span className="font-semibold text-gray-900">{calculation.totalVolume.toFixed(3)} m³</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">出厂总成本</span>
                  <span className="font-semibold text-gray-900">¥{calculation.totalFactoryCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">包装费</span>
                  <span className="font-semibold text-gray-900">¥{calculation.totalPackagingCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">退税金额</span>
                  <span className="font-semibold text-green-600">-¥{calculation.taxRebateAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">净成本 (RMB)</span>
                  <span className="font-semibold text-gray-900">¥{calculation.netCostRMB.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">净成本 (USD)</span>
                  <span className="font-semibold text-gray-900">${calculation.netCostUSD.toFixed(2)}</span>
                </div>

                {showDetails && (
                  <>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">海运费</span>
                      <span className="font-semibold text-gray-900">${calculation.breakdown.freight?.toFixed(2) || 0}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">保险费</span>
                      <span className="font-semibold text-gray-900">${calculation.breakdown.insurance?.toFixed(2) || 0}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">含利润总价 ({settings.tradeTerm})</span>
                  <span className="font-bold text-blue-600 text-lg">${calculation.priceWithProfit.toFixed(2)}</span>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">建议单价 ({settings.tradeTerm})</p>
                    <p className="text-3xl font-bold text-blue-600">${calculation.unitPriceUSD.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">per piece</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                {showDetails ? '隐藏详情' : '显示费用明细'}
              </button>

              <button
                onClick={exportQuotation}
                className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                导出报价单
              </button>

              <Link
                href="/catalog"
                className="w-full block text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                下载产品目录
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
