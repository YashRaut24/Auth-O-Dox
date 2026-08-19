import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./VerificationChart.css";

const data = [
  { month: "Jan", verified: 132, suspicious: 24, invalid: 12 },
  { month: "Feb", verified: 148, suspicious: 28, invalid: 15 },
  { month: "Mar", verified: 165, suspicious: 31, invalid: 18 },
  { month: "Apr", verified: 158, suspicious: 27, invalid: 14 },
  { month: "May", verified: 181, suspicious: 38, invalid: 21 },
  { month: "Jun", verified: 198, suspicious: 39, invalid: 35 },
];

function VerificationChart() {
  return (
    <div className="verification-chart">
      <div className="chart-legend">
        <span>
          <i className="legend-dot verified-dot"></i>
          Verified
        </span>

        <span>
          <i className="legend-dot suspicious-dot"></i>
          Suspicious
        </span>

        <span>
          <i className="legend-dot invalid-dot"></i>
          Invalid
        </span>
      </div>

      <ResponsiveContainer width="100%" height={255}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="#e9eff5" vertical={false} />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#829ab1",
              fontSize: 10,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#829ab1",
              fontSize: 10,
            }}
          />

          <Tooltip
            contentStyle={{
              border: "1px solid #d9e2ec",
              borderRadius: "6px",
              boxShadow: "none",
              fontSize: "11px",
            }}
          />

          <Line
            type="monotone"
            dataKey="verified"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="suspicious"
            stroke="#b45309"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="invalid"
            stroke="#b91c1c"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VerificationChart;