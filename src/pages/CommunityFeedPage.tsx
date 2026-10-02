import React, { useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
import { communityService, PostItem, CommentItem } from '../services/communityService';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../utils/socketClient';

export default function CommunityFeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'trending' | 'latest' | 'top'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTags, setTrendingTags] = useState<{ name: string; count: number }[]>([]);
  const [savedPostsOnly, setSavedPostsOnly] = useState(false);

  // Expanded comment drawer per post
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, CommentItem[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Create post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newTags, setNewTags] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [hasCode, setHasCode] = useState(false);
  const [codeLang, setCodeLang] = useState('javascript');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadFeed = async () => {
    setLoading(true);
    try {
      if (savedPostsOnly) {
        const res = await communityService.getSavedPosts(user?.email || undefined);
        setPosts(res.posts || []);
      } else {
        const res = await communityService.getFeed({
          category: activeCategory,
          sort: sortOrder,
          search: searchQuery || undefined,
        });
        setPosts(res.posts || []);
        if (res.trendingTags?.length) {
          setTrendingTags(res.trendingTags);
        }
      }
    } catch (err) {
      console.error('Error loading feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [activeCategory, sortOrder, savedPostsOnly]);

  // Real-time socket updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewPost = (newPost: PostItem) => {
      setPosts((prev) => [newPost, ...prev.filter((p) => p._id !== newPost._id)]);
      showToast(`🔥 New post by ${newPost.author.name}!`);
    };

    const handlePostUpvoted = ({ postId, upvotesCount }: { postId: string; upvotesCount: number }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, upvotesCount } : p))
      );
    };

    socket.on('community:new_post', handleNewPost);
    socket.on('community:post_upvoted', handlePostUpvoted);

    return () => {
      socket.off('community:new_post', handleNewPost);
      socket.off('community:post_upvoted', handlePostUpvoted);
    };
  }, []);

  const handleUpvote = async (postId: string) => {
    try {
      const res = await communityService.toggleLike(postId, user?.email || undefined);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const currentUpvotes = p.upvotes || [];
            const userEmail = user?.email || 'guest@krtech.in';
            const updatedUpvotes = res.isLiked
              ? [...currentUpvotes, userEmail]
              : currentUpvotes.filter((e) => e !== userEmail);
            return {
              ...p,
              upvotesCount: res.upvotesCount,
              upvotes: updatedUpvotes,
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleToggleSave = async (postId: string) => {
    try {
      const res = await communityService.toggleSavePost(postId, user?.email || undefined);
      showToast(res.message || (res.saved ? 'Post saved to bookmarks!' : 'Bookmark removed'));
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleToggleComments = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (!postComments[postId]) {
      try {
        const res = await communityService.getPostById(postId);
        setPostComments((prev) => ({ ...prev, [postId]: res.comments || [] }));
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setIsSubmittingComment(true);
    try {
      const res = await communityService.addComment({
        postId,
        content: text,
      });
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.comment],
      }));
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, commentsCount: res.commentsCount } : p))
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      showToast('Comment published!');
    } catch (err) {
      console.error('Failed to comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await communityService.createPost({
        title: newTitle,
        content: newContent,
        category: newCategory as any,
        tags: tagsArray,
        company: newCompany.trim() || undefined,
        codeSnippet: hasCode ? { language: codeLang, code: codeSnippet } : undefined,
      });

      setPosts((prev) => [res.post, ...prev]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
      setNewCompany('');
      setCodeSnippet('');
      setHasCode(false);
      showToast('🎉 Your discussion post is live!');
    } catch (err) {
      console.error('Post creation failed:', err);
      showToast('Failed to create post. Please try again.');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const CATEGORIES = [
    { id: 'all', label: 'All Topics', icon: '🌐' },
    { id: 'announcement', label: 'Announcements', icon: '📢' },
    { id: 'dsa', label: 'DSA Arena', icon: '⚔️' },
    { id: 'certifications', label: 'Certifications & Skills', icon: '🚀' },
    { id: 'mentor_qa', label: 'Mentor Q&A', icon: '❓' },
    { id: 'webdev', label: 'WebDev & FullStack', icon: '⚡' },
    { id: 'ai', label: 'AI & LLMs', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Community Social Feed | KR Global Learning"
        description="Join thousands of engineering students discussing coding solutions, certification roadmaps, and live technical doubts with verified mentors."
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-600/90 backdrop-blur-md border border-purple-400/40 text-white px-5 py-3 rounded-xl shadow-2xl shadow-purple-900/40 flex items-center gap-3 animate-bounce">
          <span>✨</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/30 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                <span>⚡ Real-Time Collaborative Hub</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                Student Community & Tech Forum
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Collaborate with 15,000+ peers, crack MAANG interview rounds, participate in LeetCode solution debates, and get answers from verified industry mentors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSavedPostsOnly(!savedPostsOnly)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                  savedPostsOnly
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>🔖</span>
                <span>{savedPostsOnly ? 'Viewing Bookmarks' : 'Saved Posts'}</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center gap-2"
              >
                <span>✍️</span>
                <span>Create New Post</span>
              </button>
            </div>
          </div>

          {/* Search & Sort Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadFeed()}
                placeholder="Search algorithms, companies, mentors..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-medium">Sort:</span>
              {(['trending', 'latest', 'top'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortOrder(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    sortOrder === s
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-white/5'
                  }`}
                >
                  {s === 'trending' ? '🔥 Trending' : s === 'latest' ? '✨ Latest' : '🏆 Top Upvoted'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSavedPostsOnly(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                activeCategory === cat.id && !savedPostsOnly
                  ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Main Grid: Feed + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Feed (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-5">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 bg-slate-900/50 border border-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 border border-white/5 rounded-2xl p-8 space-y-4">
                <span className="text-5xl">💬</span>
                <h3 className="text-xl font-bold text-white">No discussions found</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  {savedPostsOnly
                    ? "You haven't bookmarked any discussions yet."
                    : 'Be the first to start a conversation in this topic!'}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all"
                >
                  Create Discussion
                </button>
              </div>
            ) : (
              posts.map((post) => {
                const isExpanded = expandedPostId === post._id;
                const comments = postComments[post._id] || [];
                const userEmail = user?.email || 'guest@krtech.in';
                const hasLiked = post.upvotes?.includes(userEmail) || false;

                return (
                  <div
                    key={post._id}
                    className={`bg-slate-900/70 border rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/30 ${
                      post.isPinned
                        ? 'border-purple-500/40 bg-gradient-to-b from-purple-950/20 to-slate-900/80 shadow-lg shadow-purple-950/30'
                        : 'border-white/10'
                    }`}
                  >
                    {/* Author & Header Metadata */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            post.author.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white hover:text-purple-300 cursor-pointer">
                              {post.author.name}
                            </span>
                            {post.author.isMentor && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                                VERIFIED MENTOR
                              </span>
                            )}
                            {post.author.badge && !post.author.isMentor && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-medium">
                                {post.author.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center gap-1">
                            📌 Pinned
                          </span>
                        )}
                        {post.company && (
                          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold">
                            💼 {post.company}
                          </span>
                        )}
                        {post.dsaDifficulty && (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              post.dsaDifficulty === 'Hard'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : post.dsaDifficulty === 'Medium'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {post.dsaDifficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h2
                      onClick={() => handleToggleComments(post._id)}
                      className="text-lg md:text-xl font-bold text-white hover:text-purple-300 cursor-pointer transition-colors mb-3 leading-snug"
                    >
                      {post.title}
                    </h2>

                    {/* Content */}
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-4">
                      {post.content}
                    </p>

                    {/* Optional Code Snippet */}
                    {post.codeSnippet && post.codeSnippet.code && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-mono text-cyan-400">
                            {post.codeSnippet.language.toUpperCase() || 'CODE'}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(post.codeSnippet?.code || '');
                              showToast('Code copied to clipboard!');
                            }}
                            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                          >
                            📋 Copy
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-purple-200 overflow-x-auto leading-relaxed">
                          <code>{post.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs hover:text-purple-300 cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleUpvote(post._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                            hasLiked
                              ? 'bg-purple-600/30 border-purple-500 text-purple-300 font-bold'
                              : 'border-white/5 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span>▲</span>
                          <span>{post.upvotesCount || 0} Upvotes</span>
                        </button>

                        <button
                          onClick={() => handleToggleComments(post._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                            isExpanded
                              ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                              : 'border-white/5 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span>💬</span>
                          <span>{post.commentsCount || 0} Replies</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleSave(post._id)}
                          className="hover:text-amber-300 transition-colors flex items-center gap-1 p-1.5"
                          title="Bookmark"
                        >
                          <span>🔖</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            showToast('Link copied to clipboard!');
                          }}
                          className="hover:text-white transition-colors flex items-center gap-1 p-1.5"
                          title="Share"
                        >
                          <span>🔗</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments Drawer */}
                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-white/10 space-y-4 animate-fadeIn">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Discussion Thread</span>
                          <span className="text-xs text-purple-400 font-normal">
                            ({comments.length} replies)
                          </span>
                        </h4>

                        {/* Comments List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                          {comments.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">
                              No replies yet. Be the first to share your thoughts!
                            </p>
                          ) : (
                            comments.map((comment) => (
                              <div
                                key={comment._id}
                                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                                  comment.author.isMentor || comment.isAcceptedAnswer
                                    ? 'bg-emerald-950/20 border-emerald-500/30'
                                    : 'bg-slate-800/60 border-white/5'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">
                                      {comment.author.name}
                                    </span>
                                    {comment.author.isMentor && (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-bold">
                                        MENTOR
                                      </span>
                                    )}
                                    {comment.isAcceptedAnswer && (
                                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[9px] font-bold">
                                        ✓ ACCEPTED ANSWER
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-500">
                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                                  </span>
                                </div>
                                <p className="text-slate-300 leading-relaxed">{comment.content}</p>
                                {comment.codeSnippet && comment.codeSnippet.code && (
                                  <pre className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                                    <code>{comment.codeSnippet.code}</code>
                                  </pre>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInputs[post._id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))
                            }
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                            placeholder="Write an insightful response..."
                            className="flex-1 px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            disabled={isSubmittingComment}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-all"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Community Stats Card */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>⚡ Community Pulse</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/70 p-3 rounded-xl border border-white/5 text-center">
                  <span className="block text-2xl font-extrabold text-purple-400">15.4k</span>
                  <span className="text-[11px] text-slate-400">Active Learners</span>
                </div>
                <div className="bg-slate-800/70 p-3 rounded-xl border border-white/5 text-center">
                  <span className="block text-2xl font-extrabold text-cyan-400">250+</span>
                  <span className="text-[11px] text-slate-400">DSA Challenges</span>
                </div>
                <div className="bg-slate-800/70 p-3 rounded-xl border border-white/5 text-center">
                  <span className="block text-2xl font-extrabold text-emerald-400">98%</span>
                  <span className="text-[11px] text-slate-400">Answer Rate</span>
                </div>
                <div className="bg-slate-800/70 p-3 rounded-xl border border-white/5 text-center">
                  <span className="block text-2xl font-extrabold text-amber-400">500+</span>
                  <span className="text-[11px] text-slate-400">Projects Built</span>
                </div>
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🏷️ Trending Topics</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => {
                      setSearchQuery(tag.name);
                      loadFeed();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/40 border border-white/5 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <span>#{tag.name}</span>
                    <span className="text-[10px] text-purple-400 bg-purple-950/60 px-1.5 py-0.2 rounded-full">
                      {tag.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Contributor Spotlight */}
            <div className="bg-gradient-to-b from-purple-950/30 to-slate-900/80 border border-purple-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  🌟 Top Contributor
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  Diamond Tier
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt="Top student"
                  className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">Aditya Sharma</h4>
                  <p className="text-xs text-purple-300 font-mono">4,850 Reputation XP</p>
                  <span className="text-[10px] text-slate-400">48 Accepted Solutions</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">
                "Consistently answering tricky Graph and DP questions for junior cohort members."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>✍️ Create Community Discussion</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Discussion Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best approach for Word Break II with memoization..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="general">General Tech Discussion</option>
                    <option value="dsa">DSA & Algorithms</option>
                    <option value="certifications">Certification & Project Experience</option>
                    <option value="mentor_qa">Mentor Q&A Question</option>
                    <option value="webdev">Full Stack & WebDev</option>
                    <option value="ai">AI Agents & Machine Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Google, Amazon, Microsoft"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Discussion Body / Question *
                </label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Explain your problem, thought process, or interview breakdown clearly..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-y"
                />
              </div>

              {/* Code Snippet Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase">
                    Include Code Snippet?
                  </span>
                  <input
                    type="checkbox"
                    checked={hasCode}
                    onChange={(e) => setHasCode(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>

                {hasCode && (
                  <div className="p-3 bg-slate-950 border border-white/10 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <select
                        value={codeLang}
                        onChange={(e) => setCodeLang(e.target.value)}
                        className="px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-cyan-300 font-mono focus:outline-none"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="sql">SQL</option>
                      </select>
                    </div>
                    <textarea
                      rows={4}
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      placeholder="// Paste your formatted code here..."
                      className="w-full p-2.5 bg-slate-900 font-mono text-xs text-purple-200 border border-white/5 rounded-lg focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="dsa, leetcode, graph, recursion"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 rounded-xl text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  {isSubmittingPost ? 'Publishing...' : 'Publish Discussion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
