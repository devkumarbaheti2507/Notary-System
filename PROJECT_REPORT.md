# Cross-Chain Document Notary System: Comprehensive Project Report

## 1. Introduction
The **Cross-Chain Document Notary System (DocNotary)** is a decentralized application (dApp) designed to securely and immutably record the existence, ownership, and timestamp of digital documents using blockchain technology. By leveraging smart contracts, the system provides a tamper-proof way to verify documents without relying on a central authority.

## 2. Problem Statement & Aim
### The Problem
In today's digital age, proving the authenticity, origin, and integrity of a document (such as a legal contract, intellectual property claim, or academic certificate) is challenging. Traditional notarization is slow, geographically restricted, and relies heavily on centralized human trust, which can be vulnerable to fraud, loss, or corruption.

### The Aim
The primary aim of DocNotary is to eliminate the need for centralized trust entities by utilizing the Ethereum Virtual Machine (EVM) architecture. The goal is to create a lightweight, accessible, and highly secure system where:
- Anyone can prove they possessed a specific document at a specific time.
- Documents can be verified instantly by third parties.
- Duplicate claims are programmatically prevented.
- The system remains decentralized and transparent.

## 3. What the System Does
DocNotary allows users to "notarize" a digital file. However, instead of uploading the actual file to the blockchain (which would be expensive and violate privacy), the system processes the file locally on the user's device to generate a **SHA-256 cryptographic hash**. 

This unique digital fingerprint is then sent to the blockchain via a smart contract along with metadata. The blockchain permanently records:
- The Document Hash (the digital fingerprint).
- The Owner's Wallet Address.
- The exact Timestamp of the block.
- Optional Metadata (like a filename or brief description).

Once recorded, the system provides functions to:
- **Verify:** Anyone with the original file can generate its hash and query the blockchain to verify its authenticity and original timestamp.
- **Transfer:** The current owner can transfer the ownership of the document record to another wallet.
- **Revoke:** The owner can mark a document as "revoked" if it is no longer valid, without deleting the historical record.

## 4. Key Technical Features
- **Zero-Knowledge Privacy:** The actual file contents never leave the user's computer. Only the cryptographic hash is exposed and stored on the blockchain.
- **Strict Duplicate Detection:** The smart contract ensures a document hash can only be registered once. If a user attempts to upload a duplicate, the transaction is rejected, preventing competing claims on the same document.
- **Revocation and Re-notarization:** Documents can be revoked by their owners. Once revoked, the system smartly allows the document to be re-notarized (creating a new active record while preserving the history of the revoked one).
- **Multi-User LAN Capabilities:** The development environment is optimized for local networks, allowing multiple users on the same WiFi to interact with the same local blockchain node, simulating a live public network environment.

## 5. How It Is Useful (Use Cases)
- **Intellectual Property Protection:** Writers, musicians, and inventors can notarize their early drafts or blueprints. The blockchain timestamp serves as indisputable proof of creation prior to a specific date.
- **Legal Contracts & Agreements:** Parties can notarize a signed digital PDF contract. In the future, if one party claims the contract was altered, the hash of the altered document will not match the blockchain record.
- **Academic Credentials:** Universities can notarize digital diplomas. Employers can verify the authenticity of a candidate's diploma by running it through the system.
- **Supply Chain & Invoicing:** Businesses can notarize invoices or bills of lading to prevent tampering and ensure all parties are referencing the exact same document version.

## 6. How It Can Be Used (Workflow)
1. **Upload & Hash:** A user drags and drops a file into the web interface. The browser calculates the SHA-256 hash.
2. **Pre-Check:** The UI quickly queries the blockchain to ensure the document hasn't already been notarized.
3. **Notarize:** The user signs a MetaMask transaction, paying a small gas fee to permanently store the hash and metadata on the blockchain.
4. **Share & Verify:** The user shares the file with a third party. The third party uploads the file to the "Verify" tab of the dApp. The system hashes the file, checks the blockchain, and confirms the document's validity, owner, and timestamp.

## 7. Technology Stack
- **Smart Contract:** Solidity (^0.8.28)
- **Development Environment:** Hardhat
- **Frontend Interaction:** Ethers.js v6
- **User Interface:** Vanilla HTML, CSS (Custom Design System), JavaScript
- **Local Server:** Node.js HTTP Server

## 8. Conclusion
The Cross-Chain Document Notary System successfully demonstrates the power of decentralized record-keeping. By abstracting the complexities of blockchain interaction behind a clean, responsive, and intuitive web interface, it provides a practical, real-world utility for document verification and intellectual property protection.
