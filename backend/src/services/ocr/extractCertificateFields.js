function clean(value) {
  if (!value) return null;

  return value
    .replace(/\s+/g, " ")
    .replace(/[|]+/g, "")
    .trim();
}

function findLine(lines, patterns) {
  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);

      if (match?.[1]) {
        return clean(match[1]);
      }
    }
  }

  return null;
}

export function extractCertificateFields(ocrText) {
  const text = String(ocrText || "")
    .replace(/\r/g, "")
    .replace(/\\n/g, "\n");

  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const certificate = {
    userName: null,
    courseName: null,
    institutionName: null,
    certificateId: null,
    issuerName: null,
    studentId: null,
    duration: null,
    period: null,
    curriculumProvider: null
  };

  const completedIndex = lines.findIndex(line =>
    /has successfully completed/i.test(line)
  );

  if (
    completedIndex > 0 &&
    lines[completedIndex - 1]
  ) {
    certificate.userName = clean(
      lines[completedIndex - 1]
    );
  }

  const certifyIndex = lines.findIndex(line =>
    /this is to certify that/i.test(line)
  );

  if (
    !certificate.userName &&
    certifyIndex >= 0 &&
    lines[certifyIndex + 1]
  ) {
    certificate.userName = clean(
      lines[certifyIndex + 1]
    );
  }

  const onlineCourseIndex = lines.findIndex(line =>
    /successfully completed the online course/i.test(line)
  );

  if (
    onlineCourseIndex >= 0 &&
    lines[onlineCourseIndex + 1]
  ) {
    certificate.courseName = clean(
      lines[onlineCourseIndex + 1]
    );
  }

  if (!certificate.courseName) {
    const genAiLine = lines.find(line =>
      /GEN[-\s]?AI.*INTERNSHIP/i.test(line)
    );

    if (genAiLine) {
      certificate.courseName = clean(genAiLine);
    }
  }

  if (!certificate.courseName) {
    const internshipIndex = lines.findIndex(line =>
      /certificate of virtual internship/i.test(line)
    );

    if (
      internshipIndex >= 0 &&
      lines[internshipIndex + 1]
    ) {
      certificate.courseName = clean(
        lines[internshipIndex + 1]
      );
    }
  }

  certificate.certificateId = findLine(lines, [
    /certificate\s*(?:code|id|no|number)\s*[:\-]?\s*(.+)/i
  ]);

  certificate.studentId = findLine(lines, [
    /student\s*(?:id)\s*[:\-]?\s*(.+)/i
  ]);

  for (const line of lines) {
    if (
      /college/i.test(line) ||
      /university/i.test(line) ||
      /institute/i.test(line)
    ) {
      certificate.institutionName = clean(line);
      break;
    }
  }

  certificate.duration = findLine(lines, [
    /completed the\s*(.+?week.*?)$/i,
    /^(.+?\d+[-\s]?week.*)$/i
  ]);

  certificate.period = findLine(lines, [
    /during\s+(.+)/i
  ]);

  if (!certificate.period) {
    const periodLine = lines.find(line =>
      /(January|February|March|April|May|June|July|August|September|October|November|December).*(January|February|March|April|May|June|July|August|September|October|November|December)/i.test(
        line
      )
    );

    if (periodLine) {
      certificate.period = clean(periodLine);
    }
  }

  certificate.curriculumProvider = findLine(lines, [
    /curriculum\s+provided\s+by\s*[:\-]?\s*(.+)/i
  ]);

  const issuers = [];

  for (const line of lines) {
    if (/simplilearn/i.test(line)) {
      issuers.push("Simplilearn SkillUP");
    }

    if (/eduskills/i.test(line)) {
      issuers.push("EdusSkills");
    }

    if (/AICTE/i.test(line)) {
      issuers.push("AICTE");
    }
  }

  if (issuers.length) {
    certificate.issuerName = [
      ...new Set(issuers)
    ].join(" / ");
  }

  return certificate;
}