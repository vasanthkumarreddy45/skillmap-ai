import { motion } from "framer-motion";
import { MessageSquare, Volume2 } from "lucide-react";

const ChatbotPage = () => (
  <div className="space-y-8 max-w-3xl">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold gradient-text">AI Chatbot</h1>
      <p className="text-sm text-muted-foreground mt-1">Ask doubts, get explanations, and listen in your native language</p>
    </motion.div>
    <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 pulse-glow">
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-display text-sm font-semibold text-foreground mb-2">Coming Soon</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        AI-powered chatbot with Gemini integration, web-scraped knowledge, and text-to-audio via Servam API.
      </p>
      <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-muted/30">
        <Volume2 className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground">Native language audio support</span>
      </div>
    </div>
  </div>
);

export default ChatbotPage;
