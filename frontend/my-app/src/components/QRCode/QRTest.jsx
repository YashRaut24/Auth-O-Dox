import { useState } from "react";
import "./QRTest.css";

function QRTest() {
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setResult(null);
    setError("");
    setIsLoading(true);

    const formData = new FormData();

    formData.append("certificate", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/verify",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to process the certificate."
        );
      }

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to verify the certificate. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const certificate = result?.certificateData || {};
  const ocrDetected = result?.ocr?.detected === true;
  const qrDetected = result?.qr?.detected === true;
  const qrValid =
    result?.qr?.validation?.valid === true;
  const issuerFound = Boolean(result?.issuer);

  const backendStatus =
    result?.verification?.status;

  const getStatus = () => {
    if (backendStatus === "VALID") {
      return "verified";
    }

    if (backendStatus === "INVALID") {
      return "invalid";
    }

    if (backendStatus === "UNVERIFIABLE") {
      return "unknown";
    }

    return "unknown";
  };

  const status = getStatus();

  const getStatusContent = () => {
    if (status === "verified") {
      return {
        icon: "✓",
        label: "VERIFICATION RESULT",
        title: "Certificate Verified",
        description:
          "The certificate information matches the available information provided by the issuing organization.",
      };
    }

    if (status === "invalid") {
      return {
        icon: "!",
        label: "VERIFICATION RESULT",
        title: "Certificate Needs Attention",
        description:
          "Some information on this certificate does not match the available issuer information.",
      };
    }

    if (!qrDetected) {
      return {
        icon: "i",
        label: "CERTIFICATE REVIEW",
        title: "Certificate Information Extracted",
        description:
          "We successfully read the certificate, but no QR-based verification information was found.",
      };
    }

    if (qrDetected && !qrValid) {
      return {
        icon: "!",
        label: "CERTIFICATE REVIEW",
        title: "Verification Link Could Not Be Used",
        description:
          "A QR code was found, but its verification address could not be validated.",
      };
    }

    return {
      icon: "i",
      label: "CERTIFICATE REVIEW",
      title: "Certificate Processed",
      description:
        "The certificate was successfully read. Additional information is required to complete verification.",
    };
  };

  const statusContent = getStatusContent();

  const renderField = (
    label,
    value
  ) => {
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      return null;
    }

    return (
      <div className="certificate-field">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    );
  };

  return (
    <div className="qr-verification">

      <div className="qr-verification-header">
        <div className="qr-security-icon">
          <span></span>
        </div>

        <div>
          <h2>Certificate Verification</h2>

          <p>
            Upload a certificate to check its
            authenticity and available verification information.
          </p>
        </div>
      </div>

      {!result && !isLoading && (
        <div className="qr-upload-area">

          <div className="qr-upload-icon">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="7"
                y="7"
                width="14"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="2.5"
              />

              <rect
                x="27"
                y="7"
                width="14"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="2.5"
              />

              <rect
                x="7"
                y="27"
                width="14"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="2.5"
              />

              <path
                d="M29 29H35V35H29M35 35H41V41H35M29 35V41"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="qr-upload-content">
            <h3>
              Upload certificate
            </h3>

            <p>
              Upload a PDF, PNG or JPG certificate.
              Auth-O-Dox will read the certificate
              and look for available verification information.
            </p>

            <span className="qr-file-types">
              PDF, PNG and JPG supported
            </span>
          </div>

          <label className="qr-upload-button">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />

            Choose Certificate
          </label>
        </div>
      )}

      {fileName && (
        <div className="qr-selected-file">

          <div className="selected-file-icon">
            {fileName
              .toLowerCase()
              .endsWith(".pdf")
              ? "PDF"
              : "IMG"}
          </div>

          <div className="selected-file-info">
            <strong>
              {fileName}
            </strong>

            <span>
              {isLoading
                ? "Analyzing certificate..."
                : "Certificate processed"}
            </span>
          </div>

          {isLoading && (
            <div className="verification-loader"></div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="qr-processing">

          <div className="processing-line"></div>

          <div className="processing-steps">

            <span className="active">
              Reading certificate
            </span>

            <span>
              Looking for QR code
            </span>

            <span>
              Checking available information
            </span>

          </div>
        </div>
      )}

      {error && (
        <div className="qr-error">

          <div className="qr-error-icon">
            !
          </div>

          <div>
            <strong>
              We couldn't process this certificate
            </strong>

            <p>
              {error}
            </p>
          </div>

        </div>
      )}

      {result && !isLoading && (
        <div
          className={`qr-result ${status}`}
        >

          <div className="result-header">

            <div
              className={`result-status-icon ${status}`}
            >
              {statusContent.icon}
            </div>

            <div className="result-title">

              <span className="result-label">
                {statusContent.label}
              </span>

              <h3>
                {statusContent.title}
              </h3>

              <p>
                {statusContent.description}
              </p>

            </div>

          </div>

          <div className="result-divider"></div>

          <section className="analysis-section">

            <span className="section-title">
              DOCUMENT CHECK
            </span>

            <div className="analysis-grid">

              <div className="analysis-card">

                <div className="analysis-card-icon">
                  T
                </div>

                <div>
                  <span>
                    CERTIFICATE INFORMATION
                  </span>

                  <strong>
                    {ocrDetected
                      ? "Found"
                      : "Not available"}
                  </strong>
                </div>

              </div>

              <div className="analysis-card">

                <div className="analysis-card-icon">
                  QR
                </div>

                <div>
                  <span>
                    QR CODE
                  </span>

                  <strong>
                    {qrDetected
                      ? "Found"
                      : "Not found"}
                  </strong>
                </div>

              </div>

              <div className="analysis-card">

                <div className="analysis-card-icon">
                  ✓
                </div>

                <div>
                  <span>
                    DOCUMENT
                  </span>

                  <strong>
                    Processed
                  </strong>
                </div>

              </div>

            </div>
          </section>

          <section className="certificate-section">

            <span className="section-title">
              CERTIFICATE DETAILS
            </span>

            <div className="certificate-fields">

              {renderField(
                "Certificate Holder",
                certificate.userName
              )}

              {renderField(
                "Course / Program",
                certificate.courseName
              )}

              {renderField(
                "Institution",
                certificate.institutionName
              )}

              {renderField(
                "Issued By",
                certificate.issuerName
              )}

              {renderField(
                "Certificate ID",
                certificate.certificateId
              )}

              {renderField(
                "Student ID",
                certificate.studentId
              )}

              {renderField(
                "Duration",
                certificate.duration
              )}

              {renderField(
                "Period",
                certificate.period
              )}

              {renderField(
                "Curriculum Provider",
                certificate.curriculumProvider
              )}

            </div>
          </section>

          <section className="checks-section">

            <span className="section-title">
              WHAT WE CHECKED
            </span>

            <div className="checks-list">

              <div className="check-row">

                <div className="check-left">

                  <span
                    className={
                      ocrDetected
                        ? "check-icon success"
                        : "check-icon warning"
                    }
                  >
                    {ocrDetected
                      ? "✓"
                      : "!"}
                  </span>

                  <div>
                    <strong>
                      Certificate information
                    </strong>

                    <span>
                      Information was read from your document
                    </span>
                  </div>

                </div>

                <b>
                  {ocrDetected
                    ? "Found"
                    : "Unavailable"}
                </b>

              </div>

              <div className="check-row">

                <div className="check-left">

                  <span
                    className={
                      qrDetected
                        ? "check-icon success"
                        : "check-icon warning"
                    }
                  >
                    {qrDetected
                      ? "✓"
                      : "!"}
                  </span>

                  <div>
                    <strong>
                      QR code
                    </strong>

                    <span>
                      Verification code on the certificate
                    </span>
                  </div>

                </div>

                <b>
                  {qrDetected
                    ? "Found"
                    : "Not found"}
                </b>

              </div>

              {qrDetected && (
                <div className="check-row">

                  <div className="check-left">

                    <span
                      className={
                        qrValid
                          ? "check-icon success"
                          : "check-icon warning"
                      }
                    >
                      {qrValid
                        ? "✓"
                        : "!"}
                    </span>

                    <div>
                      <strong>
                        Verification address
                      </strong>

                      <span>
                        The QR destination was checked
                      </span>
                    </div>

                  </div>

                  <b>
                    {qrValid
                      ? "Available"
                      : "Could not verify"}
                  </b>

                </div>
              )}

              {issuerFound && (
                <div className="check-row">

                  <div className="check-left">

                    <span className="check-icon success">
                      ✓
                    </span>

                    <div>
                      <strong>
                        Issuing organization
                      </strong>

                      <span>
                        Information was retrieved from the issuer
                      </span>
                    </div>

                  </div>

                  <b>
                    Retrieved
                  </b>

                </div>
              )}

            </div>
          </section>

          {status === "verified" && (
            <div className="final-status valid">

              <div className="final-status-icon">
                ✓
              </div>

              <div>
                <strong>
                  Certificate verified
                </strong>

                <p>
                  The available certificate information
                  matches the information provided by the issuer.
                </p>
              </div>

            </div>
          )}

          {status === "invalid" && (
            <div className="final-status invalid">

              <div className="final-status-icon">
                !
              </div>

              <div>
                <strong>
                  Certificate needs attention
                </strong>

                <p>
                  Some information did not match
                  the available issuer information.
                </p>
              </div>

            </div>
          )}

          {status === "unknown" && !qrDetected && (
            <div className="final-status unverifiable">

              <div className="final-status-icon">
                i
              </div>

              <div>
                <strong>
                  More verification information is needed
                </strong>

                <p>
                  We could read the certificate,
                  but this document does not provide
                  a QR-based verification link.
                </p>
              </div>

            </div>
          )}

          {status === "unknown" &&
            qrDetected &&
            !qrValid && (
              <div className="final-status invalid">

                <div className="final-status-icon">
                  !
                </div>

                <div>
                  <strong>
                    Verification could not be completed
                  </strong>

                  <p>
                    A QR code was found, but its
                    verification address could not be used.
                  </p>
                </div>

              </div>
            )}

          {status === "unknown" &&
            qrDetected &&
            qrValid &&
            !issuerFound && (
              <div className="final-status unverifiable">

                <div className="final-status-icon">
                  i
                </div>

                <div>
                  <strong>
                    Certificate information found
                  </strong>

                  <p>
                    The QR code was found, but issuer
                    information could not be retrieved.
                  </p>
                </div>

              </div>
            )}

          {qrDetected && (
            <details className="verification-source">

              <summary>
                View verification source
              </summary>

              <div className="source-box">

                <span>
                  Verification address
                </span>

                <p>
                  {result.qr.data}
                </p>

              </div>

            </details>
          )}

        </div>
      )}

      <div className="qr-trust-note">

        <span className="trust-lock">
          ✓
        </span>

        <p>
          Your certificate is processed securely.
          The uploaded document is used only for verification.
        </p>

      </div>

    </div>
  );
}

export default QRTest;