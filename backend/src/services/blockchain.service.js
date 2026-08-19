    import { ethers } from "ethers";
    import "dotenv/config"

    const provider =
        new ethers.JsonRpcProvider(
            process.env.BLOCKCHAIN_RPC_URL
        );

    const wallet =
        new ethers.Wallet(
            process.env.ISSUER_PRIVATE_KEY,
            provider
        );

    const contractAbi = [ "function registerCertificate(bytes32 certificateHash) external",
        "function verifyCertificate(bytes32 certificateHash) external view returns (bool exists, address issuer, uint256 timestamp)", 
        "function hasRole(bytes32 role, address account) external view returns (bool)", 
        "function ISSUER_ROLE() external view returns (bytes32)",
        "function DEFAULT_ADMIN_ROLE() external view returns (bytes32)"
     ];


    const contract =
        new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            contractAbi,
            wallet
        );

    const adminRole = await contract.DEFAULT_ADMIN_ROLE();

    const isAdmin = await contract.hasRole(
        adminRole,
        wallet.address
    );

    console.log("Backend wallet:", wallet.address);
    console.log("Is admin:", isAdmin);


    export async function registerCertificate(
        certificateHash
    ) {

        const bytes32Hash =
            "0x" + certificateHash;

        const transaction =
            await contract.registerCertificate(
                bytes32Hash
            );
        
        const issuerRole = await contract.ISSUER_ROLE(); 
        // Check whether our wallet has ISSUER_ROLE 
        const hasRole = await contract.hasRole( issuerRole, wallet.address );
        console.log( "Issuer wallet:", wallet.address );

        const receipt =
            await transaction.wait();

        return {
            transactionHash: receipt.hash
        };
    }