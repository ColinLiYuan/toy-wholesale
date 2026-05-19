import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Wholesale Adult Toys | Sex Toys Wholesale Supplier",
    template: "%s | Silvibe",
  },
  description: "Premium wholesale sex toys and adult toys wholesale supplier. Luxury adult toys at wholesale prices from China. Low MOQ, FDA/CE/RoHS certified.",
  keywords: [
    "wholesale sex toys",
    "adult toys wholesale",
    "wholesale adult toys",
    "luxury sex toys wholesale",
    "sex toys wholesale supplier",
    "adult wellness wholesale",
    "OEM adult toys",
    "low MOQ adult products",
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.adult-toy-wholesale.com",
    siteName: "Silvibe",
    title: "Silvibe - Medical-Grade Silicone Adult Toys",
    description: "Certified medical-grade silicone toys from Dongguan. Low MOQ, FDA/CE/RoHS compliant.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Silvibe - Medical-Grade Silicone Adult Toys Wholesale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silvibe",
    description: "Medical-grade silicone adult toys. Low MOQ for global retailers.",
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
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
