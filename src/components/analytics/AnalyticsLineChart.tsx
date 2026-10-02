import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RevenueTrendItem, SignupsTrendItem } from "../../services/analyticsService";

interface AnalyticsLineChartProps {
  revenueData?: RevenueTrendItem[];
  signupsData?: SignupsTrendItem[];
  days: number;
  onDaysChange: (days: number) => void;
  isDark?: boolean;
}

export default function AnalyticsLineChart({
  revenueData = [],
  signupsData = [],
  days,
  onDaysChange,
  isDark = true,
}: AnalyticsLineChartProps) {
  const [activeMetric, setActiveMetric] = useState<"both" | "revenue" | "signups">("both");

  // Merge revenue and signups by date
  const mergedData = React.useMemo(() => {
    const map = new Map<string, { date: string; displayDate: string; revenue: number; orders: number; signups: number }>();

    revenueData.forEach((r) => {
      const parts = r.date.split("-");
      const displayDate = parts.length === 3 ? `${parts[1]}/${parts[2]}` : r.date;
      map.set(r.date, {
        date: r.date,
        displayDate,
        revenue: r.revenue || 0,
        orders: r.orders || 0,
        signups: 0,
      });
    });

    signupsData.forEach((s) => {
      const parts = s.date.split("-");
      const displayDate = parts.length === 3 ? `${parts[1]}/${parts[2]}` : s.date;
      if (map.has(s.date)) {
        map.get(s.date)!.signups = s.signups || 0;
      } else {
        map.set(s.date, {
          date: s.date,
          displayDate,
          revenue: 0,
          orders: 0,
          signups: s.signups || 0,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [revenueData, signupsData]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">
            Date: {dataPoint.date}
          </p>
          {(activeMetric === "both" || activeMetric === "revenue") && (
            <div className="flex items-center justify-between gap-4 text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Revenue:
              </span>
              <span className="font-extrabold">₹{dataPoint.revenue?.toLocaleString("en-IN")}</span>
            </div>
          )}
          {(activeMetric === "both" || activeMetric === "revenue") && (
            <div className="flex items-center justify-between gap-4 text-purple-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Orders:
              </span>
              <span className="font-extrabold">{dataPoint.orders}</span>
            </div>
          )}
          {(activeMetric === "both" || activeMetric === "signups") && (
            <div className="flex items-center justify-between gap-4 text-cyan-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                New Signups:
              </span>
              <span className="font-extrabold">{dataPoint.signups} students</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls: Metric Switcher & Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMetric("both")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeMetric === "both"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Combined Telemetry
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("revenue")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeMetric === "revenue"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Revenue (₹)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("signups")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeMetric === "signups"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Daily Signups
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDaysChange(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                days === d
                  ? "bg-slate-800 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mergedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="signupsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1E293B" : "#E2E8F0"} />
            <XAxis
              dataKey="displayDate"
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)}
              hide={activeMetric === "signups"}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
              hide={activeMetric === "revenue"}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              iconType="circle"
            />

            {(activeMetric === "both" || activeMetric === "revenue") && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹)"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
                activeDot={{ r: 6, fill: "#10B981", stroke: "#047857", strokeWidth: 2 }}
              />
            )}

            {(activeMetric === "both" || activeMetric === "signups") && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="signups"
                name="Daily Signups"
                stroke="#06B6D4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#signupsGrad)"
                activeDot={{ r: 6, fill: "#06B6D4", stroke: "#0891B2", strokeWidth: 2 }}
              />
            )}

            {activeMetric === "both" && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#A855F7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ordersGrad)"
                activeDot={{ r: 5, fill: "#A855F7" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
