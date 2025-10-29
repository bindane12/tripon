'use client';

import { useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import idl from '../../idl/anchor.json';
import { Anchor } from '../../../anchor/target/types/anchor';

// Hardcoded program ID for the prototype
const programID = new PublicKey(idl.address);

export default function RegisterHotelPage() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const { publicKey, sendTransaction } = wallet;

    const [hotelName, setHotelName] = useState('');
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [txSig, setTxSig] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const provider = useMemo(() => {
        if (!wallet.publicKey || !connection) return null;
        return new AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program<Anchor>(idl as any, provider);
    }, [provider]);

    // Fetch SOL balance
    useEffect(() => {
        if (publicKey) {
            connection.getBalance(publicKey).then(bal => {
                setBalance(bal / LAMPORTS_PER_SOL);
            });
        }
    }, [publicKey, connection, loading]);

    const handleRegisterHotel = async () => {
        if (!program || !publicKey || !provider) {
            setError('Wallet not connected or program not loaded. Please connect your wallet.');
            return;
        }

        if (hotelName.length < 3 || hotelName.length > 50) {
            setError('Hotel name must be between 3 and 50 characters.');
            return;
        }

        setLoading(true);
        setError('');
        setTxSig('');

        try {
            // Derive the PDA for the hotel account
            const [hotelPda] = await PublicKey.findProgramAddress(
                [
                    Buffer.from("hotel"),
                    Buffer.from(hotelName)
                ],
                program.programId
            );

            // Build the transaction
            const tx = await program.methods
                .initializeHotel(hotelName) // `isVerified` removed
                .accounts({
                    hotel: hotelPda,
                    authority: publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .transaction();

            // Send and confirm the transaction
            const signature = await sendTransaction(tx, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            setTxSig(signature);
            // Clear form on success
            setHotelName('');

        } catch (err: any) {
            console.error("Transaction error:", err);
            setError(err.message || 'An unknown error occurred during the transaction.');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) {
        return null; // Or a loading spinner
    }

    if (!publicKey) {
        return (
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">Please connect your wallet to register a hotel.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted">
            <div className="">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-foreground">List Your Property</h1>
                    <p className="text-muted-foreground mt-2">Join the decentralized travel revolution by listing your hotel on TripOn.</p>
                </header>

                <div className="bg-card shadow-lg rounded-2xl p-8 border border-border">
                    <div className="mb-6">
                        <p className="text-sm text-muted-foreground">Your Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="hotelName" className="block text-sm font-medium text-foreground">Hotel Name</label>
                            <input
                                type="text"
                                id="hotelName"
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm text-foreground"
                                placeholder='e.g., "The Solana Sands Resort"'
                                disabled={loading}
                            />
                        </div>

                        <button
                            onClick={handleRegisterHotel}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
                            disabled={loading || !hotelName}
                        >
                            {loading ? 'Registering...' : 'Register Hotel'}
                        </button>
                    </div>
                </div>

                {error && <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"><strong>Error:</strong> {error}</div>}
                {txSig && (
                    <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        <strong>Success!</strong> Transaction confirmed. 
                        <a 
                            href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className='font-medium underline hover:text-green-800 ml-2'
                        >
                            View on Solana Explorer
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}