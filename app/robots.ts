import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com';

  const disallow = ['/api/', '/_next/', '/admin/', '/login/', '/register/', '/debug/', '/inquiry-cart/'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
