"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Item = { name: string; value: number };

// 🎨 Muted Glass Dashboard Palette (Blue/Teal/Slate/Sage)
export const MUTED_COLORS = [
  "#3B82F6", // soft blue
  "#2563EB", // deeper blue
  "#1D4ED8", // navy-ish
  "#0EA5A4", // teal
  "#14B8A6", // soft teal
  "#059669", // muted green
  "#64748B", // slate
  "#475569", // darker slate
  "#94A3B8", // light slate
];

export default function AlumniStatsDonut({ data }: { data: Item[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="65%"
            outerRadius="88%"
            paddingAngle={3}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={MUTED_COLORS[i % MUTED_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.92)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              color: "white",
              backdropFilter: "blur(10px)",
            }}
            itemStyle={{ color: "white" }}
            labelStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}