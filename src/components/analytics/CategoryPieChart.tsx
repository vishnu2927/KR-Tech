import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface CategoryPieChartProps {
  data?: {
    name: string;
    value: number;
  }[];
  isDark?: boolean;
}

const DEFAULT_CATEGORY_DATA = [
  { name: "Java Backend", value: 34 },
  { name: "Cloud & DevOps", value: 28 },
  { name: "MERN Stack", value: 22 },
  { name: "Cyber Security", value: 16 },
  { name: "SAP & Enterprise", value: 12 },
];

const COLORS = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

export default function CategoryPieChart({
  data = DEFAULT_CATEGORY_DATA,
  isDark = true,
}: CategoryPieChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            animationDuration={1200}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={isDark ? "#0f172a" : "#ffffff"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}% Share`, "Enrollment Volume"]}
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
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "11px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
