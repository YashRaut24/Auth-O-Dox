import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CertificateRegistryModule = buildModule(
    "CertificateRegistryModule",
    (m) => {

        const issuerAddress = m.getParameter(
            "issuerAddress",
            "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
        );

        const certificateRegistry = m.contract(
            "CertificateRegistry",
            [issuerAddress]
        );

        return {
            certificateRegistry
        };
    }
);

export default CertificateRegistryModule;