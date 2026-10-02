import React, { useState } from "react";
import { LessonItem } from "./LessonSidebar";
import { AssignmentData } from "./AssignmentUploadModal";

interface LessonNotesProps {
  lesson: LessonItem;
  assignment?: AssignmentData | null;
  onOpenAssignmentModal?: () => void;
}

export default function LessonNotes({
  lesson,
  assignment,
  onOpenAssignmentModal,
}: LessonNotesProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "resources" | "discussion" | "assignment"
  >("notes");

  const [comments, setComments] = useState([
    {
      id: "c1",
      author: "Sneha Rao",
      role: "Backend Fellow",
      avatar: "SR",
      time: "2 hours ago",
      text: "Is it recommended to use Project Loom Virtual Threads directly with WebFlux, or should we stick to traditional Netty event loops?",
      mentorReply: {
        author: "Dr. Rajesh Kumar (Principal Technical Architect Staff)",
        text: "Great question, Sneha! For CPU-bound operations or reactive stream composition, Netty event loops remain optimal. Virtual Threads shine when calling blocking legacy JDBC or external REST APIs without rewriting to reactive syntax.",
      },
    },
    {
      id: "c2",
      author: "Vikram M.",
      role: "DevOps Engineer",
      avatar: "VM",
      time: "1 day ago",
      text: "The explanation of Kafka partition keys and rebalance listeners in Lesson 4 was top tier. Tested with 3 consumers locally!",
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      {
        id: `c-${Date.now()}`,
        author: "Aditya Sharma (You)",
        role: "Student Fellow",
        avatar: "AS",
        time: "Just now",
        text: newComment.trim(),
      },
      ...comments,
    ]);
    setNewComment("");
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-5 sm:p-7 shadow-xl">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-800/80 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === "notes"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
              : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span>📝 Architecture Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/40"
              : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span>🎯 Lesson Objectives</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === "resources"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
              : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span>📂 Resources & Downloads</span>
          {lesson.resources && lesson.resources.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
              {lesson.resources.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("discussion")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeTab === "discussion"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
              : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span>💬 Mentorship & Q&A</span>
        </button>

        {assignment && (
          <button
            type="button"
            onClick={() => setActiveTab("assignment")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeTab === "assignment"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40"
                : "bg-slate-800/60 text-amber-400 hover:text-amber-300 hover:bg-slate-800 border border-amber-500/30"
            }`}
          >
            <span>🏆 Capstone Submission</span>
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {/* 1. ARCHITECTURE NOTES TAB */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                  Lecture {lesson.lessonNumber} · Reference Notes
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {lesson.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <span>🖨️ Export PDF</span>
              </button>
            </div>

            {/* Formatted Notes Body */}
            <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
              {lesson.notes ? (
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 font-sans space-y-4">
                  {lesson.notes.split("\n\n").map((block, idx) => {
                    if (block.startsWith("###")) {
                      return (
                        <h4
                          key={idx}
                          className="text-base font-bold text-cyan-300 border-b border-slate-800 pb-2 pt-2"
                        >
                          {block.replace("###", "").trim()}
                        </h4>
                      );
                    }
                    if (block.startsWith("-")) {
                      return (
                        <ul key={idx} className="space-y-2 list-disc list-inside text-slate-300">
                          {block.split("\n").map((line, lIdx) => (
                            <li key={lIdx} className="leading-normal">
                              {line.replace(/^-\s*/, "")}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} className="text-slate-300">
                        {block}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-center">
                  Comprehensive notes and architectural diagrams will synchronize dynamically as
                  you progress through this lesson.
                </div>
              )}

              {/* Code Snippet Demonstration */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden mt-4">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-2">DistributedSystemPattern.java</span>
                  </div>
                  <span>Spring 3.2 / Java 21</span>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto">
{`@Service
public class OrderEventStreamingService {
    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;
    private final MeterRegistry meterRegistry;

    @Transactional
    public CompletableFuture<SendResult<String, OrderPlacedEvent>> dispatchOrder(Order order) {
        OrderPlacedEvent event = new OrderPlacedEvent(order.getId(), order.getTotal(), Instant.now());
        return kafkaTemplate.send("orders.v1", order.getPartitionKey(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    meterRegistry.counter("kafka.order.dispatch.failed").increment();
                } else {
                    meterRegistry.counter("kafka.order.dispatch.success").increment();
                }
            });
    }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* 2. LESSON OBJECTIVES TAB */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">What You Will Master in This Lesson</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lesson.description ||
                "Understand distributed architectures, event loop performance, and high-concurrency stream tuning."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-cyan-400 block">🎯 Core Takeaways</span>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Idempotent request dispatch and poison-pill recovery</li>
                  <li>Zero dual-write inconsistency via Outbox pattern</li>
                  <li>Memory leak prevention in high-throughput streams</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-purple-400 block">
                  ⚙️ Prerequisites & Environment
                </span>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Docker compose with Kafka & Zookeeper/KRaft</li>
                  <li>Java 17+ or Node.js 20+ runtime</li>
                  <li>Postman / curl for API verification</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. RESOURCES & DOWNLOADS TAB */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Downloadable Assets & References</h3>
            <p className="text-xs text-slate-400">
              Approved production guides, architecture diagrams, and official KR Global Learning starter
              repositories.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {lesson.resources && lesson.resources.length > 0 ? (
                lesson.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between group no-underline"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
                        {res.type === "code" ? "🐙" : "📄"}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block group-hover:text-emerald-300 truncate">
                          {res.title}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {res.type || "PDF Document"}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-emerald-400 text-sm">↓</span>
                  </a>
                ))
              ) : (
                <div className="col-span-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs">
                  No separate attachments for this lesson. Check Github starter repo in Module 1.
                </div>
              )}

              {/* Standard Academy Cheatsheet */}
              <a
                href="https://github.com/krtech-academy"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between group no-underline"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-lg shrink-0">
                    ⚡
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block group-hover:text-cyan-300 truncate">
                      KR Global Learning Official GitHub Organization
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Production Repositories
                    </span>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-cyan-400 text-sm">↗</span>
              </a>
            </div>
          </div>
        )}

        {/* 4. DISCUSSION & Q&A TAB */}
        {activeTab === "discussion" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Ask Principal Mentors & Discussion</h3>

            {/* Post Comment Input */}
            <form onSubmit={handlePostComment} className="flex gap-3">
              <input
                type="text"
                placeholder="Ask a technical question about this lesson or architecture..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white cursor-pointer shrink-0 transition-all shadow-md shadow-purple-950/40"
              >
                Ask Question 🚀
              </button>
            </form>

            {/* Comment Stream */}
            <div className="space-y-4 divide-y divide-slate-800/60 pt-2">
              {comments.map((c) => (
                <div key={c.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {c.avatar}
                      </div>
                      <div>
                        <span className="font-bold text-white">{c.author}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({c.role})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">{c.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 pl-9">{c.text}</p>

                  {/* Mentor Reply */}
                  {c.mentorReply && (
                    <div className="ml-9 mt-2 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-purple-300 text-[11px]">
                        <span>🛡️ Verified Mentor Response:</span>
                        <span>{c.mentorReply.author}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{c.mentorReply.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CAPSTONE ASSIGNMENT TAB */}
        {activeTab === "assignment" && assignment && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-950 to-slate-900 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Capstone Challenge Available
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Points: <strong className="text-white">{assignment.maxScore || 100}</strong>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">{assignment.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {assignment.description}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAssignmentModal}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-950/50 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Upload GitHub Repo Solution</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
