const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Room = require('./models/Room');
const Message = require('./models/Message');
const Badge = require('./models/Badge');

const SEED_BADGES = [
  {
    badgeId: 'code-samurai',
    name: 'Code Samurai',
    description: 'Solved 100+ LeetCode DSA challenges with optimal time & space complexity.',
    icon: '⚔️',
    tier: 'gold',
    category: 'dsa',
    xp: 500,
    criteria: 'Submit 100 accepted DSA solutions',
  },
  {
    badgeId: 'dsa-master',
    name: 'DSA Grandmaster',
    description: 'Ranked in the top 5% of KR Tech Weekly Coding Contests.',
    icon: '🏆',
    tier: 'diamond',
    category: 'dsa',
    xp: 1000,
    criteria: 'Top 5% finish in official contest',
  },
  {
    badgeId: 'top-contributor',
    name: 'Top Contributor',
    description: 'Authored 25+ verified technical explanations in the community forum.',
    icon: '🌟',
    tier: 'platinum',
    category: 'community',
    xp: 750,
    criteria: '25 accepted answers or verified solutions',
  },
  {
    badgeId: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Identified and fixed 10 critical edge cases during peer code reviews.',
    icon: '🐞',
    tier: 'silver',
    category: 'learning',
    xp: 350,
    criteria: '10 approved GitHub pull request reviews',
  },
  {
    badgeId: 'certification-ready',
    name: 'Certification Ready',
    description: 'Completed all course modules, passed mock assessments with 90%+ score, and earned industry certification.',
    icon: '🚀',
    tier: 'gold',
    category: 'learning',
    xp: 600,
    criteria: 'Passed all certification assessments with distinction',
  },
  {
    badgeId: 'streak-30',
    name: '30-Day Legend',
    description: 'Maintained 30 continuous days of platform activity, attendance, and coding.',
    icon: '🔥',
    tier: 'platinum',
    category: 'learning',
    xp: 800,
    criteria: '30 consecutive days of active login',
  },
  {
    badgeId: 'system-architect',
    name: 'System Architect',
    description: 'Designed a production-ready microservices architecture with Kafka and Redis.',
    icon: '🏛️',
    tier: 'diamond',
    category: 'tech',
    xp: 1200,
    criteria: 'Complete Capstone 3 System Architecture',
  },
  {
    badgeId: 'peer-mentor',
    name: 'Peer Mentor',
    description: 'Helped 15+ junior batchmates debug tricky asynchronous errors.',
    icon: '🤝',
    tier: 'silver',
    category: 'community',
    xp: 400,
    criteria: '15 student upvotes on debugging threads',
  },
];

