'use client';

import KnowledgeNav from '@/components/trade-knowledge/KnowledgeNav';

export default function TechnicalSeoPage() {
  const sections = [
    {
      id: 'site-speed',
      title: '网站速度优化',
      content: `
## 为什么网站速度很重要？

网站加载速度直接影响用户体验和 SEO 排名。Google 已将页面速度作为排名因素，尤其是移动端。

### 速度目标
- **桌面端**：< 2 秒
- **移动端**：< 3 秒
- **首次内容绘制 (FCP)**：< 1.8 秒
- **最大内容绘制 (LCP)**：< 2.5 秒

### 优化工具
- **Google PageSpeed Insights**：分析并提供优化建议
- **GTmetrix**：详细的速度报告
- **WebPageTest**：多地点、多设备测试
- **Lighthouse**：Chrome DevTools 内置工具

### 优化策略

#### 1. 图片优化
- **格式选择**：使用 WebP 或 AVIF 格式
- **压缩**：使用 TinyPNG、ImageOptim 等工具
- **懒加载**：只在可见时加载图片
- **响应式图片**：根据屏幕尺寸提供不同大小

\`\`\`html
<!-- 响应式图片示例 -->
<img 
  src="toy-small.jpg"
  srcset="toy-large.jpg 1200w, toy-medium.jpg 800w, toy-small.jpg 400w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Wholesale Toys"
  loading="lazy"
/>
\`\`\`

#### 2. 代码优化
- **压缩 CSS/JS**：移除空格、注释
- **Tree Shaking**：删除未使用的代码
- **代码分割**：按需加载模块
- **最小化 HTTP 请求**：合并文件

#### 3. 服务器优化
- **启用 Gzip/Brotli 压缩**
- **使用 CDN**：Cloudflare、AWS CloudFront
- **浏览器缓存**：设置合理的 Cache-Control
- **HTTP/2**：支持多路复用

#### 4. Next.js 特定优化
- **图像组件**：使用 \`<Image>\` 自动优化
- **字体优化**：使用 \`next/font\`
- **路由预取**：自动预取链接页面
- **服务端渲染**：减少客户端 JavaScript
      `,
    },
    {
      id: 'mobile-optimization',
      title: '移动端优化',
      content: `
## 移动优先索引

Google 现在主要使用移动版页面进行索引和排名，因此移动端优化至关重要。

### 响应式设计原则

#### 1. 视口设置
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

#### 2. 触摸友好
- **按钮大小**：至少 44x44 像素
- **间距**：元素之间留足空间
- **手势**：支持滑动、缩放等操作

#### 3. 字体可读性
- **字号**：正文至少 16px
- **行高**：1.5-1.6
- **对比度**：符合 WCAG 标准

### 移动端测试

#### Google Mobile-Friendly Test
访问：https://search.google.com/test/mobile-friendly

检查项目：
- 文本是否可读
- 点击目标是否足够大
- 内容是否适合屏幕宽度
- 是否使用了不兼容的技术（如 Flash）

### 常见移动端问题

1. **弹窗干扰**：避免全屏弹窗影响用户体验
2. **水平滚动**：确保内容不会超出屏幕
3. **加载时间**：移动端网络较慢，需特别优化
4. **表单体验**：简化输入，使用合适的键盘类型

\`\`\`html
<!-- 移动端表单优化 -->
<input type="tel" pattern="[0-9]*" placeholder="电话号码">
<input type="email" autocomplete="email">
\`\`\`
      `,
    },
    {
      id: 'structured-data',
      title: '结构化数据',
      content: `
## 什么是结构化数据？

结构化数据（Schema.org）是一种标准化的标记语言，帮助搜索引擎更好地理解页面内容，从而在搜索结果中显示丰富的信息（富媒体摘要）。

### 常见的 Schema 类型

#### 1. Product（产品）
适用于产品详情页：

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wholesale Educational Building Blocks",
  "image": "https://example.com/images/blocks.jpg",
  "description": "High-quality educational building blocks for kids, wholesale available",
  "brand": {
    "@type": "Brand",
    "name": "ToyWholesale"
  },
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/products/building-blocks"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "128"
  }
}
\`\`\`

#### 2. Organization（组织）
适用于首页或关于我们页面：

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SinTone Toy Wholesale",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-123-4567",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://www.facebook.com/example",
    "https://www.linkedin.com/company/example"
  ]
}
\`\`\`

#### 3. BreadcrumbList（面包屑导航）
帮助搜索引擎理解网站结构：

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://example.com/products"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Educational Toys",
      "item": "https://example.com/products/educational"
    }
  ]
}
\`\`\`

#### 4. Article（文章）
适用于博客文章：

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Choose Safe Toys for Kids",
  "image": "https://example.com/images/safe-toys.jpg",
  "author": {
    "@type": "Person",
    "name": "John Smith"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SinTone",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20"
}
\`\`\`

### 实施方法

#### Next.js 中 implementation

\`\`\`tsx
import Script from 'next/script';

export default function ProductPage({ product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 页面内容 */}
    </>
  );
}
\`\`\`

### 验证工具

- **Rich Results Test**：https://search.google.com/test/rich-results
- **Schema Markup Validator**：https://validator.schema.org/
- **Google Search Console**：增强功能报告
      `,
    },
    {
      id: 'ssl-security',
      title: 'SSL 与安全',
      content: `
## HTTPS 的重要性

HTTPS 不仅是安全要求，也是 Google 的排名信号。没有 SSL 证书的网站会被标记为"不安全"。

### SSL 证书类型

1. **DV（域名验证）**：最基本，适合小型网站
2. **OV（组织验证）**：验证企业身份
3. **EV（扩展验证）**：最高级别，显示绿色地址栏

### 获取 SSL 证书

#### 免费选项
- **Let's Encrypt**：自动续期，广泛支持
- **Cloudflare**：提供免费的 Universal SSL

#### 付费选项
- **Comodo**
- **DigiCert**
- **Symantec**

### Next.js 中的 HTTPS

#### 开发环境
\`\`\`bash
# 使用 mkcert 生成本地证书
npm install -g mkcert
mkcert localhost
\`\`\`

#### 生产环境
大多数托管平台（Vercel、Netlify）自动提供 HTTPS。

### 安全最佳实践

1. **HSTS（HTTP Strict Transport Security）**
\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains
\`\`\`

2. **Content Security Policy (CSP)**
防止 XSS 攻击：
\`\`\`
Content-Security-Policy: default-src 'self'
\`\`\`

3. **X-Frame-Options**
防止点击劫持：
\`\`\`
X-Frame-Options: DENY
\`\`\`

4. **定期更新依赖**
\`\`\`bash
npm audit
npm update
\`\`\`

### 混合内容问题

确保所有资源都通过 HTTPS 加载：

\`\`\`html
<!-- ❌ 错误 -->
<img src="http://example.com/image.jpg">

<!-- ✅ 正确 -->
<img src="https://example.com/image.jpg">
\`\`\`

使用相对协议或始终使用 HTTPS。
      `,
    },
    {
      id: 'xml-sitemap',
      title: 'XML Sitemap',
      content: `
## XML Sitemap 的作用

XML Sitemap 帮助搜索引擎发现和索引网站的所有重要页面，特别是对于大型网站或新网站。

### Sitemap 格式

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2024-01-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
\`\`\`

### Next.js 中生成 Sitemap

本项目已实现动态 Sitemap 生成：

- **主 Sitemap**：\`/sitemap.xml\`
- **产品 Sitemap**：\`/sitemap-products.xml\`
- **博客 Sitemap**：\`/sitemap-blogs.xml\`
- **页面 Sitemap**：\`/sitemap-pages.xml\`

### Sitemap 最佳实践

#### 1. 文件大小限制
- 单个文件最多 50,000 个 URL
- 文件大小不超过 50MB（未压缩）
- 超过限制时使用 Sitemap 索引文件

#### 2. 优先级设置
- **1.0**：首页、核心产品页
- **0.8**：分类页、重要文章
- **0.6**：普通产品页、博客文章
- **0.4**：归档页、标签页

#### 3. 更新频率
- **always**：实时变化（很少用）
- **hourly**：新闻网站
- **daily**：博客、新产品
- **weekly**：产品分类
- **monthly**：关于我们、联系页面
- **yearly**：静态页面
- **never**：归档内容

### 提交 Sitemap

#### Google Search Console
1. 访问 https://search.google.com/search-console
2. 选择你的网站
3. 左侧菜单 → 索引 → Sitemap
4. 输入 Sitemap URL：\`sitemap.xml\`
5. 点击"提交"

#### Bing Webmaster Tools
类似步骤，访问 https://www.bing.com/webmasters

### Sitemap 索引文件

当有多个 Sitemap 时：

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-products.xml</loc>
    <lastmod>2024-01-20</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-blogs.xml</loc>
    <lastmod>2024-01-20</lastmod>
  </sitemap>
</sitemapindex>
\`\`\`

### 常见问题

1. **排除页面**：不要在 Sitemap 中包含 noindex 页面
2. ** canonical URL**：只包含 canonical URL
3. **404 错误**：定期清理无效链接
4. **重定向**：更新为重定向后的 URL
      `,
    },
    {
      id: 'robots-txt',
      title: 'Robots.txt 配置',
      content: `
## Robots.txt 的作用

Robots.txt 文件告诉搜索引擎爬虫哪些页面可以抓取，哪些应该忽略。

### 基本语法

\`\`\`
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml
\`\`\`

### 常见指令

#### User-agent
指定适用的爬虫：
- **\\***：所有爬虫
- **Googlebot**：Google 爬虫
- **Bingbot**：Bing 爬虫

#### Allow / Disallow
控制访问权限：

\`\`\`
# 阻止访问管理后台
Disallow: /admin/

# 阻止访问 API 端点
Disallow: /api/

# 阻止特定文件类型
Disallow: /*.pdf$
Disallow: /*.zip$
\`\`\`

#### Crawl-delay
设置爬取间隔（秒）：
\`\`\`
Crawl-delay: 10
\`\`\`

注意：Google 不支持此指令，使用 Search Console 设置。

### Next.js 中的 Robots.txt

本项目已实现动态 robots.ts：

\`\`\`ts
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
\`\`\`

### 最佳实践

#### 1. 不要阻止 CSS/JS
Google 需要这些资源来渲染页面：
\`\`\`
# ❌ 错误
Disallow: /*.css$
Disallow: /*.js$

# ✅ 正确：允许访问
Allow: /*.css$
Allow: /*.js$
\`\`\`

#### 2. 阻止低价值页面
\`\`\`
Disallow: /search?
Disallow: /tag/
Disallow: /archive/
Disallow: /cart/
Disallow: /checkout/
\`\`\`

#### 3. 测试 Robots.txt
使用 Google Search Console 的 Robots.txt 测试工具验证配置。

### 常见错误

1. **语法错误**：每行一个指令
2. **大小写敏感**：\`/Admin/\` 和 \`/admin/\` 不同
3. **通配符限制**：只支持 \\* 和 $
4. **不是访问控制**：Robots.txt 不能阻止直接访问，只能指导爬虫

### 与 Meta Robots 的区别

- **Robots.txt**：阻止爬虫抓取
- **Meta Robots**：阻止索引已抓取的页面

\`\`\`html
<!-- 阻止索引 -->
<meta name="robots" content="noindex, nofollow">
\`\`\`

通常结合使用以达到最佳效果。
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <KnowledgeNav 
        title="技术 SEO"
        description="掌握网站技术优化要点，提升搜索引擎抓取效率和用户体验"
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
