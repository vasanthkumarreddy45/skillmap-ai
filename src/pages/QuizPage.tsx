import { useState } from "react";
import { motion } from "framer-motion";
import { Timer, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

const sampleQuestions = [
  {
    id: 1,
    question: "Which algorithm is commonly used for classification in supervised learning?",
    type: "mcq",
    options: ["K-Means", "Random Forest", "DBSCAN", "PCA"],
    correct: 1,
  },
  {
    id: 2,
    question: "Gradient descent is used to minimize the loss function.",
    type: "tf",
    options: ["True", "False"],
    correct: 0,
  },
  {
    id: 3,
    question: "What is the purpose of regularization in machine learning?",
    type: "mcq",
    options: ["Increase overfitting", "Prevent overfitting", "Speed up training", "Increase parameters"],
    correct: 1,
  },
];

const QuizPage = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft] = useState(120);

  const q = sampleQuestions[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === q.correct;

  const handleSelect = (i: number) => {
    if (submitted) return;
    setSelected(i);
    const newAnswers = [...answers];
    newAnswers[current] = i;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < sampleQuestions.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1]);
      setSubmitted(false);
    }
  };

  const handleSubmitAnswer = () => {
    setSubmitted(true);
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(new Array(sampleQuestions.length).fill(null));
    setSubmitted(false);
  };

  const score = answers.reduce((acc, a, i) => acc + (a === sampleQuestions[i].correct ? 1 : 0), 0);
  const allDone = current === sampleQuestions.length - 1 && submitted;

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold gradient-text">AI Quiz</h1>
        <p className="text-sm text-muted-foreground mt-1">Test your knowledge with AI-generated questions</p>
      </motion.div>

      {/* Progress & Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {sampleQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono transition-all ${
                i === current
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : answers[i] !== null
                  ? "bg-accent/20 text-accent"
                  : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Timer className="w-4 h-4" />
          <span className="font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {q.type === "mcq" ? "Multiple Choice" : "True / False"}
          </span>
        </div>
        <h2 className="text-lg font-medium text-foreground mb-6">{q.question}</h2>

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

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          {!submitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!isAnswered}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 transition-opacity"
            >
              Submit
            </button>
          ) : allDone ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground font-medium">
                Score: <span className="glow-text font-display">{score}/{sampleQuestions.length}</span>
              </span>
              <button onClick={handleRestart} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizPage;
