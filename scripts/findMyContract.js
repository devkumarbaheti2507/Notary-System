const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  let log = "";
  try {
    const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/I7-3CRJgWy1yz4xpkdKI1");
    const deployer = "0xAd0496A45ecC3B3F10b506f383fac3fec54Ba7B2";
    
    log += `Checking Sepolia for deployer: ${deployer}\n`;
    const nonce = await provider.getTransactionCount(deployer);
    log += `Deployer has ${nonce} transactions on Sepolia.\n`;

    if (nonce === 0) {
      log += "ERROR: Deployer has 0 transactions. Meaning NOTHING was deployed!\n";
    }

    // Check recent nonces to find the contract
    for (let i = Math.max(0, nonce - 10); i <= nonce; i++) {
      const addr = ethers.getCreateAddress({ from: deployer, nonce: i });
      const code = await provider.getCode(addr);
      
      if (code !== "0x") {
        log += `FOUND CONTRACT AT NONCE ${i}: ${addr}\n`;
        // Double check if it's our Notary by calling totalDocuments
        const contract = new ethers.Contract(addr, ["function totalDocuments() view returns (uint256)", "function isNotarized(bytes32) view returns(bool)"], provider);
        try {
          const total = await contract.totalDocuments();
          log += `   SUCCESS! It is our Notary. Total docs: ${total.toString()}\n`;
        } catch(e) {
          log += `   Failed to call totalDocuments: ${e.message}\n`;
        }
      }
    }
  } catch (err) {
    log += `Script Error: ${err.message}\n`;
  }
  
  fs.writeFileSync("output.txt", log);
}

main();
