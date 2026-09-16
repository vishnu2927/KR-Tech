import React from "react";
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

interface PopularCoursesChartProps {
  data?: {
    name: string;
    students: number;
    rating: number;
  }[];
  isDark?: boolean;
}

const DEFAULT_POPULAR_COURSES = [
  { name: "Java Backend", students: 5240, rating: 4.95 },
  { name: "AWS Solutions", students: 4310, rating: 4.92 },
  { name: "MERN Bootcamp", students: 3390, rating: 4.9 },
  { name: "Ethical Hacking", students: 2460, rating: 4.88 },
  { name: "Power BI Analyst", students: 1850, rating: 4.85 },
];

const GRADIENTS = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4"];

export default function PopularCoursesChart({
  data = DEFAULT_POPULAR_COURSES,
  isDark = true,
}: PopularCoursesChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#334155" : "#e2e8f0"}
            opacity={0.5}
            horizontal={false}
          />
          <XAxis
            type="number"
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={11}
            tickLine={false}
            width={110}
          />
          <Tooltip
            formatter={(val: number) => [`${val.toLocaleString()} Enrolled`, "Students"]}
            contentStyle={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              borderColor: isDark ? "#334155" : "#cbd5e1",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
              fontSize: "12px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          />
          <Bar
            dataKey="students"
            radius={[0, 8, 8, 0]}
            animationDuration={1200}
          >
            {data.map((_, index) => (
              <Cell
                key={`bar-cell-${index}`}
                fill={GRADIENTS[index % GRADIENTS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
