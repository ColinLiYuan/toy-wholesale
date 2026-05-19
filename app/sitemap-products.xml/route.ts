import { NextResponse } from 'next/server'
import type { Product } from '@/types'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356'

    let products: Product[] = []
    try {
        // 在 Server Component 中，需要直接调用后端 API，不能使用代理
        // 注意：后端路径需要 /api 前缀
        const productUrl = `${apiBaseUrl}/api/v1/products?page=0&size=100`
        console.log('Fetching products from:', productUrl)
        const res = await fetch(productUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Site-Id': 'toy',
            },
            cache: 'no-store'
        })

        if (res.ok) {
            const responseData = await res.json()
            console.log('Products API response:', JSON.stringify(responseData).substring(0, 200))
            const pageData = responseData.code === 200 ? responseData.data : responseData

            if (pageData?.content && Array.isArray(pageData.content)) {
                products = pageData.content
                console.log(`✅ 动态获取 ${products.length} 个商品`)
            } else {
                console.error('❌ Products API 返回格式错误:', pageData)
            }
        } else {
            console.error('❌ Products API 请求失败:', res.status, res.statusText)
        }
    } catch (error) {
        console.error('❌ 获取商品失败:', error)
    }

    // 生成 XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products.map(product => `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
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
