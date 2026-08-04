import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthButton from "@/components/AuthButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "SweetShop | Premium Apparel & Sneakers",
  description: "Explore the latest collection of premium streetwear, sneakers, and accessories at SweetShop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-neutral-900 selection:bg-black selection:text-white">
        <Navbar authButton={<AuthButton />} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

