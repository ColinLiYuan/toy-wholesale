import { blogService } from '@/services';
import { BlogPost } from '@/types';
import Link from 'next/link';
import { formatImageUrl } from '@/lib/api-config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

function ArticleJsonLd({ blog }: { blog: BlogPost }) {
  const imageUrl = blog.coverImage
    ? (blog.coverImage.startsWith('http') ? blog.coverImage : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${blog.coverImage}`)
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.seoDescription || blog.excerpt,
    ...(imageUrl ? { image: imageUrl } : {}),
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    author: {
      '@type': 'Person',
      name: blog.authorName || 'SinTone Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SinTone',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${blog.slug}`,
    },
    ...(blog.tags ? { keywords: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Auto-detect FAQ sections in Markdown content and generate FAQPage Schema
function FaqPageJsonLd({ content }: { content: string; slug: string }) {
  if (!content) return null;

  // Match FAQ blocks: **Q: question?** followed by A: answer
  const faqRegex = /\*\*Q:\s+(.+?)\*\*\s*\n\s*A:\s*(.+?)(?=\n\n|\n\*\*Q:|\n---|\n##|$)/gs;
  const qaPairs: { question: string; answer: string }[] = [];
  let match;
  while ((match = faqRegex.exec(content)) !== null) {
    qaPairs.push({
      question: match[1].trim(),
      answer: match[2].trim().replace(/\n/g, ' '),
    });
  }

  // Also try alternate format with multi-line answers
  if (qaPairs.length === 0) {
    const altRegex = /\*\*Q:\s+(.+?)\*\*\s*\n\s*(A:\s*)?([\s\S]+?)(?=\n\*\*Q:|\n##\s|\n---\s|$)/g;
    while ((match = altRegex.exec(content)) !== null) {
      const answer = (match[3] || '').trim().replace(/\n/g, ' ').substring(0, 300);
      if (answer) {
        qaPairs.push({ question: match[1].trim(), answer });
      }
    }
  }

  if (qaPairs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qaPairs.map(qa => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BlogBreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Generate static params (optional, for SSG)
export async function generateStaticParams() {
  return [];
}

// Generate metadata
export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  try {
    const blog = await blogService.getBlogBySlug(slug);

    // Handle tags: support both string and array
    let keywords: string[] = [];
    if (blog.tags) {
      const tags = blog.tags as any;
      if (typeof tags === 'string') {
        keywords = tags.split(',').map((t: string) => t.trim());
      } else if (Array.isArray(tags)) {
        keywords = tags;
      }
    }

    return {
      title: `${blog.seoTitle || blog.title} | SinTone Wholesale`,
      description: blog.seoDescription || blog.excerpt,
      keywords,
      openGraph: {
        title: blog.seoTitle || blog.title,
        description: blog.seoDescription || blog.excerpt,
        images: blog.coverImage ? [{ url: blog.coverImage.startsWith('http') ? blog.coverImage : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${blog.coverImage}`, alt: blog.title }] : [],
        type: 'article',
        publishedTime: blog.publishedAt,
        authors: blog.authorName ? [blog.authorName] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.seoTitle || blog.title,
        description: blog.seoDescription || blog.excerpt,
        images: blog.coverImage ? [blog.coverImage.startsWith('http') ? blog.coverImage : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${blog.coverImage}`] : [],
      },
      alternates: {
        canonical: `/blog/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Blog Not Found | SinTone Wholesale',
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  let blog: BlogPost | null = null;
  let error: string | null = null;

  try {
    blog = await blogService.getBlogBySlug(slug);
  } catch (err: any) {
    error = err.message || 'Failed to load blog post';
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#0a0a0a] text-[#E5E5E5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-[#9CA3AF] mb-8">{error || 'The requested blog post could not be found.'}</p>
          <Link
            href="/blog"
            className="px-6 py-3 bg-[#00D4FF] text-[#0a0a0a] rounded-lg font-semibold hover:bg-[#00b8e6] transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ArticleJsonLd blog={blog} />
      <FaqPageJsonLd content={blog.content} slug={slug} />
      <BlogBreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: blog.title, url: `/blog/${slug}` },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#0a0a0a] text-[#E5E5E5]">
      {/* Hero */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-[#00D4FF] hover:text-[#00b8e6] mb-8 transition-colors"
          >
            ← Back to Blog
          </Link>

          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[#00D4FF]/10 text-[#00D4FF] text-sm font-medium rounded-full">
              {blog.category}
            </span>
            {blog.publishedAt && (
              <span className="text-[#6B7280] text-sm">
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-[#9CA3AF] leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Author */}
          {blog.authorName && (
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00D4FF] rounded-full flex items-center justify-center text-[#0a0a0a] font-bold">
                {blog.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{blog.authorName}</p>
                <p className="text-sm text-[#6B7280]">Author</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {blog.coverImage && (
        <section className="px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <img
              src={formatImageUrl(blog.coverImage)}
              alt={blog.title}
              className="w-full rounded-xl"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-6 pb-20">
        <article className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-xl p-8 md:p-12 border border-[#2a2a2a]">
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mb-6 mt-8 text-[#E5E5E5]" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mb-4 mt-8 text-[#E5E5E5] border-b border-[#2a2a2a] pb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold mb-3 mt-6 text-[#E5E5E5]" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed text-[#9CA3AF]" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-[#00D4FF] hover:text-[#00b8e6] underline" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-[#9CA3AF]" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-[#9CA3AF]" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-[#00D4FF] pl-4 italic my-4 text-[#9CA3AF]" {...props} />
                ),
                code: ({ node, inline, ...props }: any) => (
                  inline ? (
                    <code className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-sm text-[#00D4FF]" {...props} />
                  ) : (
                    <code className="block bg-[#0a0a0a] p-4 rounded-lg overflow-x-auto text-sm" {...props} />
                  )
                ),
                img: ({ node, ...props }) => {
                  let src = props.src || '';
                  if (src && typeof src === 'string' && !src.startsWith('http')) {
                    src = formatImageUrl(src);
                  }
                  return (
                    <img
                      {...props}
                      src={src}
                      className="rounded-lg my-6 w-full"
                      loading="lazy"
                    />
                  );
                },
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full divide-y divide-[#2a2a2a]" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="px-4 py-2 bg-[#2a2a2a] text-left text-sm font-semibold text-[#E5E5E5]" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-4 py-2 border-t border-[#2a2a2a] text-sm text-[#9CA3AF]" {...props} />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </article>
      </section>

      {/* Tags */}
      {blog.tags && (() => {
        let tagsArray: string[] = [];
        if (typeof blog.tags === 'string') {
          try {
            tagsArray = JSON.parse(blog.tags);
          } catch {
            tagsArray = (blog.tags as string).split(',').filter((t: string) => t.trim());
          }
        } else if (Array.isArray(blog.tags)) {
          tagsArray = blog.tags;
        }

        return tagsArray.length > 0 ? (
          <section className="px-6 pb-20">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {tagsArray.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#9CA3AF] rounded-lg hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ) : null;
      })()}
    </div>
    </>
  );
}
