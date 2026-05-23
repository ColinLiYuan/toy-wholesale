import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Wholesale Partnership | LuxeAdult',
  description: 'Ready to stock your shelves? Reach out to our sales team for catalogs, bulk pricing, and shipping quotes. Low MOQ starting from 20 pcs.',
  keywords: ['wholesale contact', 'adult toys distributor', 'bulk pricing', 'partnership inquiry'],
  openGraph: {
    title: 'Contact Us - Wholesale Partnership | LuxeAdult',
    description: 'Reach out to our sales team for catalogs, bulk pricing, and shipping quotes',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
