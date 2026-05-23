import { blogService } from '@/services';
import { BlogPost } from '@/types';
import { formatImageUrl } from '@/lib/api-config';
import Link from 'next/link';
import { Metadata } from 'next';
import BlogPagination from './BlogPagination';

export const metadata: Metadata = {
  title: 'Industry Insights & Business Tips',
  description: 'Expert advice for adult toy retailers, distributors, and e-commerce entrepreneurs. Learn how to grow your business with our industry insights.',
  keywords: ['adult toys wholesale', 'business tips', 'retail advice', 'e-commerce strategies', 'wholesale distribution'],
  openGraph: {
    title: 'Industry Insights & Business Tips | Silvibe',
    description: 'Expert advice for adult toy retailers, distributors, and e-commerce entrepreneurs',
    type: 'website',
    images: [
      {
        url: 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvibe - Industry Insights & Business Tips',
      },
    ],
  },
  alternates: {
    canonical: '/blog',
  },
};

const pageSize = 12;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '0');

  let blogs: BlogPost[] = [];
  let totalPages = 1;

  try {
    const data = await blogService.getPublishedBlogs(currentPage, pageSize);
    blogs = data.content || [];
    totalPages = data.totalPages || 1;
  } catch (error) {
    console.error('Failed to load blogs:', error);
  }

  const parseTags = (tags: string | string[] | undefined): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      return JSON.parse(tags);
    } catch {
      return tags.split(',').filter(t => t.trim());
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Industry Insights & Business Tips',
            description: 'Expert advice for adult toy retailers, distributors, and e-commerce entrepreneurs.',
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'}/blog`,
            hasPart: blogs.map(blog => ({
              '@type': 'BlogPosting',
              headline: blog.title,
              url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'}/blog/${blog.slug}`,
              description: blog.excerpt,
              ...(blog.publishedAt ? { datePublished: blog.publishedAt } : {}),
            })),
          }),
        }}
      />
      <section className="relative py-20 px-6 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1A1A1A]">
            Industry Insights & Business Tips
          </h1>
          <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
            Expert advice for adult toy retailers, distributors, and e-commerce entrepreneurs. Learn how to grow your business.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#6C757D] text-xl">No blog posts available yet</p>
              <p className="text-gray-400 mt-2">Check back soon for industry insights and business tips</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    {blog.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={formatImageUrl(blog.coverImage)}
                          alt={blog.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-[#0056B3]/10 text-[#0056B3] text-xs font-medium rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-sm text-[#6C757D]">
                          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-[#1A1A1A] group-hover:text-[#0056B3] transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-[#6C757D] text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
                      {blog.tags && (() => {
                        const tagsArray = parseTags(blog.tags);
                        return tagsArray.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {tagsArray.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-[#F8F9FA] text-[#6C757D] text-xs rounded border border-gray-200">#{tag}</span>
                            ))}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && <BlogPagination currentPage={currentPage} totalPages={totalPages} />}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
