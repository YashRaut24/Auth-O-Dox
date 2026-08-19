import "./Landing.css";

function Landing({ onUser, onAdmin, onIssuer }) {
  return (
    <main className="landing-page">
      <div className="landing-shell">
        <header className="landing-header">
          <div className="brand-mark">
            <div className="brand-icon">A</div>

            <div>
              <div className="brand-name">AUTH-O-DOX</div>
              <div className="brand-caption">
                Credential Authenticity Platform
              </div>
            </div>
          </div>

          <div className="secure-label">
            <span className="secure-dot"></span>
            Secure Verification
          </div>
        </header>

        <section className="landing-content">
          <div className="landing-badge">
            DIGITAL CREDENTIAL VERIFICATION
          </div>

          <h1>
            Verify what
            <br />
            <span>can be trusted.</span>
          </h1>

          <p className="landing-description">
            A secure platform for verifying academic and professional
            credentials using document analysis, issuer verification,
            cryptographic validation and fraud intelligence.
          </p>

          <div className="role-selection">
            <button className="role-card" onClick={onUser}>
              <div className="role-icon user-icon">
                <span>U</span>
              </div>

              <div className="role-content">
                <span className="role-label">FOR USERS</span>
                <h2>Verify a Credential</h2>
                <p>
                  Upload a certificate and check its authenticity through the
                  verification system.
                </p>
              </div>

              <div className="role-arrow">→</div>
            </button>

            <button className="role-card" onClick={onIssuer}>
              <div className="role-icon issuer-icon">
                <span>IS</span>
              </div>

              <div className="role-content">
                <span className="role-label">FOR ISSUERS</span>
                <h2>Issuer Portal</h2>
                <p>
                  For authorized institutions to issue and manage verified
                  certificates.
                </p>
              </div>

              <div className="role-arrow">→</div>
            </button>

            <button className="role-card" onClick={onAdmin}>
              <div className="role-icon admin-icon">
                <span>AD</span>
              </div>

              <div className="role-content">
                <span className="role-label">FOR ADMINISTRATORS</span>
                <h2>Admin Dashboard</h2>
                <p>
                  Monitor verification activity, fraud patterns and registered
                  credential issuers.
                </p>
              </div>

              <div className="role-arrow">→</div>
            </button>
          </div>
        </section>

        <footer className="landing-footer">
          <div>AUTH-O-DOX</div>

          <div className="footer-status">
            <span></span>
            Prototype Environment
          </div>
        </footer>
      </div>
    </main>
  );
}

export default Landing;