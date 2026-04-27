import { Metadata } from 'next';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Industry Insights & Business Tips | LuxeAdult Wholesale',
  description: 'Expert advice for adult toy retailers, distributors, and e-commerce entrepreneurs. Learn how to grow your business with our industry insights.',
  keywords: ['adult toys wholesale', 'business tips', 'retail advice', 'e-commerce strategies', 'wholesale distribution'],
  openGraph: {
    title: 'Industry Insights & Business Tips | LuxeAdult Wholesale',
    description: 'Expert advice for adult toy retailers, distributors, and e-commerce entrepreneurs',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogListClient />;
}
