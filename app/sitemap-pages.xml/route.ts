import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'

    const staticPages = [
        { loc: '', priority: 1.0, changefreq: 'daily' }, // 首页
        { loc: '/blog', priority: 0.9, changefreq: 'daily' }, // 博客首页
        { loc: '/contact', priority: 0.5, changefreq: 'monthly' },
        { loc: '/content/solutions', priority: 0.8, changefreq: 'monthly' },
        { loc: '/content/sample-kit', priority: 0.7, changefreq: 'monthly' },
        { loc: '/content/verify', priority: 0.7, changefreq: 'monthly' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
</urlset>`

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}
