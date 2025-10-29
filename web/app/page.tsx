'use client';

import { ReactNode, useState, useMemo } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Star, TrendingUp, Zap, ShieldCheck, Globe } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN, Idl, Provider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../idl/anchor.json';
import { Anchor } from '../../anchor/target/types/anchor';
import { mockHotels } from '../lib/mockHotels';

const programId = new PublicKey(idl.address);
import { FadeInUp, FadeIn, SlideIn, HoverScale } from '../components/Animations';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

interface HotelType {
  name: string;
  location: string;
  image: string;
  rating: number;
  mintingPrice: number;
  owner: string;
}

const Section = ({ children, className = '', id }: SectionProps) => {
  return (
    <section id={id} className={`py-16 ${className} mb-8`}>
      <div className="max-w-6xl mx-auto px-6">
        {children}
      </div>
    </section>
  );
};

const Title = ({ children }: { children: ReactNode }) => {
  return (
    <h2 className="font-display text-4xl md:text-5xl font-bold text-center max-w-2xl mx-auto">
      {children}
    </h2>
  );
};

const Subtitle = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-center text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
      {children}
    </p>
  );
};

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-28 min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 hero-bg">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Hotel Poolside"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-60"
          priority
        />
        {/* Local SVG fallback will show if external image is slow or blocked */}
        <Image src="/hero-fallback.svg" alt="Hero background" fill style={{ objectFit: 'cover' }} className="opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/80"></div>
      </div>
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <FadeInUp delay={0}>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Revolutionary Hotel Loyalty Program
            </span>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
              Own Your Travel <br/>
              <span className="text-primary">Rewards</span>
            </h1>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl">
              Experience the future of hotel loyalty with blockchain-powered rewards. 
              Earn, trade, and unlock exclusive perks with complete ownership.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.6}>
            <div className="flex items-center justify-center gap-4">
              <a href="#featured-stays" className="btn btn-primary flex items-center gap-2">
                Browse Hotels <ArrowRight size={18} />
              </a>
              <a href="#how-it-works" className="btn btn-ghost">
                Learn More
              </a>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { 
      icon: <ShieldCheck size={24} />, 
      title: 'True Ownership', 
      description: "Transform your loyalty into a tradeable asset on the blockchain." 
    },
    { 
      icon: <Zap size={24} />, 
      title: 'Instant Rewards', 
      description: 'Earn and redeem rewards in real-time across our network.' 
    },
    { 
      icon: <Globe size={24} />, 
      title: 'Global Access', 
      description: 'One token, endless possibilities with our partner hotels worldwide.' 
    },
  ];

  return (
    <Section className="bg-muted/30">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1">
            <FadeInUp delay={0}>
              <span className="text-primary font-medium mb-4 block">
                Why Choose TRIP.ON
              </span>
            </FadeInUp>
            <FadeInUp delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Revolutionary Features<br />for Modern Travelers
              </h2>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-muted-foreground max-w-lg">
                We're redefining hotel loyalty programs with blockchain technology, 
                giving you true ownership of your rewards and unprecedented flexibility.
              </p>
            </FadeInUp>
          </div>
          <div className="flex-1">
            <div className="grid gap-6">
              {features.map((feature, i) => (
                <FadeInUp key={i} delay={0.1 * (i + 1)}>
                  <div className="flex gap-4 p-4 rounded-lg hover:bg-background transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
    </Section>
  );
};

// Add other sections here...

const FeaturedStaysSection = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txSig, setTxSig] = useState('');

  const provider = useMemo(() => {
    if (!wallet || !connection) return null;
    return new AnchorProvider(
      connection,
      wallet as any,
      { preflightCommitment: 'processed' }
    );
  }, [connection, wallet]);

  // Some generated IDLs omit the `accounts` section (they leave account
  // structs under `types`). Anchor expects account layout information to
  // exist when initializing a Program (it will compute sizes and layouts);
  // if those are missing you can see runtime errors like "reading 'size' of
  // undefined". Build a patched IDL at runtime that copies struct types to
  // `accounts` when needed.
  const patchedIdl = useMemo(() => {
    const raw: any = idl;
    if (raw.accounts && raw.accounts.length) return raw;

    const types = raw.types || [];
    const accounts = types
      .filter((t: any) => t.type && t.type.kind === 'struct')
      .map((t: any) => ({ name: t.name, type: t.type }));

    return { ...raw, accounts };
  }, []);

  const program = useMemo(() => {
    if (!provider) return null;
    try {
      // The correct constructor signature is (idl, provider). Do NOT pass
      // the program id as the second argument — use Program.at(...) if you
      // want to load by address (it returns a Promise). Using the provider
      // here prevents the "PublicKey is not assignable to Provider" TS
      // error and avoids argument reordering that led to the runtime
      // "reading 'size' of undefined" error when idl.accounts was missing.
      return new Program(patchedIdl as any, provider as any) as Program<Anchor>;
    } catch (err) {
      console.error('Failed to initialize Anchor Program:', err);
      return null;
    }
  }, [provider, patchedIdl]);

  const handleMint = async (hotel: any) => {
    if (!program || !publicKey || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');
    setTxSig('');

    try {
      const [hotelPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("hotel"),
          Buffer.from(hotel.name)
        ],
        programId
      );

      const [membershipPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("membership"),
          hotelPda.toBuffer(),
          publicKey.toBuffer()
        ],
        programId
      );

      const tx = await program.methods
        .mintMembershipToken()
        // Cast accounts to `any` to avoid strict TS mismatches between the
        // generated IDL bindings and runtime IDL transformations. This is a
        // pragmatic runtime fix; if you prefer stricter typing we can refine
        // the generated d.ts or update the IDL instead.
        .accounts({
          hotel: hotelPda,
          membershipToken: membershipPda,
          user: publicKey,
          hotelAuthority: new PublicKey(hotel.owner),
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      setTxSig(signature);
    } catch (err: any) {
      console.error("Transaction error:", err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const HotelCard = ({ hotel, index }: { hotel: any, index: number }) => (
    <FadeInUp delay={index * 0.1}>
      <div className="bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
          <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-xl">
            <Image
              src={hotel.image}
              alt={hotel.name}
              fill
              style={{ objectFit: 'cover' }}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-foreground text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
            <Star size={14} className="text-yellow-500" /> 
            <span className="font-medium">{hotel.rating}</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium text-lg mb-1">{hotel.name}</h3>
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <Globe size={14} /> {hotel.location}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Minting Price</p>
              <p className="font-medium text-lg">{hotel.mintingPrice} SOL</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => handleMint(hotel)}
              disabled={loading || !publicKey}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" aria-hidden />
                  Minting...
                </span>
              ) : (
                'Mint Loyalty Token'
              )}
            </button>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {txSig && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                <strong>Success!</strong> 
                <a 
                  href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-medium text-green-600 hover:text-green-800 underline ml-1"
                >
                  View on Explorer
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeInUp>
  );

  return (
    <Section id="featured-stays" className="bg-muted/30">
      <FadeInUp>
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-primary font-medium mb-4 block">Premium Partners</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Luxury Stays</h2>
          <p className="text-muted-foreground">
            Join our exclusive network of premium hotels and start earning rewards instantly with blockchain-powered loyalty tokens.
          </p>
        </div>
      </FadeInUp>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {mockHotels.slice(0, 3).map((hotel, i) => (
          <HotelCard key={hotel.name} hotel={hotel} index={i} />
        ))}
      </div>
    </Section>
  );
};

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <FeaturedStaysSection />
      {/* Add other sections here */}
    </div>
  );
}