import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Code, Shield, Database, Cpu, Globe, ChevronRight } from "lucide-react";

const skills = [
  { id: "ds", label: "Data Science", icon: Database, topics: ["Statistics", "ML Algorithms", "Data Viz", "Feature Engineering"] },
  { id: "ai", label: "Artificial Intelligence", icon: Brain, topics: ["Neural Networks", "Deep Learning", "NLP", "Computer Vision"] },
  { id: "web", label: "Web Development", icon: Globe, topics: ["React", "Node.js", "Databases", "APIs"] },
  { id: "cyber", label: "Cybersecurity", icon: Shield, topics: ["Network Security", "Cryptography", "Ethical Hacking", "Forensics"] },
  { id: "embedded", label: "Embedded Systems", icon: Cpu, topics: ["Microcontrollers", "IoT", "RTOS", "Firmware"] },
  { id: "dsa", label: "DSA & Coding", icon: Code, topics: ["Arrays", "Trees", "Graphs", "Dynamic Programming"] },
];

const streams = ["Computer Science", "Information Technology", "Electronics", "Data Science"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const SkillsPage = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [stream, setStream] = useState("");
  const [year, setYear] = useState("");

  const activeSkill = skills.find((s) => s.id === selectedSkill);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold gradient-text">Skill Categorization</h1>
        <p className="text-sm text-muted-foreground mt-1">Select your skill, stream, and year to begin</p>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">University Stream</label>
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select stream</option>
            {streams.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="glass-card p-4">
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Academic Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select year</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Skill Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, i) => (
          <motion.button
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedSkill(skill.id)}
            className={`glass-card-hover p-5 text-left transition-all ${
              selectedSkill === skill.id ? "border-primary/50 shadow-[0_0_25px_hsl(185,80%,55%,0.15)]" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedSkill === skill.id ? "bg-primary/20" : "bg-muted/50"
              }`}>
                <skill.icon className={`w-5 h-5 ${selectedSkill === skill.id ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground">{skill.label}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skill.topics.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected Skill Detail */}
      {activeSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-display text-lg font-bold glow-text mb-4">{activeSkill.label} — Learning Path</h3>
          <div className="space-y-3">
            {activeSkill.topics.map((topic, i) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-mono text-primary">
                    {i + 1}
                  </div>
                  <span className="text-sm text-foreground">{topic}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SkillsPage;
