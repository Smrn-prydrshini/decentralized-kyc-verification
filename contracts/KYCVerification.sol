// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KYCVerification {

    address public admin;

    struct KYCRecord {
        string kycHash;
        bool isVerified;
    }

    mapping(address => KYCRecord) private kycRecords;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function storeKYC(address user, string memory _kycHash) public onlyAdmin {
        kycRecords[user] = KYCRecord(_kycHash, true);
    }

    function verifyKYC(address user, string memory _kycHash) public view returns (bool) {
        return (
            keccak256(bytes(kycRecords[user].kycHash)) == keccak256(bytes(_kycHash)) &&
            kycRecords[user].isVerified
        );
    }
}
