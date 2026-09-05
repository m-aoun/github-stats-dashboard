import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { GitHubRepo } from "../types";

interface TopReposChartProps {
  repos: GitHubRepo[];
}

interface ChartRow {
  name: string;
  fullName: string;
  stars: number;
  url: string;
}

function truncate(name: string, max = 20): string {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

interface TooltipPayloadItem {
  payload: ChartRow;
}

function RepoTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-value">
        {row.stars.toLocaleString()} {row.stars === 1 ? "star" : "stars"}
      </div>
      <div className="chart-tooltip-label">{row.fullName}</div>
    </div>
  );
}

export function TopReposChart({ repos }: TopReposChartProps) {
  if (repos.length === 0) {
    return <p className="empty-note">No public repos to rank yet.</p>;
  }

  const data: ChartRow[] = repos.map((repo) => ({
    name: truncate(repo.name),
    fullName: repo.name,
    stars: repo.stargazers_count,
    url: repo.html_url,
  }));

  const height = Math.max(220, data.length * 42);

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke="var(--gridline)" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--baseline)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: "var(--text-secondary)", fontSize: 13 }}
            axisLine={{ stroke: "var(--baseline)" }}
            tickLine={false}
          />
          <Tooltip content={<RepoTooltip />} cursor={{ fill: "var(--gridline)", opacity: 0.4 }} />
          <Bar dataKey="stars" fill="var(--seq-450)" radius={[0, 4, 4, 0]} maxBarSize={24}>
            <LabelList
              dataKey="stars"
              position="right"
              formatter={(value: unknown) => (typeof value === "number" ? value.toLocaleString() : String(value ?? ""))}
              style={{ fill: "var(--text-secondary)", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
