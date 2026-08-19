import { network } from "hardhat";

const { ethers } = await network.connect();

const [deployer] = await ethers.getSigners();

const CertificateRegistry =
    await ethers.getContractFactory("CertificateRegistry");

const certificateRegistry =
    await CertificateRegistry.deploy(deployer.address);

await certificateRegistry.waitForDeployment();

console.log(
    "Contract:",
    await certificateRegistry.getAddress()
);

console.log(
    "Issuer:",
    deployer.address
);