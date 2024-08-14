import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data2 = [];
const salesData = [
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 1 },
  { month: "Mar", sales: 2 },
  { month: "Apr", sales: 3 },
  { month: "May", sales: 4 },
  { month: "Jun", sales: 5 },
  { month: "Jul", sales: 6 },
  { month: "Aug", sales: 7 },
  { month: "Sep", sales: 8 },
  { month: "Oct", sales: 9 },
  { month: "Nov", sales: 10 },
  { month: "Dec", sales: 11 },
];

export default function Example() {
  const demoUrl =
    "https://codesandbox.io/p/sandbox/bar-chart-has-no-padding-2hlnt8";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={800}
        height={300}
        data={salesData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        barSize={20}
      >
        <XAxis
          dataKey="month"
          scale="point"
          padding={{ left: 10, right: 10 }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar
          dataKey="sales"
          fill="#000000"
          background={{ fill: "#ffffff" }}
          barSize={2}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
