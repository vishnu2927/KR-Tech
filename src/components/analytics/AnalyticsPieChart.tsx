import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CategoryDistributionItem, PaymentMethodItem } from "../../services/analyticsService";

interface AnalyticsPieChartProps {
  categories?: CategoryDistributionItem[];
  paymentMethods?: PaymentMethodItem[];
  isDark?: boolean;
}

const DEFAULT_COLORS = [
  "#7C3AED",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#3B82F6",
  "#8B5CF6",
  "#14B8A6",
];

export default function AnalyticsPieChart({
  categories = [],
  paymentMethods = [],
  isDark = true,
}: AnalyticsPieChartProps) {
  const [pieMode, setPieMode] = useState<"category" | "payment">("category");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = React.useMemo(() => {
    if (pieMode === "category") {
      const topCats = categories.slice(0, 6);
      const total = topCats.reduce((acc, curr) => acc + curr.value, 0) || 1;
      return topCats.map((c, i) => ({
        name: c.name,
        value: c.value,
        students: c.students,
        percentage: ((c.value / total) * 100).toFixed(1),
        color: c.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      }));
    } else {
      const total = paymentMethods.reduce((acc, curr) => acc + curr.count, 0) || 1;
      return paymentMethods.map((p, i) => ({
        name: p.name,
        value: p.count,
        amount: p.totalAmount,
        percentage: ((p.count / total) * 100).toFixed(1),
        color: p.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      }));
    }
  }, [pieMode, categories, paymentMethods]);

  const totalValue = data.reduce((acc, d) => acc + d.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-bold text-white">{item.name}</span>
          </div>
          <div className="text-slate-300">
            {pieMode === "category" ? (
              <>
                <p>Catalog Tracks: <strong className="text-purple-400">{item.value}</strong></p>
                <p>Enrolled Students: <strong className="text-cyan-400">{item.students?.toLocaleString()}</strong></p>
              </>
            ) : (
              <>
                <p>Transactions: <strong className="text-emerald-400">{item.value}</strong></p>
                <p>Amount: <strong className="text-purple-400">₹{item.amount?.toLocaleString("en-IN")}</strong></p>
              </>
            )}
            <p className="text-slate-400 text-[10px]">Share: {item.percentage}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setPieMode("category")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              pieMode === "category"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Category Share
          </button>
          <button
            type="button"
            onClick={() => setPieMode("payment")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              pieMode === "payment"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Payment Channels
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {totalValue} {pieMode === "category" ? "Total Tracks" : "Transactions"}
        </span>
      </div>

      {/* Donut Chart & Legend Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
        {/* Pie Canvas */}
        <div className="sm:col-span-6 h-60 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isDark ? "#0A0D14" : "#FFFFFF"}
                    strokeWidth={activeIndex === index ? 3 : 2}
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-medium">
              {pieMode === "category" ? "Tracks" : "Volume"}
            </span>
            <span className="text-xl font-extrabold text-white">
              {totalValue}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="sm:col-span-6 space-y-2">
          {data.map((item, idx) => (
            <div
              key={item.name}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`p-2 rounded-xl flex items-center justify-between text-xs transition cursor-pointer border ${
                activeIndex === idx
                  ? "bg-slate-800/80 border-purple-500/50"
                  : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-200 font-medium truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-extrabold text-slate-100">{item.value}</span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
