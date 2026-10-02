const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Badge = require('../models/Badge');
const SavedPost = require('../models/SavedPost');
const CommunityNotification = require('../models/CommunityNotification');

// Mock fallback posts if DB is empty before seed
const DEFAULT_POSTS = [
  {
    title: '🚀 Cloud & DevOps Strategy: How 14 KR Global Learning students achieved AWS & Azure Solutions Architect Credentials in Q1 2026',
    content: 'A comprehensive breakdown of the exact 12-week roadmap used by our students: Core architecture mastery, System Design hands-on labs, Docker & Kubernetes microservices, and live One-on-One mentorship.',
    category: 'certifications',
    author: {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@krgloballearning.com',
      role: 'mentor',
      badge: 'Master Mentor',
      isMentor: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['certifications', 'aws', 'azure', 'roadmap', 'cloud'],
    upvotesCount: 142,
    commentsCount: 38,
    viewsCount: 1250,
    isPinned: true,
    isAnnouncement: true,
    company: 'Google / Microsoft',
  },
  {
    title: '💡 Optimal O(N) Approach for LeetCode 42: Trapping Rain Water using Two Pointers',
    content: 'Instead of using O(N) auxiliary space for leftMax and rightMax arrays, you can solve Trapping Rain Water in O(1) space with two pointers. Here is the clean template implementation in C++ and JavaScript.',
    category: 'dsa',
    author: {
      name: 'Rohan Verma',
      email: 'rohan.v@student.krtech.in',
      role: 'student',
      badge: 'Code Samurai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['dsa', 'leetcode', 'two-pointers', 'cpp', 'javascript'],
    codeSnippet: {
      language: 'cpp',
      code: `int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            height[left] >= leftMax ? (leftMax = height[left]) : (water += leftMax - height[left]);
            left++;
        } else {
            height[right] >= rightMax ? (rightMax = height[right]) : (water += rightMax - height[right]);
            right--;
        }
    }
    return water;
}`,
    },
    upvotesCount: 89,
    commentsCount: 19,
    viewsCount: 680,
    dsaDifficulty: 'Hard',
  },
  {
    title: '❓ [Mentor Q&A] When to choose Microservices vs Modular Monolith for a 100k DAU FinTech startup?',
    content: 'We are architecting a fast payment service handling 100k daily transactions. Should we start with event-driven Kafka microservices or a cleanly structured Modular Monolith with PostgreSQL ACID transactions?',
    category: 'mentor_qa',
    author: {
      name: 'Ananya Deshmukh',
      email: 'ananya.d@student.krtech.in',
      role: 'student',
      badge: 'System Explorer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['system-design', 'microservices', 'architecture', 'fintech'],
    upvotesCount: 64,
    commentsCount: 12,
    viewsCount: 490,
    isResolved: true,
  },
];

// @desc    Get community feed with filters, pagination, and sorting
// @route   GET /api/community/feed
// @access  Public / Optional Auth
exports.getFeed = async (req, res) => {
  try {
    const { category, tag, search, sort = 'trending', page = 1, limit = 20 } = req.query;

    const query = {};
    if (category && category !== 'all') {
      if (category === 'announcement') {
        query.isAnnouncement = true;
      } else {
        query.category = category;
      }
    }

    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ title: searchRegex }, { content: searchRegex }, { tags: searchRegex }, { company: searchRegex }];
    }

    let sortOptions = { isPinned: -1, createdAt: -1 };
    if (sort === 'trending') {
      sortOptions = { isPinned: -1, upvotesCount: -1, createdAt: -1 };
    } else if (sort === 'top') {
      sortOptions = { upvotesCount: -1 };
    } else if (sort === 'latest') {
      sortOptions = { isPinned: -1, createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    let posts = await Post.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Fallback if no posts in DB yet
    if (!posts || posts.length === 0) {
      if (!category || category === 'all') {
        posts = DEFAULT_POSTS;
      }
    }

    const total = await Post.countDocuments(query);

    // Get popular trending tags
    const trendingTags = [
      { name: 'dsa', count: 124 },
      { name: 'certifications', count: 98 },
      { name: 'system-design', count: 76 },
      { name: 'fullstack', count: 65 },
      { name: 'interview', count: 52 },
      { name: 'ai-agents', count: 48 },
    ];

    res.json({
      success: true,
      count: posts.length,
      total: total || posts.length,
      page: Number(page),
      totalPages: Math.ceil((total || posts.length) / Number(limit)) || 1,
      trendingTags,
      posts,
    });
  } catch (err) {
    console.error('getFeed Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve community feed', error: err.message });
  }
};

// @desc    Create new community post
// @route   POST /api/community/post
// @access  Public / Auth
exports.createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      category = 'general',
      tags = [],
      codeSnippet,
      company = '',
      dsaDifficulty = '',
      isAnnouncement = false,
      isPinned = false,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    // Determine author from authenticated user or request body
    const user = req.user || {};
    const author = {
      name: user.name || req.body.authorName || 'KR Tech Student',
      email: user.email || req.body.authorEmail || 'student@krtech.in',
      avatar: user.avatar || req.body.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: user.role || (req.body.isMentor ? 'mentor' : 'student'),
      badge: req.body.badge || (user.role === 'admin' ? 'Founding Admin' : 'Community Innovator'),
      isMentor: user.role === 'admin' || req.body.isMentor === true,
      userId: user._id || null,
    };

    const formattedTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim().toLowerCase())
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    const newPost = await Post.create({
      title,
      content,
      category,
      author,
      tags: formattedTags,
      codeSnippet: codeSnippet || { language: 'javascript', code: '' },
      company,
      dsaDifficulty,
      isAnnouncement: Boolean(isAnnouncement && (user.role === 'admin' || user.role === 'mentor')),
      isPinned: Boolean(isPinned && user.role === 'admin'),
    });

    // Real-time notification broadcast via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('community:new_post', newPost);
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (err) {
    console.error('createPost Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create post', error: err.message });
  }
};

