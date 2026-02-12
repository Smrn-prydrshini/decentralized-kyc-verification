require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ====== BLOCKCHAIN CONNECTION ======
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use PRIVATE KEY of Hardhat account #0 (admin)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract details
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require("../artifacts/contracts/KYCVerification.sol/KYCVerification.json").abi;

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// ====== ROUTES ======

// Health check
app.get("/", (req, res) => {
  res.send("KYC Backend Running");
});

// Submit KYC
app.post("/submit-kyc", async (req, res) => {
  try {
    const { name, idNumber, walletAddress } = req.body;

    // Create hash from KYC data
    const dataHash = ethers.keccak256(
      ethers.toUtf8Bytes(name + idNumber)
    );

    // Send hash to blockchain
    const tx = await contract.submitKYC(dataHash);
    await tx.wait();

    res.json({
      message: "KYC submitted to blockchain",
      hash: dataHash,
      txHash: tx.hash
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed" });
  }
});

// Approve KYC (admin)
app.post("/approve-kyc", async (req, res) => {
  try {
    const { userAddress } = req.body;

    const tx = await contract.approveKYC(userAddress);
    await tx.wait();

    res.json({ message: "KYC approved", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Approval failed" });
  }
});

// Check verification
app.get("/status/:address", async (req, res) => {
  try {
    const status = await contract.isVerified(req.params.address);
    res.json({ verified: status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Status check failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
