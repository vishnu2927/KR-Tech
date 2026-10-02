import React, { useState } from 'react';
import SEO from '../components/common/SEO';

interface QAThread {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    date: string;
  };
  tags: string[];
  category: string;
  question: string;
  isResolved: boolean;
  upvotes: number;
  mentorAnswer?: {
    mentorName: string;
    mentorRole: string;
    mentorCompany: string;
    mentorAvatar: string;
    answerText: string;
    codeSnippet?: string;
    upvotes: number;
    answeredAt: string;
  };
}

const INITIAL_THREADS: QAThread[] = [
  {
    id: 'qa-1',
    title: 'How to handle Distributed Cache Invalidation with Redis & PostgreSQL without race conditions?',
    author: {
      name: 'Aditya Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      badge: 'Top Contributor',
      date: '2 hours ago',
    },
    tags: ['redis', 'postgresql', 'caching', 'system-design'],
    category: 'Architecture',
    question:
      'In our high-throughput e-commerce service, reading product stock from Redis is blazing fast, but when stock updates happen in PostgreSQL, we encounter race conditions between cache invalidation and subsequent reads. Should we adopt Write-Through caching or Cache-Aside with Redis PubSub / Debezium CDC?',
    isResolved: true,
    upvotes: 42,
    mentorAnswer: {
      mentorName: 'Dr. Priya Sharma',
      mentorRole: 'VP of Engineering / Cloud Architect',
      mentorCompany: 'Enterprise Cloud Systems',
      mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      answerText:
        'Great question Aditya! For 100k+ transactions, do NOT invalidate synchronously in your HTTP handler. Instead, use Cache-Aside combined with Change Data Capture (CDC via Debezium + Kafka). When Postgres commits, the WAL event triggers an async cache purge, avoiding dual-write race conditions.',
      codeSnippet: `// Debezium Kafka Consumer purges stale Redis key asynchronously
consumer.on("message", async ({ key, value }) => {
  const productId = value.after.id;
  await redis.del(\`product:\${productId}\`);
});`,
      upvotes: 89,
      answeredAt: '1 hour ago',
    },
  },
  {
    id: 'qa-2',
    title: 'What is the most common pitfall in Uber/Ola Low-Level System Design interviews?',
    author: {
      name: 'Rohit Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'Industry Ready Skills',
      date: '5 hours ago',
    },
    tags: ['system-design', 'uber', 'lld', 'concurrency'],
    category: 'System Design',
    question:
      'When designing a Ride-Sharing dispatch service like Uber, candidates often jump directly to Geospatial H3 / QuadTree indexing. What does the interviewer evaluate first in concurrency and driver matching?',
    isResolved: true,
    upvotes: 35,
    mentorAnswer: {
      mentorName: 'Arjun Verma',
      mentorRole: 'Staff Distributed Systems Architect',
      mentorCompany: 'Uber Tech',
      mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      answerText:
        'The #1 mistake is forgetting double-booking race conditions! Two nearby passengers can be matched to the same driver simultaneously. In your LLD, always model the Driver State Machine (IDLE -> RESERVED -> ON_TRIP) using Redis Distributed Locks (Redlock) or database row-level locking (SELECT ... FOR UPDATE).',
      upvotes: 67,
      answeredAt: '3 hours ago',
    },
  },
  {
    id: 'qa-3',
    title: 'Should I prepare Spring Boot or Node.js/Go for FinTech Backend Engineering in 2026?',
    author: {
      name: 'Tanvi Jain',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      badge: 'Student Member',
      date: 'Yesterday',
    },
    tags: ['learning', 'springboot', 'golang', 'fintech'],
    category: 'Learning Roadmaps',
    question:
      'I have 6 months before completing my technical degree. Tier-1 banks (Goldman Sachs, Morgan Stanley) seem to love Java/Spring Boot, whereas modern FinTechs (Razorpay, Stripe) build extensively in Go. Which stack offers higher ROI for enterprise production development?',
    isResolved: false,
    upvotes: 19,
  },
];

