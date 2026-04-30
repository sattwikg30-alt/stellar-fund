# StellarFund 🚀

StellarFund is a decentralized, high-performance crowdfunding platform built on the Stellar network using Soroban smart contracts. It empowers visionaries around the globe to launch projects and raise funds transparently, securely, and with lightning-fast transaction speeds.

Unlike traditional platforms, StellarFund removes the middleman. All funds are held and distributed by immutable smart contracts, ensuring donors that their XLM goes directly to the causes they care about.

---

## 💻 Tech Stack

### Frontend
* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (with Glassmorphism UI)
* **Icons:** Lucide React

### Blockchain & Web3
* **Smart Contracts:** Rust (Soroban SDK)
* **Network Integration:** `@stellar/stellar-sdk`
* **Wallet Connection:** `@creit.tech/stellar-wallets-kit` (Supporting Freighter, Albedo, and xBull)

---

## ✨ Key Features

- **🚀 Instant Campaign Launch**: Create crowdfunding projects directly on the Stellar blockchain with defined funding goals.
- **💎 Secure XLM Donations**: Support projects using Soroban smart contracts, ensuring funds are handled autonomously.
- **🏆 Global Leaderboard**: Real-time tracking of top contributors across all active campaigns.
- **⚡ Live Activity Feed**: Instant updates of recent donations with links to the Stellar Expert explorer.
- **📂 Transaction History**: Local tracking of your personal contributions with transaction hashes.
- **🔌 Multi-Wallet Support**: Seamless integration with Freighter, Albedo, and xBull wallets.
- **🎨 Modern Glassmorphism UI**: A beautiful, responsive interface designed for the best user experience.

---

```text
stellar2.0/
├── contract/                   # Soroban Smart Contract
│   └── crowdfunding/
│       └── contracts/
│           └── hello-world/    # Main Rust contract logic
│               └── src/lib.rs  # Core contract implementation
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable UI components
│   │   ├── CampaignCard.tsx    # Individual campaign display
│   │   ├── Donate.tsx          # Donation logic & UI
│   │   ├── Leaderboard.tsx     # Top donor tracking
│   │   └── ActivityFeed.tsx    # Live blockchain updates
│   ├── context/                # Wallet & Global state providers
│   ├── lib/                    # SDK initializations & utils
│   │   ├── contract.ts         # Contract constants
│   │   └── wallet.ts           # Wallet connection helpers
│   └── services/               # Blockchain interaction logic
│       └── stellar.ts          # Soroban RPC & transaction calls
└── public/                     # Static assets & icons
```

---

## 📊 Tech Stack & Resources

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) | React Framework with App Router |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Modern Glassmorphism UI |
| **Blockchain** | [Soroban (Stellar)](https://soroban.stellar.org/) | Smart Contract Platform |
| **Smart Contract** | [Rust](https://www.rust-lang.org/) | Secure contract logic |
| **SDK** | [Stellar SDK](https://github.com/stellar/js-stellar-sdk) | RPC communication |
| **Wallet Kit** | [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) | Multi-wallet integration |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent iconography |

---
* **Deployed Contract Address:** `CAHJIP3GBQIXOK2HULS7ALYI2PTKEXEMQYMKAESD3BOZQ2BD5QRUWO56`
* **Network:** Stellar Testnet
* **Example Transaction Hash (Deployment/Call):** 
  * `283b88f567d98eb036421866b1854d9de1baba334b8bbfd19cb58d5954c64177`
  * [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/283b88f567d98eb036421866b1854d9de1baba334b8bbfd19cb58d5954c64177)

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Rust & Cargo
- Stellar CLI
- A Stellar Wallet Extension (Freighter, Albedo, or xBull)

### Frontend Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sattwikg30-alt/stellar-fund.git
   cd stellar2.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000`.

### Smart Contract Deployment
The Soroban smart contract is located in `contract/crowdfunding/contracts/hello-world`.

To build the contract from scratch:
```bash
cd contract/crowdfunding
stellar contract build
```

To deploy the contract to the testnet:
```bash
stellar contract deploy --wasm target/wasm32v1-none/release/hello_world.wasm --source default --network testnet
```

---

## 📸 Screenshots 



### Wallet Options
![Wallet Options Screenshot](https://res.cloudinary.com/dzjn1u0ln/image/upload/v1777569968/Screenshot_2026-04-30_224942_se3h0c.png) 
Wallet Options- multiwallet.

![Wallet transaction ](https://res.cloudinary.com/dzjn1u0ln/image/upload/v1777570036/Screenshot_2026-04-30_225210_npmjde.png)
Wallet transactions 

![history ](https://res.cloudinary.com/dzjn1u0ln/image/upload/v1777570099/Screenshot_2026-04-30_225145_r1swmb.png)
History

![contract deployed and deployment id](https://res.cloudinary.com/dzjn1u0ln/image/upload/v1777570099/Screenshot_2026-04-30_225145_r1swmb.png)
Contract deployed and deployment id