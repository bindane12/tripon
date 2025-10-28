'use client';

import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';
import Image from 'next/image';
import { mockHotels, Hotel } from '../lib/mockHotels';
import { ArrowRight, CheckCircle, Star, TrendingUp, Zap, ShieldCheck, Globe } from 'lucide-react';

// --- Reusable Components ---

const Section: FC<{ children: ReactNode; className?: string, id?: string }> = ({ children, className = '', id }) => (
  <section id={id} className={`py-20 md:py-28 ${className}`}>
    <div className="container mx-auto px-4">
      {children}
    </div>
  </section>
);

const Title: FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className="font-display text-5xl md:text-6xl font-bold text-center">
    {children}
  </h2>
);

const Subtitle: FC<{ children: ReactNode }> = ({ children }) => (
  <p className="text-center text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
    {children}
  </p>
);

// --- Page Sections ---

const HeroSection: FC = () => (
  <section className="relative text-center py-32 md:py-48 min-h-[70vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Image 
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" 
        alt="Luxury Hotel Poolside" 
        fill
        style={{objectFit:"cover"}}
        className="opacity-20"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background"></div>
    </div>
    <div className="relative z-10 max-w-4xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-display text-6xl md:text-8xl font-bold tracking-wider mb-6"
      >
        LOYALTY, REIMAGINED
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10"
      >
        Unlock exclusive rewards and own your travel experiences with blockchain-powered loyalty tokens.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <a href="#featured-stays" className="bg-primary text-primary-foreground font-bold py-4 px-8 rounded-full shadow-lg shadow-primary/20 transition-all transform hover:scale-105 hover:shadow-primary/40 text-lg flex items-center gap-2 mx-auto w-fit">
          Explore Stays <ArrowRight size={22} />
        </a>
      </motion.div>
    </div>
  </section>
);

const FeaturesSection: FC = () => {
  const features = [
    { icon: <ShieldCheck size={28} />, title: 'True Ownership', description: "Your loyalty is an asset. Buy, sell, and trade it on open markets." },
    { icon: <Zap size={28} />, title: 'Instant Rewards', description: 'No more waiting. Perks and benefits are credited to you in real-time.' },
    { icon: <Globe size={28} />, title: 'Global Access', description: 'A single, unified loyalty system across our growing network of partner hotels.' },
  ];

  return (
    <Section className="bg-background">
      <div className="grid md:grid-cols-3 gap-10 text-center">
        {features.map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 font-display tracking-wide">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

const FeaturedStaysSection: FC = () => (
  <Section id="featured-stays" className="bg-muted/50">
    <Title>Featured Stays</Title>
    <Subtitle>Mint loyalty tokens from our top-tier hotel partners and start earning today.</Subtitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
      {mockHotels.slice(0, 3).map((hotel, i) => (
        <HotelCard key={hotel.name} hotel={hotel} index={i} />
      ))}
    </div>
  </Section>
);

const HotelCard: FC<{ hotel: Hotel, index: number }> = ({ hotel, index }) => (
  <motion.div 
    className="bg-background rounded-2xl shadow-lg overflow-hidden border border-border group transition-all duration-300 hover:shadow-xl hover:border-primary/50"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -8 }}
  >
    <div className="relative h-56 overflow-hidden">
      <Image src={hotel.image} alt={hotel.name} fill style={{objectFit:"cover"}} className="group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-4 right-4 bg-background/60 backdrop-blur-sm text-foreground text-sm px-3 py-1 rounded-full flex items-center gap-2 border border-border">
        <Star size={16} className="text-amber-400" /> {hotel.rating}
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-display text-2xl font-bold tracking-wide mb-2">{hotel.name}</h3>
      <p className="text-muted-foreground text-sm mb-5">{hotel.location}</p>
      <div className="flex justify-between items-center text-sm mb-6">
        <span className="text-muted-foreground">Minting Price</span>
        <span className="font-bold text-lg text-foreground">{hotel.mintingPrice} SOL</span>
      </div>
      <button className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1">
        Mint Loyalty Token
      </button>
    </div>
  </motion.div>
);

const HowItWorksSection: FC = () => {
  const steps = [
    { icon: <TrendingUp size={32} />, title: 'Mint & Hold', description: "Purchase a hotel's loyalty token to become a member and start earning." },
    { icon: <Star size={32} />, title: 'Earn Rewards', description: 'Tokens automatically accrue points, unlocking exclusive perks and benefits.' },
    { icon: <CheckCircle size={32} />, title: 'Own Your Loyalty', description: 'Trade your tokens on open marketplaces, giving you true ownership.' },
  ];

  return (
    <Section>
      <Title>A New Era of Hotel Loyalty</Title>
      <Subtitle>A simple, powerful, and transparent way to engage with your favorite hotels.</Subtitle>
      <div className="grid md:grid-cols-3 gap-12 text-center mt-16">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-background text-primary border-2 border-primary/20 shadow-lg">
              {step.icon}
            </div>
            <h3 className="font-display text-2xl font-bold tracking-wide mb-3">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const ForHotelsSection: FC = () => (
  <Section className="bg-muted/50">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-display text-5xl font-bold tracking-wide text-foreground mb-6">Partner with TripOn</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Engage your guests like never before. Our blockchain platform transforms your loyalty program into a dynamic, tradable asset, creating a vibrant community around your brand.
        </p>
        <ul className="space-y-4 mb-10">
          <li className="flex items-center gap-4 text-lg">
            <CheckCircle className="text-primary" size={24} />
            <span>Boost guest retention and direct bookings.</span>
          </li>
          <li className="flex items-center gap-4 text-lg">
            <CheckCircle className="text-primary" size={24} />
            <span>Create new revenue streams through tokenization.</span>
          </li>
          <li className="flex items-center gap-4 text-lg">
            <CheckCircle className="text-primary" size={24} />
            <span>Access a global community of crypto-savvy travelers.</span>
          </li>
        </ul>
        <button className="bg-secondary text-secondary-foreground font-bold py-4 px-8 rounded-full shadow-lg shadow-secondary/30 transition-transform transform hover:scale-105 text-lg">
          List Your Property
        </button>
      </motion.div>
      <motion.div
        className="relative h-[500px] rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <Image src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop" fill style={{objectFit:"cover"}} className="shadow-2xl" alt="Hotel Lobby" />
      </motion.div>
    </div>
  </Section>
);


const Footer: FC = () => (
  <footer className="border-t border-border">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Image src="/logo.png" width={30} height={30} alt="TripOn Logo" />
          <span className="font-display text-xl font-bold">TRIP.ON</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 md:mb-0">&copy; {new Date().getFullYear()} TRIP.on. All Rights Reserved.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Discord</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Telegram</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <FeaturedStaysSection />
      <HowItWorksSection />
      <ForHotelsSection />
      <Footer />
    </div>
  );
}