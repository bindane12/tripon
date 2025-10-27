'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="TripOn Logo" width={40} height={40} />
          <span className="text-2xl font-bold text-gray-800">TripOn</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/register-hotel" className="text-gray-600 hover:text-primary transition-colors">
            List Your Hotel
          </Link>
        </nav>
        <div>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
