import { verifyCertificate } from "./verifyCertificate.js";
const ocrData = {
  userName: "YASH RAUT",
  courseName: "Networking fundamentals for beginners",
  institutionName: null,
  certificateId: "9ab92ac2",
  issuerName: "Mind Luster"
};

const qrData = null;

console.log(
  JSON.stringify(
    verifyCertificate(ocrData, qrData),
    null,
    2
  )
);