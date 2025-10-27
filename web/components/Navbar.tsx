'use client';

import Link from 'next/link';
import Wallet from "./Wallet";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Hotel Loyalty</h1>
      <div className="flex items-center">
        <Link href="/" className="mr-4">Home</Link>
        <Link href="/register-hotel" className="mr-4">Register Hotel</Link>
        <Link href="/dashboard" className="mr-4">Dashboard</Link>
        <Wallet />
      </div>
    </nav>
  );
};

export default Navbar;