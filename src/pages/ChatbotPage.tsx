import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Message {
  id: string;
  user_id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}

const ChatbotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const { data, error } = await (supabase.from("messages") as any).select("id").limit(1);
      if (error) {
        if (error.code === "PGRST116") {
          toast.success("Connection OK! Table exists but is empty.");
        } else {
          toast.error(`Database Error: ${error.message}`, {
            description: `Code: ${error.code}. If it says 'Could not find table', PLEASE run the SQL script in Supabase SQL Editor again AND click 'Run'.`,
          });
        }
      } else {
        toast.success("Connection successful! Table found.");
      }
    } catch (err: any) {
      toast.error(`Unexpected Error: ${err.message}`);
    }
    setChecking(false);
  };

  useEffect(() => {
    if (!user) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await (supabase
        .from("messages") as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Failed to load messages");
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user || loading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setLoading(true);

    try {
      const { error } = await (supabase.from("messages") as any).insert({
        user_id: user.id,
        content: userMessage,
        role: "user",
      });

      if (error) throw error;

      // Trigger AI response via Edge Function
      await supabase.functions.invoke("chat-response", {
        body: { user_id: user.id, content: userMessage },
      });

    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-2xl font-display font-bold gradient-text flex items-center gap-4">
          AI Skill Assistant
          <button
            onClick={checkConnection}
            disabled={checking}
            className="text-[10px] px-2 py-1 rounded bg-muted hover:bg-muted-foreground/10 transition-colors flex items-center gap-1"
          >
            {checking ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : "Check DB"}
          </button>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Chat with AI to clarify your roadmap and learn faster.</p>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg mb-4" ref={scrollRef}>
        {messages.length === 0 && !loading && (
          <div className="text-center text-muted-foreground py-8">
            Start a conversation!
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-background text-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading || !user}
        />
        <button
          type="submit"
          className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !inputValue.trim() || !user}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatbotPage;
