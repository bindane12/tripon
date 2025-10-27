
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';

const Wallet = () => {
    const { publicKey } = useWallet();

    if (!publicKey) {
        return (
            <WalletMultiButton 
                style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '9999px',
                    fontWeight: 'bold',
                    padding: '0.5rem 1rem'
                }}
            />
        );
    }

    const publicKeyString = publicKey.toBase58();
    const truncatedKey = `${publicKeyString.slice(0, 4)}...${publicKeyString.slice(-4)}`;

    return (
        <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md text-white font-mono text-sm px-4 py-2 rounded-full border border-white/20 cursor-pointer"
        >
            {truncatedKey}
        </motion.div>
    );
};

export default Wallet;
