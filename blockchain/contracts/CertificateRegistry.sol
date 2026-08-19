// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateRegistry is AccessControl {

    bytes32 public constant ISSUER_ROLE =
        keccak256("ISSUER_ROLE");

    struct Certificate {
        bool exists;
        address issuer;
        uint256 timestamp;
    }

    mapping(bytes32 => Certificate) private certificates;

    event CertificateRegistered(
        bytes32 indexed certificateHash,
        address indexed issuer,
        uint256 timestamp
    );

    constructor(address initialIssuer) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);

        if (initialIssuer != address(0)) {
            _grantRole(ISSUER_ROLE, initialIssuer);
        }
    }

    function registerCertificate(
        bytes32 certificateHash
    )
        external
        onlyRole(ISSUER_ROLE)
    {
        require(
            !certificates[certificateHash].exists,
            "Certificate already registered"
        );

        certificates[certificateHash] = Certificate({
            exists: true,
            issuer: msg.sender,
            timestamp: block.timestamp
        });

        emit CertificateRegistered(
            certificateHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyCertificate(
        bytes32 certificateHash
    )
        external
        view
        returns (
            bool exists,
            address issuer,
            uint256 timestamp
        )
    {
        Certificate memory certificate =
            certificates[certificateHash];

        return (
            certificate.exists,
            certificate.issuer,
            certificate.timestamp
        );
    }

    function addIssuer(
        address issuer
    )
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(ISSUER_ROLE, issuer);
    }

    function removeIssuer(
        address issuer
    )
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        revokeRole(ISSUER_ROLE, issuer);
    }
}