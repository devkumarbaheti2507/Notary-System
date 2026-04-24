# 🚀 Online Deployment Guide (Free)

Follow this guide to deploy your Academic Notary Project online so anyone can use it.

## 1. Setup Wallet & Testnet Funds
You need a wallet (like MetaMask) and some "Fake" ETH to pay for transaction fees.
- **Network**: Use **Sepolia** (Ethereum Testnet) or **Amoy** (Polygon Testnet).
- **Faucets (Get Free ETH)**:
  - [Google Cloud Sepolia Faucet](https://cloud.google.com/application/faucets/ethereum/sepolia)
  - [Alchemy Sepolia Faucet](https://www.sepoliafaucet.io/)
  - [Polygon Amoy Faucet](https://faucet.polygon.technology/)

## 2. Prepare Environment Variables
1. Copy `.env.example` to a new file named `.env`.
2. Get an API Key from [Alchemy](https://www.alchemy.com/) (Free) and paste the RPC URL in `.env`.
3. Export your Private Key from MetaMask (Account Details -> Export Private Key) and paste it in `.env`.
   - **⚠️ WARNING**: Never share your `.env` file or Private Key!

## 3. Deploy the Smart Contract
Run the following command in your terminal:
```bash
# To deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# OR to deploy to Polygon Amoy
npx hardhat run scripts/deploy.js --network amoy
```
**Take note of the deployed contract address** printed in the terminal.

## 4. Host the Website (Frontend)
Since your project is a single `index.html` file, you can host it for free easily:

### Option A: GitHub Pages (Recommended)
1. Create a new GitHub repository.
2. Upload `index.html`.
3. Go to **Settings -> Pages**.
4. Select **Deploy from a branch** and choose `main`.
5. Your site will be live at `https://yourusername.github.io/your-repo-name/`.

### Option B: Vercel / Netlify
1. Drag and drop the folder containing `index.html` onto the [Vercel Dashboard](https://vercel.com/new).
2. It will give you a public URL instantly.

## 5. Share with Users
Once hosted, you can share the link with the contract address pre-filled:
`https://your-site.vercel.app/?contract=YOUR_CONTRACT_ADDRESS`

Now, when other users visit that link:
- They will see the same contract address.
- If they upload a document that has already been notarized, it will show **"Document already found on blockchain"**.
- All users on the same network using the same contract address will share the same data.
