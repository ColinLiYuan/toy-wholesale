'use client';

import KnowledgeNav from '@/components/trade-knowledge/KnowledgeNav';

export default function SeoBasicsPage() {
  const sections = [
    {
      id: 'seo-intro',
      title: 'SEO 基础概念',
      content: `
## 什么是 SEO？

SEO（Search Engine Optimization，搜索引擎优化）是通过优化网站内容、结构和技术，提高网站在搜索引擎自然搜索结果中的排名，从而获得更多免费流量的过程。

### SEO 的核心目标
- **提高可见性**：让潜在客户更容易找到你的产品
- **增加流量**：吸引更多有购买意向的访客
- **提升转化**：通过精准关键词吸引高质量用户
- **建立品牌**：在搜索结果中树立专业形象

### B2B 外贸 SEO 的重要性
对于玩具批发业务，SEO 可以帮助：
- 吸引全球采购商搜索 "wholesale toys"、"toy supplier" 等关键词
- 降低获客成本，相比付费广告更具长期价值
- 建立行业权威，提升买家信任度
      `,
    },
    {
      id: 'keyword-research',
      title: '关键词研究',
      content: `
## 关键词类型与策略

### 1. 核心词（Core Keywords）
- **特点**：搜索量大，竞争度高
- **示例**："toys wholesale", "adult toys"
- **用途**：首页、主要分类页

### 2. 长尾词（Long-tail Keywords）
- **特点**：搜索量较小，但更精准，转化率高
- **示例**："wholesale educational toys for kids", "bulk silicone adult toys"
- **用途**：产品详情页、博客文章

### 3. 商业意图词（Commercial Intent）
- **特点**：用户有明确购买意向
- **示例**："buy wholesale toys online", "toy distributor near me"
- **用途**：产品页、询价页

### 4. 信息类词（Informational）
- **特点**：用户寻求知识或解决方案
- **示例**："how to choose safe toys", "best materials for adult toys"
- **用途**：博客文章、指南页面

### 关键词研究工具
- **Google Keyword Planner**：免费，适合初学者
- **Ahrefs**：功能强大，数据准确
- **SEMrush**：竞品分析能力强
- **Ubersuggest**：性价比高
      `,
    },
    {
      id: 'on-page-seo',
      title: '页面 SEO 优化',
      content: `
## On-Page SEO 最佳实践

### 标题标签（Title Tag）
- **长度**：50-60 字符
- **格式**：主关键词 | 品牌名
- **示例**："Wholesale Adult Toys - Premium Silicone Products | SinTone"

### 元描述（Meta Description）
- **长度**：150-160 字符
- **内容**：包含关键词 + 行动号召
- **示例**："Discover premium wholesale adult toys made from medical-grade silicone. MOQ 50 units, global shipping. Get your quote today!"

### 标题层级（H1-H6）
- **H1**：每页只有一个，包含主关键词
- **H2-H3**：组织内容结构，使用相关关键词
- **示例**：
  - H1: Wholesale Educational Toys for Kids
  - H2: Benefits of Educational Toys
  - H2: Our Product Range
  - H3: Building Blocks
  - H3: Puzzle Games

### 图片优化
- **Alt 文本**：描述图片内容，包含关键词
- **文件名**：使用描述性名称，如 "wholesale-silicone-toy.jpg"
- **压缩**：减小文件大小，提高加载速度

### URL 结构
- **简洁清晰**：/products/wholesale-educational-toys
- **包含关键词**：避免无意义的参数
- **使用连字符**：不要用下划线
      `,
    },
    {
      id: 'technical-seo',
      title: '技术 SEO',
      content: `
## 技术 SEO 要点

### 网站速度优化
- **目标**：页面加载时间 < 3 秒
- **方法**：
  - 图片压缩和懒加载
  - 代码压缩（CSS/JS）
  - 使用 CDN 加速
  - 启用浏览器缓存

### 移动端适配
- **响应式设计**：自动适应各种屏幕尺寸
- **移动优先索引**：Google 优先抓取移动版
- **测试工具**：Google Mobile-Friendly Test

### SSL 证书（HTTPS）
- **安全性**：保护用户数据
- **排名因素**：HTTPS 是 Google 排名信号
- **信任度**：显示安全锁图标，提升用户信任

### XML Sitemap
- **作用**：帮助搜索引擎发现所有页面
- **提交**：在 Google Search Console 提交
- **更新**：添加新内容时自动更新

### Robots.txt
- **控制爬虫**：指定哪些页面可以抓取
- **优化预算**：阻止无关页面浪费爬取资源
- **示例**：
  \`\`\`
  User-agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /api/
  \`\`\`
      `,
    },
    {
      id: 'content-strategy',
      title: '内容策略',
      content: `
## B2B 外贸内容营销

### 博客文章主题
1. **行业趋势**："2024 年玩具市场十大趋势"
2. **采购指南**："如何选择可靠的玩具供应商"
3. **产品知识**："硅胶玩具 vs PVC 玩具：全面对比"
4. **认证解读**："CE、ASTM、EN71 认证详解"
5. **案例分享**："如何成功进口玩具到欧盟"

### 内容质量要求
- **原创性**：避免复制粘贴
- **深度**：提供有价值的信息，不少于 1500 字
- **可读性**：使用短段落、列表、图表
- **更新频率**：每周至少发布 1-2 篇文章

### 内部链接策略
- **相关文章**：在文章末尾推荐相关内容
- **产品链接**：在文章中自然插入产品链接
- **锚文本**：使用描述性文字，而非"点击这里"

### 外部链接建设
- **行业目录**：提交到 B2B 平台（Alibaba、Global Sources）
- **客座博客**：在行业网站发表文章
- **社交媒体**：分享内容到 LinkedIn、Facebook
      `,
    },
    {
      id: 'local-seo',
      title: '本地与国际化 SEO',
      content: `
## 多语言与多地区优化

### hreflang 标签
用于告诉搜索引擎不同语言版本的对应关系：
\`\`\`html
<link rel="alternate" hreflang="en" href="https://example.com/en/products" />
<link rel="alternate" hreflang="es" href="https://example.com/es/productos" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
\`\`\`

### 国家顶级域名（ccTLD）
- **.com**：国际通用
- **.de**：德国市场
- **.fr**：法国市场
- **优势**：提升当地用户信任度

### 本地化内容
- **货币**：显示当地货币价格
- **单位**：使用公制/英制单位
- **文化适配**：考虑当地节日、习俗
- **联系方式**：提供当地电话、地址

### Google My Business
- **适用场景**：有线下展厅或仓库
- **优化要点**：
  - 完整填写企业信息
  - 上传高质量照片
  - 鼓励客户评价
  - 定期发布更新
      `,
    },
    {
      id: 'analytics',
      title: '数据分析与监控',
      content: `
## SEO 效果追踪

### Google Analytics
- **关键指标**：
  - 有机流量（Organic Traffic）
  - 跳出率（Bounce Rate）
  - 平均会话时长
  - 转化率（Conversion Rate）

### Google Search Console
- **监控内容**：
  - 关键词排名
  - 点击率（CTR）
  - 索引状态
  - 技术问题警报

### 排名跟踪
- **工具推荐**：
  - Ahrefs Rank Tracker
  - SEMrush Position Tracking
  - SERPWatcher
- **跟踪频率**：每周检查一次
- **关注关键词**：前 20 个核心关键词

### ROI 计算
\`\`\`
SEO ROI = (SEO 带来的收入 - SEO 成本) / SEO 成本 × 100%
\`\`\`

### 常见问题排查
- **流量下降**：检查算法更新、技术问题
- **排名波动**：分析竞争对手、内容质量
- **索引问题**：检查 robots.txt、sitemap
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <KnowledgeNav 
        title="SEO 基础知识"
        description="掌握搜索引擎优化的核心概念和实战技巧，提升网站在 Google 等搜索引擎中的排名"
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
                  __html: section.content.replace(/\n/g, '<br/>'),
                }}
              />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
