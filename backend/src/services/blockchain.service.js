import { ethers } from "ethers";
    import "dotenv/config"

const contractAbi = [ "function registerCertificate(bytes32 certificateHash) external",
        "function verifyCertificate(bytes32 certificateHash) external view returns (bool exists, address issuer, uint256 timestamp)", 
        "function hasRole(bytes32 role, address account) external view returns (bool)", 
        "function ISSUER_ROLE() external view returns (bytes32)"
     ];


function getContract() {
    const required = ["BLOCKCHAIN_RPC_URL", "ISSUER_PRIVATE_KEY", "CONTRACT_ADDRESS"];
    const missing = required.filter((name) => !process.env[name]);
    if (missing.length) throw new Error(`Missing blockchain configuration: ${missing.join(", ")}`);

    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.ISSUER_PRIVATE_KEY, provider);
    return { wallet, contract: new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, wallet) };
}

function toBytes32(certificateHash) {
    if (!/^[a-fA-F0-9]{64}$/.test(certificateHash)) throw new Error("Invalid SHA-256 certificate hash");
    return `0x${certificateHash}`;
}


export async function registerCertificate(
        certificateHash
    ) {

        const { wallet, contract } = getContract();
        const bytes32Hash = toBytes32(certificateHash);

        const issuerRole = await contract.ISSUER_ROLE(); 
        if (!await contract.hasRole(issuerRole, wallet.address)) {
            throw new Error(`Issuer wallet ${wallet.address} does not have ISSUER_ROLE`);
        }

        const transaction =
            await contract.registerCertificate(
                bytes32Hash
            );
        
        const receipt =
            await transaction.wait();

        if (!receipt || receipt.status !== 1) throw new Error("Certificate registration transaction failed");

        console.log("CertificateRegistry deployed to:", await contract.getAddress());    

        return {
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber
        };
    }

export async function verifyCertificateOnChain(certificateHash) {
    const { contract } = getContract();
    const [exists, issuer, timestamp] = await contract.verifyCertificate(toBytes32(certificateHash));
    return { exists, issuer, timestamp: Number(timestamp) };
}
