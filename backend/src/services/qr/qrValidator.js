export function validateQRUrl(qrData) {
  try {
    const url = new URL(qrData.trim());

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return {
        valid: false,
        reason: "Unsupported URL protocol"
      };
    }

    return {
      valid: true,
      protocol: url.protocol,
      hostname: url.hostname,
      path: url.pathname
    };
  } catch {
    return {
      valid: false,
      reason: "Invalid URL"
    };
  }
}