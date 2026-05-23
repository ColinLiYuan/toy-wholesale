import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wholesale Adult Toys - Premium Products at Bulk Prices | Silvibe',
  description: 'Browse our curated collection of premium adult wellness products. Low MOQ, competitive pricing, fast shipping for retailers and distributors.',
  keywords: ['wholesale adult toys', 'bulk sex toys', 'adult products distributor', 'low MOQ', 'wholesale prices'],
  openGraph: {
    title: 'Wholesale Adult Toys - Premium Products at Bulk Prices | Silvibe',
    description: 'Browse our curated collection of premium adult wellness products for wholesale distribution',
    type: 'website',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
