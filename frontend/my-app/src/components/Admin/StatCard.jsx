import "./StatCard.css";

function StatCard({ title, value, description, status }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>

        {status && (
          <span className={`stat-card-status ${status}`}>
            {status}
          </span>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      <div className="stat-card-description">{description}</div>
    </div>
  );
}

export default StatCard;