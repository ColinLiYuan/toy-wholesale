export default function OrderFollowupModule() {
  return (
    <section id="order-followup" className="py-16 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">📋</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">跟单流程</h2>
              <p className="text-lg text-gray-600 mt-1">订单确认、生产跟踪、质量控制、发货安排</p>
            </div>
          </div>
        </div>

        {/* 二级导航 */}
        <div className="mb-12 bg-gray-50 rounded-xl p-4">
          <div className="flex flex-wrap gap-3">
            <a href="#order-confirm" className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors">
              ✅ 订单确认
            </a>
            <a href="#production-track" className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              🏭 生产跟踪
            </a>
            <a href="#quality-control" className="px-4 py-2 bg-white border border-green-200 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
              🔍 质量控制
            </a>
            <a href="#shipping-docs" className="px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors">
              📦 发货单证
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 id="order-confirm" className="text-xl font-bold text-gray-900 scroll-mt-24">完整跟单流程图（8步）</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: 1, title: '订单确认', items: ['收到客户PO', '确认产品规格', '确认价格和数量', '确认交货期', '签订销售合同'], id: 'order-confirm' },
                { step: 2, title: '收取定金', items: ['发送PI给客户', '确认付款方式', '收取30%定金', '确认水单', '通知财务入账'], id: 'deposit' },
                { step: 3, title: '生产跟踪', items: ['下达生产指令', '采购原材料', '监控生产进度', '中期质量检查', '定期向客户汇报'], id: 'production-track' },
                { step: 4, title: '验货包装', items: ['成品质量检验', '客户验货（如需要）', '整改问题产品', '按要求包装', '贴标签和唛头'], id: 'quality-control' },
                { step: 5, title: '订舱报关', items: ['联系货代订舱', '准备报关资料', '安排拖车提货', '报关出口', '货物装船/装机'], id: 'shipping-docs' },
                { step: 6, title: '单据制作', items: ['获取提单副本', '制作商业发票', '制作装箱单', '申请原产地证', '其他认证文件'] },
                { step: 7, title: '收取尾款', items: ['发送单据副本', '催收尾款', '确认收款', '电放或寄正本', '通知客户提货'] },
                { step: 8, title: '退税归档', items: ['收集退税单据', '申报出口退税', '外汇核销', '档案整理归档', '客户满意度调查'] },
              ].map(({ step, title, items }) => (
                <div key={step} className="relative">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">{step}</div>
                    <h4 className="font-bold text-gray-900">{title}</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {items.map((item, idx) => (
                      <li key={idx}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
