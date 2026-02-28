import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const milestones = [
  { label: "Python Fundamentals", status: "done", day: "Day 1-3" },
  { label: "Statistics & Probability", status: "done", day: "Day 4-7" },
  { label: "Data Visualization", status: "current", day: "Day 8-10" },
  { label: "Machine Learning Basics", status: "upcoming", day: "Day 11-15" },
  { label: "Deep Learning Intro", status: "upcoming", day: "Day 16-20" },
  { label: "Project & Review", status: "upcoming", day: "Day 21-25" },
];

const RoadmapPage = () => (
  <div className="space-y-8 max-w-3xl">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold gradient-text">Learning Roadmap</h1>
      <p className="text-sm text-muted-foreground mt-1">Your personalized daily learning path</p>
    </motion.div>

    {/* Progress bar */}
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Overall Progress</span>
        <span className="font-mono text-sm glow-text">33%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "33%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </div>

    {/* Timeline */}
    <div className="space-y-0">
      {milestones.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex gap-4"
        >
          {/* Line */}
          <div className="flex flex-col items-center">
            {m.status === "done" ? (
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            ) : m.status === "current" ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary/20 shrink-0 pulse-glow" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
            )}
            {i < milestones.length - 1 && (
              <div className={`w-px h-12 ${m.status === "done" ? "bg-accent/40" : "bg-border"}`} />
            )}
          </div>
          {/* Content */}
          <div className="pb-8">
            <p className={`text-sm font-medium ${m.status === "current" ? "text-primary" : m.status === "done" ? "text-foreground" : "text-muted-foreground"}`}>
              {m.label}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[11px] text-muted-foreground">{m.day}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default RoadmapPage;
