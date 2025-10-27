'use client';

import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';
import Image from 'next/image';
import { mockHotels, Hotel } from '../lib/mockHotels';
import { ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react';

// --- Reusable Components ---

const Section: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`py-16 md:py-24 ${className}`}>
    <div className="container mx-auto px-4">
      {children}
    </div>
  </div>
);

const GradientText: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 ${className}`}>
    {children}
  </span>
);

// --- Page Sections ---

const HeroSection: FC = () => (
  <div className="relative text-center py-24 md:py-36 bg-gray-900 overflow-hidden">
    <div 
      className="absolute inset-0 z-0 opacity-20"
      style={{
        backgroundImage: 'radial-gradient(circle at top right, #10b981, transparent 40%), radial-gradient(circle at bottom left, #0d9488, transparent 40%)',
      }}
    ></div>
    <div className="relative z-10">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4"
      >
        Own Your Loyalty. <GradientText>Unlock Your World.</GradientText>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-8"
      >
        A revolutionary on-chain loyalty platform that turns your hotel stays into tradable assets.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex justify-center gap-4"
      >
        <button className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-emerald-500/30 flex items-center gap-2">
          Explore Hotels <ArrowRight size={20} />
        </button>
        <button className="bg-white/10 backdrop-blur-md text-white font-bold py-3 px-6 rounded-full border border-white/20 transition-colors hover:bg-white/20">
          List Your Property
        </button>
      </motion.div>
    </div>
  </div>
);

const FeaturedStaysSection: FC = () => (
  <Section className="bg-gray-800/50 py-12 md:py-16">
    <h2 className="text-3xl font-bold text-center mb-2 text-white">Featured Stays</h2>
    <p className="text-center text-gray-400 mb-10">Mint loyalty tokens from our top-tier hotel partners.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {mockHotels.slice(0, 3).map((hotel) => (
        <HotelCard key={hotel.name} hotel={hotel} />
      ))}
    </div>
  </Section>
);

const HotelCard: FC<{ hotel: Hotel }> = ({ hotel }) => (
  <motion.div 
    className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-white/10 group transition-all duration-300 hover:border-emerald-500/50"
    whileHover={{ y: -5 }}
  >
    <div className="relative h-40 overflow-hidden">
      <Image src={hotel.image} alt={hotel.name} width={400} height={250} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <Star size={12} className="text-amber-400" /> {hotel.rating}
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold mb-1 text-white">{hotel.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{hotel.location}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-300">Price</span>
        <span className="font-semibold text-white">{hotel.mintingPrice} SOL</span>
      </div>
      <div className="mt-4">
        <button className="w-full bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-colors hover:bg-emerald-500">
          View Details
        </button>
      </div>
    </div>
  </motion.div>
);

const HowItWorksSection: FC = () => {
  const steps = [
    { icon: <TrendingUp />, title: 'Mint & Hold', description: 'Purchase a hotel\'s loyalty token to become a member and start earning.' },
    { icon: <Star />, title: 'Earn Rewards', description: 'Tokens automatically accrue points, unlocking exclusive perks and benefits.' },
    { icon: <CheckCircle />, title: 'Own Your Loyalty', description: 'Trade your tokens on open marketplaces, giving you true ownership.' },
  ];

  return (
    <Section className="bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">A New Era of Loyalty</h2>
      <div className="grid md:grid-cols-3 gap-10 text-center">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gray-800 text-emerald-400 border border-white/10">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
            <p className="text-gray-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const Footer: FC = () => (
  <footer className="bg-gray-900 border-t border-white/10 py-8">
    <div className="container mx-auto px-4 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} TRIP.on. All Rights Reserved.</p>
      <p className="text-sm mt-2">The future of travel loyalty, built on Solana.</p>
    </div>
  </footer>
);

export default function HomePage() {
  return (
    <div className="bg-gray-900 text-white">
      <HeroSection />
      <FeaturedStaysSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}