import { NextResponse } from 'next/server'
import type { BlogPost } from '@/types'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356'
    const imageBaseUrl = 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev'

    let blogs: BlogPost[] = []
    try {
        // 站点由部署配置决定（NEXT_PUBLIC_SITE_ID），不再硬编码
        const siteId = process.env.NEXT_PUBLIC_SITE_ID || ''
        const blogUrl = `${apiBaseUrl}/api/v1/blog/posts?page=0&size=1000`
        const res = await fetch(blogUrl, {
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
                // Only include published posts in sitemap
                blogs = pageData.content.filter((b: BlogPost) => b.isPublished)
            } else {
                console.error('Blogs API returned unexpected format:', pageData)
            }
        } else {
            console.error('Blogs API request failed:', res.status, res.statusText)
        }
    } catch (error) {
        console.error('Failed to fetch blogs for sitemap:', error)
    }

    // Priority based on content type
    const highPriorityCategories = ['Product Guide', 'How-To Guide', 'Educational']
    const getPriority = (blog: BlogPost): string => {
        if (highPriorityCategories.includes(blog.category || '')) return '0.8'
        if (blog.category === 'Comparison') return '0.7'
        return '0.6'
    }
    const getChangefreq = (blog: BlogPost): string => {
        if (blog.category === 'Product Guide') return 'monthly'
        if (blog.category === 'Industry Insights') return 'monthly'
        return 'weekly'
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${blogs.map(blog => {
    const lastmod = blog.updatedAt || blog.publishedAt
      ? new Date((blog.updatedAt || blog.publishedAt)!).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    const priority = getPriority(blog)
    const changefreq = getChangefreq(blog)

    // Cover image for Google Image Sitemap
    const imageXml = blog.coverImage ? `
    <image:image>
      <image:loc>${blog.coverImage.startsWith('http') ? blog.coverImage : `${imageBaseUrl}/${blog.coverImage}`}</image:loc>
      <image:title><![CDATA[${blog.title}]]></image:title>
    </image:image>` : ''

    return `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageXml}
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
