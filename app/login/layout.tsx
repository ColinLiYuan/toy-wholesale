import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Distributor Login | SinTone Wholesale',
  description: 'Access your wholesale account to view pricing and place orders. Login for exclusive B2B benefits.',
  robots: {
    index: false, // 登录页面不应被索引
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
