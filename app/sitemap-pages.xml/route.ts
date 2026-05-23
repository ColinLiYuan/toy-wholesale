import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'
    const today = new Date().toISOString().split('T')[0]

    const pages: { loc: string; lastmod: string }[] = [
        { loc: '', lastmod: today },
        { loc: '/products', lastmod: today },
        { loc: '/showroom', lastmod: today },
        { loc: '/oem-odm', lastmod: today },
        { loc: '/solutions', lastmod: today },
        { loc: '/sample-kit', lastmod: today },
        { loc: '/about', lastmod: today },
        { loc: '/blog', lastmod: today },
        { loc: '/contact', lastmod: today },
        { loc: '/catalog', lastmod: today },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
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
