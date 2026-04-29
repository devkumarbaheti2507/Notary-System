# 🎓 Cross-Chain Document Notary - Presentation Guide

This document contains the exact steps and commands you need to run your presentation perfectly in front of your professor. Keep this file open on your screen during the demo!

---

## 🛠️ Phase 1: Setup (Do this right before your presentation starts)

You need to run two isolated blockchains to prove your cross-chain logic works.

**1. Start the Main Blockchain (Chain 1)**
Open your first terminal and run:
```powershell
npx hardhat node
```
*(Minimize this terminal. It is running your main database on port 8545)*

**2. Start the Foreign Blockchain (Chain 2 - "Simulated Sepolia")**
Open a **second** terminal and run:
```powershell
$env:CHAIN_ID="31338"; npx hardhat node --port 8546
```
*(Minimize this terminal. It is running your cross-chain database on port 8546)*

---

## 🚀 Phase 2: Deploy & Host (Do this right before presenting)

Now deploy the smart contract to both blockchains. Open a **third** terminal.

**1. Deploy to Chain 1:**
```powershell
npx hardhat run scripts/deploy.js --network localhost
```

**2. Deploy to Chain 2:**
```powershell
$env:LOCAL_RPC="http://127.0.0.1:8546"; npx hardhat run scripts/deploy.js --network localhost
```

**3. Start the Website:**
```powershell
npx http-server -p 8080 -a 0.0.0.0
```
Your backend is now fully operational! Open Google Chrome and go to `http://localhost:8080`.

---

## 🎤 Phase 3: The Live Demo (What to say and do)

*Pro-Tip: In MetaMask, name your second local network "Sepolia Testnet" so it looks 100% real to your professor.*

### Step 1: Normal Notarization
1. Connect MetaMask to **Localhost 8545** (Chain ID 31337).
2. Click **Connect** on the website.
3. Upload a PDF (e.g., `Project_Report.pdf`) and click **Notarize**.
4. **🗣️ What to say:** *"The document's cryptographic hash has been successfully stamped onto our primary blockchain network. You can see the Block number and Gas fees."*

### Step 2: Same-Chain Duplicate Prevention
1. Stay on **Localhost 8545**.
2. Try to upload the **exact same PDF** again.
3. **🗣️ What to say:** *"If an attacker tries to upload the same document, the smart contract automatically blocks it, preventing duplicate records on this chain."*

### Step 3: The Cross-Chain Air Gap (The Finale)
1. Open MetaMask and completely switch your network over to **Localhost 8546** (Chain 31338). 
2. The website will refresh. Click **Connect** again to connect to the second blockchain.
3. Attempt to upload the **exact same PDF**.
4. Watch the system instantly flash the red `⛔ CROSS-CHAIN COLLISION DETECTED` error!
5. **🗣️ What to say:** *"This is the core of the project. Even though we are connected to a completely different, isolated blockchain, our Application-Layer cross-chain logic queried the global registry in the background. It detected the document on the first chain and strictly blocked the upload here to preserve global uniqueness across all networks!"*
