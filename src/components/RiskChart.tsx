import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ScanResult } from "@/pages/Index";

const COLORS: Record<string, string> = {
  Low: "hsl(160, 100%, 40%)",
  Medium: "hsl(45, 93%, 47%)",
  High: "hsl(0, 72%, 51%)",
};

// Mock data shown when no scans have been performed yet
const MOCK_DATA = [
  { name: "Low (Quantum-Safe)", value: 12 },
  { name: "Medium (PQC Ready)", value: 7 },
  { name: "High (Vulnerable)", value: 4 },
];

interface Props {
  results: ScanResult[];
}

export const RiskChart = ({ results }: Props) => {
  const hasData = results.length > 0;

  const chartData = hasData
    ? [
        { name: "Low (Quantum-Safe)", value: results.filter((r) => r.risk === "Low").length, risk: "Low" },
        { name: "Medium (PQC Ready)", value: results.filter((r) => r.risk === "Medium").length, risk: "Medium" },
        { name: "High (Vulnerable)", value: results.filter((r) => r.risk === "High").length, risk: "High" },
      ].filter((d) => d.value > 0)
    : MOCK_DATA.map((d, i) => ({ ...d, risk: ["Low", "Medium", "High"][i] }));

  return (
    <div className="rounded border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Risk Distribution
        </h2>
        {!hasData && (
          <span className="text-xs text-muted-foreground font-mono">Sample Data</span>
        )}
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.risk]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 9%)",
                border: "1px solid hsl(220, 14%, 16%)",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-2">
        {[
          { name: "Low (Quantum-Safe)", risk: "Low" },
          { name: "Medium (PQC Ready)", risk: "Medium" },
          { name: "High (Vulnerable)", risk: "High" },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLORS[item.risk] }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
