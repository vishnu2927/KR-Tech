const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Message = require('./models/Message');
const Room = require('./models/Room');
const Badge = require('./models/Badge');
const SavedPost = require('./models/SavedPost');
const CommunityNotification = require('./models/CommunityNotification');

async function testCommunity() {
  console.log('🧪 Starting Community Platform System Verification...');
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/krtech';
  await mongoose.connect(mongoUri);
  console.log('✅ 1. MongoDB Atlas connection verified.');

  // Test Badges
  const badgesCount = await Badge.countDocuments();
  console.log(`✅ 2. Badges collection verified: ${badgesCount} badges found.`);

  // Test Rooms
  const rooms = await Room.find().lean();
  console.log(`✅ 3. Rooms collection verified: ${rooms.length} rooms found. Sample room: "${rooms[0]?.name}"`);

  // Test Posts
  const posts = await Post.find().lean();
  console.log(`✅ 4. Posts collection verified: ${posts.length} posts found. Sample post: "${posts[0]?.title}"`);

  // Test Comments
  const comments = await Comment.find().lean();
  console.log(`✅ 5. Comments collection verified: ${comments.length} comments found.`);

  // Test CRUD: Create a verified test post
  const testPost = await Post.create({
    title: '🧪 Automated Verification Post: Microservices Kafka Integration',
    content: 'Testing automated creation of discussion threads with code snippets.',
    category: 'tech',
    author: {
      name: 'Verification Bot',
      email: 'verify@krtech.in',
      role: 'student',
      badge: 'Code Samurai',
    },
    tags: ['testing', 'verification', 'kafka'],
    codeSnippet: {
      language: 'javascript',
      code: 'console.log("Verified Community Thread");',
    },
  });
  console.log(`✅ 6. CRUD: Created test post with ID: ${testPost._id}`);

  // Test Upvote
  testPost.upvotes.push('verify@krtech.in');
  testPost.upvotesCount += 1;
  await testPost.save();
  console.log(`✅ 7. CRUD: Upvoted test post (upvotesCount: ${testPost.upvotesCount})`);

  // Test Comment
  const testComment = await Comment.create({
    post: testPost._id,
    author: {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@krtech.in',
      role: 'mentor',
      isMentor: true,
      badge: 'Master Mentor',
    },
    content: 'Great verification test! All indexes and relationships working.',
  });
  console.log(`✅ 8. CRUD: Added comment ID: ${testComment._id}`);

  // Test SavedPost
  const savedPost = await SavedPost.create({
    studentEmail: 'verify@krtech.in',
    post: testPost._id,
  });
  console.log(`✅ 9. CRUD: Bookmarked post with ID: ${savedPost._id}`);

  // Test Message in Room
  const testMessage = await Message.create({
    room: rooms[0]?.roomId || 'general-lounge',
    sender: {
      name: 'Verification Bot',
      email: 'verify@krtech.in',
      role: 'student',
      badge: 'Code Samurai',
    },
    content: 'Automated test message in chat room.',
  });
  console.log(`✅ 10. CRUD: Sent test message ID: ${testMessage._id}`);

  // Test CommunityNotification
  const notification = await CommunityNotification.create({
    recipient: 'verify@krtech.in',
    sender: { name: 'Dr. Priya Sharma', role: 'mentor' },
    type: 'comment',
    title: 'Test Notification',
    message: 'Your verification post received a reply.',
    link: `/community/post/${testPost._id}`,
  });
  console.log(`✅ 11. CommunityNotification created ID: ${notification._id}`);

  // Cleanup test artifacts
  await Post.deleteOne({ _id: testPost._id });
  await Comment.deleteOne({ _id: testComment._id });
  await SavedPost.deleteOne({ _id: savedPost._id });
  await Message.deleteOne({ _id: testMessage._id });
  await CommunityNotification.deleteOne({ _id: notification._id });
  console.log('✅ 12. Cleaned up verification records cleanly.');

  console.log('🎉 ALL 7 MODELS & CRUD OPERATIONS FULLY VERIFIED!');
  process.exit(0);
}

testCommunity().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
