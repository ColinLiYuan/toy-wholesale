'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import messages from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && (
        <>
          <Header translations={messages} />
          <main className="flex-1">{children}</main>
          <Footer translations={messages} />
        </>
      )}
      {isAdminRoute && (
        <main className="min-h-screen">{children}</main>
      )}
    </>
  );
}
