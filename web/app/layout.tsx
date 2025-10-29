import type { Metadata } from "next";
import { Poppins, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WalletContextProvider from "../components/WalletContextProvider";
import { ReactNode } from "react";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const bebas_neue = Bebas_Neue({
  subsets: ["latin"],
  weight: ['400'],
  variable: '--font-bebas-neue',
});

export const metadata: Metadata = {
  title: "Hotel Loyalty Platform",
  description: "A decentralized hotel loyalty platform on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${bebas_neue.variable} font-sans bg-background text-foreground`}>
        <WalletContextProvider>
          {/* Skip link for keyboard users */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus:shadow">Skip to content</a>
          <Header />
          <main id="main-content" className="max-w-6xl mx-auto px-6 py-12">{children}</main>
          <Footer />
        </WalletContextProvider>
      </body>
    </html>
  );
}