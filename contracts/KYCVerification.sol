// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract KYCVerification {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    struct KYCRequest {
        bytes32 dataHash;   // cryptographic hash of KYC data
        bool verified;
    }

    mapping(address => KYCRequest) public kycRequests;

    // 🔔 Events (you forgot to declare these earlier)
    event KYCSubmitted(address indexed user, bytes32 dataHash);
    event KYCApproved(address indexed user);

    function submitKYC(bytes32 _dataHash) public {
        kycRequests[msg.sender] = KYCRequest({
            dataHash: _dataHash,
            verified: false
        });

        emit KYCSubmitted(msg.sender, _dataHash);
    }

    function approveKYC(address user) public onlyAdmin {
        require(kycRequests[user].dataHash != 0, "KYC not submitted");
        kycRequests[user].verified = true;

        emit KYCApproved(user);
    }

    function isVerified(address user) public view returns (bool) {
        return kycRequests[user].verified;
    }

    function getKYCDetails(address user) public view returns (bytes32, bool) {
        KYCRequest memory kyc = kycRequests[user];
        return (kyc.dataHash, kyc.verified);
    }
}
