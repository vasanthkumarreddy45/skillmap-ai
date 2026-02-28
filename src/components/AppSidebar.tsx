import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Brain, BookOpen, MessageSquare, Map, Library, Settings, Zap, Trophy, LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/skills", icon: Brain, label: "Skills" },
  { to: "/quiz", icon: BookOpen, label: "Quiz" },
  { to: "/chatbot", icon: MessageSquare, label: "Chatbot" },
  { to: "/roadmap", icon: Map, label: "Roadmap" },
  { to: "/resources", icon: Library, label: "Resources" },
];

export const AppSidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center pulse-glow">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-sm font-bold glow-text">SkillMap</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">AI Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={() => `nav-item ${location.pathname === item.to ? "active" : ""}`}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </motion.div>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border">
        {user && (
          <div className="mx-1 mb-2 px-3 py-2">
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="nav-item w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
        <div className="mx-4 mt-3 mb-2 glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs font-medium text-foreground">7 Day Streak</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>
        </div>
      </div>
    </aside>
  );
};
