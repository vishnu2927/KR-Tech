import React, { useState, useEffect, useRef } from 'react';
import SEO from '../components/common/SEO';
import { communityService, RoomItem, MessageItem } from '../services/communityService';
import { useAuth } from '../context/AuthContext';
import { getSocket, joinRoom, leaveRoom, emitTyping } from '../utils/socketClient';

export default function GroupChatPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>('batch-fullstack-2026');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Load Rooms
  useEffect(() => {
    async function loadRooms() {
      try {
        setLoadingRooms(true);
        const data = await communityService.getRooms();
        setRooms(data);
        if (data.length > 0 && !activeRoomId) {
          setActiveRoomId(data[0].roomId);
        }
      } catch (err) {
        console.error('Failed to load rooms:', err);
      } finally {
        setLoadingRooms(false);
      }
    }
    loadRooms();
  }, []);

  // 2. Load Messages when Active Room changes
  useEffect(() => {
    if (!activeRoomId) return;

    let isMounted = true;
    async function fetchMessages() {
      try {
        setLoadingMessages(true);
        const msgs = await communityService.getRoomMessages(activeRoomId);
        if (isMounted) {
          setMessages(msgs);
          setTimeout(scrollToBottom, 100);
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    }

    fetchMessages();
    joinRoom(activeRoomId);

    return () => {
      isMounted = false;
      leaveRoom(activeRoomId);
    };
  }, [activeRoomId]);

  // 3. Real-Time Socket.IO message handler
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (newMsg: MessageItem) => {
      if (newMsg.room === activeRoomId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });
        setTimeout(scrollToBottom, 100);
      }

      // Update room last message preview
      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === newMsg.room
            ? {
                ...r,
                lastMessage: {
                  text: newMsg.content,
                  senderName: newMsg.sender.name,
                  timestamp: new Date().toISOString(),
                },
              }
            : r
        )
      );
    };

    const handleTyping = ({ roomId, userName }: { roomId: string; userName: string }) => {
      if (roomId === activeRoomId) {
        setTypingUser(userName);
        setTimeout(() => setTypingUser(null), 3000);
      }
    };

    socket.on('chat:new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);

    // Fallback polling every 6 seconds if socket is disconnected
    const pollingInterval = setInterval(async () => {
      if (!socket.connected && activeRoomId) {
        try {
          const fresh = await communityService.getRoomMessages(activeRoomId);
          setMessages(fresh);
        } catch {
          // ignore
        }
      }
    }, 6000);

    return () => {
      socket.off('chat:new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
      clearInterval(pollingInterval);
    };
  }, [activeRoomId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !codeSnippet.trim()) return;

    const payload = {
      room: activeRoomId,
      content: inputText.trim() || (showCodeInput ? 'Code snippet shared:' : ''),
      codeSnippet:
        showCodeInput && codeSnippet.trim()
          ? { language: codeLanguage, code: codeSnippet.trim() }
          : undefined,
    };

    // Optimistic UI append
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: MessageItem = {
      _id: tempId,
      room: activeRoomId,
      sender: {
        name: user?.name || 'You',
        email: user?.email || 'student@krtech.in',
        role: (user?.role as any) || 'student',
        badge: 'Member',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      content: payload.content,
      codeSnippet: payload.codeSnippet,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText('');
    setCodeSnippet('');
    setShowCodeInput(false);
    setTimeout(scrollToBottom, 50);

    try {
      const res = await communityService.sendMessage(payload);
      if (res?.chatMessage) {
        setMessages((prev) =>
          prev.map((m) => (m._id === tempId ? res.chatMessage : m))
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (user?.name) {
      emitTyping(activeRoomId, user.name);
    }
  };

  const activeRoom = rooms.find((r) => r.roomId === activeRoomId) || rooms[0];

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Batch & Topic Chat Rooms | KR Global Learning"
        description="Connect with your batch cohort, DSA peers, and student success team in real-time rooms."
      />

      <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] flex flex-col md:flex-row gap-4">
        {/* Left Sidebar: Rooms List */}
        <div className="w-full md:w-80 bg-slate-900/80 border border-white/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>💬 Channels & Rooms</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              {rooms.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {loadingRooms ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              rooms.map((room) => {
                const isActive = room.roomId === activeRoomId;
                return (
                  <button
                    key={room.roomId}
                    onClick={() => setActiveRoomId(room.roomId)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border ${
                      isActive
                        ? 'bg-purple-600/30 border-purple-500/50 shadow-md shadow-purple-950/40 text-white'
                        : 'border-transparent hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{room.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate text-white">
                          {room.name}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          {room.activeUsersCount}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {room.lastMessage?.text || room.description}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* User info status */}
          <div className="p-3 bg-slate-950/70 border-t border-white/10 flex items-center gap-3">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt="User"
              className="w-8 h-8 rounded-full border border-purple-400 object-cover"
            />
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-white truncate">
                {user?.name || 'Student Member'}
              </span>
              <span className="block text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected to Real-Time Socket
              </span>
            </div>
          </div>
        </div>

        {/* Right Main Chat Panel */}
        <div className="flex-1 bg-slate-900/80 border border-white/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Active Room Top Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeRoom?.icon || '💬'}</span>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{activeRoom?.name || 'Channel'}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] uppercase font-bold">
                    {activeRoom?.category}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">{activeRoom?.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {activeRoom?.activeUsersCount || 35} Online Coders
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 space-y-2">
                <span className="text-4xl">👋</span>
                <p className="text-sm font-semibold text-white">No messages yet in this room.</p>
                <p className="text-xs">Say hello or ask a question to start the discussion!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelf = user?.email && msg.sender.email === user.email;
                return (
                  <div
                    key={msg._id}
                    className={`flex items-start gap-3 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={
                        msg.sender.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={msg.sender.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                    />

                    <div className={`max-w-xl space-y-1 ${isSelf ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-center gap-2 text-xs ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-bold text-white">{msg.sender.name}</span>
                        {msg.sender.role === 'mentor' && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-bold">
                            MENTOR
                          </span>
                        )}
                        {msg.sender.badge && msg.sender.role !== 'mentor' && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px]">
                            {msg.sender.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                          isSelf
                            ? 'bg-purple-600 text-white rounded-tr-none'
                            : 'bg-slate-800/90 text-slate-200 border border-white/5 rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.content}</p>

                        {/* Optional Code Snippet inside message */}
                        {msg.codeSnippet && msg.codeSnippet.code && (
                          <div className="rounded-lg overflow-hidden border border-black/20 bg-slate-950 mt-2 text-left">
                            <div className="px-3 py-1 bg-slate-900 text-[10px] font-mono text-cyan-400 flex items-center justify-between border-b border-slate-800">
                              <span>{msg.codeSnippet.language.toUpperCase() || 'SNIPPET'}</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(msg.codeSnippet?.code || '')}
                                className="text-slate-400 hover:text-white"
                              >
                                Copy
                              </button>
                            </div>
                            <pre className="p-3 text-[11px] font-mono text-purple-200 overflow-x-auto">
                              <code>{msg.codeSnippet.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Emoji Reactions */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {msg.reactions.map((r, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-[10px] text-slate-300 flex items-center gap-1 cursor-pointer hover:bg-slate-700"
                            >
                              <span>{r.emoji}</span>
                              <span>{r.count}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing indicator */}
          {typingUser && (
            <div className="px-4 py-1 text-xs text-purple-400 italic bg-purple-950/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>{typingUser} is typing...</span>
            </div>
          )}

          {/* Code Input Expandable Drawer */}
          {showCodeInput && (
            <div className="p-3 bg-slate-950 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300">Format Code Snippet:</span>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="px-2 py-0.5 bg-slate-800 rounded text-xs text-purple-300 font-mono"
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
                placeholder="// Paste formatted code here..."
                className="w-full p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-purple-200 border border-white/10 focus:outline-none"
              />
            </div>
          )}

          {/* Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/10 bg-slate-950/60 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`p-2 rounded-xl text-sm transition-all ${
                showCodeInput
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Add Code Snippet"
            >
              💻
            </button>

            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={`Message #${activeRoom?.name || 'channel'}...`}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !codeSnippet.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/30 transition-all disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
