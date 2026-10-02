const DeviceToken = require('../models/DeviceToken');
const OfflineProgress = require('../models/OfflineProgress');
const CourseProgress = require('../models/CourseProgress');

// @desc    Register Device Push Token for PWA
// @route   POST /api/pwa/register-device
// @access  Public / Authenticated
const registerDevice = async (req, res) => {
  try {
    const { endpoint, keys, deviceType, browser, os } = req.body;

    if (!endpoint) {
      return res.status(400).json({ success: false, message: 'Push endpoint or token is required' });
    }

    const userId = req.user?._id || null;
    const userEmail = req.user?.email || '';

    let device = await DeviceToken.findOne({ endpoint });

    if (device) {
      device.user = userId || device.user;
      device.userEmail = userEmail || device.userEmail;
      device.keys = keys || device.keys;
      device.deviceType = deviceType || device.deviceType;
      device.browser = browser || device.browser;
      device.os = os || device.os;
      device.isActive = true;
      device.lastActive = new Date();
      await device.save();
    } else {
      device = await DeviceToken.create({
        user: userId,
        userEmail,
        endpoint,
        keys: keys || {},
        deviceType: deviceType || 'browser',
        browser: browser || 'Chrome',
        os: os || 'Android',
        ipAddress: req.ip || '',
        isActive: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'PWA device registered for push notifications successfully',
      device,
    });
  } catch (error) {
    console.error('Register Device Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sync Offline Lesson Watch Progress from IndexedDB
// @route   POST /api/pwa/sync-progress
// @access  Private / Authenticated
const syncProgress = async (req, res) => {
  try {
    const { progressBatch, deviceInfo } = req.body;

    if (!progressBatch || !Array.isArray(progressBatch)) {
      return res.status(400).json({ success: false, message: 'progressBatch array is required' });
    }

    const userId = req.user?._id;
    const userEmail = req.user?.email;

    const savedRecords = [];

    for (const item of progressBatch) {
      const record = await OfflineProgress.create({
        student: userId,
        studentEmail: userEmail,
        courseId: item.courseId,
        lessonId: item.lessonId,
        moduleNumber: item.moduleNumber || 1,
        durationWatchedSeconds: item.durationWatchedSeconds || 0,
        completed: item.completed || false,
        quizScore: item.quizScore || null,
        offlineTimestamp: item.offlineTimestamp ? new Date(item.offlineTimestamp) : new Date(),
        syncedAt: new Date(),
        deviceInfo: deviceInfo || 'PWA IndexedDB Sync',
      });
      savedRecords.push(record);

      // Update primary CourseProgress if available
      try {
        if (userId && item.completed) {
          await CourseProgress.findOneAndUpdate(
            { user: userId, courseId: item.courseId },
            {
              $addToSet: { completedLessons: item.lessonId },
              $set: { lastAccessed: new Date() },
            },
            { upsert: true }
          );
        }
      } catch (e) {
        // Non-blocking
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully synchronized ${savedRecords.length} offline progress records`,
      count: savedRecords.length,
    });
  } catch (error) {
    console.error('Sync Progress Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Offline-Ready Lessons Catalog for Downloads
// @route   GET /api/pwa/offline-lessons
// @access  Public / Authenticated
const getOfflineLessons = async (req, res) => {
  try {
    const offlineLibrary = [
      {
        id: "off-01",
        courseId: "java-backend",
        courseTitle: "Java Backend Development with Spring Boot 3 & Microservices",
        title: "Microservices Service Discovery with Eureka & Spring Cloud",
        module: "Module 4 · Spring Cloud Architecture",
        durationMinutes: 48,
        fileSizeBytes: 245000000, // ~245 MB
        fileSizeFormatted: "245 MB",
        thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        notesPdfUrl: "https://krtech.edu/notes/spring-cloud-eureka.pdf",
        mentor: "Rajesh Kumar (Principal Technical Architect)",
      },
      {
        id: "off-02",
        courseId: "mern-stack",
        courseTitle: "MERN Stack Full Stack Web Development Mastery",
        title: "Next.js 15 Server Actions & Optimistic UI Updates",
        module: "Module 6 · Full Stack Next.js",
        durationMinutes: 42,
        fileSizeBytes: 198000000, // ~198 MB
        fileSizeFormatted: "198 MB",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop&auto=format",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        notesPdfUrl: "https://krtech.edu/notes/nextjs15-server-actions.pdf",
        mentor: "Amit Verma (Principal Systems Architect)",
      },
      {
        id: "off-03",
        courseId: "aws-architect",
        courseTitle: "AWS Certified Solutions Architect Associate (SAA-C03)",
        title: "VPC Peering, Transit Gateways & Direct Connect Masterclass",
        module: "Module 3 · Enterprise Cloud Networking",
        durationMinutes: 54,
        fileSizeBytes: 280000000, // ~280 MB
        fileSizeFormatted: "280 MB",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        notesPdfUrl: "https://krtech.edu/notes/aws-transit-gateway.pdf",
        mentor: "Vikram Nair (Staff Software Engineer Cloud)",
      },
      {
        id: "off-04",
        courseId: "ai-engineering",
        courseTitle: "AI, Large Language Models & Prompt Engineering",
        title: "Building Enterprise RAG with LangChain & Pinecone Vector DB",
        module: "Module 5 · Retrieval Augmented Generation",
        durationMinutes: 50,
        fileSizeBytes: 260000000, // ~260 MB
        fileSizeFormatted: "260 MB",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop&auto=format",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        notesPdfUrl: "https://krtech.edu/notes/langchain-rag-pinecone.pdf",
        mentor: "Deepak Joshi (Senior FinTech Architect)",
      },
    ];

    res.json({
      success: true,
      count: offlineLibrary.length,
      lessons: offlineLibrary,
    });
  } catch (error) {
    console.error('Get Offline Lessons Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerDevice,
  syncProgress,
  getOfflineLessons,
};
