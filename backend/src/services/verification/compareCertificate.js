export function compareCertificateData(ocrData, qrData) {
  const fields = [
    "userName",
    "courseName",
    "institutionName",
    "certificateId",
    "issuerName"
  ];

  const comparison = {};

  for (const field of fields) {
    const ocrValue = normalizeValue(ocrData[field]);
    const qrValue = normalizeValue(qrData[field]);

    comparison[field] = {
      ocr: ocrData[field] ?? null,
      qr: qrData[field] ?? null,
      match: ocrValue !== null && qrValue !== null
        ? ocrValue === qrValue
        : null
    };
  }

  const availableMatches = fields
    .map(field => comparison[field].match)
    .filter(match => match !== null);

  const mismatches = availableMatches.filter(
    match => match === false
  ).length;

  let status;

  if (availableMatches.length === 0) {
    status = "UNVERIFIABLE";
  } else if (mismatches > 0) {
    status = "INVALID";
  } else {
    status = "VALID";
  }

  return {
    status,
    comparison
  };
}

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}