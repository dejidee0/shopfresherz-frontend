"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  sparkData: { v: number }[];
  sparkColor: string;
}

export default function StatsCard({
  title,
  value,
  change,
  positive,
  sparkData,
  sparkColor,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className={`text-sm font-bold ${
            positive ? "text-emerald-500" : "text-red-400"
          }`}
        >
          {change}
        </span>
        <div className="w-20 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}