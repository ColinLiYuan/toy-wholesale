'use client';

import KnowledgeNav from '@/components/trade-knowledge/KnowledgeNav';

export default function InternationalSeoPage() {
  const sections = [
    {
      id: 'multilingual-seo',
      title: '多语言 SEO',
      content: `
## 多语言网站的重要性

对于玩具批发业务，支持多语言可以：
- **扩大市场覆盖**：触达非英语国家买家
- **提升用户体验**：母语浏览更易理解
- **增加信任度**：本地化显示专业性
- **提高转化率**：用户更倾向用母语购买

### 语言选择策略

#### 优先级排序

根据目标市场确定语言优先级：

1. **英语（en）**：全球通用，必选
2. **西班牙语（es）**：拉丁美洲、西班牙
3. **法语（fr）**：法国、加拿大、非洲部分国家
4. **德语（de）**：德国、奥地利、瑞士
5. **葡萄牙语（pt）**：巴西、葡萄牙
6. **阿拉伯语（ar）**：中东市场
7. **日语（ja）**：日本市场
8. **中文（zh）**：中国市场

#### 市场调研

考虑因素：
- 市场规模和潜力
- 竞争程度
- 语言使用人数
- 电子商务成熟度
- 支付和物流便利性

### URL 结构选择

#### 方案 1：子目录（推荐）

\`\`\`
https://example.com/en/products
https://example.com/es/productos
https://example.com/fr/produits
\`\`\`

**优点**：
- 易于设置和维护
- SEO 权重集中在主域名
- Google Search Console 统一管理
- CDN 和服务器配置简单

**缺点**：
- URL 中包含语言代码
- 需要正确配置 hreflang

#### 方案 2：子域名

\`\`\`
https://en.example.com/products
https://es.example.com/productos
https://fr.example.com/produits
\`\`\`

**优点**：
- 清晰的语言分离
- 可以针对不同地区优化
- 服务器部署灵活

**缺点**：
- SEO 权重分散
- 需要分别验证 GSC
- 外链建设更复杂
- 维护成本高

#### 方案 3：国家顶级域名（ccTLD）

\`\`\`
https://example.com/products        (国际)
https://example.de/produkte         (德国)
https://example.fr/produits         (法国)
https://example.es/productos        (西班牙)
\`\`\`

**优点**：
- 最强的地域信号
- 当地用户信任度高
- 可以在当地托管

**缺点**：
- 成本最高（多个域名）
- 管理复杂
- 需要分别建立权威度
- 法律和公司实体要求

### Next.js 中的实现

#### 使用 next-intl

\`\`\`bash
npm install next-intl
\`\`\`

#### 项目结构

\`\`\`
app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── products/
│       └── page.tsx
├── layout.tsx
└── page.tsx
\`\`\`

#### 配置文件

\`\`\`ts
// i18n.ts
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'es', 'fr', 'de'];

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(\`@/locales/\${locale}.json\`)).default
  };
});
\`\`\`

#### 中间件配置

\`\`\`ts
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr', 'de'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\\\..*).*)']
};
\`\`\`

### 内容翻译策略

#### 专业翻译 vs 机器翻译

**专业翻译（推荐）**：
- ✅ 准确、自然
- ✅ 文化适配
- ✅ 行业术语正确
- ❌ 成本高
- ❌ 时间长

**机器翻译 + 人工校对**：
- ✅ 成本低
- ✅ 速度快
- ⚠️ 需要仔细校对
- ⚠️ 可能有错误

**纯机器翻译（不推荐）**：
- ❌ 质量不可控
- ❌ 可能损害品牌形象
- ❌ SEO 效果差

#### 翻译注意事项

1. **关键词研究**：每种语言单独做关键词研究
2. **文化差异**：避免文化敏感内容
3. **度量单位**：公制 vs 英制
4. **日期格式**：MM/DD/YYYY vs DD/MM/YYYY
5. **货币符号**：$、€、£、¥

### hreflang 标签

#### 什么是 hreflang？

hreflang 标签告诉搜索引擎不同语言版本的对应关系，避免重复内容问题。

#### 实施方法

**在 HTML <head> 中**：

\`\`\`html
<link rel="alternate" hreflang="en" href="https://example.com/en/products" />
<link rel="alternate" hreflang="es" href="https://example.com/es/productos" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/produits" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/products" />
\`\`\`

**在 Next.js 中**：

\`\`\`tsx
// app/[locale]/layout.tsx
import {headers} from 'next/headers';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const baseUrl = 'https://example.com';
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];
  
  const alternates = {
    languages: {},
  };
  
  languages.forEach(lang => {
    alternates.languages[lang.code] = \`\${baseUrl}/\${lang.code}\`;
  });
  
  alternates.languages['x-default'] = \`\${baseUrl}/en\`;
  
  return {
    alternates,
  };
}
\`\`\`

#### hreflang 最佳实践

1. **双向链接**：如果 A 页面链接到 B，B 也要链接回 A
2. **自引用**：每个页面都要包含自己的 hreflang
3. **x-default**：为未指定语言的用戶提供默认版本
4. **一致性**：所有页面都要有完整的 hreflang 集合
5. **验证**：使用 Google Search Console 检查错误

### 语言切换器

#### UI 设计

\`\`\`tsx
// components/LanguageSwitcher.tsx
'use client';

import {useRouter, usePathname} from 'next/navigation';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  const switchLanguage = (locale: string) => {
    // 替换当前路径中的语言代码
    const newPath = pathname.replace(/\\/[^/]+(\\/.*)/, \`/\${locale}$1\`);
    router.push(newPath);
  };
  
  return (
    <div className="flex items-center space-x-2">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className="px-3 py-1 rounded hover:bg-gray-100"
        >
          <span className="mr-1">{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
\`\`\`

### SEO 优化要点

#### 每种语言独立优化

1. **关键词研究**：不要直译，要重新研究
2. **元标签**：标题和描述要本地化
3. **内容质量**：确保翻译准确自然
4. **内部链接**：同语言页面互相链接

#### 避免常见错误

❌ **错误做法**：
- 使用自动翻译 without 校对
- 忽略 hreflang 标签
- 混合语言在同一页面
- 忘记本地化图片和媒体

✅ **正确做法**：
- 专业翻译或人工校对
- 完整实施 hreflang
- 每页单一语言
- 本地化所有内容元素

### 测试和验证

#### 工具推荐

1. **Google Search Console**：
   - 国际 targeting 报告
   - hreflang 错误检测

2. **Screaming Frog**：
   - 爬取多语言网站
   - 检查 hreflang 实现

3. **Ahrefs/SEMrush**：
   - 追踪不同语言的排名
   - 分析竞争对手

#### 测试清单

- [ ] 所有语言版本可访问
- [ ] hreflang 标签正确
- [ ] 语言切换器工作正常
- [ ] 元标签已翻译
- [ ] 内容无混合语言
- [ ] 图片和媒体已本地化
- [ ] 表单和 CTA 已翻译
- [ ] 法律和合规信息已更新
      `,
    },
    {
      id: 'regional-targeting',
      title: '地域定向',
      content: `
## 地域定向的重要性

即使使用相同语言，不同国家和地区的用户需求、搜索习惯也可能不同。

### 地域差异示例

#### 英语变体

**美国英语（en-US）**：
- "color" vs "colour"
- "center" vs "centre"
- "toy store" vs "toy shop"

**英国英语（en-GB）**：
- 不同的拼写和用词
- 不同的度量单位
- 不同的文化参考

#### 搜索意图差异

**美国用户**：
- 搜索："wholesale toys USA"
- 关注：快速配送、本土供应商

**欧洲用户**：
- 搜索："wholesale toys EU"
- 关注：CE 认证、VAT、跨境物流

### Google Search Console 地域设置

#### 国际 Targeting

1. 访问 GSC
2. 左侧菜单 → 设置 → 国际 targeting
3. 选择目标国家
4. 提交验证

注意：这只适用于 gTLD（如 .com），不适用于 ccTLD。

### 本地化内容策略

#### 地址和联系信息

\`\`\`
美国版本：
📍 123 Main St, New York, NY 10001, USA
📞 +1 (800) 123-4567
📧 us@example.com

德国版本：
📍 Musterstraße 123, 10115 Berlin, Deutschland
📞 +49 (0) 30 12345678
📧 de@example.com
\`\`\`

#### 货币和价格

\`\`\`tsx
// 根据地区显示不同货币
const prices = {
  US: { currency: 'USD', symbol: '$', price: 29.99 },
  EU: { currency: 'EUR', symbol: '€', price: 27.99 },
  UK: { currency: 'GBP', symbol: '£', price: 24.99 },
};
\`\`\`

#### 运输和物流信息

**美国**：
- 国内运输：3-5 天
- 运费：满 $500 免运费
- 承运商：FedEx, UPS

**欧洲**：
- 欧盟内运输：5-7 天
- 运费：满 €500 免运费
- 承运商：DHL, DPD
- VAT 说明

#### 认证和合规

**美国市场**：
- ASTM F963
- CPSIA
- FCC（电子玩具）

**欧盟市场**：
- CE 标志
- EN71 标准
- REACH（化学品）
- RoHS（电子产品）

### 本地化 SEO 策略

#### 地域关键词

在内容中包含地域特定关键词：

\`\`\`
美国：
- "wholesale toys USA"
- "American toy supplier"
- "toys made in USA"

欧洲：
- "wholesale toys Europe"
- "EU toy distributor"
- "CE certified toys"

澳大利亚：
- "wholesale toys Australia"
- "Australian toy supplier"
\`\`\`

#### 本地化博客内容

创建针对特定地区的内容：

\`\`\`
文章示例：
- "How to Import Toys to the USA: Complete Guide"
- "Understanding CE Certification for European Market"
- "Top 10 Toy Trends in Germany 2024"
- "Shipping Toys to Australia: Customs and Regulations"
\`\`\`

#### 本地外链建设

获取目标地区的反向链接：

- 当地行业协会
- 地区性 B2B 目录
- 当地媒体报道
- 地区博客和媒体

### 技术实施

#### 地理 IP 重定向（谨慎使用）

\`\`\`tsx
// middleware.ts - 可选的地理重定向
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const country = request.headers.get('x-vercel-ip-country');
  
  // 仅对首页进行重定向建议，不要强制
  if (request.nextUrl.pathname === '/') {
    if (country === 'DE' || country === 'FR') {
      // 返回建议，但允许用户切换
      return NextResponse.redirect(new URL('/de', request.url));
    }
  }
  
  return NextResponse.next();
}
\`\`\`

**注意**：
- ❌ 不要强制重定向
- ✅ 提供语言/地区选择器
- ✅ 记住用户偏好
- ✅ 允许手动切换

#### Hreflang 地域变体

\`\`\`html
<!-- 英语的不同地区 -->
<link rel="alternate" hreflang="en-US" href="https://example.com/en-us/products" />
<link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/products" />
<link rel="alternate" hreflang="en-AU" href="https://example.com/en-au/products" />

<!-- 德语的不同地区 -->
<link rel="alternate" hreflang="de-DE" href="https://example.com/de-de/produkte" />
<link rel="alternate" hreflang="de-AT" href="https://example.com/de-at/produkte" />
<link rel="alternate" hreflang="de-CH" href="https://example.com/de-ch/produkte" />
\`\`\`

### 本地商业列表

#### Google My Business

如果有实体展厅或仓库：

1. 创建当地 GMB 列表
2. 完整填写信息
3. 上传高质量照片
4. 鼓励客户评价
5. 定期发布更新

#### 当地目录

提交到目标市场的 B2B 目录：

**美国**：
- ThomasNet
- Wholesale Central
- SaleHoo

**欧洲**：
- Europages
- Kompass
- Wer Liefert Was (WLW)

**亚洲**：
- Alibaba
- Global Sources
- TradeKey

### 性能优化

#### CDN 配置

使用 CDN 加速全球访问：

- **Cloudflare**：全球节点
- **AWS CloudFront**：可定制
- **Fastly**：高性能

#### 服务器位置

考虑在主要市场附近部署服务器：

- **北美**：US East/West
- **欧洲**：Frankfurt, London
- **亚洲**：Singapore, Tokyo

### 分析和监控

#### 按地区分割数据

在 Google Analytics 中：

1. Audience → Geo → Location
2. 查看不同国家的：
   - 流量
   - 跳出率
   - 转化率
   - 收入

#### Search Console 地域数据

Performance 报告中：
- 添加"Country"维度
- 分析各国表现
- 识别增长机会

### 常见问题

**Q: 应该先拓展哪些市场？**
A: 根据现有客户分布、市场规模、竞争程度、运营难度综合评估。

**Q: 如何处理时区差异？**
A: 提供 24/7 在线客服，或使用聊天机器人处理常见问题。

**Q: 需要考虑当地节假日吗？**
A: 是的，制定针对不同市场的促销日历。

**Q: 法律要求有哪些？**
A: GDPR（欧洲）、CCPA（加州）、当地消费者保护法等。
      `,
    },
    {
      id: 'international-best-practices',
      title: '国际化最佳实践',
      content: `
## 国际化 SEO 完整指南

成功实施国际化 SEO 的关键要素和最佳实践。

### 规划阶段

#### 1. 市场研究

**评估标准**：
- 市场规模和增长潜力
- 竞争程度
- 进入壁垒（法规、认证）
- 语言和文化的相似性
- 物流和支付基础设施
- 政治和经济稳定性

**工具**：
- Google Trends：搜索趋势
- Statista：市场数据
- SimilarWeb：竞品分析
- Ahrefs/SEMrush：关键词难度

#### 2. 资源评估

**所需资源**：
- 翻译和本地化预算
- 技术开发时间
- 内容创作能力
- 客户服务支持
- 法律和合规咨询

**ROI 预测**：
\`\`\`
预计收入 = 目标市场规模 × 市场份额预估 × 平均订单价值
成本 = 翻译 + 开发 + 营销 + 运营
ROI = (预计收入 - 成本) / 成本
\`\`\`

### 实施阶段

#### 1. 技术架构

**推荐的 URL 结构**：子目录

\`\`\`
✅ example.com/en/
✅ example.com/es/
✅ example.com/fr/

❌ en.example.com (子域名 - SEO 权重分散)
❌ example.com?lang=en (参数 - 不利于 SEO)
\`\`\`

**技术栈选择**：
- Next.js with next-intl
- React with i18next
- WordPress with WPML
- Shopify Markets

#### 2. 内容本地化流程

\`\`\`
步骤 1：内容审计
- 列出所有需要翻译的页面
- 确定优先级（高流量页面优先）

步骤 2：关键词研究
- 每种语言独立研究
- 识别当地搜索习惯

步骤 3：专业翻译
- 聘请母语译者
- 提供上下文和术语表

步骤 4：本地化调整
- 修改文化参考
- 更新度量单位
- 调整图片和示例

步骤 5：SEO 优化
- 翻译元标签
- 优化标题层级
- 添加 hreflang

步骤 6：质量保证
- 语言校对
- 功能测试
- SEO 检查

步骤 7：发布和监控
- 逐步上线
- 监控性能和错误
- 收集用户反馈
\`\`\`

#### 3. Hreflang 完整实施

**检查清单**：

- [ ] 每个语言版本都有完整的 hreflang 集合
- [ ] 包含自引用链接
- [ ] 包含 x-default 版本
- [ ] 所有链接都是双向的
- [ ] URL 是绝对路径（含 https://）
- [ ] 语言代码符合 ISO 639-1 标准
- [ ] 地域代码符合 ISO 3166-1 Alpha 2 标准

**验证工具**：
- Google Search Console
- Screaming Frog SEO Spider
- Merkle Hreflang Tags Testing Tool

### 优化阶段

#### 1. 持续内容策略

**每月任务**：
- 发布新的多语言博客文章
- 更新过时内容
- 添加新的产品翻译
- 优化低表现页面

**内容优先级**：
1. 高流量页面
2. 高转化页面
3. 核心产品页面
4. 重要博客文章
5. 帮助和支持页面

#### 2. 外链建设策略

**按地区建设外链**：

\`\`\`
美国市场：
- 美国行业媒体客座博客
- 美国 B2B 目录提交
- 美国贸易展会参与

欧洲市场：
- 欧洲行业协会会员
- 欧洲商业出版物
- 当地 influencer 合作
\`\`\`

**链接多样性**：
- 新闻网站
- 行业博客
- 教育网站（.edu）
- 政府网站（.gov）
- 社交媒体平台

#### 3. 技术优化

**页面速度**：
- 使用 CDN 加速全球访问
- 图片懒加载和优化
- 代码分割和压缩
- 缓存策略

**移动优化**：
- 响应式设计
- 触摸友好的界面
- 快速加载时间
- 清晰的导航

**结构化数据**：
- Product schema
- Organization schema
- BreadcrumbList schema
- Article schema（博客）

### 监控和维护

#### 关键指标仪表板

**Google Data Studio / Looker Studio**：

整合以下数据源：
- Google Analytics 4
- Google Search Console
- Ahrefs/SEMrush
- 社交媒体分析
- CRM 系统

**核心 KPI**：
1. 按语言的有机流量
2. 按国家的转化率
3. 关键词排名变化
4. ROI 和收入
5. 用户参与度指标

#### 月度审查清单

**技术检查**：
- [ ] hreflang 错误
- [ ] 404 错误页面
- [ ] 页面速度性能
- [ ] 移动端可用性
- [ ] SSL 证书状态

**内容检查**：
- [ ] 新内容发布计划
- [ ] 旧内容更新需求
- [ ] 翻译质量审核
- [ ] 关键词表现分析

**SEO 检查**：
- [ ] 核心关键词排名
- [ ] 外链增长情况
- [ ] 竞争对手动态
- [ ] Google 算法更新影响

#### 问题排查

**常见问题**：

1. **流量下降**
   - 检查技术问题（宕机、速度慢）
   - 分析 Google 算法更新
   - 审查竞争对手活动
   - 检查季节性因素

2. **hreflang 错误**
   - 使用 GSC 国际 targeting 报告
   - 运行 Screaming Frog 爬取
   - 验证所有双向链接
   - 检查语言代码格式

3. **排名不佳**
   - 重新评估关键词选择
   - 改进内容质量
   - 增加外链建设
   - 优化技术 SEO

4. **转化率低**
   - A/B 测试页面元素
   - 改善用户体验
   - 优化行动号召
   - 本地化支付选项

### 扩展策略

#### 渐进式扩展

不要一次性推出所有语言：

\`\`\`
第 1-3 个月：英语 + 西班牙语
第 4-6 个月：添加法语
第 7-9 个月：添加德语
第 10-12 个月：添加其他语言
\`\`\`

**好处**：
- 降低初期投入
- 学习曲线更平缓
- 可以根据经验优化流程
- 更容易管理质量

#### 市场优先级矩阵

| 市场 | 规模 | 竞争 | 难度 | 优先级 |
|------|------|------|------|--------|
| 美国 | 大 | 高 | 中 | P0 |
| 德国 | 中 | 中 | 中 | P1 |
| 法国 | 中 | 中 | 中 | P1 |
| 西班牙 | 小 | 低 | 低 | P2 |
| 日本 | 大 | 高 | 高 | P2 |

### 成功案例分析

#### 案例 1：中型玩具批发商

**背景**：
- 原本只有英语网站
- 年营收：$5M
- 主要市场：美国

**行动**：
- 第 1 年：添加西班牙语、法语
- 第 2 年：添加德语、葡萄牙语
- 投资：$150K（翻译 + 开发 + 营销）

**结果**：
- 国际流量增长：300%
- 国际收入占比：从 10% 到 35%
- 年营收增长到：$8M
- ROI：180%（2 年）

**关键成功因素**：
1. 专业翻译和质量控制
2. 完整的 hreflang 实施
3. 针对性的内容营销
4. 当地市场的外链建设
5. 持续的优化和改进

### 工具和资源

#### 必备工具

**翻译和本地化**：
- Smartling
- Lokalise
- Transifex
- Weglot（自动化）

**SEO 分析**：
- Ahrefs
- SEMrush
- Moz Pro
- Screaming Frog

**技术分析**：
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse

**项目管理**：
- Asana
- Trello
- Notion
- Monday.com

#### 学习资源

**官方文档**：
- Google Search Central: International SEO
- Mozilla MDN: hreflang
- W3C: Internationalization

**博客和课程**：
- Ahrefs Blog: International SEO
- SEMrush Academy
- Moz Blog
- Search Engine Journal

**社区**：
- Reddit: r/SEO
- LinkedIn Groups
- Slack communities
- Industry forums

### 未来趋势

#### 人工智能翻译

- GPT-4 等 AI 模型提升翻译质量
- 仍需人工校对和文化适配
- 降低成本，提高效率

#### 语音搜索优化

- 多语言语音搜索增长
- 长尾关键词更重要
- 自然语言内容优化

#### 视觉搜索

- Google Lens 等多语言支持
- 图片 Alt 文本本地化
- 产品图片文化适配

#### 隐私法规

- GDPR、CCPA 等合规要求
- Cookie 同意本地化
- 数据保护政策更新

### 总结

成功的国际化 SEO 需要：

1. **战略规划**：明确目标和优先级
2. **技术基础**：正确的 URL 结构和 hreflang
3. **优质内容**：专业翻译和本地化
4. **持续优化**：数据驱动的改进
5. **长期承诺**：耐心和坚持

记住：国际化是一个旅程，不是目的地。持续学习、测试和优化，才能在全球市场取得成功。
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <KnowledgeNav 
        title="国际化 SEO"
        description="掌握多语言和跨地区 SEO 策略，拓展全球市场"
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