// @desc    Get post by ID with comments
// @route   GET /api/community/post/:id
// @access  Public
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment views
    post.viewsCount += 1;
    await post.save();

    const comments = await Comment.find({ post: post._id }).sort({ createdAt: 1 }).lean();

    res.json({
      success: true,
      post,
      comments,
    });
  } catch (err) {
    console.error('getPostById Error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch post', error: err.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/community/comment
// @access  Public / Auth
exports.addComment = async (req, res) => {
  try {
    const { postId, content, codeSnippet } = req.body;
    if (!postId || !content) {
      return res.status(400).json({ success: false, message: 'Post ID and content are required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const user = req.user || {};
    const author = {
      name: user.name || req.body.authorName || 'KR Tech Member',
      email: user.email || req.body.authorEmail || 'member@krtech.in',
      avatar: user.avatar || req.body.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: user.role || (req.body.isMentor ? 'mentor' : 'student'),
      badge: req.body.badge || (req.body.isMentor ? 'Verified Mentor' : 'Contributor'),
      isMentor: user.role === 'admin' || req.body.isMentor === true,
      userId: user._id || null,
    };

    const comment = await Comment.create({
      post: post._id,
      author,
      content,
      codeSnippet: codeSnippet || { language: '', code: '' },
    });

    post.commentsCount += 1;
    await post.save();

    // Create notification for post author if not self
    if (post.author.email && post.author.email !== author.email) {
      await CommunityNotification.create({
        recipient: post.author.email,
        sender: {
          name: author.name,
          avatar: author.avatar,
          role: author.role,
        },
        type: 'comment',
        title: 'New reply on your post',
        message: `${author.name} commented: "${content.substring(0, 60)}..."`,
        link: `/community/post/${post._id}`,
      });
    }

    // Socket.io real-time broadcast
    const io = req.app.get('io');
    if (io) {
      io.to(`post_${postId}`).emit('community:new_comment', comment);
      io.emit('community:comment_count_updated', { postId, commentsCount: post.commentsCount });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment,
      commentsCount: post.commentsCount,
    });
  } catch (err) {
    console.error('addComment Error:', err);
    res.status(500).json({ success: false, message: 'Failed to add comment', error: err.message });
  }
};

// @desc    Toggle like / upvote on post
// @route   POST /api/community/like/:id
// @access  Public / Auth
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userEmail = (req.user && req.user.email) || req.body.userEmail || 'guest@krtech.in';
    const index = post.upvotes.indexOf(userEmail);

    let isLiked = false;
    if (index === -1) {
      post.upvotes.push(userEmail);
      post.upvotesCount += 1;
      isLiked = true;

      // Notify post author if not self
      if (post.author.email && post.author.email !== userEmail) {
        await CommunityNotification.create({
          recipient: post.author.email,
          sender: { name: (req.user && req.user.name) || 'A student', role: 'student' },
          type: 'like',
          title: 'Upvote received',
          message: `Your post "${post.title.substring(0, 45)}..." received an upvote!`,
          link: `/community/post/${post._id}`,
        });
      }
    } else {
      post.upvotes.splice(index, 1);
      post.upvotesCount = Math.max(0, post.upvotesCount - 1);
      isLiked = false;
    }

    await post.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('community:post_upvoted', {
        postId: post._id,
        upvotesCount: post.upvotesCount,
      });
    }

    res.json({
      success: true,
      isLiked,
      upvotesCount: post.upvotesCount,
    });
  } catch (err) {
    console.error('toggleLike Error:', err);
    res.status(500).json({ success: false, message: 'Failed to toggle like', error: err.message });
  }
};

// @desc    Toggle save/bookmark post
// @route   POST /api/community/save/:id
// @access  Public / Auth
exports.toggleSavePost = async (req, res) => {
  try {
    const studentEmail = (req.user && req.user.email) || req.body.studentEmail || 'student@krtech.in';
    const postId = req.params.id;

    const existing = await SavedPost.findOne({ studentEmail, post: postId });

    if (existing) {
      await SavedPost.deleteOne({ _id: existing._id });
      return res.json({ success: true, saved: false, message: 'Post removed from bookmarks' });
    } else {
      await SavedPost.create({ studentEmail, post: postId });
      return res.json({ success: true, saved: true, message: 'Post saved to bookmarks' });
    }
  } catch (err) {
    console.error('toggleSavePost Error:', err);
    res.status(500).json({ success: false, message: 'Failed to bookmark post', error: err.message });
  }
};

// @desc    Get user's saved posts
// @route   GET /api/community/saved
// @access  Public / Auth
exports.getSavedPosts = async (req, res) => {
  try {
    const studentEmail = (req.user && req.user.email) || req.query.studentEmail || 'student@krtech.in';
    const saved = await SavedPost.find({ studentEmail }).populate('post').sort({ createdAt: -1 });

    const posts = saved.map((s) => s.post).filter(Boolean);

    res.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    console.error('getSavedPosts Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve saved posts', error: err.message });
  }
};

