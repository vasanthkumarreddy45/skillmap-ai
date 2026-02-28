import { motion } from "framer-motion";

const confusionData = [
  [42, 8, 3, 2],
  [5, 38, 7, 4],
  [2, 6, 35, 9],
  [1, 3, 5, 40],
];

const labels = ["Mastered", "Learning", "Struggling", "Not Started"];

const metrics = [
  { label: "Accuracy", value: "87.3%", color: "primary" },
  { label: "Precision", value: "84.1%", color: "accent" },
  { label: "Recall", value: "89.5%", color: "secondary" },
  { label: "Engagement", value: "91.2%", color: "warning" },
  { label: "Dropout Risk", value: "8.7%", color: "destructive" },
];

const colorScale = (val: number) => {
  if (val >= 35) return "hsl(185, 80%, 55%)";
  if (val >= 20) return "hsl(185, 80%, 55% / 0.5)";
  if (val >= 10) return "hsl(185, 80%, 55% / 0.25)";
  return "hsl(185, 80%, 55% / 0.1)";
};

export const RLMetrics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-6"
    >
      <h3 className="font-display text-sm font-semibold mb-5 text-foreground">
        Reinforcement Learning Analytics
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            Confusion Matrix — Topic Mastery
          </p>
          <div className="grid grid-cols-5 gap-1">
            <div />
            {labels.map((l) => (
              <div key={l} className="text-[9px] text-muted-foreground text-center truncate px-1">
                {l}
              </div>
            ))}
            {confusionData.map((row, i) => (
              <>
                <div key={`label-${i}`} className="text-[9px] text-muted-foreground flex items-center justify-end pr-2 truncate">
                  {labels[i]}
                </div>
                {row.map((val, j) => (
                  <motion.div
                    key={`${i}-${j}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + (i * 4 + j) * 0.03 }}
                    className="aspect-square rounded-md flex items-center justify-center text-xs font-mono font-bold"
                    style={{
                      background: colorScale(val),
                      color: val >= 35 ? "hsl(222, 47%, 6%)" : "hsl(200, 20%, 90%)",
                    }}
                  >
                    {val}
                  </motion.div>
                ))}
              </>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Model Performance
          </p>
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <span className={`font-mono font-semibold text-sm text-${m.color === "destructive" ? "destructive" : m.color}`}>
                {m.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
