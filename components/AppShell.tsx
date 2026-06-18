'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </>
      )}
      {isAdminRoute && children}
    </>
  );
}
