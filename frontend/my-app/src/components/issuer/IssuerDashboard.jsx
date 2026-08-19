import { Link, useNavigate } from "react-router-dom";
import { clearIssuerSession, getStoredIssuer } from "../../services/issuer/issuerAuth";
import "./IssuerDashboard.css";

function IssuerDashboard() {
    const navigate = useNavigate();
    const issuer = getStoredIssuer();

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
                <button className="issuer-logout-button" onClick={handleLogout}>Log out</button>
            </header>

            <section className="issuer-dashboard-content">
                <div className="issuer-dashboard-intro">
                    <div>
                        <span className="issuer-section-label">AUTHORIZED ISSUER</span>
                        <h1>{issuer?.institutionName || "Issuer institution"}</h1>
                        <p>{issuer?.issuerName || "Authorized Certificate Officer"}</p>
                    </div>
                    <div className="issuer-active-status"><span></span>Active session</div>
                </div>

                <nav className="issuer-dashboard-nav" aria-label="Issuer navigation">
                    <Link className="active" to="/issuer/issue">Issue Certificate</Link>
                    <Link to="/issuer/certificates">Issued Certificates</Link>
                    <Link to="/issuer/information">Issuer Information</Link>
                </nav>

                <section className="issuer-dashboard-panel">
                    <div>
                        <span className="issuer-section-label">CERTIFICATE REGISTRATION</span>
                        <h2>Issue a verified certificate</h2>
                        <p>Create and register an authenticated certificate for a student through the blockchain-backed issuance service.</p>
                    </div>
                    <Link className="issuer-primary-link" to="/issuer/issue">Issue Certificate <span aria-hidden="true">→</span></Link>
                </section>
            </section>
        </main>
    );
}

export default IssuerDashboard;
