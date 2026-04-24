const { ethers } = require("hardhat");

async function main() {
  const deployerAddress = "0xAd0496A45ecC3B3F10b506f383fac3fec54Ba7B2";
  console.log("Checking Sepolia network for deployments by:", deployerAddress);

  const provider = ethers.provider;
  const transactionCount = await provider.getTransactionCount(deployerAddress);
  console.log("Total transactions by deployer:", transactionCount);

  if (transactionCount === 0) {
    console.log("❌ ERROR: This wallet has never made a transaction on Sepolia!");
    console.log("   This means the deployment definitely failed.");
    return;
  }

  // Contract address is deterministic based on deployer + nonce
  // Usually the deployment is the first transaction, so nonce = 0
  const expectedContractAddress0 = ethers.getCreateAddress({ from: deployerAddress, nonce: 0 });
  const expectedContractAddress1 = ethers.getCreateAddress({ from: deployerAddress, nonce: 1 });
  
  console.log("Possible Contract Address (if nonce 0):", expectedContractAddress0);
  console.log("Possible Contract Address (if nonce 1):", expectedContractAddress1);

  const code0 = await provider.getCode(expectedContractAddress0);
  const code1 = await provider.getCode(expectedContractAddress1);

  if (code0 !== "0x") {
      console.log("✅ FOUND CONTRACT at:", expectedContractAddress0);
      try {
          const contract = await ethers.getContractAt("DocumentNotary", expectedContractAddress0);
          const totalDocs = await contract.totalDocuments();
          console.log("   Contract is live. Total documents:", totalDocs.toString());
      } catch (e) {
          console.log("   Error connecting to it:", e.message);
      }
  } else if (code1 !== "0x") {
      console.log("✅ FOUND CONTRACT at:", expectedContractAddress1);
  } else {
      console.log("❌ No contract found at the expected addresses. Did the deployment complete?");
  }
}

main().catch(console.error);
