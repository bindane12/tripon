'use client';

import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
    const { connected, publicKey } = useWallet();

    return (
        <main className="container mx-auto mt-10 p-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Hotel Loyalty Platform</h1>

            <div className="bg-white shadow-md rounded-lg p-6 text-gray-800">
                <h2 className="text-2xl font-semibold mb-3">Wallet Connection Status</h2>
                {
                    connected && publicKey ? (
                        <div>
                            <p className="text-green-600 font-medium">Wallet Connected!</p>
                            <p className="text-gray-700 mt-2">Your wallet address is:</p>
                            <code className="bg-gray-100 p-2 rounded text-sm break-all">
                                {publicKey.toBase58()}
                            </code>
                        </div>
                    ) : (
                        <p className="text-red-600 font-medium">Wallet is not connected. Please connect your wallet.</p>
                    )
                }
            </div>
        </main>
    );
}
