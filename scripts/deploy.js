const hre = require("hardhat");

async function main() {
  const [admin, user] = await hre.ethers.getSigners();

  const KYC = await hre.ethers.getContractFactory("KYCVerification");
  const contract = await KYC.deploy();
  await contract.waitForDeployment();

  console.log("KYC Contract deployed to:", await contract.getAddress());
  console.log("Admin address:", admin.address);
  console.log("User address:", user.address);

  // 🔐 Simulated KYC data (this would normally be user documents)
  const userKYCData = "Name: Simran | Aadhaar: 1234 | PAN: ABCD1234";
  const dataHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes(userKYCData));

  console.log("Generated KYC Hash:", dataHash);

  // User submits hash
  await contract.connect(user).submitKYC(dataHash);
  console.log("User submitted KYC hash");

  // Admin approves
  await contract.connect(admin).approveKYC(user.address);
  console.log("Admin approved KYC");

  // Check verification
  const status = await contract.isVerified(user.address);
  console.log("Is user verified?", status);

  // Fetch stored data
  const details = await contract.getKYCDetails(user.address);
  console.log("Stored On-Chain Data (Hash, Verified):", details);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
