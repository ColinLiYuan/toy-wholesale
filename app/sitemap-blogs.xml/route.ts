import { NextResponse } from 'next/server'
import type { BlogPost } from '@/types'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356'
    const locales = ['en', 'zh', 'es', 'ru']

    let blogs: BlogPost[] = []
    try {
        // 获取所有已发布的博客
        const blogUrl = `${apiBaseUrl}/api/v1/blog/posts?page=0&size=1000`
        const res = await fetch(blogUrl, {
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
                blogs = pageData.content
                console.log(`✅ 动态获取 ${blogs.length} 篇博客`)
            }
        }
    } catch (error) {
        console.error('❌ 获取博客失败:', error)
    }

    // 生成 XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${blogs.map((blog: BlogPost) => `
  <url>
    <loc>${baseUrl}/en/blog/${blog.slug}</loc>
    <lastmod>${new Date(blog.updatedAt || blog.publishedAt || new Date().toISOString()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    ${locales.map(locale => `
    <xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}/blog/${blog.slug}"/>`).join('')}
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
