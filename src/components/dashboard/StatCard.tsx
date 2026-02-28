import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  color: "primary" | "secondary" | "accent" | "warning";
}

const colorMap = {
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  accent: "var(--accent)",
  warning: "var(--warning)",
};

const glowMap = {
  primary: "var(--glow-primary)",
  secondary: "var(--glow-secondary)",
  accent: "var(--glow-accent)",
  warning: "var(--warning)",
};

export const StatCard = ({ icon: Icon, label, value, change, changePositive, color }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-hover p-5 relative overflow-hidden"
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10"
        style={{ background: `hsl(${colorMap[color]})` }}
      />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
          <p className="stat-value" style={{ color: `hsl(${colorMap[color]})` }}>
            {value}
          </p>
          {change && (
            <p className={`text-xs mt-1 ${changePositive ? "text-success" : "text-destructive"}`}>
              {change}
            </p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: `hsl(${colorMap[color]} / 0.15)`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: `hsl(${colorMap[color]})` }} />
        </div>
      </div>
    </motion.div>
  );
};
