import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const locales = ['en', 'zh', 'es', 'ru']

    const pages = [
        { url: '/', changefreq: 'daily', priority: '1.0' },
        { url: '/products', changefreq: 'daily', priority: '0.9' },
        { url: '/contact', changefreq: 'monthly', priority: '0.8' },
        { url: '/solutions', changefreq: 'monthly', priority: '0.8' },
        { url: '/sample-kit', changefreq: 'monthly', priority: '0.7' },
        { url: '/verify', changefreq: 'monthly', priority: '0.7' },
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${locales.map(locale => `
    <xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}${page.url}"/>`).join('')}
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
