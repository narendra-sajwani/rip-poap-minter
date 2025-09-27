const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying RIFPoap contract to Rootstock Testnet...");
  
  const RIF_TOKEN_ADDRESS = "0x19f64674d8a5b4e652319f5e239efd3bc969a1fe";
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const RIFPoap = await ethers.getContractFactory("RIFPoap");
  console.log("📦 Deploying contract...");
  
  const rifPoap = await RIFPoap.deploy(RIF_TOKEN_ADDRESS);
  await rifPoap.deployed();
  
  console.log("✅ RIF POAP Contract deployed!");
  console.log("📍 Contract address:", rifPoap.address);
  console.log("📍 RIF Token address:", RIF_TOKEN_ADDRESS);
  
  // Wait for confirmations
  console.log("⏳ Waiting for confirmations...");
  await rifPoap.deployTransaction.wait(2);
  
  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Add this to your .env file:");
  console.log(`   RIF_POAP_CONTRACT_ADDRESS=${rifPoap.address}`);
  console.log(`   REACT_APP_RIF_POAP_CONTRACT_ADDRESS=${rifPoap.address}`);
  
  return rifPoap.address;
}

main()
  .then((contractAddress) => {
    console.log(`\n✨ Deployment completed!`);
    console.log(`Contract: ${contractAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
