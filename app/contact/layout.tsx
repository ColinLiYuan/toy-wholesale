import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Wholesale Partnership | Silvibe',
  description: 'Ready to stock your shelves? Reach out to our sales team for catalogs, bulk pricing, and shipping quotes. Low MOQ starting from 20 pcs.',
  keywords: ['wholesale contact', 'adult toys distributor', 'bulk pricing', 'partnership inquiry'],
  openGraph: {
    title: 'Contact Us - Wholesale Partnership | Silvibe',
    description: 'Reach out to our sales team for catalogs, bulk pricing, and shipping quotes',
    type: 'website',
    images: [
      {
        url: 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvibe - Contact Us',
      },
    ],
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
