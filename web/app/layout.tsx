import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const WalletProvider = dynamic(
  () => import("../components/ClientWalletProvider"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <WalletProvider>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
