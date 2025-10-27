'use client';

import { mockHotels, Hotel } from '../../lib/mockHotels';
import Image from 'next/image';
import { FC, ReactNode } from 'react';
import { BarChart2, ChevronRight, DollarSign, Star, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Reusable Components ---

const DashboardSection: FC<{ title: string; children: ReactNode; className?: string, noPadding?: boolean }> = ({ title, children, className = '', noPadding = false }) => (
  <div className={`bg-gray-800/50 border border-white/10 rounded-2xl ${className}`}>
    <h2 className="text-xl font-bold text-white mb-4 px-6 pt-6">{title}</h2>
    <div className={noPadding ? '' : 'px-6 pb-6'}>
      {children}
    </div>
  </div>
);

const StatCard: FC<{ title: string; value: string; icon: ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-gray-900/70 p-5 rounded-xl flex items-center gap-4 border border-white/10">
    <div className="text-emerald-400 bg-emerald-900/50 p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  </div>
);

const HotelRow: FC<{ hotel: Hotel }> = ({ hotel }) => (
  <div className="flex items-center justify-between p-4 border-b border-white/10 last:border-b-0 hover:bg-gray-700/50 transition-colors">
    <div className="flex items-center gap-4">
      <Image src={hotel.image} alt={hotel.name} width={40} height={40} className="rounded-full object-cover" />
      <div>
        <p className="font-semibold text-white">{hotel.name}</p>
        <p className="text-sm text-gray-400">{hotel.location}</p>
      </div>
    </div>
    <div className="text-right hidden sm:block">
        <p className="font-semibold text-white">{(Math.random() * 1000).toFixed(2)} <span className="text-gray-400 text-sm">{hotel.tokenSymbol}</span></p>
        <p className="text-xs text-gray-500">Balance</p>
    </div>
    <div className="text-right hidden md:block">
        <p className="font-semibold text-emerald-400">+{Math.random().toFixed(2)}%</p>
        <p className="text-xs text-gray-500">24h Change</p>
    </div>
    <ChevronRight className="text-gray-600" />
  </div>
);

const RewardsChartPlaceholder: FC = () => (
    <div className="w-full h-48 bg-gray-900/80 rounded-lg p-4 flex flex-col justify-end">
        <div className="flex items-end h-full gap-2">
            <motion.div initial={{height: '20%'}} whileInView={{height: '40%'}} className="w-full bg-emerald-500/30 rounded-t-sm"></motion.div>
            <motion.div initial={{height: '30%'}} whileInView={{height: '60%'}} className="w-full bg-emerald-500/50 rounded-t-sm"></motion.div>
            <motion.div initial={{height: '50%'}} whileInView={{height: '30%'}} className="w-full bg-emerald-500/40 rounded-t-sm"></motion.div>
            <motion.div initial={{height: '40%'}} whileInView={{height: '75%'}} className="w-full bg-emerald-500/80 rounded-t-sm"></motion.div>
            <motion.div initial={{height: '60%'}} whileInView={{height: '50%'}} className="w-full bg-emerald-500/60 rounded-t-sm"></motion.div>
        </div>
    </div>
)


// --- Dashboard Page ---

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
       <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at top right, #10b981, transparent 40%), radial-gradient(circle at bottom left, #0d9488, transparent 40%)',
        }}
      ></div>
      <div className="relative z-10 container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Your personal hub for on-chain loyalty.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Portfolio Value" value="$1,284.50" icon={<DollarSign />} />
          <StatCard title="Loyalty Tokens" value="4" icon={<Wallet />} />
          <StatCard title="Total Rewards" value="1,850 pts" icon={<Star />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* My Loyalty Tokens Section */}
          <DashboardSection title="My Loyalty Portfolio" className="lg:col-span-2" noPadding>
            <div className="flex justify-between text-xs text-gray-400 px-4 py-2 border-b border-white/10">
                <p>Asset</p>
                <div className="flex gap-12">
                    <p className="hidden sm:block">Balance</p>
                    <p className="hidden md:block">24h Change</p>
                    <p className="w-6"></p>
                </div>
            </div>
            <div className="space-y-0">
              {mockHotels.slice(0, 4).map(hotel => (
                <HotelRow key={hotel.name} hotel={hotel} />
              ))}
            </div>
          </DashboardSection>

          <div className="flex flex-col gap-8">
            {/* Rewards Overview */}
            <DashboardSection title="Rewards Overview">
                <RewardsChartPlaceholder />
                <p className="text-sm text-gray-400 mt-4">Total rewards earned over the last 30 days.</p>
            </DashboardSection>

            {/* Featured Stay Section */}
            <DashboardSection title="Featured Stay">
                <div className="relative group">
                <Image src={mockHotels[4].image} alt={mockHotels[4].name} width={400} height={250} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-md text-white">{mockHotels[4].name}</h3>
                <p className="text-xs text-gray-400 mb-3">{mockHotels[4].location}</p>
                <button className="w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors hover:bg-emerald-500 text-sm">
                    Mint Now
                </button>
                </div>
            </DashboardSection>
          </div>

        </div>
      </div>
    </div>
  );
}