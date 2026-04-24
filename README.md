# 🔏 Cross-Chain Document Notary System

A blockchain-based document notarization system built with **Solidity** and **Hardhat**, following the concepts taught in the workshop.

### ✨ Key Features
- **Multi-user LAN access** — Run the blockchain node on your laptop and let friends connect via the same WiFi
- **Duplicate detection** — The smart contract prevents the same document from being notarized twice
- **Ownership verification** — Anyone can verify who originally notarized a document

---

## 📁 Project Structure

```
cross-chain-document-notary/
├── contracts/
│   └── DocumentNotary.sol      ← Main smart contract
├── scripts/
│   └── deploy.js               ← Deployment script
├── test/
│   └── DocumentNotary.js       ← Full test suite (15 tests)
├── server.js                   ← LAN HTTP server for frontend
├── index.html                  ← Interactive UI
├── hardhat.config.js
└── package.json
```

---

## 🚀 Quick Start (Multi-User LAN Setup)

### Prerequisites
```bash
node -v    # LTS version required
npm -v
```
All devices need **MetaMask** (browser extension) installed.

### Step 1 — Install Dependencies
```bash
npm install
```

### Step 2 — Compile the Contract
```bash
npx hardhat compile
```

### Step 3 — Run Tests
```bash
npx hardhat test
```

### Step 4 — Start Blockchain Node on LAN (**Terminal 1**)
```bash
npm run node
```
> This starts the Hardhat node on `0.0.0.0:8545`, making it accessible to all devices on your WiFi/LAN.

### Step 5 — Deploy the Contract (**Terminal 2**)
```bash
npm run deploy:local
```
> Save the **contract address** from the output. The deploy script also prints shareable URLs.

### Step 6 — Serve Frontend on LAN (**Terminal 3**)
```bash
npm run serve
```
> This starts an HTTP server on port 3000, accessible at `http://YOUR_IP:3000`.

### Step 7 — Share with Friends!
1. Find your computer's IP address (shown in the `npm run serve` output)
2. Share this URL with friends on the same WiFi:
   ```
   http://192.168.x.x:3000?contract=0x_CONTRACT_ADDRESS_HERE
   ```
3. Each friend needs to:
   - Open the URL in a browser with **MetaMask**
   - Click **Connect** — MetaMask will auto-add the LAN network
   - Import one of the Hardhat test accounts (private keys shown in Terminal 1)

---

## 🔒 Duplicate Document Prevention

The smart contract enforces that **each document can only be notarized once**:

1. When a user uploads a file, its **SHA-256 hash** is computed in the browser
2. Before notarizing, the frontend checks if that hash already exists on-chain
3. If a duplicate is detected:
   - The user sees who originally uploaded it and when
   - The notarization is **denied** (both frontend-side and contract-side)
4. The contract's `require(documents[_docHash].timestamp == 0, "Document already notarized")` provides a hard guarantee

### What this means:
- ✅ User A uploads `report.pdf` → Notarized successfully
- ❌ User B uploads the same `report.pdf` → **Denied** with message showing User A as the original owner
- ✅ User B uploads a modified `report_v2.pdf` → Notarized (different hash)

---

## 🌐 How Friends Connect (MetaMask Setup)

When friends open the shared URL and click **Connect**, MetaMask will automatically:
1. Add a custom network called `DocNotary LAN (YOUR_IP)` 
2. Set the RPC URL to `http://YOUR_IP:8545`
3. Set Chain ID to `31337`

**To get test ETH for transactions**, friends should import one of the Hardhat accounts:
- Open MetaMask → Import Account → Paste a private key from the `npm run node` output
- Each Hardhat account starts with **10,000 ETH** (test currency, no real value)

---

## 📜 Smart Contract Features

| Function | Type | Description |
|---|---|---|
| `notarizeDocument(hash, metadata)` | Write | Register a document hash on-chain |
| `verifyDocument(hash)` | View | Get full document details |
| `isNotarized(hash)` | View | Quick boolean existence check |
| `revokeDocument(hash)` | Write | Owner-only permanent revocation |
| `transferOwnership(hash, newOwner)` | Write | Transfer document ownership |
| `getOwnerDocuments(address)` | View | List all docs by an address |

---

## 🌐 Cross-Chain Deployment

To deploy to testnets, add RPC URLs to `.env`:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
```

Then run:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🖥️ Frontend UI

Features:
- **Live blockchain connection** via ethers.js (auto-detects LAN IP)
- Drag-and-drop file hashing (SHA-256 in browser)
- **Duplicate detection** — warns immediately when a file was already notarized
- Notarize, verify, revoke, and transfer documents on-chain
- Real-time stats from the deployed contract
- Visual development flow guide
- Contract ABI reference

---

## 🏗️ Built With

- **Solidity ^0.8.28** — Smart contract language
- **Hardhat ^2.22.0** — Ethereum development environment
- **Ethers.js v6** — Blockchain interaction (frontend + scripts)
- **Mocha + Chai** — Testing framework
- **Vanilla HTML/CSS/JS** — Frontend (no framework needed)
- **Node.js HTTP Server** — LAN-accessible frontend serving
