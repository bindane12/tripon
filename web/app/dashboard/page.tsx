'use client';

import { mockHotels } from '../../lib/mockHotels';
import Image from 'next/image';
import { FC, ReactNode, useState, useMemo, useEffect } from 'react';
import { BarChart2, ChevronRight, DollarSign, Star, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../../idl/anchor.json';
import { Anchor } from '../../../anchor/target/types/anchor';

const programID = new PublicKey(idl.address);

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
  <div className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
    <div className="flex items-center gap-4">
      <Image src={hotel.image} alt={hotel.name} width={40} height={40} className="rounded-full object-cover" />
      <div>
        <p className="font-semibold text-foreground">{hotel.name}</p>
        <p className="text-sm text-muted-foreground">{hotel.location}</p>
      </div>
    </div>
    <div className="text-right hidden sm:block">
        <p className="font-semibold text-foreground">{(Math.random() * 1000).toFixed(2)} <span className="text-muted-foreground text-sm">{hotel.tokenSymbol}</span></p>
        <p className="text-xs text-gray-500">Balance</p>
    </div>
    <div className="text-right hidden md:block">
        <p className="font-semibold text-primary">+{Math.random().toFixed(2)}%</p>
        <p className="text-xs text-gray-500">24h Change</p>
    </div>
    <ChevronRight className="text-gray-400" />
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

  const provider = useMemo(() => {
      if (!wallet.publicKey || !connection) return null;
      return new AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });
  }, [connection, wallet]);

  const program = useMemo(() => {
      if (!provider) return null;
      return new Program<Anchor>(idl as any, provider);
  }, [provider]);

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
          <StatCard title="Loyalty Tokens" value="4" icon={<Wallet />} />
          <StatCard title="Total Rewards" value="1,850 pts" icon={<Star />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* My Loyalty Tokens Section */}
          <DashboardSection title="My Loyalty Portfolio" className="lg:col-span-2" noPadding>
            <div className="flex justify-between text-xs text-muted-foreground px-4 py-2 border-b border-border">
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
                <p className="text-sm text-muted-foreground mt-4">Total rewards earned over the last 30 days.</p>
            </DashboardSection>

            {/* Featured Stay Section */}
            <DashboardSection title="Featured Stay">
                <div className="relative group">
                <Image src={mockHotels[4].image} alt={mockHotels[4].name} width={400} height={250} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-md text-foreground">{mockHotels[4].name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{mockHotels[4].location}</p>
                <button 
                    onClick={() => handleMint(mockHotels[4])}
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
