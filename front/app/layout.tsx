import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthButton from "@/components/AuthButton";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sweet-shop-one-flame.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SweetShop | Premium Apparel & Sneakers",
    template: "%s | SweetShop",
  },
  description: "Explore the latest collection of premium streetwear, sneakers, and accessories at SweetShop.",
  keywords: ["streetwear", "sneakers", "apparel", "hoodies", "jackets", "SweetShop", "online shop"],
  openGraph: {
    type: "website",
    siteName: "SweetShop",
    title: "SweetShop | Premium Apparel & Sneakers",
    description: "Explore the latest collection of premium streetwear, sneakers, and accessories at SweetShop.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "SweetShop | Premium Apparel & Sneakers",
    description: "Explore the latest collection of premium streetwear, sneakers, and accessories at SweetShop.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SweetShop",
  url: SITE_URL,
  description: "Premium streetwear, sneakers, and accessories.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-neutral-900 selection:bg-black selection:text-white">
        <Navbar authButton={<AuthButton />} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

