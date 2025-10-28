
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Wallet from './Wallet';

const Navigation = () => {
    return (
        <header className="w-full bg-gray-900/70 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
            <nav className="container mx-auto flex items-center justify-between p-4 text-white">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="Assets/logo.png" alt="Trip.on Logo" width={32} height={32} />
                        <span className="text-xl font-bold">TRIP.on</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                    <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                    <Link href="/register-hotel" className="text-gray-300 hover:text-white transition-colors">List Your Hotel</Link>
                </div>

                <div className="flex items-center">
                    <Wallet />
                </div>
            </nav>
        </header>
    );
};

export default Navigation;
