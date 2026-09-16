import React from "react";
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

interface LeadsTrendChartProps {
  data?: {
    month: string;
    leads: number;
    demos: number;
    enrollments: number;
  }[];
  isDark?: boolean;
}

const DEFAULT_DATA = [
  { month: "Apr", leads: 140, demos: 85, enrollments: 42 },
  { month: "May", leads: 210, demos: 130, enrollments: 76 },
  { month: "Jun", leads: 290, demos: 195, enrollments: 118 },
  { month: "Jul", leads: 380, demos: 245, enrollments: 165 },
  { month: "Aug", leads: 490, demos: 340, enrollments: 230 },
  { month: "Sep", leads: 620, demos: 460, enrollments: 310 },
];

export default function LeadsTrendChart({
  data = DEFAULT_DATA,
  isDark = true,
}: LeadsTrendChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="demosGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="enrollmentsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#334155" : "#e2e8f0"}
            opacity={0.5}
          />
          <XAxis
            dataKey="month"
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={11}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              borderColor: isDark ? "#334155" : "#cbd5e1",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
              fontSize: "12px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", paddingTop: "0px" }}
          />

          <Area
            type="monotone"
            dataKey="leads"
            name="Total Leads"
            stroke="#a855f7"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#leadsGradient)"
            animationDuration={1200}
          />
          <Area
            type="monotone"
            dataKey="demos"
            name="Scheduled Demos"
            stroke="#818cf8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#demosGradient)"
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="enrollments"
            name="Admissions"
            stroke="#34d399"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#enrollmentsGradient)"
            animationDuration={1800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
