import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  sendMentorMessage,
  getChatSessions,
  type ChatMessage,
  type AIChatSession,
} from "../services/aiService";
import ChatBubble from "../components/ai/ChatBubble";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

const PERSONAS = [
  { id: "general", label: "Chief AI Tech Mentor", icon: "🤖", desc: "Holistic engineering guidance & career direction" },
  { id: "fullstack", label: "Full-Stack Architect", icon: "💻", desc: "React 19, TypeScript, Java Spring Boot & Node.js" },
  { id: "cloud_devops", label: "Cloud & DevOps Lead", icon: "☁️", desc: "AWS, Docker, Kubernetes & CI/CD Pipelines" },
  { id: "system_design", label: "System Design Staff", icon: "🏛️", desc: "Distributed systems, caching, Kafka & scalability" },
  { id: "cybersecurity", label: "Security & CEH Specialist", icon: "🛡️", desc: "OWASP Top 10, ethical hacking & zero-trust" },
  { id: "dsa", label: "Algorithms Coach", icon: "⚡", desc: "Data structures, Big-O analysis & LeetCode patterns" },
];

const SUGGESTED_PROMPTS = [
  "How do I implement the Saga pattern for distributed transactions in Spring Boot?",
  "Explain React 19 Server Components vs Client Components with code examples.",
  "Design a rate limiter for 100k requests/sec using Redis and token bucket.",
  "What is the difference between Kubernetes Ingress and LoadBalancer services?",
];

export default function AIMentorPage() {
  const { user } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState<string>("general");
  const [sessionId, setSessionId] = useState<string>(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pastSessions, setPastSessions] = useState<AIChatSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      role: "assistant",
      content: `Welcome! I am your One-on-One Senior Technical Mentor at KR Global Learning.

Feel free to ask me to:
- **Review Architecture**: Microservices, Event-Driven Kafka pipelines, Database Sharding.
- **Inspect Code**: React 19, Spring Boot, Node.js, Kubernetes manifests.
- **Deconstruct Algorithmic Trade-offs**: Big-O runtime, space complexity, and concurrency.

Select a specialized mentor persona above or ask any question to get started!`,
      timestamp: new Date().toISOString(),
    };
    setMessages([greeting]);
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const sessions = await getChatSessions();
      setPastSessions(sessions);
    } catch {
      // Ignored in offline
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendMentorMessage({
        sessionId,
        message: text.trim(),
        mentorPersona: selectedPersona,
        topic: "Technical Mentorship",
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      fetchHistory();
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a temporary network bottleneck. Please re-send your message.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    const newId = `session_${Date.now()}`;
    setSessionId(newId);
    setMessages([
      {
        role: "assistant",
        content: `New technical session started with **${
          PERSONAS.find((p) => p.id === selectedPersona)?.label || "AI Mentor"
        }**. How can I help you today?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleLoadPastSession = (s: AIChatSession) => {
    setSessionId(s.sessionId);
    setSelectedPersona(s.mentorPersona);
    setMessages(s.messages);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="One-on-One AI Tech Mentor | KR Global Learning"
        description="Connect with our AI Technical Mentor for architectural code reviews, algorithmic design, and enterprise engineering guidance."
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>🤖</span> Phase 8 Sprint 8.1 AI Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            One-on-One AI Senior Technical Mentor
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            Ask complex architectural questions, debug full-stack code, and master distributed engineering concepts with specialized mentor personas.
          </p>
        </div>

        {/* Persona Selector Carousel/Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {PERSONAS.map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPersona(p.id);
                  handleNewSession();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                    : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300"
                }`}
              >
                <div>
                  <span className="text-xl block mb-1">{p.icon}</span>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {p.label}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* History Sidebar */}
          <div className="hidden lg:block lg:col-span-1 bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 h-[620px] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Past Sessions
                </h3>
                <button
                  type="button"
                  onClick={handleNewSession}
                  className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-all font-semibold cursor-pointer"
                >
                  + New Chat
                </button>
              </div>

              <div className="mt-4 space-y-2 overflow-y-auto max-h-[480px] pr-1">
                {pastSessions.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No past sessions recorded yet.
                  </p>
                ) : (
                  pastSessions.map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => handleLoadPastSession(s)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer border ${
                        sessionId === s.sessionId
                          ? "bg-slate-800 border-cyan-500/40 text-cyan-300 font-semibold"
                          : "bg-slate-950/40 hover:bg-slate-800/40 border-slate-800/60 text-slate-400"
                      }`}
                    >
                      <div className="truncate font-medium">
                        {s.messages[1]?.content?.slice(0, 32) || s.topic || "Technical Session"}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        {new Date(s.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} • {s.messages.length} msgs
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Model: <strong className="text-slate-400">GPT-4o-Mini</strong></span>
              <span className="text-emerald-400">● Online</span>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-[620px]">
            {/* Suggested Prompts Pill Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-800/80 mb-4 scrollbar-none">
              <span className="text-[11px] text-slate-500 font-semibold shrink-0">
                Ideas:
              </span>
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] px-3 py-1 rounded-full bg-slate-950 hover:bg-cyan-500/10 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 text-slate-400 shrink-0 transition-all cursor-pointer"
                >
                  {prompt.length > 40 ? `${prompt.slice(0, 40)}...` : prompt}
                </button>
              ))}
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {messages.map((msg, idx) => (
                <ChatBubble
                  key={idx}
                  message={msg}
                  mentorPersona={selectedPersona}
                  userAvatar={user?.avatar}
                />
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800 w-fit text-xs text-slate-400">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-150" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-300" />
                  </div>
                  <span>AI Mentor is compiling an architectural solution...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-3"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about microservices, Spring Boot, React 19, Kubernetes manifests, or Big-O..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span>
                <span>➔</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
