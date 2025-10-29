'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/register-hotel', label: 'List Your Hotel' },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="TripOn Logo" width={40} height={40} />
          <span className="text-2xl font-bold text-foreground">TripOn</span>
        </Link>
        <nav className="flex-1 flex items-center justify-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-300 text-sm ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-end">
          <WalletMultiButton className="wallet-adapter-button" />
        </div>
      </div>
    </header>
  );
};

export default Header;
