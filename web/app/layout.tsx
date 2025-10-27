import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const WalletProvider = dynamic(
  () => import("../components/ClientWalletProvider"),
  { ssr: false }
);

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'] 
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
      <body className={poppins.className}>
        <WalletProvider>
          <Header />
          <main>{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}