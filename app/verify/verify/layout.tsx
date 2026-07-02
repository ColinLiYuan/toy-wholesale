import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Product Authenticity | SinTone Wholesale',
  description: 'Verify the authenticity of your products using our security code system. Ensure you have genuine products.',
};

export default function ContentVerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
