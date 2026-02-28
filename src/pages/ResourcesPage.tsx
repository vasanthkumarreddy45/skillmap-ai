import { motion } from "framer-motion";
import { ExternalLink, FileText, Youtube, BookOpen } from "lucide-react";

const resources = [
  { title: "Python for Data Science", type: "course", level: "Beginner", icon: BookOpen, url: "#" },
  { title: "Stanford CS229 Lectures", type: "video", level: "Intermediate", icon: Youtube, url: "#" },
  { title: "Deep Learning Book (Goodfellow)", type: "pdf", level: "Advanced", icon: FileText, url: "#" },
  { title: "Scikit-learn Documentation", type: "docs", level: "Beginner", icon: ExternalLink, url: "#" },
  { title: "Neural Networks from Scratch", type: "video", level: "Intermediate", icon: Youtube, url: "#" },
  { title: "Hands-On ML with Python", type: "pdf", level: "Intermediate", icon: FileText, url: "#" },
];

const levelColor: Record<string, string> = {
  Beginner: "text-accent",
  Intermediate: "text-primary",
  Advanced: "text-secondary",
};

const ResourcesPage = () => (
  <div className="space-y-8">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold gradient-text">Learning Resources</h1>
      <p className="text-sm text-muted-foreground mt-1">Curated materials organized by difficulty</p>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((r, i) => (
        <motion.a
          key={r.title}
          href={r.url}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card-hover p-5 block"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
              <r.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1">{r.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium uppercase tracking-wider ${levelColor[r.level]}`}>
                  {r.level}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize">{r.type}</span>
              </div>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  </div>
);

export default ResourcesPage;
