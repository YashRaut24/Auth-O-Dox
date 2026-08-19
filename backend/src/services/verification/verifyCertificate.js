import { compareCertificateData } from "./compareCertificate.js";

export function verifyCertificate(ocrData, qrData) {
  if (!qrData) {
    return {
      status: "UNVERIFIABLE",
      reason: "QR verification data is not available"
    };
  }

  return compareCertificateData(
    ocrData,
    qrData
  );
}