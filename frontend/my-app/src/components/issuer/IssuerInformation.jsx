import { Link, useNavigate } from "react-router-dom";
import { clearIssuerSession, getStoredIssuer } from "../../services/issuer/issuerAuth";
import "./IssuerDashboard.css";

function IssuerInformation() {
    const issuer = getStoredIssuer();
    const navigate = useNavigate();

    function handleLogout() {
        clearIssuerSession();
        navigate("/issuer/login", { replace: true });
    }

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
                    <Link to="/issuer/certificates">Issued Certificates</Link>
                    <Link className="active" to="/issuer/information">Issuer Information</Link>
                </nav>

                <div className="issuer-page-heading">
                    <span className="issuer-section-label">AUTHORIZED PROFILE</span>
                    <h1>Issuer Information</h1>
                    <p>Details for the institution authorized to register certificates.</p>
                </div>

                <dl className="issuer-information-panel">
                    <div><dt>Institution</dt><dd>{issuer?.institutionName || "Not available"}</dd></div>
                    <div><dt>Issuer name</dt><dd>{issuer?.issuerName || "Not available"}</dd></div>
                    <div><dt>Email</dt><dd>{issuer?.email || "Not available"}</dd></div>
                    <div><dt>Role</dt><dd>{issuer?.role || "issuer"}</dd></div>
                    <div><dt>Account status</dt><dd className="issuer-certificate-status">Active</dd></div>
                </dl>
            </section>
        </main>
    );
}

export default IssuerInformation;
