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

const EMPTY_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map((month) => ({ month, sales: 0 }));

export default function Chart({ data }) {
  const chartData = Array.isArray(data) && data.length > 0 ? data : EMPTY_MONTHS;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={800}
        height={300}
        data={chartData}
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
