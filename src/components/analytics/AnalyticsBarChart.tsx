import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { PopularCourseBarItem } from "../../services/analyticsService";

interface AnalyticsBarChartProps {
  data?: PopularCourseBarItem[];
  isDark?: boolean;
}

const BAR_COLORS = [
  "#7C3AED", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Violet
];

export default function AnalyticsBarChart({
  data = [],
  isDark = true,
}: AnalyticsBarChartProps) {
  const [metric, setMetric] = useState<"students" | "revenue">("students");

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: PopularCourseBarItem = payload[0].payload;
      return (
        <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 max-w-xs">
          <p className="font-bold text-white leading-snug">{item.fullName || item.name}</p>
          <span className="inline-block px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 text-[10px] font-semibold border border-purple-700/50">
            {item.category}
          </span>
          <div className="pt-1 text-slate-300 space-y-1">
            <p className="flex items-center justify-between">
              <span>Students Enrolled:</span>
              <strong className="text-cyan-400 font-extrabold">{item.students.toLocaleString()}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span>Estimated Revenue:</span>
              <strong className="text-emerald-400 font-extrabold">₹{item.revenue.toLocaleString("en-IN")}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span>Course Rating:</span>
              <strong className="text-amber-400 font-extrabold">★ {item.rating}</strong>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      {/* Metric Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMetric("students")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              metric === "students"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            By Enrollment Volume
          </button>
          <button
            type="button"
            onClick={() => setMetric("revenue")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              metric === "revenue"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            By Revenue Generated (₹)
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Top {data.length} Certification Tracks
        </span>
      </div>

      {/* Bar Chart Canvas */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1E293B" : "#E2E8F0"} vertical={false} />
            <XAxis
              dataKey="name"
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
              angle={-25}
              textAnchor="end"
              interval={0}
              height={50}
            />
            <YAxis
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) =>
                metric === "revenue"
                  ? v >= 100000
                    ? `₹${(v / 100000).toFixed(1)}L`
                    : `₹${(v / 1000).toFixed(0)}k`
                  : v.toLocaleString()
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey={metric}
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {data.map((_, index) => (
                <Cell
                  key={`bar-cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                  className="hover:opacity-85 transition-opacity cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
