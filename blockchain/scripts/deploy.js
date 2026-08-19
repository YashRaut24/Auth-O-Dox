const CertificateRegistry =
    await ethers.getContractFactory("CertificateRegistry");

const certificateRegistry =
    await CertificateRegistry.deploy();

await certificateRegistry.waitForDeployment();

console.log(
    "Contract:",
    await certificateRegistry.getAddress()
);