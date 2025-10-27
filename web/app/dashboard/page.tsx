
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import idl from '../../idl/anchor.json';
import { Anchor } from '../../../anchor/target/types/anchor';

// Program ID from the IDL
const programID = new PublicKey(idl.address);

// Define interfaces for our data structures
interface Hotel {
    publicKey: PublicKey;
    account: {
        name: string;
        tokenSupply: BN;
        verified: boolean;
        owner: PublicKey;
    };
}

interface Membership {
    publicKey: PublicKey;
    account: {
        hotel: PublicKey;
        pointsBalance: BN;
        lastPointsUpdate: BN;
        timestamp: BN;
    };
}

export default function DashboardPage() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [redeemAmounts, setRedeemAmounts] = useState<{ [key: string]: string }>({});

    const provider = useMemo(() => {
        if (!wallet.publicKey || !connection) return null;
        return new AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program<Anchor>(idl as any, provider);
    }, [provider]);

    // Fetch hotels and memberships on load
    useEffect(() => {
        const fetchData = async () => {
            if (!program || !publicKey) return;

            setLoading(true);
            try {
                // Fetch all hotel accounts
                const hotelAccounts = await program.account.hotel.all();
                setHotels(hotelAccounts as any[]);

                // Fetch all membership accounts and filter for the current user
                const allMemberships = await program.account.membership.all();
                const userMemberships = allMemberships.filter(m => m.account.user.equals(publicKey));
                setMemberships(userMemberships as any[]);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch on-chain data. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [program, publicKey]);

    const handleMintMembership = async (hotel: Hotel) => {
        if (!program || !publicKey || !provider) {
            setError('Wallet not connected or program not loaded.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const [membershipPda] = await PublicKey.findProgramAddress(
                [
                    Buffer.from("membership"),
                    hotel.publicKey.toBuffer(),
                    publicKey.toBuffer(),
                ],
                program.programId
            );

            const transaction = new web3.Transaction().add(
                // Instruction to transfer 0.01 SOL for the membership
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: hotel.account.owner,
                    lamports: 0.01 * LAMPORTS_PER_SOL,
                })
            );

            const mintTx = await program.methods
                .mintMembershipToken()
                .accounts({
                    hotel: hotel.publicKey,
                    membershipToken: membershipPda,
                    user: publicKey,
                    hotelAuthority: hotel.account.owner,
                    systemProgram: SystemProgram.programId,
                })
                .transaction();
            
            transaction.add(mintTx);

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            // Refresh data
            const allMemberships = await program.account.membership.all();
            const userMemberships = allMemberships.filter(m => m.account.user.equals(publicKey));
            setMemberships(userMemberships as any[]);

        } catch (err: any) {
            console.error("Minting error:", err);
            setError(err.message || 'An unknown error occurred during minting.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshPoints = async (membership: Membership) => {
        if (!program || !publicKey) return;
        setLoading(true);
        try {
            await program.methods
                .calculateAndUpdatePoints()
                .accounts({
                    membershipToken: membership.publicKey,
                    user: publicKey,
                })
                .rpc();
            
            // Refresh memberships data
            const updatedMemberships = memberships.map(m => {
                if (m.publicKey.equals(membership.publicKey)) {
                    // This is a mock update. A real implementation would refetch.
                    // For now, we just signal that something happened.
                }
                return m;
            });
            // Ideally, you'd refetch the specific account to get the new points
            // For simplicity, we'll just stop loading
        } catch (err: any) {
            setError(err.message || "Failed to refresh points.");
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemPoints = async (membership: Membership) => {
        if (!program || !publicKey) return;
        const amountStr = redeemAmounts[membership.publicKey.toBase58()];
        if (!amountStr || isNaN(parseInt(amountStr))) {
            setError("Please enter a valid number of points to redeem.");
            return;
        }
        const amount = new BN(amountStr);

        setLoading(true);
        try {
            await program.methods
                .redeemPoints(amount)
                .accounts({
                    membershipToken: membership.publicKey,
                    user: publicKey,
                })
                .rpc();
            
            // Clear input and refetch data
            setRedeemAmounts(prev => ({...prev, [membership.publicKey.toBase58()]: ''}));
        } catch (err: any) {
            setError(err.message || "Failed to redeem points.");
        } finally {
            setLoading(false);
        }
    };

    const hotelMap = useMemo(() => {
        return hotels.reduce((acc, hotel) => {
            acc[hotel.publicKey.toBase58()] = hotel.account.name;
            return acc;
        }, {} as { [key: string]: string });
    }, [hotels]);

    if (!publicKey) {
        return <div className="text-center p-8">Please connect your wallet to view the dashboard.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            {/* Section 1: Available Hotels */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Available Hotels</h2>
                {loading && !hotels.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 h-36 rounded-lg animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hotels.map(hotel => (
                            <div key={hotel.publicKey.toBase58()} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">{hotel.account.name} {hotel.account.verified && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Verified</span>}</h3>
                                    <p className="text-sm text-gray-600">Members: {hotel.account.tokenSupply.toString()}</p>
                                </div>
                                <button
                                    onClick={() => handleMintMembership(hotel)}
                                    disabled={loading}
                                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                                >
                                    Mint Membership (0.01 SOL)
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Section 2: My Memberships */}
            <section className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">My Memberships</h2>
                {loading && !memberships.length ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(2)].map((_, i) => <div key={i} className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>)}
                    </div>
                ) : memberships.length === 0 ? (
                    <p>You have no hotel memberships yet. Mint one from the hotels above!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {memberships.map(membership => (
                            <div key={membership.publicKey.toBase58()} className="bg-white shadow-md rounded-lg p-4 space-y-3">
                                <h3 className="font-bold text-lg">{hotelMap[membership.account.hotel.toBase58()] || 'Unknown Hotel'}</h3>
                                <p>Points: <span className="font-semibold">{membership.account.pointsBalance.toString()}</span></p>
                                <p className="text-sm text-gray-500">Joined: {new Date(membership.account.timestamp.toNumber() * 1000).toLocaleDateString()}</p>
                                
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleRefreshPoints(membership)} disabled={loading} className="bg-gray-200 px-3 py-1 rounded-md text-sm hover:bg-gray-300">Refresh Points</button>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input 
                                        type="number"
                                        placeholder="Points to redeem"
                                        value={redeemAmounts[membership.publicKey.toBase58()] || ''}
                                        onChange={e => setRedeemAmounts({...redeemAmounts, [membership.publicKey.toBase58()]: e.target.value})}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-black"
                                    />
                                    <button onClick={() => handleRedeemPoints(membership)} disabled={loading} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Redeem</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
