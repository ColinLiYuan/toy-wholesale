import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import messages from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "LuxeAdult Wholesale - Premium Adult Toys & Wellness",
    template: "%s | LuxeAdult Wholesale",
  },
  description: "Global leading supplier of premium adult wellness products. Wholesale silicone vibrators, male pleasure tech, BDSM gear, and lingerie with OEM/ODM services.",
  keywords: [
    "adult toys wholesale",
    "silicone vibrators",
    "male pleasure devices",
    "BDSM bondage",
    "adult lingerie",
    "wellness products",
    "OEM adult toys",
    "private label",
    "bulk adult products",
    "discreet shipping",
  ],
  authors: [{ name: "LuxeAdult Wholesale" }],
  creator: "LuxeAdult Wholesale",
  publisher: "LuxeAdult Wholesale",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://luxeadult.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luxeadult.com",
    siteName: "LuxeAdult Wholesale",
    title: "LuxeAdult Wholesale - Premium Adult Toys & Wellness",
    description: "Premium adult wellness products for global wholesale distribution",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LuxeAdult Wholesale - Premium Adult Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxeAdult Wholesale",
    description: "High-quality adult wellness products for wholesale markets",
    images: ["/twitter-image.jpg"],
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
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-white font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
