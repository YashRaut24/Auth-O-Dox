import "./AdminPage.css";
import StatCard from "./StatCard";
import VerificationChart from "./VerificationChart";
import FraudAnalysis from "./FraudAnalysis";
import IssuerOverview from "./IssuerOverview";
import RecentActivity from "./RecentActivity";

function AdminPage({ onBack }) {
  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <button className="admin-back-button" onClick={onBack}>
            ←
          </button>

          <div className="admin-brand">
            <div className="admin-brand-mark">A</div>

            <div>
              <div className="admin-brand-name">AUTH-O-DOX</div>
              <div className="admin-brand-subtitle">
                Administrative Console
              </div>
            </div>
          </div>
        </div>

        <div className="admin-security">
          <span></span>
          Secure Session
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-title-row">
          <div>
            <div className="admin-overline">SYSTEM OVERVIEW</div>
            <h1>Verification Dashboard</h1>
            <p>
              Monitor credential verification activity, fraud signals and
              registered issuers.
            </p>
          </div>

          <div className="demo-badge">
            <span></span>
            Prototype Data
          </div>
        </div>

        <section className="stats-grid">
          <StatCard
            title="Total Verifications"
            value="1,284"
            description="All verification attempts"
          />

          <StatCard
            title="Verified"
            value="982"
            description="Successfully authenticated"
            status="verified"
          />

          <StatCard
            title="Suspicious"
            value="187"
            description="Requires investigation"
            status="suspicious"
          />

          <StatCard
            title="Invalid"
            value="115"
            description="Failed verification"
            status="invalid"
          />

          <StatCard
            title="Registered Issuers"
            value="24"
            description="Active institutions"
          />
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel verification-panel">
            <div className="panel-heading">
              <div>
                <h2>Verification Activity</h2>
                <p>Credential verification attempts</p>
              </div>

              <span className="panel-period">LAST 6 MONTHS</span>
            </div>

            <VerificationChart />
          </div>

          <div className="dashboard-panel fraud-panel">
            <div className="panel-heading">
              <div>
                <h2>Fraud Analysis</h2>
                <p>Detected anomaly categories</p>
              </div>
            </div>

            <FraudAnalysis />
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Issuer Overview</h2>
              <p>Credential activity across registered institutions</p>
            </div>

            <button className="view-all-button">View all</button>
          </div>

          <IssuerOverview />
        </section>

        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Verification Activity</h2>
              <p>Latest system events</p>
            </div>

            <span className="live-indicator">
              <span></span>
              Activity feed
            </span>
          </div>

          <RecentActivity />
        </section>
      </section>
    </main>
  );
}

export default AdminPage;