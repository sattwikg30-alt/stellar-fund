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

## 🔗 Contract Information
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
   git clone <your-repo-url>
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
Wallet Options Screenshot.

![Wallet transaction ](https://res.cloudinary.com/dzjn1u0ln/image/upload/v1777570036/Screenshot_2026-04-30_225210_npmjde.png)
wallet trans

![history ](https://res.cloudinary.com/dzjn1u0ln/image/upload/v1777570099/Screenshot_2026-04-30_225145_r1swmb.png)
history