// @desc    Get badges and reputation data
// @route   GET /api/community/badges
// @access  Public
exports.getBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ xp: 1 }).lean();

    // Student reputation summary
    const studentReputation = {
      reputationPoints: 2450,
      rank: 4,
      totalBadgesEarned: 6,
      currentTier: 'Gold Contributor',
      nextTierXp: 3000,
      recentAchievements: [
        { name: 'Code Samurai', date: 'Yesterday', icon: '⚔️' },
        { name: 'Bug Hunter', date: '3 days ago', icon: '🐞' },
        { name: '14-Day Streak', date: '1 week ago', icon: '🔥' },
      ],
    };

    res.json({
      success: true,
      studentReputation,
      badges: badges.length > 0 ? badges : [
        { badgeId: 'code-samurai', name: 'Code Samurai', description: 'Solved 100+ LeetCode DSA challenges with optimal complexity.', icon: '⚔️', tier: 'gold', category: 'dsa', xp: 500 },
        { badgeId: 'dsa-master', name: 'DSA Grandmaster', description: 'Placed in Top 5% of KR Tech Weekly Coding Contests.', icon: '🏆', tier: 'diamond', category: 'dsa', xp: 1000 },
        { badgeId: 'top-contributor', name: 'Top Contributor', description: 'Authored 25+ accepted technical solutions in the community forum.', icon: '🌟', tier: 'platinum', category: 'community', xp: 750 },
        { badgeId: 'bug-hunter', name: 'Bug Hunter', description: 'Found and resolved 10 edge cases in peer project reviews.', icon: '🐞', tier: 'silver', category: 'learning', xp: 350 },
        { badgeId: 'industry-ready', name: 'Industry Ready Skills', description: 'Completed comprehensive system design capstone and verified production deployment.', icon: '🚀', tier: 'gold', category: 'skills', xp: 600 },
        { badgeId: 'streak-30', name: '30-Day Legend', description: 'Maintained 30 continuous days of platform activity and coding.', icon: '🔥', tier: 'platinum', category: 'learning', xp: 800 },
      ],
    });
  } catch (err) {
    console.error('getBadges Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve badges', error: err.message });
  }
};

// @desc    Get community leaderboard
// @route   GET /api/community/leaderboard
// @access  Public
exports.getCommunityLeaderboard = async (req, res) => {
  try {
    const leaderboard = [
      { rank: 1, name: 'Aditya Sharma', email: 'aditya.s@krtech.in', xp: 4850, badgesCount: 11, solutionsCount: 48, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', tier: 'Diamond' },
      { rank: 2, name: 'Sanya Malhotra', email: 'sanya.m@krtech.in', xp: 3920, badgesCount: 9, solutionsCount: 39, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', tier: 'Platinum' },
      { rank: 3, name: 'Vikram Joshi', email: 'vikram.j@krtech.in', xp: 3150, badgesCount: 8, solutionsCount: 31, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', tier: 'Platinum' },
      { rank: 4, name: 'Rahul Patel (You)', email: 'student@krtech.in', xp: 2450, badgesCount: 6, solutionsCount: 24, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', tier: 'Gold' },
      { rank: 5, name: 'Megha Nair', email: 'megha.n@krtech.in', xp: 2180, badgesCount: 5, solutionsCount: 19, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', tier: 'Gold' },
    ];

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load leaderboard', error: err.message });
  }
};
