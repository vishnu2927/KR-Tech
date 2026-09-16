import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface MentorChartProps {
  data?: {
    name: string;
    students: number;
    rating: number;
  }[];
  isDark?: boolean;
}

const DEFAULT_MENTOR_DATA = [
  { name: "Rajesh K.", students: 2400, rating: 4.96 },
  { name: "Vikram N.", students: 1850, rating: 4.95 },
  { name: "Amit V.", students: 2100, rating: 4.92 },
  { name: "Ananya R.", students: 1620, rating: 4.94 },
  { name: "Deepak J.", students: 1450, rating: 4.9 },
  { name: "Pooja H.", students: 1380, rating: 4.91 },
];

export default function MentorChart({
  data = DEFAULT_MENTOR_DATA,
  isDark = true,
}: MentorChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#334155" : "#e2e8f0"}
            opacity={0.5}
          />
          <XAxis
            dataKey="name"
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
            wrapperStyle={{ fontSize: "11px" }}
          />
          <Bar
            dataKey="students"
            name="Students Mentored"
            fill="#8b5cf6"
            radius={[6, 6, 0, 0]}
            animationDuration={1300}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
