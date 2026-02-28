import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, CheckCircle2, XCircle, ArrowRight, RotateCcw, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Question = {
  id: number;
  question: string;
  type: string;
  options: string[];
  correct: number;
  explanation: string;
};

const defaultQuestions: Question[] = [
  { id: 1, question: "Which algorithm is commonly used for classification?", type: "mcq", options: ["K-Means", "Random Forest", "DBSCAN", "PCA"], correct: 1, explanation: "Random Forest is a supervised classification algorithm." },
  { id: 2, question: "Gradient descent minimizes the loss function.", type: "tf", options: ["True", "False"], correct: 0, explanation: "Gradient descent iteratively finds the minimum of the loss function." },
  { id: 3, question: "What prevents overfitting?", type: "mcq", options: ["Increase overfitting", "Regularization", "Speed up training", "More parameters"], correct: 1, explanation: "Regularization adds a penalty to prevent overfitting." },
];

const QuizPage = () => {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
  }, [questions]);

  const q = questions[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === q?.correct;

  const handleSelect = (i: number) => {
    if (submitted) return;
    setSelected(i);
    const newAnswers = [...answers];
    newAnswers[current] = i;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1]);
      setSubmitted(false);
    }
  };

  const handleSubmitAnswer = () => setSubmitted(true);

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
  };

  const generateQuiz = async () => {
    const profile = localStorage.getItem("onboarding_data");
    const role = profile ? JSON.parse(profile).role : "Developer";
    const quizTopic = topic.trim() || "General Programming";

    setGenerating(true);
    try {
      const res = await supabase.functions.invoke("generate-quiz", {
        body: { topic: quizTopic, role, difficulty: "intermediate" },
      });
      if (res.error) throw res.error;
      if (res.data?.questions) {
        setQuestions(res.data.questions);
        setCurrent(0);
        setSelected(null);
        setSubmitted(false);
        toast.success(`Generated ${res.data.questions.length} questions on "${quizTopic}"`);
      }
    } catch {
      toast.error("Failed to generate quiz, using defaults");
    }
    setGenerating(false);
  };

  const score = answers.reduce((acc, a, i) => acc + (a === questions[i]?.correct ? 1 : 0), 0);
  const allDone = current === questions.length - 1 && submitted;

  if (!q) return null;

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold gradient-text">AI Quiz</h1>
        <p className="text-sm text-muted-foreground mt-1">Test your knowledge with AI-generated questions</p>
      </motion.div>

      {/* Generate Section */}
      <div className="glass-card p-4 flex gap-3">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
          placeholder="Enter a topic (e.g. React hooks, SQL joins)..."
          className="flex-1 h-10 rounded-lg border border-input bg-background/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={generateQuiz}
          disabled={generating}
          className="flex items-center gap-2 px-5 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono transition-all ${
                i === current ? "bg-primary/20 text-primary border border-primary/30" :
                answers[i] !== null ? "bg-accent/20 text-accent" : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {q.type === "mcq" ? "Multiple Choice" : "True / False"}
        </span>
        <h2 className="text-lg font-medium text-foreground mb-6 mt-1">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let borderClass = "border-border hover:border-primary/30";
            if (submitted && i === q.correct) borderClass = "border-accent bg-accent/10";
            else if (submitted && i === selected && !isCorrect) borderClass = "border-destructive bg-destructive/10";
            else if (selected === i) borderClass = "border-primary/50 bg-primary/5";

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3 ${borderClass}`}
              >
                <span className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center text-xs font-mono text-muted-foreground">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-foreground">{opt}</span>
                {submitted && i === q.correct && <CheckCircle2 className="w-4 h-4 ml-auto text-accent" />}
                {submitted && i === selected && !isCorrect && i !== q.correct && <XCircle className="w-4 h-4 ml-auto text-destructive" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {submitted && q.explanation && (
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground"><span className="text-primary font-medium">Explanation:</span> {q.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          {!submitted ? (
            <button onClick={handleSubmitAnswer} disabled={!isAnswered} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40">
              Submit
            </button>
          ) : allDone ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground font-medium">
                Score: <span className="glow-text font-display">{score}/{questions.length}</span>
              </span>
              <button onClick={handleRestart} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          ) : (
            <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizPage;
