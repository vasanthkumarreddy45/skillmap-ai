import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const weeklyData = [
  { day: "Mon", score: 72, engagement: 85, deviation: 12 },
  { day: "Tue", score: 78, engagement: 90, deviation: 8 },
  { day: "Wed", score: 65, engagement: 70, deviation: 18 },
  { day: "Thu", score: 82, engagement: 88, deviation: 6 },
  { day: "Fri", score: 90, engagement: 95, deviation: 4 },
  { day: "Sat", score: 88, engagement: 82, deviation: 7 },
  { day: "Sun", score: 85, engagement: 78, deviation: 10 },
];

const monthlyData = [
  { day: "W1", score: 68, engagement: 75, deviation: 15 },
  { day: "W2", score: 74, engagement: 82, deviation: 11 },
  { day: "W3", score: 80, engagement: 88, deviation: 8 },
  { day: "W4", score: 86, engagement: 92, deviation: 5 },
];

const radarData = [
  { subject: "ML", mastery: 85 },
  { subject: "Python", mastery: 92 },
  { subject: "Stats", mastery: 70 },
  { subject: "DL", mastery: 78 },
  { subject: "NLP", mastery: 65 },
  { subject: "CV", mastery: 72 },
];

type TimeFilter = "week" | "month";

export const PerformanceCharts = () => {
  const [filter, setFilter] = useState<TimeFilter>("week");
  const data = filter === "week" ? weeklyData : monthlyData;

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["week", "month"] as TimeFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
              filter === f
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground bg-muted/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h3 className="font-display text-sm font-semibold mb-4 text-foreground">Quiz Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(185, 80%, 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(185, 80%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 30%, 18%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 40%, 10%)",
                  border: "1px solid hsl(215, 30%, 22%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(185, 80%, 55%)"
                strokeWidth={2}
                fill="url(#scoreGrad)"
                dot={{ fill: "hsl(185, 80%, 55%)", r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="font-display text-sm font-semibold mb-4 text-foreground">Engagement Score</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 30%, 18%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 40%, 10%)",
                  border: "1px solid hsl(215, 30%, 22%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="engagement" fill="hsl(260, 60%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Topic Deviation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="font-display text-sm font-semibold mb-4 text-foreground">Topic Deviation</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="devGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 70%, 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0, 70%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 30%, 18%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 40%, 10%)",
                  border: "1px solid hsl(215, 30%, 22%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="deviation"
                stroke="hsl(0, 70%, 55%)"
                strokeWidth={2}
                fill="url(#devGrad)"
                dot={{ fill: "hsl(0, 70%, 55%)", r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5"
        >
          <h3 className="font-display text-sm font-semibold mb-4 text-foreground">Skill Mastery</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(215, 30%, 18%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar
                name="Mastery"
                dataKey="mastery"
                stroke="hsl(165, 70%, 45%)"
                fill="hsl(165, 70%, 45%)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};
