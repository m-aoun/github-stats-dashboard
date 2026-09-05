import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LanguageSlice } from "../types";

interface LanguageChartProps {
  data: LanguageSlice[];
}

// Fixed categorical order - never cycled or reassigned by rank, so a
// language's color stays consistent regardless of where it lands.
const SERIES_COLORS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
];
const OTHER_COLOR = "var(--series-other)";

function colorFor(index: number, language: string): string {
  if (language === "Other") return OTHER_COLOR;
  return SERIES_COLORS[index % SERIES_COLORS.length];
}

interface TooltipPayloadItem {
  payload: LanguageSlice;
}

function LanguageTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const slice = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-value">{slice.percent.toFixed(1)}%</div>
      <div className="chart-tooltip-label">
        {slice.language} · {slice.count} {slice.count === 1 ? "repo" : "repos"}
      </div>
    </div>
  );
}

export function LanguageChart({ data }: LanguageChartProps) {
  if (data.length === 0) {
    return <p className="empty-note">No language data available for this user's repos.</p>;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="language"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={2}
            stroke="var(--surface-1)"
            strokeWidth={2}
          >
            {data.map((slice, index) => (
              <Cell key={slice.language} fill={colorFor(index, slice.language)} />
            ))}
          </Pie>
          <Tooltip content={<LanguageTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value: string) => <span className="legend-text">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
