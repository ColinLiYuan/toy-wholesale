import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'

    const staticPages = [
        { loc: '', priority: 1.0, changefreq: 'daily' },
        { loc: '/products', priority: 0.9, changefreq: 'daily' },
        { loc: '/showroom', priority: 0.8, changefreq: 'weekly' },
        { loc: '/oem-odm', priority: 0.8, changefreq: 'weekly' },
        { loc: '/solutions', priority: 0.8, changefreq: 'monthly' },
        { loc: '/sample-kit', priority: 0.7, changefreq: 'monthly' },
        { loc: '/about', priority: 0.7, changefreq: 'monthly' },
        { loc: '/blog', priority: 0.9, changefreq: 'daily' },
        { loc: '/contact', priority: 0.6, changefreq: 'monthly' },
        { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
        { loc: '/terms', priority: 0.3, changefreq: 'yearly' },
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
