import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Loader2, RefreshCw, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Milestone = {
  label: string;
  description: string;
  duration: string;
  status: string;
  topics: string[];
};

type Roadmap = {
  title: string;
  totalWeeks: number;
  milestones: Milestone[];
  recommendations: string[];
};

const fallbackRoadmap: Roadmap = {
  title: "Learning Roadmap",
  totalWeeks: 25,
  milestones: [
    { label: "Fundamentals", description: "Core concepts", duration: "Week 1-3", status: "upcoming", topics: ["Basics"] },
    { label: "Intermediate", description: "Build projects", duration: "Week 4-8", status: "upcoming", topics: ["Projects"] },
    { label: "Advanced", description: "Deep dive", duration: "Week 9-15", status: "upcoming", topics: ["Advanced"] },
  ],
  recommendations: ["Complete the onboarding to get a personalized roadmap"],
};

const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFetching(false);
        return;
      }

      const { data, error } = await (supabase
        .from("profiles") as any)
        .select("roadmap")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching roadmap:", error);
        setRoadmap(fallbackRoadmap);
      } else if (data && (data as any).roadmap) {
        setRoadmap((data as any).roadmap as Roadmap);
      } else {
        setRoadmap(fallbackRoadmap);
      }
      setFetching(false);
    };

    fetchRoadmap();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile-roadmap')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.new.roadmap) {
            setRoadmap(payload.new.roadmap as Roadmap);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const regenerate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await (supabase
      .from("profiles") as any)
      .select("onboarding_data")
      .eq("id", user.id)
      .single();

    if (!profile || !(profile as any).onboarding_data) {
      toast.error("Complete onboarding first to generate a roadmap");
      return;
    }

    setLoading(true);
    try {
      const res = await (supabase.functions.invoke("generate-roadmap") as any)({
        body: { userProfile: (profile as any).onboarding_data },
      });
      if (res.error) throw res.error;

      const { error: updateError } = await (supabase
        .from("profiles") as any)
        .update({ roadmap: res.data })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setRoadmap(res.data);
      toast.success("Roadmap regenerated!");
    } catch (err) {
      console.error("Regeneration failed:", err);
      toast.error("Failed to regenerate roadmap");
    }
    setLoading(false);
  };

  if (fetching) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!roadmap) return null;

  const doneCount = roadmap.milestones.filter((m) => m.status === "done").length;
  const progress = Math.round((doneCount / roadmap.milestones.length) * 100);

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-text">{roadmap.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {roadmap.totalWeeks} weeks • {roadmap.milestones.length} milestones
          </p>
        </div>
        <button
          onClick={regenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Regenerate
        </button>
      </motion.div>

      {/* Progress bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Overall Progress</span>
          <span className="font-mono text-sm glow-text">{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {roadmap.milestones.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              {m.status === "done" ? (
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              ) : m.status === "current" ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary/20 shrink-0 pulse-glow" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
              )}
              {i < roadmap.milestones.length - 1 && (
                <div className={`w-px h-16 ${m.status === "done" ? "bg-accent/40" : "bg-border"}`} />
              )}
            </div>
            <div className="pb-8">
              <p className={`text-sm font-medium ${m.status === "current" ? "text-primary" : m.status === "done" ? "text-foreground" : "text-muted-foreground"}`}>
                {m.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-[11px] text-muted-foreground">{m.duration}</span>
              </div>
              {m.topics && m.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.topics.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-muted/50 text-muted-foreground border border-border">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      {roadmap.recommendations && roadmap.recommendations.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">AI Recommendations</span>
          </div>
          <ul className="space-y-2">
            {roadmap.recommendations.map((r, i) => (
              <li key={i} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-primary">•</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
