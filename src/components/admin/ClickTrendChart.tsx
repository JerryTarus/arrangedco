"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export type TrendPoint = { date: string; clicks: number };

type TooltipRenderProps = {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string | number;
};

function renderTooltip({ active, payload, label }: TooltipRenderProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(61,56,52,0.10)",
        borderRadius: 10,
        padding: "8px 12px",
        boxShadow: "0 1px 6px rgba(61,56,52,0.10)",
      }}
    >
      <p style={{ fontSize: 11, color: "rgba(61,56,52,0.45)", margin: 0 }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#C4533A",
          margin: "2px 0 0",
        }}
      >
        {payload[0]?.value} clicks
      </p>
    </div>
  );
}

type Props = { data: TrendPoint[] };

export function ClickTrendChart({ data }: Props) {
  const hasData = data.some((d) => d.clicks > 0);

  if (!hasData) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-xl bg-ink/[0.02]">
        <p className="text-sm text-ink/35">No click data for the past 30 days</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(61,56,52,0.07)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "rgba(61,56,52,0.40)" }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "rgba(61,56,52,0.40)" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={28}
        />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Tooltip content={renderTooltip as any} cursor={{ stroke: "rgba(196,83,58,0.15)", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#C4533A"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#C4533A", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
