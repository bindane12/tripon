'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="TripOn" className="h-10 w-10" />
            <span className="font-bold text-lg">TripOn</span>
          </Link>
          <p className="text-muted-foreground mt-3 text-sm max-w-sm">Decentralized hotel loyalty that gives you ownership of your rewards.</p>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link href="/register-hotel" className="text-muted-foreground hover:text-foreground">List Hotel</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">Privacy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
