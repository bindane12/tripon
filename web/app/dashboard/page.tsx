'use client';

import { mockHotels } from '../../lib/mockHotels';
import Image from 'next/image';
import { FC, ReactNode, useState, useMemo, useEffect } from 'react';
import { BarChart2, ChevronRight, DollarSign, Star, Wallet, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../../idl/anchor.json';
import { Anchor } from '../../../anchor/target/types/anchor';

const programID = new PublicKey(idl.address);

// --- Tier System --- 
const TIER_CONFIG = {
  0: { name: 'Basic', color: '#94a3b8', benefits: '1x points multiplier' },
  1: { name: 'Silver', color: '#a1a1aa', benefits: '1.2x points multiplier' },
  2: { name: 'Gold', color: '#f59e0b', benefits: '1.5x points multiplier' },
  3: { name: 'Platinum', color: '#6366f1', benefits: '2x points multiplier' },
};

const TIER_THRESHOLDS = [0, 1000, 5000, 15000];

const TierBadge: FC<{ tier: number }> = ({ tier }) => {
  const { name, color, benefits } = TIER_CONFIG[tier as keyof typeof TIER_CONFIG] || TIER_CONFIG[0];
  return (
    <div className="group relative flex items-center">
      <div style={{ backgroundColor: color }} className="text-white text-xs font-bold px-2 py-1 rounded-full">
        {name}
      </div>
      <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {benefits}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
      </div>
    </div>
  );
};

const TierProgressBar: FC<{ points: number; tier: number }> = ({ points, tier }) => {
  const currentThreshold = TIER_THRESHOLDS[tier];
  const nextThreshold = TIER_THRESHOLDS[tier + 1] || TIER_THRESHOLDS[tier];
  const progress = tier === 3 ? 100 : Math.max(0, Math.min(100, ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{TIER_CONFIG[tier as keyof typeof TIER_CONFIG].name}</span>
        {tier < 3 && <span>{TIER_CONFIG[tier + 1 as keyof typeof TIER_CONFIG].name}</span>}
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div style={{ width: `${progress}%`, backgroundColor: TIER_CONFIG[tier as keyof typeof TIER_CONFIG].color }} className="h-1.5 rounded-full transition-all duration-500"></div>
      </div>
      <p className="text-xs text-right text-muted-foreground mt-1">{points} / {nextThreshold} points</p>
    </div>
  );
};


// --- Reusable Components ---

const DashboardSection: FC<{ title: string; children: ReactNode; className?: string, noPadding?: boolean }> = ({ title, children, className = '', noPadding = false }) => (
  <div className={`bg-card border border-border rounded-2xl shadow-sm ${className}`}>
    <h2 className="text-xl font-bold text-card-foreground mb-4 px-6 pt-6">{title}</h2>
    <div className={noPadding ? '' : 'px-6 pb-6'}>
      {children}
    </div>
  </div>
);

const StatCard: FC<{ title: string; value: string; icon: ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-card p-5 rounded-xl flex items-center gap-4 border border-border shadow-sm">
    <div className="text-primary bg-primary/10 p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

const HotelRow: FC<{ hotel: any }> = ({ hotel }) => (
    <div className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image src={hotel.image} alt={hotel.name} width={40} height={40} className="rounded-full object-cover" />
                <div>
                    <p className="font-semibold text-foreground">{hotel.name}</p>
                    <p className="text-sm text-muted-foreground">{hotel.location}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-semibold text-foreground">{(hotel.points || 0).toFixed(2)} <span className="text-muted-foreground text-sm">PTS</span></p>
                    <p className="text-xs text-gray-500">Balance</p>
                </div>
                <TierBadge tier={hotel.tier || 0} />
                <ChevronRight className="text-gray-400" />
            </div>
        </div>
        <div className="mt-3">
            <TierProgressBar points={hotel.points || 0} tier={hotel.tier || 0} />
        </div>
    </div>
  );

const RewardsChartPlaceholder: FC = () => (
    <div className="w-full h-48 bg-muted rounded-lg p-4 flex flex-col justify-end">
        <div className="flex items-end h-full gap-2">
            <motion.div initial={{height: '20%'}} whileInView={{height: '40%'}} className="w-full bg-primary/30 rounded-t-sm"></motion.div>
            <motion.div initial={{height: '30%'}} whileInView={{height: '60%'}} className="w-full bg-primary/50 rounded-t-sm"></motion.div>
            <motion.div initial={{height: '50%'}} whileInView={{height: '30%'}} className="w-full bg-primary/40 rounded-t-sm"></motion.div>
            <motion.div initial={{height: '40%'}} whileInView={{height: '75%'}} className="w-full bg-primary/80 rounded-t-sm"></motion.div>
            <motion.div initial={{height: '60%'}} whileInView={{height: '50%'}} className="w-full bg-primary/60 rounded-t-sm"></motion.div>
        </div>
    </div>
)


// --- Dashboard Page ---

export default function DashboardPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txSig, setTxSig] = useState('');
  const [memberships, setMemberships] = useState<any[]>([]);

  const provider = useMemo(() => {
      if (!wallet.publicKey || !connection) return null;
      return new AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });
  }, [connection, wallet]);

  const program = useMemo(() => {
      if (!provider) return null;
      return new Program<Anchor>(idl as any, provider);
  }, [provider]);

  useEffect(() => {
    const fetchMemberships = async () => {
        if (!program || !publicKey) return;

        try {
            const membershipAccounts = await program.account.membership.all([
                { memcmp: { offset: 8, bytes: publicKey.toBase58() } }
            ]);

            const membershipsData = await Promise.all(membershipAccounts.map(async (m) => {
                const hotelAccount = await program.account.hotel.fetch(m.account.hotel);
                const mockHotel = mockHotels.find(h => h.name === hotelAccount.name);
                return {
                    ...m.account,
                    name: hotelAccount.name,
                    location: mockHotel?.location,
                    image: mockHotel?.image,
                    points: m.account.pointsBalance.toNumber(),
                    tier: m.account.tier,
                };
            }));

            setMemberships(membershipsData);
        } catch (err) {
            console.error("Error fetching memberships:", err);
        }
    };

    fetchMemberships();
  }, [program, publicKey]);

  const handleMint = async (hotel: any) => {
    if (!program || !publicKey || !provider) {
        setError('Wallet not connected or program not loaded. Please connect your wallet.');
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
            program.programId
        );

        const [membershipPda] = await PublicKey.findProgramAddress(
            [
                Buffer.from("membership"),
                hotelPda.toBuffer(),
                publicKey.toBuffer()
            ],
            program.programId
        );

        const tx = await program.methods
            .mintMembershipToken()
            .accounts({
                hotel: hotelPda,
                membershipToken: membershipPda,
                user: publicKey,
                hotelAuthority: new PublicKey(hotel.owner), // Assuming hotel owner is the authority
                systemProgram: SystemProgram.programId,
            })
            .transaction();

        const signature = await sendTransaction(tx, connection);
        await connection.confirmTransaction(signature, 'confirmed');

        setTxSig(signature);

    } catch (err: any) {
        console.error("Transaction error:", err);
        setError(err.message || 'An unknown error occurred during the transaction.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your personal hub for on-chain loyalty.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Portfolio Value" value="$1,284.50" icon={<DollarSign />} />
          <StatCard title="Loyalty Tokens" value={memberships.length.toString()} icon={<Wallet />} />
          <StatCard title="Total Rewards" value={`${memberships.reduce((acc, m) => acc + m.points, 0).toLocaleString()} pts`} icon={<Star />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* My Loyalty Tokens Section */}
          <DashboardSection title="My Loyalty Portfolio" className="lg:col-span-2" noPadding>
            <div className="flex justify-between text-xs text-muted-foreground px-4 py-2 border-b border-border">
                <p>Asset</p>
                <div className="flex items-center gap-12">
                    <p>Balance</p>
                    <p className="w-20"></p> 
                    <p className="w-6"></p>
                </div>
            </div>
            <div className="space-y-0">
              {memberships.map(hotel => (
                <HotelRow key={hotel.name} hotel={hotel} />
              ))}
            </div>
          </DashboardSection>

          <div className="flex flex-col gap-8">
            {/* Rewards Overview */}
            <DashboardSection title="Rewards Overview">
                <RewardsChartPlaceholder />
                <p className="text-sm text-muted-foreground mt-4">Total rewards earned over the last 30 days.</p>
            </DashboardSection>

            {/* Featured Stay Section */}
            <DashboardSection title="Featured Stay">
                <div className="relative group">
                <Image src={mockHotels[4].image} alt={mockHotels[4].name} width={400} height={250} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-md text-foreground">{mockHotels[4].name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{mockHotels[4].location}</p>
                <button 
                    onClick={() => handleMint(mockHotels.find(h => h.name === mockHotels[4].name))}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md transition-colors hover:bg-primary/90 text-sm disabled:bg-gray-400"
                >
                    {loading ? 'Minting...' : 'Mint Now'}
                </button>
                </div>
                {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"><strong>Error:</strong> {error}</div>}
                {txSig && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                        <strong>Success!</strong> 
                        <a 
                            href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className='font-medium underline hover:text-green-800 ml-1'
                        >
                            View on Explorer
                        </a>
                    </div>
                )}
            </DashboardSection>
          </div>

        </div>
      </div>
    </div>
  );
}
