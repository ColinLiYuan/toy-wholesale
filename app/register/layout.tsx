import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Distributor - Register | SinTone Wholesale',
  description: 'Join our wholesale network and access premium products. Register as a distributor for exclusive B2B benefits.',
  robots: {
    index: false, // 注册页面不应被索引
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
