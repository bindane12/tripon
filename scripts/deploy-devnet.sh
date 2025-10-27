#!/bin/bash
# This script deploys the Anchor program to devnet.

# Exit immediately if a command exits with a non-zero status.
set -e

# Navigate to the anchor directory
cd "$(dirname "$0")/../anchor"

# Build the program
echo "Building the program..."
anchor build

# Deploy the program to devnet
echo "Deploying to devnet..."
anchor deploy --provider.cluster devnet

# Copy the IDL to the frontend project
echo "Copying IDL to the frontend..."
cp target/idl/anchor.json ../web/idl/anchor.json

# Get the program ID from the deployment
PROGRAM_ID=$(solana address -k target/deploy/anchor-keypair.json)

# Output the program ID
echo "
--------------------------------------------------
Program Deployed Successfully!

Program ID: $PROGRAM_ID

Update this ID in your frontend and Anchor program if needed.
--------------------------------------------------
"
