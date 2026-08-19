import "./RecentActivity.css";

const activities = [
  {
    type: "verified",
    title: "Certificate DU-1021 verified",
    issuer: "Demo University",
    detail: "QR and issuer record matched",
    time: "2 min ago",
  },
  {
    type: "suspicious",
    title: "Certificate DU-1087 flagged",
    issuer: "Demo University",
    detail: "Blockchain hash mismatch",
    time: "8 min ago",
  },
  {
    type: "invalid",
    title: "Certificate AB-2045 rejected",
    issuer: "ABC Institute",
    detail: "Issuer record not found",
    time: "14 min ago",
  },
  {
    type: "verified",
    title: "Certificate TS-8812 verified",
    issuer: "Tech Skills Academy",
    detail: "All verification checks passed",
    time: "21 min ago",
  },
  {
    type: "suspicious",
    title: "Certificate XY-7319 flagged",
    issuer: "XYZ University",
    detail: "Duplicate certificate pattern",
    time: "29 min ago",
  },
];

function RecentActivity() {
  return (
    <div className="activity-list">
      {activities.map((activity, index) => (
        <div className="activity-item" key={`${activity.title}-${index}`}>
          <div className={`activity-icon ${activity.type}`}>
            {activity.type === "verified" && "✓"}
            {activity.type === "suspicious" && "!"}
            {activity.type === "invalid" && "×"}
          </div>

          <div className="activity-main">
            <div className="activity-title">{activity.title}</div>
            <div className="activity-detail">
              {activity.issuer} · {activity.detail}
            </div>
          </div>

          <div className="activity-time">{activity.time}</div>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity;