import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart - Wholesale Inquiry | LuxeAdult',
  description: 'Review your wholesale items and submit inquiry. Our team will contact you with shipping quotes.',
  robots: {
    index: false, // 购物车页面不应被索引
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
