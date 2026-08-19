import QRTest from "../QRCode/QRTest";
import "./UserPage.css";

function UserPage({ onBack }) {
  return (
    <main className="user-page">
      <header className="user-header">
        <div className="user-brand">
          <button className="back-button" onClick={onBack}>
            ←
          </button>

          <div>
            <div className="user-brand-name">AUTH-O-DOX</div>
            <div className="user-brand-subtitle">
              Credential Verification
            </div>
          </div>
        </div>

        <div className="user-security">
          <span></span>
          Secure Verification
        </div>
      </header>

      <section className="user-content">
        <div className="user-intro">
          <div className="user-label">CREDENTIAL VERIFICATION</div>

          <h1>Verify a certificate</h1>

          <p>
            Upload an academic or professional certificate to begin the
            authenticity verification process.
          </p>
        </div>

        <div className="verification-wrapper">
          <QRTest />
        </div>
      </section>
    </main>
  );
}

export default UserPage;