# Hotel Loyalty Platform on Solana

This project is a decentralized application (dApp) that implements a hotel loyalty points system on the Solana blockchain. It consists of an Anchor-based on-chain program and a Next.js web frontend.

Users can mint a "membership" token for a hotel, which then accumulates loyalty points over time for a real world asset value. These points can then be redeemed.

## Features

-   **Hotel Registration**: Hotel owners can register their hotel on the platform.
-   **Membership Minting**: Users can connect their Solana wallet and mint a membership token for a registered hotel for a small fee (0.01 SOL).
-   **Points Accumulation**: Loyalty points are automatically calculated and can be updated based on the duration the membership is held.
-   **Points Redemption**: Users can redeem their accumulated points.
-   **User Dashboard**: A comprehensive dashboard to view available hotels, manage memberships, and interact with the points system.

## Listing Your Property on TripOn

If you are a hotel or property owner, you can apply to have your property listed on TripOn. The process is as follows:

1.  **Submit an Application:** Reach out to the TripOn team to start the application process. You will need to provide details about your property.
2.  **Verification:** The TripOn team will review your application and verify your property.
3.  **Onboarding:** Once verified, you will be onboarded onto the platform, and your property will be listed.

Please contact us at apply@tripon.example.com to start the process.

## Tech Stack

-   **Blockchain**: Solana
-   **Smart Contracts**: Anchor Framework (Rust)
-   **Frontend**: Next.js, React, TypeScript
-   **Styling**: Tailwind CSS
-   **Solana Web3**: `@solana/web3.js`, `@solana/wallet-adapter` for wallet connection, and `@coral-xyz/anchor` for client-side program interaction.

---

## How It Works

The application is split into two main parts: the on-chain program and the frontend client.

### On-Chain Program (Anchor)

The Anchor program, located in the `anchor/` directory, defines the core business logic and state management on the Solana blockchain.

#### Accounts

-   **`Config`**: A singleton account that stores the public key of the program admin.
-   **`Hotel`**: A Program Derived Address (PDA) account that stores information about a single hotel, including its name, owner, verification status, and the total supply of membership tokens.
-   **`Membership`**: A PDA account unique to a user and a hotel. It stores the user's points balance, when they joined, and other relevant data for calculating points.

#### Instructions

-   `initialize_config()`: Initializes the program's configuration, setting the caller as the admin. This should only be called once.
-   `initialize_hotel(name)`: Creates a new `Hotel` account with the `verified` status set to `false`. Can only be called by a hotel owner.
-   `verify_hotel()`: Sets a hotel's `verified` status to `true`. Can only be called by the program admin.
-   `mint_membership_token()`: Creates a new `Membership` account for the calling user, linking them to a specific hotel. This costs 0.01 SOL, which is transferred to the hotel owner.
-   `calculate_and_update_points()`: Calculates points earned based on the time elapsed since the last update and adds them to the user's `Membership` account.
-   `redeem_points(amount)`: Subtracts a specified number of points from a user's `Membership` account.

#### Admin Role and Hotel Verification

The contract now includes a simple admin role. The admin is responsible for verifying hotels before they can be used by users.

The workflow is as follows:
1.  The program authority calls `initialize_config()` once to become the admin.
2.  A hotel owner calls `initialize_hotel()` to register their hotel. The hotel is created in an unverified state.
3.  The admin calls `verify_hotel()` to approve the hotel, setting its `verified` flag to `true`.
4.  Once a hotel is verified, users can mint membership tokens for it.

### Frontend (Next.js)

The frontend, located in the `web/` directory, provides a user interface to interact with the on-chain program.

#### Key Pages & Components

-   **`/` (Home)**: The landing page that shows the user's wallet connection status.
-   **`/register-hotel`**: A form for hotel owners to register their hotel by calling the `initialize_hotel` instruction.
-   **`/dashboard`**: The main user dashboard.
    -   **Available Hotels**: Fetches and displays all `Hotel` accounts from the blockchain. Users can click a button here to mint a membership token.
    -   **My Memberships**: Fetches and displays all `Membership` accounts owned by the connected user. It shows their points balance and provides buttons to refresh or redeem points.
-   **`components/WalletContextProvider.tsx`**: Wraps the application to provide wallet connection logic from `@solana/wallet-adapter`.
-   **`components/Navbar.tsx`**: The main navigation bar with links to all pages and the wallet connection button.

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or later)
-   Yarn package manager
-   Rust
-   Solana CLI: [Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools)
-   Anchor CLI: [Installation Guide](https://www.anchor-lang.com/docs/installation)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd TRIP.on
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd web
    npm install
    ```

3.  **Build the Anchor program:**
    ```bash
    cd ../anchor
    anchor build
    ```

---

## Testing the Program

To run the test suite on the Anchor program:

1.  Navigate to the `anchor` directory.
2.  Run the `anchor test` command. This will build the program, deploy it to a local test validator, and run the tests defined in `tests/hotel-loyalty.ts`.

```bash
cd anchor
anchor test
```

---

## Deployment

A helper script is provided to streamline deployment to Solana's devnet.

### Airdrop SOL

Before deploying or testing on devnet, you'll need devnet SOL. Use the `airdrop-sol.sh` script:

```bash
./scripts/airdrop-sol.sh <YOUR_WALLET_ADDRESS>
```

### Deploy to Devnet

The `deploy-devnet.sh` script will build the program, deploy it, and copy the resulting IDL to the frontend for you.

```bash
./scripts/deploy-devnet.sh
```

The script will output the new Program ID. Make sure to update this ID in `anchor/src/lib.rs` and `web/idl/anchor.json` if it has changed.

---

## Running the Application

1.  **Start the Local Validator:**
    -   For local development and testing, run a local validator.
    ```bash
    solana-test-validator
    ```

2.  **Start the Frontend:**
    -   In a new terminal, navigate to the `web` directory and start the development server.
    ```bash
    cd web
    npm run dev
    ```

3.  **Open the Application:**
    -   Open your browser and go to `http://localhost:3000`.

---

## Project Structure

```
/
├── anchor/         # Solana Anchor Program
│   ├── programs/
│   │   └── anchor/
│   │       └── src/
│   │           └── lib.rs      # On-chain program logic
│   ├── tests/                  # Test files for the program
│   ├── Anchor.toml             # Anchor configuration
│   └── ...
└── web/            # Next.js Frontend
    ├── app/
    │   ├── dashboard/
    │   │   └── page.tsx        # Dashboard UI and logic
    │   ├── register-hotel/
    │   │   └── page.tsx        # Hotel registration UI
    │   └── page.tsx            # Homepage
    ├── components/             # Reusable React components (Navbar, Wallet)
    ├── idl/
    │   └── anchor.json         # Program IDL for the client
    ├── package.json
    └── ...
```
