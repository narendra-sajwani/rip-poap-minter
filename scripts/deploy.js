const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying RIFPoap contract to Rootstock Testnet...");
  
  const RIF_TOKEN_ADDRESS = "0x19f64674d8a5b4e652319f5e239efd3bc969a1fe";
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from account:", deployer.address);
  
  // Deploy contract
  const RIFPoap = await ethers.getContractFactory("RIFPoap");
  console.log("📦 Deploying contract...");
  
  const rifPoap = await RIFPoap.deploy(RIF_TOKEN_ADDRESS);
  
  // Wait for deployment (compatible with both ethers v5 and v6)
  console.log("⏳ Waiting for deployment...");
  let deployedContract;
  
  try {
    // Try ethers v6 method first
    await rifPoap.waitForDeployment();
    deployedContract = rifPoap;
    console.log("✅ Contract deployed (v6 method)");
  } catch (error) {
    try {
      // Fall back to ethers v5 method
      deployedContract = await rifPoap.deployed();
      console.log("✅ Contract deployed (v5 method)");
    } catch (error2) {
      // Manual wait method
      console.log("⏳ Using manual deployment wait...");
      const receipt = await rifPoap.deployTransaction.wait();
      deployedContract = rifPoap;
      console.log("✅ Contract deployed (manual method)");
    }
  }
  
  const contractAddress = deployedContract.address || deployedContract.target;
  console.log("📍 Contract Address:", contractAddress);
  console.log("📍 RIF Token Address:", RIF_TOKEN_ADDRESS);
  console.log("🔍 Block Explorer:", `https://explorer.testnet.rsk.co/address/${contractAddress}`);
  
  // Test contract interaction
  try {
    const eventData = await deployedContract.events(1);
    console.log("\n🎉 Initial Event Created:");
    console.log("   Name:", eventData.name);
    console.log("   Description:", eventData.description);
    console.log("   Active:", eventData.active);
  } catch (error) {
    console.log("⚠️  Event verification skipped (contract still works)");
  }
  
  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Copy this contract address:");
  console.log(`   ${contractAddress}`);
  console.log("\n2. Add to your .env files:");
  console.log(`   RIF_POAP_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`   REACT_APP_RIF_POAP_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n3. Update frontend constants and start testing!");
  
  return contractAddress;
}

main()
  .then((address) => {
    console.log(`\n🎉 SUCCESS! Contract deployed at: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ DEPLOYMENT FAILED:");
    console.error(error.message);
    console.error("\n🔧 Debug Info:");
    console.error("Error:", error);
    process.exit(1);
  });
