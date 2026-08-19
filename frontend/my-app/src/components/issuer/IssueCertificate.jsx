import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearIssuerSession, getIssuerToken, getStoredIssuer, issuerApiUrl } from "../../services/issuer/issuerAuth";
import "./IssueCertificate.css";

function IssueCertificate() {
    const navigate = useNavigate();
    const issuer = getStoredIssuer();
    const [studentName, setStudentName] = useState("");
    const [certificateId, setCertificateId] = useState("");
    const [certificateFile, setCertificateFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function handleLogout() {
        clearIssuerSession();
        navigate("/issuer/login", { replace: true });
    }

    function messageForStatus(status) {
        if (status === 401) return "Your issuer session has expired. Please sign in again.";
        if (status === 403) return "You are not authorized to issue certificates.";
        if (status === 400) return "Please check the certificate information and try again.";
        if (status === 409) return "This certificate ID or certificate file has already been registered.";
        if (status >= 500) return "Certificate issuance could not be completed. Please try again.";
        return "Please check the certificate information and try again.";
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setResult(null);
        setIsLoading(true);

        const formData = new FormData();
        formData.append("studentName", studentName);
        formData.append("certificateId", certificateId);
        formData.append("certificate", certificateFile);

        try {
            const response = await fetch(issuerApiUrl("/api/certificates/issue"), {
                method: "POST",
                headers: { Authorization: `Bearer ${getIssuerToken()}` },
                body: formData
            });
            const data = await response.json();

            if (response.status === 401) {
                clearIssuerSession();
                navigate("/issuer/login", { replace: true });
                return;
            }

            if (!response.ok) throw new Error(messageForStatus(response.status));
            setResult(data);
        } catch (requestError) {
            setError(requestError.message || "Certificate issuance could not be completed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    function resetForm() {
        setStudentName("");
        setCertificateId("");
        setCertificateFile(null);
        setResult(null);
        setError("");
        document.getElementById("certificate-file").value = "";
    }

    const certificate = result?.certificate || {};

    return (
        <main className="issue-certificate-page">
            <header className="issue-certificate-header">
                <div>
                    <div className="issuer-dashboard-brand">AUTH-O-DOX</div>
                    <p>Issuer Portal</p>
                </div>
                <div className="issue-header-actions">
                    <Link to="/issuer/dashboard">Dashboard</Link>
                    <button className="issuer-logout-button" onClick={handleLogout}>Log out</button>
                </div>
            </header>

            <section className="issue-certificate-content">
                {!result ? (
                    <>
                        <div className="issue-heading">
                            <span className="issuer-section-label">CERTIFICATE REGISTRATION</span>
                            <h1>Issue Certificate</h1>
                            <p>Create and register an authenticated certificate for a student.</p>
                        </div>

                        <form className="issue-form" onSubmit={handleSubmit}>
                            <label>
                                Student Name
                                <input value={studentName} onChange={(event) => setStudentName(event.target.value)} required />
                            </label>
                            <label>
                                Certificate ID
                                <input value={certificateId} onChange={(event) => setCertificateId(event.target.value)} required />
                            </label>
                            <label>
                                Certificate File
                                <input
                                    id="certificate-file"
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                    onChange={(event) => setCertificateFile(event.target.files[0] || null)}
                                    required
                                />
                                <span className="issue-file-help">Accepted formats: PDF, PNG, JPG, JPEG</span>
                            </label>

                            {error && <p className="issue-form-error">{error}</p>}
                            <button className="issuer-primary-button" type="submit" disabled={isLoading || !certificateFile}>
                                {isLoading ? "Registering certificate..." : "Issue Certificate"}
                            </button>
                        </form>
                    </>
                ) : (
                    <section className="issue-success-panel">
                        <div className="issue-success-icon">✓</div>
                        <span className="issuer-section-label">ISSUANCE COMPLETE</span>
                        <h1>Certificate Issued Successfully</h1>
                        <p className="issue-success-status">Certificate registered</p>
                        <dl className="issue-summary">
                            <div><dt>Student</dt><dd>{studentName}</dd></div>
                            <div><dt>Certificate ID</dt><dd>{certificateId}</dd></div>
                            <div><dt>Issuer</dt><dd>{issuer?.institutionName || "Authorized institution"}</dd></div>
                            <div><dt>Status</dt><dd>Blockchain registration completed</dd></div>
                        </dl>
                        {(certificate.transactionHash || certificate.certificateHash) && (
                            <details className="verification-details">
                                <summary>Verification Details</summary>
                                {certificate.transactionHash && <p><strong>Transaction hash:</strong> {certificate.transactionHash}</p>}
                                {certificate.certificateHash && <p><strong>Certificate hash:</strong> {certificate.certificateHash}</p>}
                            </details>
                        )}
                        <button className="issuer-primary-button" onClick={resetForm}>Issue Another Certificate</button>
                    </section>
                )}
            </section>
        </main>
    );
}

export default IssueCertificate;
