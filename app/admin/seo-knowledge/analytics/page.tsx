'use client';

import KnowledgeNav from '@/components/trade-knowledge/KnowledgeNav';

export default function AnalyticsPage() {
  const sections = [
    {
      id: 'google-analytics',
      title: 'Google Analytics 4',
      content: `
## Google Analytics 4 (GA4) 简介

GA4 是 Google 最新的分析平台，采用事件驱动的数据模型，提供更全面的用户行为洞察。

### GA4 与 Universal Analytics 的区别

| 特性 | UA（旧版） | GA4（新版） |
|------|-----------|------------|
| 数据模型 | 基于会话 | 基于事件 |
| 跨平台追踪 | 需要单独设置 | 原生支持 Web + App |
| 机器学习 | 基础功能 | 高级预测分析 |
| 隐私保护 | 基础 | 内置隐私控制 |
| 自定义报告 | 复杂 | 更灵活 |

### 安装 GA4

#### 1. 创建 GA4 媒体资源
1. 访问 https://analytics.google.com
2. 点击"开始衡量"
3. 创建账户和媒体资源
4. 获取测量 ID（格式：G-XXXXXXXXXX）

#### 2. Next.js 中集成

\`\`\`tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={\`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX\`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: \`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            \`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
\`\`\`

#### 3. 使用 @next/third-parties（推荐）

\`\`\`bash
npm install @next/third-parties
\`\`\`

\`\`\`tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
\`\`\`

### 关键指标监控

#### 1. 用户获取（Acquisition）
- **新用户数**：首次访问的用户
- **会话数**：总访问次数
- **流量来源**：有机搜索、直接访问、引荐、社交媒体

#### 2. 参与度（Engagement）
- **参与率**：互动会话百分比
- **平均参与时间**：用户活跃时长
- **每次会话事件数**：用户互动频率

#### 3. 转化（Conversion）
- **关键事件**：表单提交、询价、下载
- **转化率**：完成目标的用户比例
- **收入**：电子商务追踪

### 设置目标和事件

#### 关键事件示例

\`\`\`tsx
// 追踪询价表单提交
const handleInquirySubmit = async (formData) => {
  // 提交表单逻辑
  
  // 发送 GA4 事件
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'inquiry',
      event_label: formData.productName,
      value: 1,
    });
  }
};

// 追踪产品查看
useEffect(() => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      }],
    });
  }
}, [product]);
\`\`\`

### 自定义报告

#### 创建探索报告

1. 左侧菜单 → 探索
2. 选择报告类型：
   - **漏斗探索**：转化路径分析
   - **路径探索**：用户旅程地图
   - **细分重叠**：受众群体对比

#### 常用维度
- 国家/地区
- 设备类别
- 流量来源
- 着陆页
- 事件名称

#### 常用指标
- 活跃用户数
- 新用戶数
- 参与率
- 平均参与时间
- 事件计数

### 电商追踪

对于 B2B 网站，可以追踪：

\`\`\`tsx
// 追踪加入购物车
window.gtag('event', 'add_to_cart', {
  currency: 'USD',
  value: product.price,
  items: [{
    item_id: product.sku,
    item_name: product.name,
    price: product.price,
    quantity: 1,
  }],
});

// 追踪开始结账
window.gtag('event', 'begin_checkout', {
  currency: 'USD',
  value: cartTotal,
  items: cartItems.map(item => ({
    item_id: item.sku,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
});
\`\`\`

### 数据导出和整合

- **BigQuery 链接**：原始数据导出
- **Looker Studio**：可视化报告
- **Google Ads 链接**：广告效果分析
- **Search Console 链接**：SEO 数据整合
      `,
    },
    {
      id: 'search-console',
      title: 'Google Search Console',
      content: `
## Google Search Console 简介

Search Console 是 Google 提供的免费工具，帮助网站所有者监控和维护网站在搜索结果中的表现。

### 验证网站所有权

#### 方法 1：HTML 文件上传
1. 下载验证文件
2. 上传到网站根目录
3. 点击"验证"

#### 方法 2：HTML 标签
\`\`\`html
<meta name="google-site-verification" content="your-verification-code" />
\`\`\`

#### 方法 3：DNS 记录（推荐）
添加 TXT 记录到域名 DNS 设置

#### 方法 4：Google Analytics
如果已安装 GA，可直接验证

### 核心功能

#### 1. 性能报告（Performance）

**关键指标**：
- **展示次数（Impressions）**：页面在搜索结果中出现的次数
- **点击次数（Clicks）**：用户点击结果的次数
- **点击率（CTR）**：点击次数 / 展示次数
- **平均排名**：页面在搜索结果中的平均位置

**分析维度**：
- 查询（关键词）
- 页面
- 国家/地区
- 设备
- 搜索类型（网页、图片、视频）
- 搜索外观（富媒体摘要）

**时间范围**：
- 最近 7 天、28 天、3 个月、6 个月、16 个月
- 自定义日期范围

#### 2. 索引覆盖（Index Coverage）

**页面状态**：
- ✅ **已编入索引**：正常显示在搜索结果中
- ⚠️ **有警告**：已索引但存在问题
- ❌ **未编入索引**：无法在搜索结果中找到
- 🚫 **已排除**：故意不索引（如 noindex）

**常见问题**：
- 404 错误（页面不存在）
- 5xx 错误（服务器错误）
- 重定向错误
- robots.txt 阻止
- canonical 问题

#### 3. Sitemap

**提交 Sitemap**：
1. 左侧菜单 → Sitemap
2. 输入 URL：\`sitemap.xml\`
3. 点击"提交"

**监控状态**：
- 发现的 URL 数量
- 已索引的 URL 数量
- 错误和警告

#### 4. 移动设备易用性

检查页面是否符合移动端标准：
- 文本是否可读
- 点击目标大小
- 视口配置
- 内容宽度

#### 5. 核心网页指标（Core Web Vitals）

**三大指标**：
- **LCP（Largest Contentful Paint）**：< 2.5 秒
- **FID（First Input Delay）**：< 100 毫秒
- **CLS（Cumulative Layout Shift）**：< 0.1

**评级**：
- 🟢 良好（Good）
- 🟡 需要改进（Needs Improvement）
- 🔴 差（Poor）

### 日常监控清单

#### 每周检查
1. **性能报告**：
   - 展示次数和点击次数趋势
   - 排名变化的关键词
   - CTR 异常的页面

2. **索引状态**：
   - 新发现的错误
   - 已修复的问题

#### 每月检查
1. **顶级关键词**：
   - 排名前 10 的关键词
   - 排名上升/下降的关键词

2. **顶级页面**：
   - 流量最高的页面
   - CTR 低的页面（优化元描述）

3. **国家/地区表现**：
   - 主要市场的增长
   - 新兴市场的机会

### 优化建议

#### 提高 CTR

1. **优化标题标签**：
   - 包含数字："10 Best..."
   - 使用括号："[2024 Guide]"
   - 添加情感词："Amazing", "Ultimate"

2. **优化元描述**：
   - 包含关键词
   - 明确价值主张
   - 行动号召

3. **富媒体摘要**：
   - 添加结构化数据
   - 获得星级评分、价格等信息

#### 提升排名

1. **内容优化**：
   - 更新过时内容
   - 增加深度和长度
   - 改善可读性

2. **技术优化**：
   - 提升页面速度
   - 修复移动问题
   - 改善内部链接

3. **外链建设**：
   - 获取高质量外链
   - 提升域名权威度

### 警报和通知

设置电子邮件通知：
- 手动操作（惩罚）
- 安全问题（被黑）
- 严重索引问题

### 与其他工具整合

- **Google Analytics**：流量和行为数据
- **Google Ads**：付费搜索数据
- **Bing Webmaster Tools**：Bing 搜索引擎数据
- **第三方 SEO 工具**：Ahrefs、SEMrush、Moz
      `,
    },
    {
      id: 'rank-tracking',
      title: '排名跟踪',
      content: `
## 关键词排名跟踪的重要性

定期监控关键词排名，了解 SEO 效果，发现优化机会。

### 排名跟踪工具

#### 1. Ahrefs Rank Tracker
**优点**：
- 数据准确可靠
- 支持本地化排名
- 竞争对手对比
- SERP 功能追踪

**价格**：$99/月起

#### 2. SEMrush Position Tracking
**优点**：
- 每日更新
- 移动和桌面排名
- 可见性指数
-  cannibalization 检测

**价格**：$129.95/月起

#### 3. SERPWatcher（Mangools）
**优点**：
- 性价比高
- 界面友好
-  dominance index
- 邮件报告

**价格**：$29/月起

#### 4. Google Search Console（免费）
**优点**：
- 完全免费
- 官方数据
- 实际点击数据

**缺点**：
- 数据采样
- 延迟 2-3 天
- 功能有限

### 跟踪策略

#### 选择关键词

**核心关键词（10-20 个）**：
- wholesale toys
- toy supplier
- educational toys bulk
- silicone baby products

**长尾关键词（50-100 个）**：
- wholesale educational toys for kids
- bulk silicone teething toys
- custom plush toy manufacturer
- ASTM certified toy supplier

**品牌关键词**：
- SinTone toys
- [你的品牌名] wholesale

#### 跟踪频率

- **核心关键词**：每日
- **重要关键词**：每周
- **长尾关键词**：每两周
- **整体趋势**：每月

#### 地理位置

根据目标市场设置：
- **全球**：United States（默认）
- **特定国家**：United Kingdom, Germany, Australia
- **城市级别**：New York, London（如需要）

### 关键指标

#### 1. 平均排名
所有跟踪关键词的平均位置。

**目标**：
- 优秀：< 10
- 良好：10-20
- 一般：20-50
- 需改进：> 50

#### 2. 可见性指数
基于排名和搜索量的加权分数。

**计算方式**：
\`\`\`
可见性 = Σ(关键词排名权重 × 搜索量)
\`\`\`

#### 3. 排名第一页的关键词数
排名在 1-10 位的关键词数量。

**目标**：每月增长 10-20%

#### 4. SERP 功能出现
- 精选摘要（Featured Snippet）
- 人们也问（People Also Ask）
- 图片包（Image Pack）
- 视频结果（Video Carousel）

### 竞争对手分析

#### 跟踪竞争对手

选择 3-5 个主要竞争对手，跟踪他们的：
- 共同关键词
- 排名变化
- 新获得的关键词
- 失去的关键词

#### 竞争情报

1. **内容差距分析**：
   - 对手排名的关键词你没有
   - 创建相关内容填补空白

2. **外链差距**：
   - 对手的外链来源
   - 争取相同的外链机会

3. **SERP 分析**：
   - 搜索结果中的内容类型
   - 用户意图（信息型、交易型）

### 排名波动分析

#### 正常波动
- ±1-3 位：日常波动，无需担心
- ±4-10 位：可能需要关注
- > 10 位：需要调查原因

#### 常见原因

**排名下降**：
- Google 算法更新
- 技术问题（速度慢、宕机）
- 内容质量下降
- 竞争对手优化
- 季节性因素

**排名上升**：
- 内容优化生效
- 获得高质量外链
- 技术改进
- 竞争对手问题
- 季节性需求

### 报告和洞察

#### 周报内容

1. **总体表现**：
   - 平均排名变化
   - 可见性指数
   - 第一页关键词数

2. **显著变化**：
   - 排名上升最多的关键词（Top 5）
   - 排名下降最多的关键词（Top 5）

3. **新机会**：
   - 接近第一页的关键词（11-20 位）
   - 高搜索量低竞争关键词

4. **行动项**：
   - 需要优化的页面
   - 需要创建的内容
   - 需要修复的问题

#### 月报内容

1. **月度总结**：
   - 整体趋势图表
   - 关键成就
   - 主要挑战

2. **详细分析**：
   - 按类别分组的表现
   - 地理分布
   - 设备对比

3. **竞品对比**：
   - 相对市场份额
   - 关键词重叠度
   - 增长机会

4. **下月计划**：
   - 优先优化的关键词
   - 内容创作计划
   - 技术改进项目

### 自动化报告

#### 工具内置报告
- Ahrefs：每周/每月邮件报告
- SEMrush：自定义报告模板
- SERPWatcher：每日/每周摘要

#### Looker Studio 仪表板
整合多个数据源：
- Google Search Console
- Google Analytics
- 排名跟踪工具
- 社交媒体数据

### 最佳实践

1. **长期视角**：SEO 是马拉松，不是短跑
2. **关注趋势**：不要过度反应单日波动
3. **结合其他指标**：排名不是唯一，还要看流量和转化
4. **定期审计**：每季度全面审查策略
5. **持续优化**：根据数据调整策略
      `,
    },
    {
      id: 'roi-calculation',
      title: 'SEO ROI 计算',
      content: `
## 计算 SEO 投资回报率

理解 SEO 的真实价值，证明营销预算的合理性。

### ROI 基本公式

\`\`\`
SEO ROI = (SEO 带来的收入 - SEO 成本) / SEO 成本 × 100%
\`\`\`

### 追踪 SEO 收入

#### 1. 电子商务追踪

如果有在线销售：

\`\`\`
SEO 收入 = 有机搜索带来的订单总额
\`\`\`

在 Google Analytics 中：
-  Acquisition → All Traffic → Channels
- 查看 "Organic Search" 的收入

#### 2. 潜在客户价值

对于 B2B 业务：

\`\`\`
步骤 1：计算每个线索的价值
单个线索价值 = 平均订单价值 × 转化率

步骤 2：计算 SEO 带来的线索数量
SEO 线索数 = GA4 中有机搜索的表单提交数

步骤 3：计算总收入
SEO 收入 = SEO 线索数 × 单个线索价值
\`\`\`

**示例**：
- 平均订单价值：$5,000
- 转化率（线索到客户）：10%
- 单个线索价值：$5,000 × 10% = $500
- 月度 SEO 线索：50 个
- 月度 SEO 收入：50 × $500 = $25,000

#### 3. 归因模型

考虑多触点归因：
- **首次点击**：SEO 作为发现渠道
- **最终点击**：SEO 作为转化渠道
- **线性归因**：所有渠道平分功劳
- **时间衰减**：越接近转化的触点权重越高

### SEO 成本构成

#### 1. 人力成本

\`\`\`
内部团队：
- SEO 专家薪资：$X/月
- 内容创作者薪资：$Y/月
- 技术人员时间：$Z/月

外部机构：
- SEO 服务费：$A/月
- 内容创作费：$B/月
- 外链建设费：$C/月
\`\`\`

#### 2. 工具成本

- SEO 工具（Ahrefs/SEMrush）：$100-500/月
- 内容工具（Grammarly等）：$20-50/月
- 分析工具：$0-200/月

#### 3. 其他成本

- 网站开发和改进
- 设计和多媒体制作
- 培训和会议

**总月度 SEO 成本** = 人力 + 工具 + 其他

### ROI 计算示例

#### 场景 1：小型企业

**成本**：
- SEO 顾问：$2,000/月
- 工具订阅：$150/月
- 内容创作：$500/月
- **总计**：$2,650/月

**收益**：
- 月度有机流量：5,000 访客
- 转化率：2%
- 线索数：100 个
- 单个线索价值：$200
- **月收入**：$20,000

**ROI**：
\`\`\`
ROI = ($20,000 - $2,650) / $2,650 × 100%
    = 654%
\`\`\`

#### 场景 2：中型企业

**成本**：
- 内部 SEO 团队：$8,000/月
- 外部机构：$3,000/月
- 工具和开发：$1,000/月
- **总计**：$12,000/月

**收益**：
- 月度有机流量：30,000 访客
- 转化率：3%
- 线索数：900 个
- 单个线索价值：$300
- **月收入**：$270,000

**ROI**：
\`\`\`
ROI = ($270,000 - $12,000) / $12,000 × 100%
    = 2,150%
\`\`\`

### 长期价值计算

SEO 的效果会累积，需要考虑长期价值：

#### 客户生命周期价值（LTV）

\`\`\`
LTV = 平均订单价值 × 年购买次数 × 客户保留年数

例如：
- 平均订单：$5,000
- 年购买次数：2 次
- 保留年限：3 年
- LTV = $5,000 × 2 × 3 = $30,000
\`\`\`

#### 内容资产价值

博客文章和页面会持续带来流量：

\`\`\`
单篇文章年价值 = 月均流量 × 转化率 × 线索价值 × 12

例如：
- 月均流量：500
- 转化率：2%
- 线索价值：$200
- 年价值 = 500 × 2% × $200 × 12 = $24,000
\`\`\`

### 非货币收益

除了直接收入，SEO 还带来：

1. **品牌知名度**：更多人知道你的品牌
2. **信任度**：高排名建立权威
3. **长期资产**：内容持续产生价值
4. **降低获客成本**：相比付费广告更便宜
5. **竞争优势**：超越竞争对手

### 报告模板

#### 月度 SEO ROI 报告

\`\`\`markdown
# SEO 月度报告 - [月份 年份]

## 执行摘要
- 本月 SEO 投资：$X
- 本月 SEO 收入：$Y
- ROI：Z%
- 环比增长：+/- N%

## 关键指标
- 有机流量：X 访客（+/- Y%）
- 线索数：X 个（+/- Y%）
- 转化率：X%（+/- Y%）
- 平均排名：X（+/- Y）

## 顶级表现
### 顶级关键词
1. keyword1 - 排名 #3（↑2）
2. keyword2 - 排名 #5（↑1）
3. keyword3 - 排名 #8（↑3）

### 顶级页面
1. /page1 - X 访客，Y 线索
2. /page2 - X 访客，Y 线索
3. /page3 - X 访客，Y 线索

## 成本明细
- 人力：$X
- 工具：$Y
- 其他：$Z
- **总计**：$Total

## 洞察和建议
1. 洞察 1...
2. 洞察 2...
3. 建议 1...
4. 建议 2...

## 下月计划
- 优先事项 1
- 优先事项 2
- 优先事项 3
\`\`\`

### 基准和 KPI

#### 行业基准（B2B）

- ** organic 流量占比**：30-50% 总流量
- **转化率**：2-5%
- **SEO ROI**：500-2000%
- **回本周期**：6-12 个月

#### 设定 KPI

**短期（1-3 个月）**：
- 关键词排名提升
- 流量增长 20-30%
- 技术问题解决

**中期（3-6 个月）**：
- 第一页关键词数翻倍
- 线索数增长 50%
- ROI 达到 300%+

**长期（6-12 个月）**：
- 核心关键词前 3 名
- 有机流量增长 200%+
- ROI 达到 1000%+

### 常见问题

**Q: SEO ROI 多久能看到？**
A: 通常 3-6 个月开始看到明显效果，12 个月达到成熟期。

**Q: 如何分离 SEO 和其他渠道的影响？**
A: 使用 GA4 的渠道分组和归因模型，结合 UTM 参数追踪。

**Q: ROI 为负怎么办？**
A: 检查策略执行、竞争环境、目标设定，可能需要调整方向。

**Q: 如何向管理层汇报？**
A: 关注业务指标（收入、利润），而非技术指标（排名、流量）。
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <KnowledgeNav 
        title="数据分析"
        description="掌握 SEO 数据分析和效果追踪方法，用数据驱动优化决策"
        sections={sections.map(s => ({ id: s.id, title: s.title }))}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white rounded-lg shadow-sm p-8 scroll-mt-24"
            >
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{
                  __html: section.content.replace(/\\n/g, '<br/>'),
                }}
              />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
