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
        string name;
        string documentHash; // IPFS or document hash
        bool verified;
    }

    mapping(address => KYCRequest) public kycRequests;

    function submitKYC(string memory _name, string memory _docHash) public {
        kycRequests[msg.sender] = KYCRequest({
            name: _name,
            documentHash: _docHash,
            verified: false
        });
    }

    function approveKYC(address user) public onlyAdmin {
        require(bytes(kycRequests[user].name).length > 0, "KYC not submitted");
        kycRequests[user].verified = true;
    }

    function isVerified(address user) public view returns (bool) {
        return kycRequests[user].verified;
    }

    function getKYCDetails(address user) public view returns (string memory, string memory, bool) {
        KYCRequest memory kyc = kycRequests[user];
        return (kyc.name, kyc.documentHash, kyc.verified);
    }
}
