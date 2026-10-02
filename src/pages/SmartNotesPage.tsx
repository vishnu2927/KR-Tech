import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function SmartNotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [folders, setFolders] = useState<string[]>(["All", "Java Backend", "System Design", "DevOps", "DSA & Algorithms", "Database Engineering"]);
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [activeNote, setActiveNote] = useState<any>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [highlightColor, setHighlightColor] = useState<string>("yellow");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadNotes();
  }, [selectedFolder, searchQuery, onlyFavorites]);

  const loadNotes = async () => {
    const res = await lmsService.getSmartNotes({
      folder: selectedFolder === "All" ? undefined : selectedFolder,
      search: searchQuery || undefined,
      favorite: onlyFavorites ? "true" : undefined,
    });
    setNotes(res.data || []);
    if (res.folders) setFolders(res.folders);
    if (!activeNote && res.data?.length > 0) {
      setActiveNote(res.data[0]);
    }
  };

  const handleAddHighlight = (text: string) => {
    if (!activeNote) return;
    const newH = { text, color: highlightColor, position: Date.now() };
    const updated = {
      ...activeNote,
      highlights: [...(activeNote.highlights || []), newH],
    };
    setActiveNote(updated);
    setNotes((prev) => prev.map((n) => (n._id === activeNote._id ? updated : n)));
    showToast(`✓ Added ${highlightColor} highlight!`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeNote) return;

    const commentObj = {
      authorName: "Aditya Sharma",
      comment: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...activeNote,
      comments: [...(activeNote.comments || []), commentObj],
    };

    setActiveNote(updated);
    setNotes((prev) => prev.map((n) => (n._id === activeNote._id ? updated : n)));
    setNewComment("");
    showToast("✓ Personal margin note added!");
  };

  const downloadOffline = () => {
    if (!activeNote) return;
    const content = `# ${activeNote.title}\n\nFolder: ${activeNote.folder}\nTags: ${activeNote.tags?.join(", ")}\n\n${activeNote.content}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNote.title.replace(/\s+/g, "_")}.md`;
    a.click();
    showToast("✓ Offline Markdown note downloaded to device storage!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="Smart Notes Library | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Search institutional and personal smart notes with folders, highlights, margin annotations, bookmarks, reading progress, and offline export."
      />
      <DashboardNavbar />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.6</span>
              <span>•</span>
              <span>Smart Notes Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Interactive Notes & Annotations Hub</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Organize study material into folders, highlight essential sections, leave margin annotations, bookmark key insights, and download for offline review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                onlyFavorites
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              <span>⭐</span> <span>{onlyFavorites ? "Showing Favorites" : "Filter Favorites"}</span>
            </button>
          </div>
        </div>

        {/* Search & Folders Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Folders Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedFolder === f
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                📁 {f}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by title or tag..."
              className="w-full p-2.5 pl-9 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
          </div>
        </div>

        {/* Main 2-Column Library: List & Active Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Notes List Column */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Available Notes ({notes.length})
            </div>
            {notes.map((n) => (
              <div
                key={n._id}
                onClick={() => setActiveNote(n)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition space-y-2 ${
                  activeNote?._id === n._id
                    ? "bg-purple-600/20 border-purple-500/50 text-white shadow-lg"
                    : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm leading-tight text-white">{n.title}</div>
                  {n.isFavorite && <span className="text-amber-400 text-xs shrink-0">★</span>}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>📁 {n.folder}</span>
                  <span>•</span>
                  <span>{n.readingProgress || 80}% Read</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full"
                    style={{ width: `${n.readingProgress || 80}%` }}
                  />
                </div>

                {/* Tags */}
                {n.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {n.tags.map((t: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Note Reader Column (2 Cols) */}
          <div className="lg:col-span-2">
            {activeNote ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
                {/* Note Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      📁 {activeNote.folder}
                    </span>
                    <h2 className="text-xl font-black text-white mt-1.5">{activeNote.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>Progress: {activeNote.readingProgress}%</span>
                      <span>•</span>
                      <span>{activeNote.highlights?.length || 0} Highlights</span>
                      <span>•</span>
                      <span>{activeNote.comments?.length || 0} Annotations</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadOffline}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>📥</span> <span>Download .MD</span>
                    </button>
                    <button
                      onClick={() => {
                        const updated = { ...activeNote, isFavorite: !activeNote.isFavorite };
                        setActiveNote(updated);
                        setNotes((prev) => prev.map((n) => (n._id === activeNote._id ? updated : n)));
                        showToast(updated.isFavorite ? "⭐ Added to Favorites!" : "Removed from Favorites");
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 cursor-pointer"
                      title="Toggle Favorite"
                    >
                      {activeNote.isFavorite ? "★" : "☆"}
                    </button>
                  </div>
                </div>

                {/* Highlighter Toolbar */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Highlight Brush:</span>
                    {["yellow", "green", "cyan", "pink"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setHighlightColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          highlightColor === c ? "scale-110 border-white shadow-md" : "border-transparent opacity-70"
                        }`}
                        style={{
                          backgroundColor:
                            c === "yellow" ? "#eab308" : c === "green" ? "#22c55e" : c === "cyan" ? "#06b6d4" : "#ec4899",
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddHighlight("Selected technical term")}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300"
                  >
                    + Add Highlight Marker
                  </button>
                </div>

                {/* Content Reader */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                  {activeNote.content}
                </div>

                {/* Highlights List */}
                {activeNote.highlights && activeNote.highlights.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                      Active Color Highlights ({activeNote.highlights.length})
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {activeNote.highlights.map((h: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                        >
                          <span className="italic text-slate-300">"{h.text}"</span>
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                h.color === "yellow"
                                  ? "#eab308"
                                  : h.color === "green"
                                  ? "#22c55e"
                                  : h.color === "cyan"
                                  ? "#06b6d4"
                                  : "#ec4899",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Margin Annotations & Comments */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Student Margin Notes ({activeNote.comments?.length || 0})
                  </div>

                  {activeNote.comments?.map((cm: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-cyan-300">{cm.authorName}</span>
                        <span>{new Date(cm.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-slate-200 m-0">{cm.comment}</p>
                    </div>
                  ))}

                  {/* Add Margin Comment */}
                  <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add personal note or interview hint..."
                      className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md cursor-pointer"
                    >
                      Save Note
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
                Select a note from the left to start reading and annotating.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
