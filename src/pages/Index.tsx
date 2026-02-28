import { motion } from "framer-motion";
import { Flame, Clock, BookOpen, Target, TrendingUp } from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { PerformanceCharts } from "../components/dashboard/PerformanceCharts";
import { RLMetrics } from "../components/dashboard/RLMetrics";

const Index = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold gradient-text">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back — your learning analytics at a glance
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Login Streak" value="7" change="+2 from last week" changePositive color="warning" />
        <StatCard icon={Clock} label="Time Today" value="2.4h" change="+18% avg" changePositive color="primary" />
        <StatCard icon={BookOpen} label="Skills Covered" value="12" change="3 new today" changePositive color="accent" />
        <StatCard icon={Target} label="Roadmap" value="68%" change="+5% this week" changePositive color="secondary" />
      </div>

      {/* Charts */}
      <PerformanceCharts />

      {/* RL Metrics */}
      <RLMetrics />
    </div>
  );
};

export default Index;
