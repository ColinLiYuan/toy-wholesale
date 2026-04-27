import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | LuxeAdult Wholesale',
  description: 'Get in touch with our team. We are here to help with your wholesale inquiries and business needs.',
};

export default function ContentContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
