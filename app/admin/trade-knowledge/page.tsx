import Link from 'next/link';

export const metadata = {
  title: '外贸知识 | 贸易术语与流程',
  description: '了解国际贸易术语(FOB, CIF, DDP等)和完整的外贸出口流程',
};

export default function TradeKnowledgePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              外贸知识库
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              掌握国际贸易术语，了解完整出口流程，让报价更专业
            </p>
          </div>
        </div>
      </section>

      {/* Trade Terms Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">国际贸易术语 (Incoterms)</h2>
            <p className="text-lg text-gray-600">
              Incoterms（International Commercial Terms）是国际商会制定的国际贸易术语，明确了买卖双方的责任、费用和风险划分。
            </p>
          </div>

          {/* 常用贸易术语卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* EXW */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">EXW</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">工厂交货</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Ex Works (named place)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">在工厂或仓库将货物准备好，买方负责所有运输和出口手续</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">适用场景：</p>
                  <p className="text-gray-600">买方有强大的物流能力，希望完全控制运输过程</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 价格最低，但买方承担最多风险和责任</p>
                </div>
              </div>
            </div>

            {/* FOB */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">FOB</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">最常用</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Free On Board (named port of shipment)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责将货物运到装运港并装上船，承担装船前的所有费用和风险</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">买方责任：</p>
                  <p className="text-gray-600">负责海运费、保险费及之后的所有费用和风险</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 中国出口最常用的贸易术语，风险在货物越过船舷时转移</p>
                </div>
              </div>
            </div>

            {/* CIF */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">CIF</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">成本+保险+运费</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Cost, Insurance and Freight (named port of destination)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责货物运到目的港的运费和保险费，但风险在装运港装船后转移给买方</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">注意：</p>
                  <p className="text-gray-600">虽然卖方买保险，但风险仍在装船后转移，保险受益人通常是买方</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 适合买方不熟悉海运保险的情况</p>
                </div>
              </div>
            </div>

            {/* CFR */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">CFR</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">成本+运费</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Cost and Freight (named port of destination)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责货物运到目的港的运费，但不包括保险</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">与CIF区别：</p>
                  <p className="text-gray-600">CFR不含保险，买方需自行购买保险</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 介于FOB和CIF之间，卖方负责运费但不负责保险</p>
                </div>
              </div>
            </div>

            {/* DDP */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">DDP</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">完税后交货</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Delivered Duty Paid (named place of destination)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责将所有费用和风险承担到买方指定地点，包括进口清关和关税</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">适用场景：</p>
                  <p className="text-gray-600">买方希望"门到门"服务，不想处理任何进口手续</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 卖方承担最大责任和风险，价格最高</p>
                </div>
              </div>
            </div>

            {/* DAP */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">DAP</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">目的地交货</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Delivered at Place (named place of destination)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责将货物运到买方指定地点，但不负责进口清关和关税</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">与DDP区别：</p>
                  <p className="text-gray-600">DAP不包含进口关税和清关，买方需自行处理</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 比DDP简单，卖方不负责进口国的税费</p>
                </div>
              </div>
            </div>
          </div>

          {/* 对比表格 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-16">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">贸易术语对比表</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">术语</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">运输</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">保险</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出口清关</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">进口清关</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">风险转移点</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">EXW</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">工厂</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">FOB ⭐</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">装运港船上</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">CFR</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">装运港船上</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">CIF</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">装运港船上</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">DAP</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">买方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">目的地</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">DDP</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">卖方</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">目的地</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Export Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">中国出口完整流程</h2>
            <p className="text-lg text-gray-600">
              从接单到收汇，了解每个环节的关键步骤和注意事项
            </p>
          </div>

          {/* 流程图 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <div className="relative">
              {/* 流程步骤 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-3">
                      1
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">询盘与报价</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 ml-15 pl-4 border-l-2 border-blue-200">
                    <li>• 接收客户询盘</li>
                    <li>• 确认产品规格和数量</li>
                    <li>• 计算成本（出厂价+运费+利润）</li>
                    <li>• 选择贸易术语（FOB/CIF等）</li>
                    <li>• 发送正式报价单</li>
                  </ul>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-3">
                      2
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">签订合同</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 ml-15 pl-4 border-l-2 border-blue-200">
                    <li>• 确认订单细节</li>
                    <li>• 签订销售合同（PI/SC）</li>
                    <li>• 确认付款方式（T/T, L/C等）</li>
                    <li>• 收取定金（通常30%）</li>
                    <li>• 安排生产计划</li>
                  </ul>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-3">
                      3
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">生产与验货</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 ml-15 pl-4 border-l-2 border-blue-200">
                    <li>• 采购原材料</li>
                    <li>• 组织生产</li>
                    <li>• 质量控制（QC）</li>
                    <li>• 客户验货（如需要）</li>
                    <li>• 包装和贴标</li>
                  </ul>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-3">
                      4
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">订舱与报关</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 ml-15 pl-4 border-l-2 border-blue-200">
                    <li>• 联系货代订舱</li>
                    <li>• 准备报关资料</li>
                    <li>• 商检（如需要）</li>
                    <li>• 报关出口</li>
                    <li>• 货物装船/装机</li>
                  </ul>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-3">
                      5
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">单据制作</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 ml-15 pl-4 border-l-2 border-blue-200">
                    <li>• 提单（B/L）</li>
                    <li>• 商业发票（CI）</li>
                    <li>• 装箱单（PL）</li>
                    <li>• 原产地证（CO）</li>
                    <li>• 其他认证文件</li>
                  </ul>
                </div>

                {/* Step 6 */}
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-3">
                      6
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">收款与退税</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 ml-15 pl-4 border-l-2 border-blue-200">
                    <li>• 发送单据给客户</li>
                    <li>• 收取尾款</li>
                    <li>• 外汇核销</li>
                    <li>• 申请出口退税</li>
                    <li>• 完成交易</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 关键文档说明 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">出口必备单证详解</h3>
            
            {/* 核心单证 */}
            <div className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-8">
              <h4 className="text-lg font-bold text-blue-600 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                核心单证（每票必用）
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">📄</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">商业发票 (Commercial Invoice)</h5>
                      <p className="text-xs text-gray-500 mb-2">CI - Commercial Invoice</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">货物价值证明，用于海关申报、银行结汇、客户清关</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">包含内容：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>买卖双方信息</li>
                        <li>货物描述、数量、单价、总价</li>
                        <li>贸易术语（FOB/CIF等）</li>
                        <li>付款方式</li>
                        <li>发票号码和日期</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 所有出口交易必用<br/>✅ L/C信用证结算必需<br/>✅ 客户进口清关必需</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">📦</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">装箱单 (Packing List)</h5>
                      <p className="text-xs text-gray-500 mb-2">PL - Packing List</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">详细列明货物包装情况，便于清点和查验</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">包含内容：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>箱号、每箱内容物</li>
                        <li>毛重、净重</li>
                        <li>包装尺寸（长×宽×高）</li>
                        <li>总体积（CBM）</li>
                        <li>唛头（Shipping Mark）</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 所有出口交易必用<br/>✅ 海关查验必需<br/>✅ 仓库收货清点必需</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">🚢</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">提单 (Bill of Lading)</h5>
                      <p className="text-xs text-gray-500 mb-2">B/L - Bill of Lading</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">货物所有权凭证、运输合同证明、收货凭证（最重要单据）</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">类型：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li><strong>正本提单 (Original B/L)</strong>：需邮寄给客户</li>
                        <li><strong>电放提单 (Telex Release)</strong>：电子放货，无需正本</li>
                        <li><strong>海运单 (Sea Waybill)</strong>：不可转让，直接放货</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 所有海运出口必用<br/>✅ T/T付款通常用电放<br/>✅ L/C付款必须用正本</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">📋</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">销售合同 (Sales Contract)</h5>
                      <p className="text-xs text-gray-500 mb-2">SC / PI - Sales Contract / Proforma Invoice</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">买卖双方权利义务约定，法律依据</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">包含内容：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>产品规格、数量、价格</li>
                        <li>交货期、付款方式</li>
                        <li>质量标准、检验方式</li>
                        <li>违约责任、争议解决</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 所有正式订单必签<br/>✅ PI用于确认订单细节<br/>✅ SC用于大额长期合作</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 认证单证 */}
            <div className="bg-white rounded-xl border-2 border-green-200 p-6 mb-8">
              <h4 className="text-lg font-bold text-green-600 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                认证与产地单证（按需使用）
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">🌍</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">原产地证 (Certificate of Origin)</h5>
                      <p className="text-xs text-gray-500 mb-2">CO - Certificate of Origin</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">证明货物原产国，享受关税优惠</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">类型：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li><strong>一般原产地证</strong>：通用</li>
                        <li><strong>Form A</strong>：普惠制（发达国家）</li>
                        <li><strong>Form E</strong>：中国-东盟</li>
                        <li><strong>中韩FTA</strong>：韩国</li>
                        <li><strong>中澳FTA</strong>：澳大利亚</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 客户要求时提供<br/>✅ 享受关税减免必需<br/>✅ 部分国家强制要求</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">✅</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">质量检验证书</h5>
                      <p className="text-xs text-gray-500 mb-2">Inspection Certificate</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">证明货物符合质量标准</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">类型：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li><strong>工厂自检报告</strong>：内部QC</li>
                        <li><strong>第三方检验</strong>：SGS/BV/Intertek</li>
                        <li><strong>商检证书</strong>：法定检验商品</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 大客户通常要求<br/>✅ L/C信用证常要求<br/>✅ 法定检验商品必需</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">🏥</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">卫生/健康证书</h5>
                      <p className="text-xs text-gray-500 mb-2">Health/Sanitary Certificate</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">证明产品符合卫生安全标准</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">适用产品：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>食品、药品</li>
                        <li>化妆品</li>
                        <li>医疗器械</li>
                        <li>成人用品（部分国家）</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 欧美市场常要求<br/>✅ 敏感类产品必需<br/>✅ 海关抽查时提供</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">🌿</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">熏蒸证书</h5>
                      <p className="text-xs text-gray-500 mb-2">Fumigation Certificate</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">证明木质包装已熏蒸处理，防止病虫害</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">适用情况：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>使用木托盘、木箱包装</li>
                        <li>实木包装材料</li>
                        <li> IPPC标识的替代方案</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 有木质包装时必需<br/>✅ 美国、欧盟、澳洲严格<br/>✅ 可用胶合板替代</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">⚖️</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">保险单</h5>
                      <p className="text-xs text-gray-500 mb-2">Insurance Policy/Certificate</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">货物运输保险凭证，理赔依据</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">险种：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li><strong>平安险 (FPA)</strong>：基本险</li>
                        <li><strong>水渍险 (WPA)</strong>：中等险</li>
                        <li><strong>一切险 (All Risks)</strong>：全险</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ CIF/CIP术语卖方购买<br/>✅ FOB术语买方购买<br/>✅ 高价值货物建议购买</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">🔬</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">化学品安全说明书</h5>
                      <p className="text-xs text-gray-500 mb-2">MSDS - Material Safety Data Sheet</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">化学品安全信息，运输和储存指导</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">包含内容：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>成分信息</li>
                        <li>危险性说明</li>
                        <li>急救措施</li>
                        <li>储存条件</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 含电池产品必需<br/>✅ 液体/膏状产品必需<br/>✅ 空运/海运订舱必需</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 报关单证 */}
            <div className="bg-white rounded-xl border-2 border-purple-200 p-6 mb-8">
              <h4 className="text-lg font-bold text-purple-600 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                报关与退税单证
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">📑</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">出口货物报关单</h5>
                      <p className="text-xs text-gray-500 mb-2">Customs Declaration Form</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">向海关申报出口，获取出口证明</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">包含内容：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>收发货人信息</li>
                        <li>商品信息（HS编码）</li>
                        <li>数量、金额、币制</li>
                        <li>贸易方式、征免性质</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 所有正规出口必需<br/>✅ 申请退税必需<br/>✅ 外汇核销必需</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">💰</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">增值税专用发票</h5>
                      <p className="text-xs text-gray-500 mb-2">VAT Invoice</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">采购凭证，申请出口退税的核心单据</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">要求：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>必须是专用发票</li>
                        <li>品名与报关单一致</li>
                        <li>数量、金额匹配</li>
                        <li>在有效期内认证</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 申请退税必需<br/>✅ 财务记账必需<br/>✅ 税务稽查备查</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">🏦</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">外汇核销单</h5>
                      <p className="text-xs text-gray-500 mb-2">Foreign Exchange Verification</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">证明外汇收入，完成外汇管理</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">流程：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>出口后收取外汇</li>
                        <li>银行结汇</li>
                        <li>外管局核销</li>
                        <li>与报关单对应</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 所有出口收汇必需<br/>✅ 申请退税前完成<br/>✅ 合规经营必需</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">📊</span>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 mb-1">出口退税申报表</h5>
                      <p className="text-xs text-gray-500 mb-2">Tax Refund Application</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">用途：</p>
                      <p className="text-gray-600">向税务局申请退还增值税</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">所需材料：</p>
                      <ul className="text-gray-600 list-disc list-inside ml-2">
                        <li>报关单（出口退税联）</li>
                        <li>增值税专用发票</li>
                        <li>外汇核销证明</li>
                        <li>退税申报表</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">使用场景：</p>
                      <p className="text-gray-600">✅ 出口后90天内申报<br/>✅ 一般纳税人企业<br/>✅ 降低出口成本</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 特殊单证 */}
            <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
              <h4 className="text-lg font-bold text-orange-600 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                特殊情况下需要的单证
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-bold text-gray-900 mb-2">🎯 许可证类</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>出口许可证</strong>：限制出口商品</li>
                    <li>• <strong>濒危物种证明</strong>：含珍稀材料</li>
                    <li>• <strong>农药登记证</strong>：杀虫剂类产品</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-bold text-gray-900 mb-2">🔋 电池相关</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>UN38.3测试报告</strong>：锂电池</li>
                    <li>• <strong>运输鉴定书</strong>：空运/海运</li>
                    <li>• <strong>危包证</strong>：危险品包装</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-bold text-gray-900 mb-2">🇪🇺 欧盟认证</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>CE证书</strong>：电子产品</li>
                    <li>• <strong>RoHS报告</strong>：有害物质</li>
                    <li>• <strong>REACH声明</strong>：化学品</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-bold text-gray-900 mb-2">🇺🇸 美国认证</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>FCC认证</strong>：电子设备</li>
                    <li>• <strong>FDA注册</strong>：医疗/食品接触</li>
                    <li>• <strong>CPC证书</strong>：儿童产品</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-bold text-gray-900 mb-2">📜 其他认证</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>ISO证书</strong>：质量管理体系</li>
                    <li>• <strong>BSCI报告</strong>：社会责任</li>
                    <li>• <strong>验厂报告</strong>：大客户审核</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-bold text-gray-900 mb-2">🚫 禁止/限制</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>禁运证明</strong>：特殊时期</li>
                    <li>• <strong>配额证明</strong>：配额商品</li>
                    <li>• <strong>授权书</strong>：品牌产品</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 出口退税要点 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                出口退税要点
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <div>
                    <p className="font-semibold text-gray-900">退税率</p>
                    <p className="text-gray-600">不同产品退税率不同（0%-13%），玩具类通常13%</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <div>
                    <p className="font-semibold text-gray-900">计算公式</p>
                    <p className="text-gray-600">退税额 = 增值税专用发票金额 × 退税率</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <div>
                    <p className="font-semibold text-gray-900">必要条件</p>
                    <p className="text-gray-600">必须有增值税专用发票、报关单、外汇收入</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <div>
                    <p className="font-semibold text-gray-900">申报时间</p>
                    <p className="text-gray-600">通常在出口后90天内申报退税</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            准备好开始报价了吗？
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            现在您已经了解了贸易术语和出口流程，可以开始为客户制作专业报价了
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/quotation-calculator"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              打开报价计算器
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载产品目录
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
