import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Premium Adult Toys Wholesale | Silvibe — Medical-Grade Supplier",
    template: "%s | Silvibe",
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
  authors: [{ name: "Silvibe" }],
  creator: "Silvibe",
  publisher: "Silvibe",
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
    siteName: "Silvibe",
    title: "Silvibe — Medical-Grade Silicone Adult Toys Wholesale",
    description: "Certified medical-grade silicone toys from Dongguan. Low MOQ, FDA/CE/RoHS compliant. OEM/ODM for global retailers.",
    images: [
      {
        url: "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg",
        width: 1200,
        height: 630,
        alt: "Silvibe - Medical-Grade Silicone Adult Toys Wholesale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silvibe — Medical-Grade Adult Toys Wholesale",
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
              name: "Silvibe",
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
                "https://linkedin.com/company/luxeadult-wholesale",
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
              name: "Silvibe",
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
