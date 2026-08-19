import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearIssuerSession, getIssuerToken, issuerApiUrl } from "../../services/issuer/issuerAuth";
import "./IssuerDashboard.css";

function IssuedCertificates() {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    function handleLogout() {
        clearIssuerSession();
        navigate("/issuer/login", { replace: true });
    }

    useEffect(() => {
        async function loadCertificates() {
            try {
                const response = await fetch(issuerApiUrl("/api/certificates/issued"), {
                    headers: { Authorization: `Bearer ${getIssuerToken()}` }
                });
                const data = await response.json();

                if (response.status === 401) {
                    clearIssuerSession();
                    navigate("/issuer/login", { replace: true });
                    return;
                }

                if (!response.ok) throw new Error("Unable to load issued certificates.");
                setCertificates(data.certificates || []);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadCertificates();
    }, [navigate]);

    return (
        <main className="issuer-dashboard-page">
            <header className="issuer-dashboard-header">
                <div>
                    <div className="issuer-dashboard-brand">AUTH-O-DOX</div>
                    <p>Issuer Portal</p>
                </div>
                <button className="issuer-logout-button" onClick={handleLogout}>Sign out</button>
            </header>

            <section className="issuer-dashboard-content">
                <nav className="issuer-dashboard-nav issuer-page-nav" aria-label="Issuer navigation">
                    <Link to="/issuer/issue">Issue Certificate</Link>
                    <Link className="active" to="/issuer/certificates">Issued Certificates</Link>
                    <Link to="/issuer/information">Issuer Information</Link>
                </nav>

                <div className="issuer-page-heading">
                    <span className="issuer-section-label">REGISTRATION HISTORY</span>
                    <h1>Issued Certificates</h1>
                    <p>Certificates registered through the Auth-O-Dox issuance service.</p>
                </div>

                {isLoading && <p className="issuer-muted-message">Loading issued certificates...</p>}
                {error && <p className="issue-form-error">{error}</p>}
                {!isLoading && !error && certificates.length === 0 && (
                    <div className="issuer-empty-panel">No certificates have been issued yet.</div>
                )}
                {!isLoading && !error && certificates.length > 0 && (
                    <div className="issuer-table-wrapper">
                        <table className="issuer-certificates-table">
                            <thead>
                                <tr><th>Student</th><th>Certificate ID</th><th>Issued</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {certificates.map((certificate) => (
                                    <tr key={certificate._id}>
                                        <td>{certificate.studentName}</td>
                                        <td>{certificate.certificateId}</td>
                                        <td>{new Date(certificate.createdAt).toLocaleDateString()}</td>
                                        <td><span className="issuer-certificate-status">{certificate.blockchainVerified ? "Registered" : "Pending"}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default IssuedCertificates;
