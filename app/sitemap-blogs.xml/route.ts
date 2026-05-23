import { NextResponse } from 'next/server'
import type { BlogPost } from '@/types'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356'

    let blogs: BlogPost[] = []
    try {
        const blogUrl = `${apiBaseUrl}/api/v1/blog/posts?page=0&size=1000`
        console.log('Fetching blogs from:', blogUrl)
        const res = await fetch(blogUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Site-Id': 'toy',
            },
            cache: 'no-store'
        })

        if (res.ok) {
            const responseData = await res.json()
            console.log('Blogs API response:', JSON.stringify(responseData).substring(0, 200))
            const pageData = responseData.code === 200 ? responseData.data : responseData

            if (pageData?.content && Array.isArray(pageData.content)) {
                blogs = pageData.content
                console.log(`✅ 动态获取 ${blogs.length} 篇博客`)
            } else {
                console.error('❌ Blogs API 返回格式错误:', pageData)
            }
        } else {
            console.error('❌ Blogs API 请求失败:', res.status, res.statusText)
        }
    } catch (error) {
        console.error('❌ 获取博客失败:', error)
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${blogs.map(blog => {
    const lastmod = blog.updatedAt || blog.publishedAt
      ? new Date((blog.updatedAt || blog.publishedAt)!).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    return `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
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
