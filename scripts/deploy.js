const hre = require("hardhat");

async function main() {
  console.log("\n🔗  Cross-Chain Document Notary System");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Get deployer info
  const [deployer] = await hre.ethers.getSigners();
  console.log("📦  Deployer address :", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰  Deployer balance  :", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy
  console.log("🚀  Deploying DocumentNotary...");
  const NotaryFactory = await hre.ethers.getContractFactory("DocumentNotary");
  const notary = await NotaryFactory.deploy();
  await notary.waitForDeployment();

  const address = await notary.getAddress();
  console.log("✅  Contract deployed to:", address);

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐  Network            :", network.name, `(chainId: ${network.chainId})`);

  // Quick smoke-test: notarize a sample document
  console.log("\n📝  Demo: notarizing a sample document...");
  const sampleHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("demo_document_2026.pdf"));
  const tx = await notary.notarizeDocument(sampleHash, "Demo Document - 2026");
  await tx.wait();
  console.log("   Document hash  :", sampleHash);
  console.log("   Tx hash        :", tx.hash);

  // Verify it
  const [owner, timestamp, metadata, isRevoked, chainId] = await notary.verifyDocument(sampleHash);
  console.log("\n🔍  Verification result:");
  console.log("   Owner     :", owner);
  console.log("   Timestamp :", new Date(Number(timestamp) * 1000).toISOString());
  console.log("   Metadata  :", metadata);
  console.log("   Revoked   :", isRevoked);
  console.log("   Chain ID  :", Number(chainId));

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉  Deployment complete!\n");
  console.log("   Save this contract address:");
  console.log("   ", address);
  console.log("\n   To interact via console:");
  console.log('   npx hardhat console --network localhost');
  console.log('   > const n = await ethers.getContractAt("DocumentNotary", "' + address + '")');
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((error) => {
  console.error("❌  Deployment failed:", error);
  process.exitCode = 1;
});
