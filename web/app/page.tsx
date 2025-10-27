'use client';

import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';
import Image from 'next/image';
import { mockHotels, Hotel } from '../lib/mockHotels';
import { ArrowRight, CheckCircle, Star, TrendingUp, Search, MapPin, Calendar, Users } from 'lucide-react';

// --- Reusable Components ---

const Section: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`py-16 md:py-24 ${className}`}>
    <div className="container mx-auto px-4">
      {children}
    </div>
  </div>
);

// --- Page Sections ---

const HeroSection: FC = () => (
  <div className="relative text-center py-24 md:py-36 bg-gray-900 overflow-hidden h-[500px] flex items-center justify-center">
    <Image 
      src="https://placehold.co/1920x1080/00a680/white?text=Travel+Destination" 
      alt="Travel Destination" 
      layout="fill" 
      objectFit="cover" 
      className="absolute inset-0 z-0 opacity-30"
    />
    <div className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
        Find your next stay
      </h1>
      <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
        Search deals on hotels, homes, and much more...
      </p>
      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <MapPin className="text-gray-400" />
          <input type="text" placeholder="Where are you going?" className="p-2 border-r border-gray-200 w-full" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Calendar className="text-gray-400" />
          <input type="text" placeholder="Check-in - Check-out" className="p-2 border-r border-gray-200 w-full" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Users className="text-gray-400" />
          <input type="text" placeholder="2 adults - 0 children" className="p-2 w-full" />
        </div>
        <button className="bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 w-full md:w-auto justify-center">
          <Search size={20} />
          <span>Search</span>
        </button>
      </div>
    </div>
  </div>
);

const FeaturedStaysSection: FC = () => (
  <Section className="bg-white py-12 md:py-16">
    <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Featured Stays</h2>
    <p className="text-center text-gray-500 mb-10">Mint loyalty tokens from our top-tier hotel partners.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {mockHotels.slice(0, 3).map((hotel) => (
        <HotelCard key={hotel.name} hotel={hotel} />
      ))}
    </div>
  </Section>
);

const HotelCard: FC<{ hotel: Hotel }> = ({ hotel }) => (
  <motion.div 
    className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border group transition-all duration-300 hover:shadow-xl"
    whileHover={{ y: -5 }}
  >
    <div className="relative h-48 overflow-hidden">
      <Image src={hotel.image} alt={hotel.name} width={400} height={250} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
        <Star size={14} className="text-amber-400" /> {hotel.rating}
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold mb-1 text-card-foreground">{hotel.name}</h3>
      <p className="text-muted-foreground text-sm mb-4">{hotel.location}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Minting Price</span>
        <span className="font-semibold text-lg text-primary">{hotel.mintingPrice} SOL</span>
      </div>
      <div className="mt-5">
        <button className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg shadow-md transition-colors hover:bg-primary/90">
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
    <Section className="bg-muted">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">A New Era of Loyalty</h2>
      <div className="grid md:grid-cols-3 gap-10 text-center">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-white text-primary border border-border shadow-sm">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const Footer: FC = () => (
  <footer className="bg-white border-t border-border py-8">
    <div className="container mx-auto px-4 text-center text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} TRIP.on. All Rights Reserved.</p>
      <p className="text-sm mt-2">The future of travel loyalty, built on Solana.</p>
    </div>
  </footer>
);

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <FeaturedStaysSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
