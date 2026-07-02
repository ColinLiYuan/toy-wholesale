import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Inquiries - Order History | SinTone Wholesale',
  description: 'View your inquiry history and order status. Track your wholesale orders and quotes.',
  robots: {
    index: false, // 订单页面不应被索引（隐私保护）
    follow: false,
  },
};

export default function MyOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
