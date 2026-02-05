const hre = require("hardhat");

async function main() {
  const [admin, user] = await hre.ethers.getSigners();

  const KYC = await hre.ethers.getContractFactory("KYCVerification");
  const contract = await KYC.deploy();
  await contract.waitForDeployment();

  console.log("KYC Contract deployed to:", await contract.getAddress());
  console.log("Admin address:", admin.address);
  console.log("User address:", user.address);

  // User submits KYC
  await contract.connect(user).submitKYC("Simran", "QmFakeIPFSHash123");
  console.log("User submitted KYC");

  // Admin approves
  await contract.connect(admin).approveKYC(user.address);
  console.log("Admin approved KYC");

  // Check verification
  const status = await contract.isVerified(user.address);
  console.log("Is user verified?", status);

  // Fetch stored details
  const details = await contract.getKYCDetails(user.address);
  console.log("Stored KYC Data:", details);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