const SEED_ROOMS = [
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
    roomId: 'certification-prep-2026',
    name: 'Certification Preparation 2026',
    description: 'Industry certification tips, mock assessments, study group discussions, and learning resources.',
    category: 'learning',
    icon: '📜',
    memberCount: 610,
    activeUsersCount: 92,
    lastMessage: {
      text: 'Oracle Cloud Infrastructure certification study guide and practice tests are now available!',
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

const SEED_POSTS = [
  {
    title: '📢 [Announcement] KR Tech National Coding Contest #14 is Live this Saturday!',
    content: 'Get ready for 4 challenging algorithmic problems ranging from Binary Search to Tree DP. Cash prizes worth ₹50,000 + Direct Fast-Track interview referrals for top 20 coders with partnering unicorns. Register directly in the Contest Leaderboard tab.',
    category: 'announcement',
    author: {
      name: 'KR Tech Administration',
      email: 'admin@krtech.in',
      role: 'admin',
      badge: 'Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['announcement', 'contest', 'prizes', 'referrals'],
    upvotesCount: 215,
    commentsCount: 42,
    viewsCount: 2450,
    isPinned: true,
    isAnnouncement: true,
  },
  {
    title: '🚀 Learning Journey: How I Earned Microsoft Azure Certification — Full Study Breakdown',
    content: `Sharing my complete certification journey for Microsoft Azure Solutions Architect:
Phase 1: Completed KR Global Learning Cloud Fundamentals module with hands-on labs.
Phase 2: Built 3 enterprise-grade projects using Azure services (App Service, Cosmos DB, Functions).
Phase 3: Practiced 200+ certification mock questions using AI Quiz Generator.
Phase 4: Final certification exam preparation with KR Global Learning study planner.
Key takeaway: Master practical implementation alongside theory and use the AI study assistant daily!`,
    category: 'learning',
    author: {
      name: 'Karan Mehra',
      email: 'karan.m@student.krtech.in',
      role: 'student',
      badge: 'Certification Ready',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['certification', 'microsoft', 'learning-journey', 'azure', 'cloud'],
    upvotesCount: 184,
    commentsCount: 56,
    viewsCount: 1820,
    company: 'Microsoft',
  },
  {
    title: '💡 DSA Problem of the Day: LeetCode 128 (Longest Consecutive Sequence) in O(N)',
    content: 'A classic hash set question where sorting gives O(N log N), but using an unordered set and only expanding when (num - 1) is NOT present yields optimal O(N) time. Here is the clean C++ and Python solution.',
    category: 'dsa',
    author: {
      name: 'Sanya Malhotra',
      email: 'sanya.m@krtech.in',
      role: 'student',
      badge: 'Code Samurai',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['dsa', 'leetcode', 'hash-set', 'cpp', 'arrays'],
    codeSnippet: {
      language: 'cpp',
      code: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longestStreak = 0;
    for (int num : numSet) {
        // Only start sequence if num is the beginning of a streak
        if (!numSet.count(num - 1)) {
            int currentNum = num;
            int currentStreak = 1;
            while (numSet.count(currentNum + 1)) {
                currentNum += 1;
                currentStreak += 1;
            }
            longestStreak = max(longestStreak, currentStreak);
        }
    }
    return longestStreak;
}`,
    },
    upvotesCount: 128,
    commentsCount: 23,
    viewsCount: 1100,
    dsaDifficulty: 'Medium',
  },
  {
    title: '❓ [Mentor Q&A] How to handle Distributed Cache Invalidation with Redis & PostgreSQL?',
    content: 'In our high-throughput e-commerce service, reading product stock from Redis is blazing fast, but when stock updates happen in PostgreSQL, we encounter race conditions between cache invalidation and subsequent reads. Should we adopt Write-Through caching or Cache-Aside with Redis PubSub / Debezium CDC?',
    category: 'mentor_qa',
    author: {
      name: 'Aditya Sharma',
      email: 'aditya.s@krtech.in',
      role: 'student',
      badge: 'Top Contributor',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['mentor-qa', 'system-design', 'redis', 'postgresql', 'caching'],
    upvotesCount: 95,
    commentsCount: 15,
    viewsCount: 890,
    isResolved: true,
  },
  {
    title: '⚡ React 19 Server Actions vs Traditional REST Endpoints in Next.js 15',
    content: 'After testing React 19 Server Actions on our internal cohort dashboard, network round-trips dropped by 35% because form submissions no longer require manual state tracking or separate useEffect fetching. Here is how we structured optimistic updates.',
    category: 'webdev',
    author: {
      name: 'Rohan Verma',
      email: 'rohan.v@student.krtech.in',
      role: 'student',
      badge: 'Full Stack Ninja',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['react19', 'nextjs', 'server-actions', 'webdev'],
    upvotesCount: 76,
    commentsCount: 18,
    viewsCount: 650,
  },
];

async function seedCommunity() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/krtech';
    console.log('Connecting to MongoDB for Community Platform Seeding...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas/Local.');

    // 1. Seed Badges
    for (const badgeData of SEED_BADGES) {
      await Badge.findOneAndUpdate(
        { badgeId: badgeData.badgeId },
        badgeData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${SEED_BADGES.length} Gamified Badges.`);

    // 2. Seed Rooms
    for (const roomData of SEED_ROOMS) {
      await Room.findOneAndUpdate(
        { roomId: roomData.roomId },
        roomData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${SEED_ROOMS.length} Chat Channels/Rooms.`);

    // 3. Seed Posts
    for (const postData of SEED_POSTS) {
      const existing = await Post.findOne({ title: postData.title });
      let savedPost;
      if (!existing) {
        savedPost = await Post.create(postData);
      } else {
        savedPost = existing;
      }

      // If mentor_qa post, add verified mentor answer comment
      if (postData.category === 'mentor_qa') {
        const hasComment = await Comment.findOne({ post: savedPost._id });
        if (!hasComment) {
          await Comment.create({
            post: savedPost._id,
            author: {
              name: 'Dr. Priya Sharma',
              email: 'priya.sharma@krtech.in',
              role: 'mentor',
              badge: 'Master Mentor',
              isMentor: true,
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            },
            content: 'Great question Aditya! For 100k+ transactions, do NOT invalidate synchronously in your HTTP handler. Instead, use Cache-Aside combined with Change Data Capture (CDC via Debezium + Kafka). When Postgres commits, the WAL event triggers an async cache purge, avoiding dual-write race conditions.',
            codeSnippet: {
              language: 'javascript',
              code: '// Debezium Kafka Consumer purges stale Redis key\nconsumer.on("message", async ({ key, value }) => {\n  const productId = value.after.id;\n  await redis.del(`product:${productId}`);\n});',
            },
            isAcceptedAnswer: true,
            upvotesCount: 42,
          });
        }
      }
    }
    console.log(`✅ Seeded ${SEED_POSTS.length} Community Posts with verified Mentor answers.`);

    console.log('🚀 Community Platform Database Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seedCommunity();
