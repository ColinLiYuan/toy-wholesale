import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import messages from "@/lib/i18n";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Silvibe - Medical-Grade Silicone Adult Toys Wholesale",
    template: "%s | Silvibe",
  },
  description: "Certified medical-grade silicone adult toys from Dongguan factory. Low MOQ for global retailers. FDA, CE, RoHS compliant with OEM/ODM services.",
  keywords: [
    "medical-grade silicone toys",
    "adult toys wholesale",
    "dongguan supplier",
    "low MOQ adult products",
    "OEM adult toys",
    "FDA certified sex toys",
    "silicone vibrator wholesale",
    "dropshipping adult toys",
  ],
  authors: [{ name: "Silvibe" }],
  creator: "Silvibe",
  publisher: "Silvibe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://silvibe.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://silvibe.com",
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
