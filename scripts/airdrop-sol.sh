#!/bin/bash
# This script airdrops SOL to a specified wallet on devnet.

# Exit immediately if a command exits with a non-zero status.
set -e

# Check if a wallet address was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <WALLET_ADDRESS>"
  exit 1
fi

WALLET_ADDRESS=$1

# Airdrop 2 SOL to the wallet on devnet
echo "Airdropping 2 SOL to $WALLET_ADDRESS on devnet..."
solana airdrop 2 "$WALLET_ADDRESS" --url https://api.devnet.solana.com

echo "Airdrop complete."
