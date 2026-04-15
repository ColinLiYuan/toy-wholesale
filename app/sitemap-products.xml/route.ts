import { NextResponse } from 'next/server'
import type { Product } from '@/types'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356'
    const locales = ['en', 'zh', 'es', 'ru']

    let products: Product[] = []
    try {
        // 在 Server Component 中，需要直接调用后端 API，不能使用代理
        const productUrl = `${apiBaseUrl}/api/v1/products?page=0&size=100`
        const res = await fetch(productUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        if (res.ok) {
            const responseData = await res.json()
            const pageData = responseData.code === 200 ? responseData.data : responseData

            if (pageData?.content && Array.isArray(pageData.content)) {
                products = pageData.content
                console.log(`✅ 动态获取 ${products.length} 个商品`)
            }
        }
    } catch (error) {
        console.error('❌ 获取商品失败:', error)
    }

    // 生成 XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${products.map((product: Product) => `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${new Date(product.updatedAt || product.createdAt || new Date().toISOString()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${locales.map(locale => `
    <xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}/products/${product.slug}"/>`).join('')}
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
