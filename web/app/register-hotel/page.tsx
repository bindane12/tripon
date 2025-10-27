
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
    const [isVerified, setIsVerified] = useState(false);
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
                .initializeHotel(hotelName, isVerified)
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
            setIsVerified(false);

        } catch (err: any) {
            console.error("Transaction error:", err);
            setError(err.message || 'An unknown error occurred during the transaction.');
        } finally {
            setLoading(false);
        }
    };

    if (!publicKey) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p className="text-lg font-semibold">Please connect your wallet to register a hotel.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">Register Your Hotel</h1>
            <p className="mb-4 text-gray-600">Your Balance: {isClient && balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</p>

            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="hotelName" className="block text-sm font-medium text-gray-800">Hotel Name</label>
                    <input
                        type="text"
                        id="hotelName"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                        placeholder='e.g., "Solana Grand Hotel"'
                        disabled={loading}
                    />
                </div>

                <div className="flex items-center">
                    <input
                        id="isVerified"
                        type="checkbox"
                        checked={isVerified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={loading}
                    />
                    <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-900">Verified Hotel</label>
                </div>

                <button
                    onClick={handleRegisterHotel}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                    disabled={loading || !hotelName}
                >
                    {loading ? 'Registering...' : 'Register Hotel'}
                </button>
            </div>

            {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"><strong>Error:</strong> {error}</div>}
            {txSig && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <strong>Success!</strong> Transaction confirmed. 
                    <a 
                        href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className='font-medium underline hover:text-green-800'
                    >
                         View on Solana Explorer
                    </a>
                </div>
            )}
        </div>
    );
}
