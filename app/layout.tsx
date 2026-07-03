import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Premium Adult Toys Wholesale | SinTone — Medical-Grade Supplier",
    template: "%s | SinTone",
  },
  description: "Premium wholesale sex toys and adult toys supplier. Medical-grade silicone, low MOQ from 20 pcs, OEM/ODM, FDA/CE/RoHS certified. Direct from Dongguan factory with global shipping.",
  keywords: [
    "wholesale sex toys",
    "adult toys wholesale",
    "wholesale adult toys",
    "sex toys wholesale supplier",
    "OEM adult toys",
    "low MOQ adult products",
    "medical-grade silicone toys",
  ],
  authors: [{ name: "SinTone" }],
  creator: "SinTone",
  publisher: "SinTone",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.adult-toy-wholesale.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.adult-toy-wholesale.com",
    siteName: "SinTone",
    title: "SinTone — Medical-Grade Silicone Adult Toys Wholesale",
    description: "Certified medical-grade silicone toys from Dongguan. Low MOQ, FDA/CE/RoHS compliant. OEM/ODM for global retailers.",
    images: [
      {
        url: "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg",
        width: 1200,
        height: 630,
        alt: "SinTone - Medical-Grade Silicone Adult Toys Wholesale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SinTone — Medical-Grade Adult Toys Wholesale",
    description: "Medical-grade silicone adult toys from Dongguan. Low MOQ for global retailers.",
    images: ["https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "QgvCqKj0JhVLnVZVQCPe8k3IhDp4Xq2nF0OjERPG9Ls",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SinTone",
              url: "https://www.adult-toy-wholesale.com",
              logo: "https://www.adult-toy-wholesale.com/favicon.ico",
              description: "Medical-grade silicone adult toys wholesale supplier from Dongguan, China. Low MOQ, OEM/ODM, FDA/CE/RoHS certified.",
              email: "colinliyuan@gmail.com",
              telephone: "+86-138-2442-3871",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dongguan",
                addressRegion: "Guangdong",
                addressCountry: "CN",
              },
              sameAs: [
                "https://linkedin.com/company/sintone-wholesale",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "sales",
                email: "colinliyuan@gmail.com",
                telephone: "+86-138-2442-3871",
                availableLanguage: ["English", "Chinese"],
              },
            }),
          }}
        />
        {/* WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SinTone",
              url: "https://www.adult-toy-wholesale.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.adult-toy-wholesale.com/products?search={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
