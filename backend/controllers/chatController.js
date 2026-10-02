const Room = require('../models/Room');
const Message = require('../models/Message');

const DEFAULT_ROOMS = [
  {
    roomId: 'batch-fullstack-2026',
    name: 'Full Stack Cohort 2026',
    description: 'Official batch discussion for MERN, Next.js 15, and Microservices projects.',
    category: 'batch',
    icon: '🚀',
    memberCount: 342,
    activeUsersCount: 48,
    lastMessage: {
      text: 'Anyone working on the Redis PubSub assignment for week 6?',
      senderName: 'Siddharth M.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  },
  {
    roomId: 'dsa-arena',
    name: 'DSA 250 Grind Arena',
    description: 'Daily LeetCode discussions, Graph algorithms, DP optimizations & contest prep.',
    category: 'dsa',
    icon: '⚔️',
    memberCount: 520,
    activeUsersCount: 79,
    lastMessage: {
      text: 'Today’s Problem of the Day: Word Break II with Trie memoization.',
      senderName: 'Aditya (TA)',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
  },
  {
    roomId: 'certifications-2026',
    name: 'Certifications & Advanced Skills 2026',
    description: 'Hands-on project architectures, cloud certifications, and technical labs.',
    category: 'skills',
    icon: '🚀',
    memberCount: 610,
    activeUsersCount: 92,
    lastMessage: {
      text: 'Oracle Cloud & AWS Solutions Architect masterclass resources are live in the learning tab!',
      senderName: 'Student Success Team',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
    },
  },
  {
    roomId: 'system-design',
    name: 'High-Level System Design',
    description: 'Scaling to 10M DAU, Distributed Caching, Kafka, Sharding & Cassandra.',
    category: 'tech',
    icon: '🏛️',
    memberCount: 280,
    activeUsersCount: 34,
    lastMessage: {
      text: 'How are you guys handling write-heavy idempotency in payment gateways?',
      senderName: 'Rhea Sen',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
    },
  },
  {
    roomId: 'ai-devs',
    name: 'AI Agents & LLMs Hub',
    description: 'Building autonomous agents with LangChain, LlamaIndex, RAG & Vector DBs.',
    category: 'tech',
    icon: '🤖',
    memberCount: 310,
    activeUsersCount: 41,
    lastMessage: {
      text: 'Check out the new hybrid search benchmark with Pinecone + BM25.',
      senderName: 'Kabir V.',
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
    },
  },
  {
    roomId: 'general-lounge',
    name: 'Student Coffee Lounge',
    description: 'Casual tech chit-chat, hackathon team formation, and study playlist sharing.',
    category: 'general',
    icon: '☕',
    memberCount: 780,
    activeUsersCount: 65,
    lastMessage: {
      text: 'Who is participating in the Smart India Hackathon internal qualifier this weekend?',
      senderName: 'Tanvi J.',
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
    },
  },
];

// @desc    Get all community chat rooms
// @route   GET /api/community/rooms or GET /api/chat/rooms
// @access  Public / Auth
exports.getRooms = async (req, res) => {
  try {
    let rooms = await Room.find().sort({ memberCount: -1 }).lean();

    if (!rooms || rooms.length === 0) {
      rooms = DEFAULT_ROOMS;
    }

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (err) {
    console.error('getRooms Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve rooms', error: err.message });
  }
};

// @desc    Get messages for a specific room
// @route   GET /api/chat/rooms/:roomId/messages
// @access  Public / Auth
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50 } = req.query;

    let messages = await Message.find({ room: roomId })
      .sort({ createdAt: 1 })
      .limit(Number(limit))
      .lean();

    // Default seeded conversation if empty room
    if (!messages || messages.length === 0) {
      const now = Date.now();
      messages = [
        {
          _id: 'msg-seed-1',
          room: roomId,
          sender: {
            name: 'Vikram Joshi',
            email: 'vikram.j@krtech.in',
            role: 'student',
            badge: 'Top Contributor',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          },
          content: 'Hey everyone! Welcome to the channel. Feel free to share your solutions, questions, and code snippets here.',
          createdAt: new Date(now - 30 * 60 * 1000),
        },
        {
          _id: 'msg-seed-2',
          room: roomId,
          sender: {
            name: 'Dr. Priya Sharma',
            email: 'priya.sharma@krtech.in',
            role: 'mentor',
            badge: 'Master Mentor',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          },
          content: 'Mentor check-in: Remember to write clean modular code and always consider edge cases like empty inputs and overflow limits.',
          codeSnippet: {
            language: 'javascript',
            code: '// Clean modular pattern\nfunction solve(input) {\n  if (!input || input.length === 0) return 0;\n  // Core logic\n  return result;\n}',
          },
          createdAt: new Date(now - 15 * 60 * 1000),
        },
        {
          _id: 'msg-seed-3',
          room: roomId,
          sender: {
            name: 'Sanya Malhotra',
            email: 'sanya.m@krtech.in',
            role: 'student',
            badge: 'Code Samurai',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          },
          content: 'Thanks Dr. Priya! Verified that test case on LeetCode and it shaved 12ms off the execution runtime.',
          reactions: [{ emoji: '🔥', count: 4, users: ['user1@krtech.in', 'user2@krtech.in'] }],
          createdAt: new Date(now - 5 * 60 * 1000),
        },
      ];
    }

    res.json({
      success: true,
      roomId,
      count: messages.length,
      messages,
    });
  } catch (err) {
    console.error('getRoomMessages Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages', error: err.message });
  }
};

// @desc    Send a message to a room
// @route   POST /api/chat/message
// @access  Public / Auth
exports.sendMessage = async (req, res) => {
  try {
    const { room, roomId, content, codeSnippet, attachments } = req.body;
    const targetRoom = room || roomId;

    if (!targetRoom || !content) {
      return res.status(400).json({ success: false, message: 'Room and content are required' });
    }

    const user = req.user || {};
    const sender = {
      name: user.name || req.body.senderName || 'KR Tech Student',
      email: user.email || req.body.senderEmail || 'student@krtech.in',
      avatar: user.avatar || req.body.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: user.role || 'student',
      badge: req.body.senderBadge || (user.role === 'admin' ? 'Admin' : 'Member'),
      userId: user._id || null,
    };

    const newMessage = await Message.create({
      room: targetRoom,
      sender,
      content,
      codeSnippet: codeSnippet || { language: '', code: '' },
      attachments: attachments || [],
    });

    // Update Room's last message
    await Room.findOneAndUpdate(
      { roomId: targetRoom },
      {
        lastMessage: {
          text: content.substring(0, 80),
          senderName: sender.name,
          timestamp: new Date(),
        },
      }
    );

    // Broadcast in real-time via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(targetRoom).emit('chat:new_message', newMessage);
      io.emit('chat:room_updated', {
        roomId: targetRoom,
        lastMessage: {
          text: content.substring(0, 80),
          senderName: sender.name,
          timestamp: new Date(),
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      chatMessage: newMessage,
    });
  } catch (err) {
    console.error('sendMessage Error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
  }
};
