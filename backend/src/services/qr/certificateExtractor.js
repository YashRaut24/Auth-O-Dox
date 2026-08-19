import * as cheerio from "cheerio";

function extractJsonLd($) {
  const data = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const json = JSON.parse($(element).text());
      data.push(json);
    } catch {
      return;
    }
  });

  return data;
}

function extractIssuerFromJsonLd(jsonLd) {
  for (const item of jsonLd) {
    if (!item || typeof item !== "object") continue;

    if (
      item["@type"] === "Organization" &&
      typeof item.name === "string"
    ) {
      return item.name.trim();
    }
  }

  return null;
}

function extractUserName({ description, ogDescription }) {
  if (description) {
    return description;
  }

  if (ogDescription) {
    return ogDescription;
  }

  return null;
}

function extractCourseName(ogTitle, title, userName, issuerName) {
  const candidates = [ogTitle, title];

  for (const value of candidates) {
    if (!value) continue;

    let course = value;

    if (issuerName) {
      course = course.replace(
        new RegExp(`^${issuerName}\\s*-\\s*`, "i"),
        ""
      );
    }

    if (userName) {
      course = course.replace(
        new RegExp(`^${userName}\\s*-\\s*`, "i"),
        ""
      );
    }

    if (course !== value && course.trim()) {
      return course.trim();
    }
  }

  return null;
}

function extractInstitutionName(jsonLd) {
  for (const item of jsonLd) {
    if (!item || typeof item !== "object") continue;

    if (
      item["@type"] === "EducationalOrganization" &&
      typeof item.name === "string"
    ) {
      return item.name.trim();
    }
  }

  for (const item of jsonLd) {
    if (!item || typeof item !== "object") continue;

    if (
      item["@type"] === "CollegeOrUniversity" &&
      typeof item.name === "string"
    ) {
      return item.name.trim();
    }
  }

  return null;
}

function extractCertificateId(verificationUrl) {
  try {
    const url = new URL(verificationUrl);

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

export function extractCertificateData(html, verificationUrl) {
  const $ = cheerio.load(html);

  const pageText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const title = $("title")
    .text()
    .trim();

  const description =
    $('meta[name="description"]')
      .attr("content")
      ?.trim() || null;

  const ogTitle =
    $('meta[property="og:title"]')
      .attr("content")
      ?.trim() || null;

  const ogDescription =
    $('meta[property="og:description"]')
      .attr("content")
      ?.trim() || null;

  const ogImage =
    $('meta[property="og:image"]')
      .attr("content")
      ?.trim() || null;

  const jsonLd = extractJsonLd($);

  const issuerName =
    extractIssuerFromJsonLd(jsonLd);

  const userName =
    extractUserName({
      description,
      ogDescription
    });

    const courseName = extractCourseName(
    ogTitle,
    title,
    userName,
    issuerName
    );

  const institutionName =
    extractInstitutionName(jsonLd);

  const certificateId =
    extractCertificateId(
      verificationUrl
    );

  return {
    userName,
    courseName,
    institutionName,
    certificateId,
    issuerName,

    metadata: {
      title,
      description,
      ogTitle,
      ogDescription,
      ogImage
    },

    jsonLd
  };
}