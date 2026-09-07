import { NextResponse } from 'next/server'
import type { Product } from '@/types'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    let products: Product[] = []
    try {
        // 站点由部署配置决定（NEXT_PUBLIC_SITE_ID），不再硬编码
        const siteId = process.env.NEXT_PUBLIC_SITE_ID || ''
        const productUrl = `${apiBaseUrl}/api/v1/products?page=0&size=100`
        const res = await fetch(productUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(siteId ? { 'X-Site-Id': siteId } : {}),
            },
            cache: 'no-store'
        })

        if (res.ok) {
            const responseData = await res.json()
            const pageData = responseData.code === 200 ? responseData.data : responseData

            if (pageData?.content && Array.isArray(pageData.content)) {
                products = pageData.content
            } else {
                console.error('❌ Products API 返回格式错误:', pageData)
            }
        } else {
            console.error('❌ Products API 请求失败:', res.status, res.statusText)
        }
    } catch (error) {
        console.error('❌ 获取商品失败:', error)
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products.map(product => {
    const lastmod = product.updatedAt
      ? new Date(product.updatedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    return `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  }).join('')}
</urlset>`

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}
