"use client";

import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface RevenuePoint {
  label: string;
  revenue: number;
}

interface RevenueData {
  totalRevenue: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  dailyData: RevenuePoint[];
  weeklyData: RevenuePoint[];
  monthlyData: RevenuePoint[];
}

type ViewType = "daily" | "weekly" | "monthly";

/* 🔥 Animated Counter */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>₹{display.toLocaleString("en-IN")}</span>;
}

export default function RevenuePage() {
  const router = useRouter();
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<ViewType>("daily");

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const res = await apiFetch("/api/admin/revenue");
        if (!res) return;
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Revenue fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRevenue();
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    if (viewType === "daily") return data.dailyData || [];
    if (viewType === "weekly") return data.weeklyData || [];
    return data.monthlyData || [];
  }, [data, viewType]);

  const isUp =
    chartData.length > 1
      ? chartData[chartData.length - 1].revenue >=
        chartData[0].revenue
      : true;

  const growth =
    chartData.length > 1
      ? (
          ((chartData[chartData.length - 1].revenue -
            chartData[0].revenue) /
            chartData[0].revenue) *
          100
        ).toFixed(1)
      : "0";

  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">

      {/* Animated Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 blur-3xl rounded-full"
        />
      </div>

      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-10 space-y-10 relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 text-sm px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <h1 className="text-3xl font-bold tracking-tight">
              Revenue Analytics
            </h1>
          </div>

          <select
            value={viewType}
            onChange={(e) =>
              setViewType(e.target.value as ViewType)
            }
            className="border border-border bg-card rounded-lg px-4 py-2 text-sm shadow-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Stat title="Total" value={data?.totalRevenue ?? 0} />
          <Stat title="Today" value={data?.dailyRevenue ?? 0} />
          <Stat title="Week" value={data?.weeklyRevenue ?? 0} />
          <Stat title="Month" value={data?.monthlyRevenue ?? 0} />
        </div>

        {/* GRAPH CARD */}
        <motion.div
          key={viewType}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card/70 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl hover:shadow-primary/20 transition"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold capitalize">
              {viewType} Trend
            </h2>

            <div
              className="flex items-center gap-2 font-semibold"
              style={{ color }}
            >
              {isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {growth}%
            </div>
          </div>

          <ResponsiveContainer width="100%" height={420}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>

                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={color} />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeOpacity={0.3}
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
                formatter={(value: number) => `₹${value}`}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="url(#strokeGradient)"
                strokeWidth={3}
                fill="url(#fillGradient)"
                filter="url(#glow)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-lg transition"
    >
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-2">
        <AnimatedNumber value={value} />
      </p>
    </motion.div>
  );
}
