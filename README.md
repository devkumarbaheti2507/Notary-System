# 🔏 Cross-Chain Document Notary System

A blockchain-based document notarization system built with **Solidity** and **Hardhat**, following the concepts taught in the workshop.

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
├── index.html                  ← Interactive UI (open in browser)
├── hardhat.config.js
└── package.json
```

---

## 🚀 Quick Start

### Step 0 — Prerequisites
```bash
node -v    # LTS version required
npm -v
```

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

### Step 4 — Start Local Blockchain (new terminal)
```bash
npx hardhat node
```

### Step 5 — Deploy to Local Network (another terminal)
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Step 6 — Open Frontend & Connect
1. Open `index.html` directly in your browser
2. Copy the deployed contract address from the deploy output
3. Paste it into the connection field and click **Connect**
4. The UI is now connected to the real blockchain — notarize, verify, revoke, and transfer documents!

### Step 7 — Interact via Console (optional)
```bash
npx hardhat console --network localhost
```
```javascript
const Notary = await ethers.getContractAt("DocumentNotary", "PASTE_ADDRESS_HERE")

// Notarize a document
const hash = ethers.keccak256(ethers.toUtf8Bytes("my_document.pdf"))
await Notary.notarizeDocument(hash, "My Important Document")

// Verify it
await Notary.verifyDocument(hash)

// Check ownership
await Notary.isNotarized(hash)
```

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

Then uncomment the networks in `hardhat.config.js` and run:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🖥️ Frontend UI

Open `index.html` directly in your browser. Features:
- **Live blockchain connection** via ethers.js (connects to Hardhat local node)
- Drag-and-drop file hashing (SHA-256 in browser)
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
