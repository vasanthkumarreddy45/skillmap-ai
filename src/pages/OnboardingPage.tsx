import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
  {
    question: "Which company/domain would you like to join?",
    key: "company",
    options: ["Google", "Microsoft", "Amazon", "Meta", "Startup", "Freelance"],
    allowCustom: true,
  },
  {
    question: "Which role do you want to pursue?",
    key: "role",
    options: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "ML Engineer", "DevOps Engineer", "Cybersecurity Analyst", "Mobile Developer"],
    allowCustom: true,
  },
  {
    question: "Do you have skills related to this role?",
    key: "existingSkills",
    options: ["No skills yet", "Basic understanding", "Intermediate level", "Advanced but need guidance"],
    allowCustom: false,
  },
  {
    question: "Which programming languages do you know?",
    key: "languages",
    options: ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "None yet"],
    multiSelect: true,
    allowCustom: true,
  },
];

export type OnboardingData = {
  company: string;
  role: string;
  existingSkills: string;
  languages: string[];
};

const OnboardingPage = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [customInput, setCustomInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const step = steps[current];
  const isMulti = step.multiSelect;
  const selected = answers[step.key];

  const handleSelect = (option: string) => {
    if (isMulti) {
      const arr = (selected as string[]) || [];
      if (option === "None yet") {
        setAnswers({ ...answers, [step.key]: ["None yet"] });
      } else {
        const filtered = arr.filter((s) => s !== "None yet");
        setAnswers({
          ...answers,
          [step.key]: filtered.includes(option) ? filtered.filter((s) => s !== option) : [...filtered, option],
        });
      }
    } else {
      setAnswers({ ...answers, [step.key]: option });
    }
  };

  const addCustom = () => {
    if (!customInput.trim()) return;
    if (isMulti) {
      const arr = ((selected as string[]) || []).filter((s) => s !== "None yet");
      if (!arr.includes(customInput.trim())) {
        setAnswers({ ...answers, [step.key]: [...arr, customInput.trim()] });
      }
    } else {
      setAnswers({ ...answers, [step.key]: customInput.trim() });
    }
    setCustomInput("");
  };

  const canProceed = isMulti
    ? Array.isArray(selected) && selected.length > 0
    : !!selected;

  const handleFinish = async () => {
    setLoading(true);
    const data: OnboardingData = {
      company: answers.company as string,
      role: answers.role as string,
      existingSkills: answers.existingSkills as string,
      languages: answers.languages as string[],
    };

    // Store in localStorage for now (no DB)
    localStorage.setItem("onboarding_data", JSON.stringify(data));

    // Generate roadmap via AI
    try {
      const res = await supabase.functions.invoke("generate-roadmap", {
        body: { userProfile: data },
      });
      if (res.error) throw res.error;
      localStorage.setItem("ai_roadmap", JSON.stringify(res.data));
      toast.success("Your personalized roadmap is ready!");
    } catch (err) {
      console.error("Roadmap generation failed:", err);
      toast.error("Roadmap generation failed, using default roadmap");
    }

    setLoading(false);
    navigate("/");
  };

  const isLast = current === steps.length - 1;

  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-lg"
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= current ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Step {current + 1} of {steps.length}
              </span>
            </div>
            <h2 className="text-lg font-display font-semibold text-foreground mb-6">
              {step.question}
            </h2>

            <div className="space-y-2.5">
              {step.options.map((opt) => {
                const isSelected = isMulti
                  ? Array.isArray(selected) && selected.includes(opt)
                  : selected === opt;

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all text-sm ${
                      isSelected
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border hover:border-primary/30 text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}

              {step.allowCustom && (
                <div className="flex gap-2 mt-3">
                  <input
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustom()}
                    placeholder="Type your own..."
                    className="flex-1 h-10 rounded-lg border border-input bg-background/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={addCustom}
                    className="px-4 h-10 rounded-lg bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}

              {isMulti && Array.isArray(selected) && selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selected.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs border border-primary/20">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setCurrent(current - 1)}
                disabled={current === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              {isLast ? (
                <button
                  onClick={handleFinish}
                  disabled={!canProceed || loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 transition-opacity"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate My Roadmap
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setCurrent(current + 1)}
                  disabled={!canProceed}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 transition-opacity"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
