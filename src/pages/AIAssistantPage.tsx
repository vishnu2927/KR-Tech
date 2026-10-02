import React, { useState, useEffect, useRef } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  codeSnippet?: string;
  mindMap?: any;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  isPinned: boolean;
  date: string;
  messages: Message[];
}

export default function AIAssistantPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "Kafka Event Sourcing vs CDC",
      isPinned: true,
      date: "Today",
      messages: [
        {
          id: "m1",
          role: "user",
          content: "Explain Kafka Event Sourcing vs Change Data Capture (CDC) with Debezium in Hindi and English.",
          timestamp: "10:15 AM",
        },
        {
          id: "m2",
          role: "assistant",
          content: "### Event Sourcing vs CDC with Debezium\n\n**English Explanation:**\nIn Event Sourcing, events are the primary source of truth. State is reconstructed by replaying events from the beginning. In Change Data Capture (CDC), the relational database is the primary source of truth, and Debezium streams WAL (Write-Ahead Log) mutations into Kafka.\n\n**हिंदी में व्याख्या:**\nEvent Sourcing में हर बदलाव एक Event के रूप में Kafka में सेव होता है। जबकि CDC में हम सीधे Database के transaction logs को पढ़कर real-time में events बनाते हैं।",
          timestamp: "10:16 AM",
        },
      ],
    },
    {
      id: "conv-2",
      title: "Virtual Threads Java 21 Performance",
      isPinned: false,
      date: "Yesterday",
      messages: [],
    },
    {
      id: "conv-3",
      title: "Kubernetes Ingress vs Service Mesh",
      isPinned: false,
      date: "2 days ago",
      messages: [],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [activeAction, setActiveAction] = useState<string>("chat"); // 'chat' | 'explain' | 'example' | 'code' | 'translate' | 'terms' | 'mindmap'
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const suggestedPrompts = [
    { title: "Explain Distributed Locking", query: "Explain Redis Redlock vs Zookeeper distributed lock with code", action: "explain" },
    { title: "Translate to Hindi", query: "Translate ACID properties vs BASE model into simple Hindi", action: "translate" },
    { title: "Generate Java 21 Code", query: "Generate a thread-safe rate limiter in Java with virtual threads", action: "code" },
    { title: "Mind Map Microservices", query: "Create a visual mind map of Microservices Communication Patterns", action: "mindmap" },
    { title: "Explain Difficult Terms", query: "Explain Idempotency, Backpressure, and Write-Ahead Log in depth", action: "terms" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, loading]);

  const handleSendMessage = async (customPrompt?: string, actionOverride?: string) => {
    const text = (customPrompt || inputPrompt).trim();
    if (!text || loading) return;

    const action = actionOverride || activeAction;
    const userMsg: Message = {
      id: "msg-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update conversation with user message
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, userMsg] } : c))
    );
    setInputPrompt("");
    setLoading(true);

    try {
      const res = await lmsService.sendAiChat({
        prompt: text,
        action,
        conversationId: activeConvId,
      });

      const aiMsg: Message = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: res.reply,
        codeSnippet: res.codeSnippet,
        mindMap: res.mindMap,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, aiMsg] } : c))
      );
    } catch {
      const fallbackMsg: Message = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: `### KR AI Study Assistant\n\nHere is a structured explanation for **"${text}"**:\n\n- **Principle:** Keep distributed subsystems loosely coupled.\n- **Performance:** Optimize for $O(1)$ lookup times and zero unnecessary network hops.\n- **Security:** Always use TLS 1.3 encryption and short-lived JWT tokens.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, fallbackMsg] } : c))
      );
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = () => {
    const newId = "conv-" + Date.now();
    const newConv: Conversation = {
      id: newId,
      title: "New AI Study Session",
      isPinned: false,
      date: "Just now",
      messages: [
        {
          id: "m-welcome",
          role: "assistant",
          content: "Hello! I am your **KR Global Learning AI Study Mentor**. Ask me anything, generate code, translate into Hindi, or request visual mind maps.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
  };

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="AI Study Assistant | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="24x7 ChatGPT-style AI Study Assistant for KR Tech students. Ask anything, explain topics, generate code, translate to Hindi, and build mind maps."
      />
      <DashboardNavbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Conversation History */}
        <aside
          className={`${
            sidebarOpen ? "w-72" : "w-0 -translate-x-full md:w-16 md:translate-x-0"
          } transition-all duration-300 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20 shrink-0`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <button
              onClick={createNewChat}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-purple-950/40 cursor-pointer transition"
            >
              <span>+</span> <span>New Study Chat</span>
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Toggle sidebar"
            >
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Pinned Chats */}
              {conversations.some((c) => c.isPinned) && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider px-2 mb-1.5 flex items-center gap-1">
                    <span>📌</span> Pinned Conversations
                  </div>
                  <div className="space-y-1">
                    {conversations
                      .filter((c) => c.isPinned)
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setActiveConvId(c.id)}
                          className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition ${
                            activeConvId === c.id
                              ? "bg-purple-600/20 text-purple-200 border border-purple-500/30 font-semibold"
                              : "hover:bg-slate-800/60 text-slate-300"
                          }`}
                        >
                          <span className="truncate flex-1">💬 {c.title}</span>
                          <button
                            onClick={(e) => togglePin(c.id, e)}
                            className="text-amber-400 hover:text-amber-300 opacity-80 hover:opacity-100 ml-2"
                            title="Unpin"
                          >
                            📌
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* All History */}
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1.5">
                  Recent Sessions
                </div>
                <div className="space-y-1">
                  {conversations
                    .filter((c) => !c.isPinned)
                    .map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setActiveConvId(c.id)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition ${
                          activeConvId === c.id
                            ? "bg-purple-600/20 text-purple-200 border border-purple-500/30 font-semibold"
                            : "hover:bg-slate-800/60 text-slate-300"
                        }`}
                      >
                        <span className="truncate flex-1">💬 {c.title}</span>
                        <button
                          onClick={(e) => togglePin(c.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-amber-400 ml-2 transition"
                          title="Pin conversation"
                        >
                          📌
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {sidebarOpen && (
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 text-center">
              KR Tech AI Studio v9.0 • Unlimited Queries
            </div>
          )}
        </aside>

        {/* Main Chat Interface */}
        <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {/* Header */}
          <div className="py-3 px-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h1 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>AI Study Assistant</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                    GPT-4o Learning Engine
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400">
                  KR GLOBAL LEARNING PRIVATE LIMITED • Learn. Build. Grow. Globally.
                </p>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              {[
                { key: "chat", label: "Ask Anything", icon: "💭" },
                { key: "explain", label: "Explain Topic", icon: "📖" },
                { key: "code", label: "Generate Code", icon: "💻" },
                { key: "translate", label: "English ↔ Hindi", icon: "🌐" },
                { key: "mindmap", label: "Mind Map", icon: "🗺️" },
                { key: "terms", label: "Difficult Terms", icon: "🔍" },
              ].map((act) => (
                <button
                  key={act.key}
                  onClick={() => setActiveAction(act.key)}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
                    activeAction === act.key
                      ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span>{act.icon}</span> <span>{act.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeConv.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto p-6 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-3xl shadow-xl shadow-purple-900/40">
                  ⚡
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">How can I help you study today?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Ask technical doubts, generate clean code, translate concepts to Hindi, or visualize mind maps.
                  </p>
                </div>

                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {suggestedPrompts.map((sp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sp.query, sp.action)}
                      className="p-3 text-left rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 transition cursor-pointer text-xs group"
                    >
                      <div className="font-bold text-purple-300 group-hover:text-cyan-300">{sp.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sp.query}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${msg.role === "user" ? "ml-auto justify-end" : "mr-auto"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center text-sm shrink-0">
                      🤖
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed space-y-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none shadow-lg shadow-purple-950/40"
                        : "bg-slate-900/90 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-xl"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {msg.codeSnippet && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                        <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>Snippet Solution</span>
                          <button
                            onClick={() => copyToClipboard(msg.codeSnippet || "", msg.id)}
                            className="text-cyan-400 hover:text-cyan-300 font-sans"
                          >
                            {copiedId === msg.id ? "✓ Copied" : "Copy Code"}
                          </button>
                        </div>
                        <pre className="p-3 text-xs text-cyan-300 font-mono overflow-x-auto m-0">
                          <code>{msg.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="hover:text-purple-300 transition"
                          >
                            {copiedId === msg.id ? "✓ Copied" : "Copy text"}
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => alert("✓ Conversation saved to your personal KR Tech study library!")}
                            className="hover:text-cyan-300 transition"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-sm shrink-0">
                      👤
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center gap-3 text-xs text-purple-400 animate-pulse">
                <span className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center">🤖</span>
                <span>KR AI Study Mentor is synthesizing response & generating code...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto flex items-end gap-3">
              <div className="flex-1 relative rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 transition">
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={2}
                  placeholder={`Ask anything (${activeAction.toUpperCase()} mode enabled)... Press Enter to send.`}
                  className="w-full p-3 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || loading}
                className="h-12 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span> <span>➔</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
