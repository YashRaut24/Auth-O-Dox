import "./IssuerOverview.css";

const issuers = [
  {
    name: "Demo University",
    type: "University",
    certificates: 420,
    requests: 184,
    status: "Active",
  },
  {
    name: "ABC Institute",
    type: "Training Institution",
    certificates: 286,
    requests: 121,
    status: "Active",
  },
  {
    name: "Tech Skills Academy",
    type: "Certification Body",
    certificates: 214,
    requests: 96,
    status: "Active",
  },
  {
    name: "XYZ University",
    type: "University",
    certificates: 176,
    requests: 73,
    status: "Active",
  },
];

function IssuerOverview() {
  return (
    <div className="issuer-table-wrapper">
      <table className="issuer-table">
        <thead>
          <tr>
            <th>Institution</th>
            <th>Type</th>
            <th>Certificates</th>
            <th>Verification Requests</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {issuers.map((issuer) => (
            <tr key={issuer.name}>
              <td className="issuer-name">{issuer.name}</td>
              <td>{issuer.type}</td>
              <td>{issuer.certificates}</td>
              <td>{issuer.requests}</td>
              <td>
                <span className="issuer-status">{issuer.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IssuerOverview;