export default function MentorQAPage() {
  const [threads, setThreads] = useState<QAThread[]>(INITIAL_THREADS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('Architecture');
  const [newTags, setNewTags] = useState('');

  const filteredThreads = threads.filter((t) => {
    if (activeFilter === 'resolved') return t.isResolved;
    if (activeFilter === 'unresolved') return !t.isResolved;
    return true;
  });

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) return;

    const newThread: QAThread = {
      id: `qa-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      question: newQuestion.trim(),
      author: {
        name: 'You (Student)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        badge: 'Peer Inquirer',
        date: 'Just now',
      },
      tags: newTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      isResolved: false,
      upvotes: 1,
    };

    setThreads([newThread, ...threads]);
    setShowAskModal(false);
    setNewTitle('');
    setNewQuestion('');
    setNewTags('');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Mentor Q&A Forum | KR Global Learning"
        description="Direct technical mentorship from VP & Staff Engineers at Google, Uber, and Microsoft. Ask architecture, code review, and career questions."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-emerald-950/40 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase">
                <span>⚡ Verified Industry Mentors</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                Mentor Q&A Advisory Board
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Get answers from MAANG staff architects on high-throughput distributed systems, tricky concurrency bugs, and certification roadmap guidance.
              </p>
            </div>

            <button
              onClick={() => setShowAskModal(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <span>❓</span>
              <span>Ask a Mentor</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Inquiries ({threads.length})
            </button>
            <button
              onClick={() => setActiveFilter('resolved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>✓</span> Answered by Mentor ({threads.filter((t) => t.isResolved).length})
            </button>
            <button
              onClick={() => setActiveFilter('unresolved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'unresolved'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>⏳</span> Awaiting Mentor Review ({threads.filter((t) => !t.isResolved).length})
            </button>
          </div>
        </div>

        {/* Q&A Thread List */}
        <div className="space-y-6">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 transition-all hover:border-emerald-500/30"
            >
              {/* Question Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={thread.author.avatar}
                      alt={thread.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{thread.author.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {thread.author.badge}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{thread.author.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
                      {thread.category}
                    </span>
                    {thread.isResolved ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <span>✓</span> Answered by Mentor
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                        ⏳ Under Mentor Review
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white leading-snug">{thread.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed">{thread.question}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {thread.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-xs font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Mentor Answer Highlight Box */}
              {thread.mentorAnswer && (
                <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-950/70 border border-emerald-500/30 space-y-4 shadow-xl shadow-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={thread.mentorAnswer.mentorAvatar}
                        alt={thread.mentorAnswer.mentorName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-white">
                            {thread.mentorAnswer.mentorName}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-extrabold">
                            VERIFIED MENTOR
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {thread.mentorAnswer.mentorRole} •{' '}
                          <span className="text-emerald-400 font-semibold">
                            {thread.mentorAnswer.mentorCompany}
                          </span>
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-500">{thread.mentorAnswer.answeredAt}</span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed">
                    {thread.mentorAnswer.answerText}
                  </p>

                  {thread.mentorAnswer.codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <div className="px-4 py-1.5 bg-slate-900 text-[10px] font-mono text-cyan-400 border-b border-slate-800">
                        VERIFIED ARCHITECTURAL PATTERN
                      </div>
                      <pre className="p-4 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed">
                        <code>{thread.mentorAnswer.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-400">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span>▲</span> {thread.mentorAnswer.upvotes} Students found this helpful
                    </span>
                    <span className="text-slate-500">Official KR Global Learning Mentor Verified Response</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Ask an Industry Mentor</h3>
              <button onClick={() => setShowAskModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Question Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How do I scale WebSocket connections to 1M concurrent users?"
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Domain Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Architecture">System Design & Architecture</option>
                  <option value="Certifications">Certifications & Learning Roadmaps</option>
                  <option value="Career">Career & Stack Choice</option>
                  <option value="DSA">Algorithmic Mastery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Describe context, scale, and specific trade-offs you are considering..."
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="websockets, redis, scaling, nodejs"
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
