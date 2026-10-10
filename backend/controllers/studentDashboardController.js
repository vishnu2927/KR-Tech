const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const CourseEnrollment = require('../models/CourseEnrollment');
const Progress = require('../models/Progress');
const CourseProgress = require('../models/CourseProgress');
const Lecture = require('../models/Lecture');
const Assignment = require('../models/Assignment');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const CourseContent = require('../models/CourseContent');
const Submission = require('../models/Submission');
const StudentAnalytics = require('../models/StudentAnalytics');

const getEffectiveStudent = (req) => {
  if (req.user && req.user.email) {
    return {
      userId: req.user._id,
      email: req.user.email.toLowerCase().trim(),
      name: req.user.name || 'Student',
      role: req.user.role || 'student',
      avatar: req.user.avatar || '',
    };
  }
  return null;
};

// @desc    Get aggregated Student Dashboard Summary
// @route   GET /api/student/dashboard
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    const userId = student.userId;

    // 1. Fetch Enrollments strictly for authenticated student
    let enrollments = await Enrollment.find({
      $or: [{ userEmail }, ...(userId ? [{ userId }] : [])],
    }).sort({ enrolledAt: -1 }).lean();

    if (enrollments.length === 0 && userId) {
      const courseEnrollments = await CourseEnrollment.find({ user: userId }).sort({ enrolledAt: -1 }).lean();
      if (courseEnrollments.length > 0) {
        enrollments = courseEnrollments.map((ce) => ({
          _id: ce._id,
          courseId: ce.courseId,
          courseTitle: ce.title,
          category: ce.category,
          thumbnail: ce.thumbnail,
          mentor: ce.mentor,
          mentorCompany: ce.mentorCompany,
          batch: ce.batch || '',
          status: ce.status,
          enrolledAt: ce.enrolledAt,
        }));
      }
    }

    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    // 2. Fetch Progress strictly for enrolled courses of authenticated student
    let progressList = [];
    if (enrolledCourseIds.length > 0) {
      progressList = await Progress.find({
        userEmail,
        courseId: { $in: enrolledCourseIds },
      }).lean();

      if (progressList.length === 0 && userId) {
        progressList = await CourseProgress.find({
          user: userId,
          courseId: { $in: enrolledCourseIds },
        }).lean();
      }
    }

    // 3. Fetch Recent Recorded Lectures for enrolled courses (empty if not enrolled)
    let recentLectures = [];
    if (enrolledCourseIds.length > 0) {
      recentLectures = await Lecture.find({
        courseId: { $in: enrolledCourseIds },
      }).sort({ lectureNumber: 1 }).limit(8).lean();
    }

    // 4. Fetch Assignments strictly for enrolled courses
    let assignments = [];
    if (enrolledCourseIds.length > 0) {
      assignments = await Assignment.find({
        courseId: { $in: enrolledCourseIds },
      }).sort({ createdAt: -1 }).limit(6).lean();
    }

    // 5. Fetch Certificates strictly for authenticated student
    const certificates = await Certificate.find({
      $or: [
        { studentEmail: userEmail },
        ...(userId ? [{ user: userId }] : []),
      ],
    }).sort({ createdAt: -1 }).lean();

    // 6. Student Analytics (Streak, Activity)
    const analytics = await StudentAnalytics.findOne({ userEmail }).lean();
    const streakDays = analytics?.streak?.current || 0;
    const recentActivity = analytics?.xpActivities || [];

    // 7. Compute Aggregated Metrics
    const totalEnrolled = enrollments.length;
    const overallProgress = (progressList.length > 0 && totalEnrolled > 0)
      ? Math.round(progressList.reduce((acc, curr) => acc + (curr.progressPercent || 0), 0) / progressList.length)
      : 0;

    const totalCompletedLectures = progressList.reduce(
      (acc, curr) => acc + (curr.completedLectures?.length || curr.completedLessons?.length || 0),
      0
    );

    const totalWatchMinutes = progressList.reduce(
      (acc, curr) => acc + (curr.totalTimeSpentMinutes || ((curr.learningHours || 0) * 60) || 0),
      0
    );
    const totalWatchHours = Math.round(totalWatchMinutes / 60);
    const certificatesEarned = certificates.length;

    // 8. Primary Continue Learning Course (Only if enrolled)
    let continueLearning = null;
    let upcomingAssignment = null;
    let upcomingMentorSession = null;
    let assignedMentor = null;

    if (enrollments.length > 0) {
      const primaryEnrollment = enrollments[0];
      const primaryProgress = progressList.find((p) => p.courseId === primaryEnrollment.courseId);
      const totalLessonsCount = await Lecture.countDocuments({ courseId: primaryEnrollment.courseId }) || 24;
      const completedCount = (primaryProgress?.completedLectures || primaryProgress?.completedLessons || []).length;

      continueLearning = {
        courseId: primaryEnrollment.courseId,
        title: primaryEnrollment.courseTitle || primaryEnrollment.title,
        category: primaryEnrollment.category || 'General',
        thumbnail: primaryEnrollment.thumbnail || '',
        mentor: primaryEnrollment.mentor || '',
        batch: primaryEnrollment.batch || '',
        progressPercent: primaryProgress?.progressPercent || 0,
        currentLesson: primaryProgress?.currentLesson || primaryProgress?.currentLectureTitle || 'Module 1: Introduction',
        completedLessons: completedCount,
        totalLessons: totalLessonsCount,
      };

      if (primaryEnrollment.mentor) {
        assignedMentor = {
          name: primaryEnrollment.mentor,
          title: primaryEnrollment.mentorCompany || '',
        };
      }

      const rawAssignment = assignments[0];
      if (rawAssignment) {
        upcomingAssignment = {
          id: rawAssignment._id,
          title: rawAssignment.title,
          courseTitle: rawAssignment.moduleTitle || continueLearning.title,
          dueDate: rawAssignment.deadline || 'Pending assignment',
          status: 'pending',
          points: rawAssignment.maxScore || 100,
        };
      }
    }

    // Weekly Activity: 7-day learning activity (0s for fresh user)
    const weeklyActivity = [
      { day: 'Mon', hours: 0, lessons: 0 },
      { day: 'Tue', hours: 0, lessons: 0 },
      { day: 'Wed', hours: 0, lessons: 0 },
      { day: 'Thu', hours: 0, lessons: 0 },
      { day: 'Fri', hours: 0, lessons: 0 },
      { day: 'Sat', hours: 0, lessons: 0 },
      { day: 'Sun', hours: 0, lessons: 0 },
    ];

    res.json({
      success: true,
      user: {
        id: userId,
        email: userEmail,
        name: student.name,
        role: student.role,
        avatar: student.avatar,
      },
      metrics: {
        coursesEnrolled: totalEnrolled,
        lessonsCompleted: totalCompletedLectures,
        learningHours: totalWatchHours,
        certificatesEarned,
        totalEnrolled,
        overallProgress,
        totalCompletedLectures,
        totalWatchHours,
        activeCertificates: certificatesEarned,
        pendingAssignments: assignments.length,
        streakDays,
      },
      continueLearning,
      upcomingAssignment,
      upcomingMentorSession,
      assignedMentor,
      recentCertificates: certificates,
      weeklyActivity,
      enrollments,
      progress: progressList,
      recentLectures,
      assignments,
      certificates,
      upcomingClasses: [],
      recentActivity,
    });
  } catch (error) {
    console.error('Student Dashboard Summary Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Student Enrollments
// @route   GET /api/enrollments
// @access  Private
const getEnrollments = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    const userId = student.userId;

    let enrollments = await Enrollment.find({
      $or: [{ userEmail }, ...(userId ? [{ userId }] : [])],
    }).sort({ enrolledAt: -1 }).lean();

    if (enrollments.length === 0 && userId) {
      enrollments = await CourseEnrollment.find({ user: userId }).sort({ enrolledAt: -1 }).lean();
    }

    res.json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    console.error('Get Enrollments Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enroll in a Course
// @route   POST /api/enrollments
// @access  Private
const createEnrollment = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    const userId = student.userId;
    const { courseId, courseTitle, category, mentor } = req.body;

    if (!courseId || !courseTitle) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and Course Title are required.',
      });
    }

    let enrollment = await Enrollment.findOne({ userEmail, courseId });
    if (enrollment) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this course track.',
        enrollment,
      });
    }

    enrollment = await Enrollment.create({
      userId: userId || null,
      userEmail,
      userName: student.name,
      courseId,
      courseTitle,
      category: category || 'Software Engineering',
      mentor: mentor || 'Senior Technical Architect',
      status: 'active',
      enrolledAt: new Date(),
    });

    // Initialize Progress record with 0% progress and 0 minutes
    await Progress.findOneAndUpdate(
      { userEmail, courseId },
      {
        $setOnInsert: {
          userId: userId || null,
          userEmail,
          courseId,
          completedLectures: [],
          completedAssignments: [],
          progressPercent: 0,
          totalTimeSpentMinutes: 0,
          lastActiveAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: `Enrolled successfully in ${courseTitle}!`,
      enrollment,
    });
  } catch (error) {
    console.error('Create Enrollment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Course Progress
// @route   GET /api/progress/:courseId
// @access  Private
const getProgress = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    const { courseId } = req.params;

    let progress = await Progress.findOne({ userEmail, courseId });

    if (!progress) {
      // Return default initial progress
      progress = {
        userEmail,
        courseId,
        completedLectures: [],
        completedAssignments: [],
        progressPercent: 0,
        totalTimeSpentMinutes: 0,
      };
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error('Get Progress Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle / Mark Lecture as Completed
// @route   POST /api/progress/mark-lecture
// @access  Public / OptionalAuth
const markLectureCompleted = async (req, res) => {
  try {
    const userEmail = getEffectiveEmail(req);
    const { courseId, lectureId, completed = true } = req.body;

    if (!courseId || !lectureId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and Lecture ID are required.',
      });
    }

    let progress = await Progress.findOne({ userEmail, courseId });
    if (!progress) {
      progress = new Progress({
        userId: req.user ? req.user._id : null,
        userEmail,
        courseId,
        completedLectures: [],
        completedAssignments: [],
      });
    }

    const setOfLectures = new Set(progress.completedLectures || []);
    if (completed) {
      setOfLectures.add(lectureId);
    } else {
      setOfLectures.delete(lectureId);
    }

    progress.completedLectures = Array.from(setOfLectures);

    // Compute progress % based on total lectures for this course
    const totalLecturesCount = await Lecture.countDocuments({ courseId });
    const denominator = totalLecturesCount > 0 ? totalLecturesCount : 10;
    progress.progressPercent = Math.min(100, Math.round((progress.completedLectures.length / denominator) * 100));
    progress.currentLectureId = lectureId;
    progress.lastActiveAt = new Date();
    progress.totalTimeSpentMinutes += 45;

    await progress.save();

    res.json({
      success: true,
      message: `Lecture marked as ${completed ? 'completed' : 'uncompleted'}.`,
      progress,
    });
  } catch (error) {
    console.error('Mark Lecture Completed Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Recorded Lectures (with course filter, notes download link)
// @route   GET /api/lectures
// @access  Public
const getLectures = async (req, res) => {
  try {
    const { courseId, moduleNumber, search } = req.query;
    const query = {};

    if (courseId && courseId !== 'All') query.courseId = courseId;
    if (moduleNumber) query.moduleNumber = Number(moduleNumber);
    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { moduleTitle: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const lectures = await Lecture.find(query).sort({ moduleNumber: 1, lectureNumber: 1 });
    res.json({ success: true, count: lectures.length, lectures });
  } catch (error) {
    console.error('Get Lectures Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Lecture Details
// @route   GET /api/lectures/:id
// @access  Public
const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ success: false, message: 'Lecture not found' });
    }
    res.json({ success: true, lecture });
  } catch (error) {
    console.error('Get Lecture by ID Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Course Assignments
// @route   GET /api/assignments
// @access  Public
const getAssignments = async (req, res) => {
  try {
    const { courseId } = req.query;
    const query = {};
    if (courseId && courseId !== 'All') query.courseId = courseId;

    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: assignments.length, assignments });
  } catch (error) {
    console.error('Get Assignments Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Assignment
// @route   POST /api/assignments/:id/submit
// @access  Public / OptionalAuth
const submitAssignment = async (req, res) => {
  try {
    const userEmail = getEffectiveEmail(req);
    const { id } = req.params;
    const { githubUrl, liveDemoUrl, notes } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: 'GitHub repository URL is required for submission.',
      });
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Remove any previous submission by this student
    assignment.submissions = assignment.submissions.filter((s) => s.userEmail !== userEmail);

    assignment.submissions.push({
      userId: req.user ? req.user._id : null,
      userEmail,
      studentName: req.user ? req.user.name : 'Student',
      githubUrl: githubUrl.trim(),
      liveDemoUrl: (liveDemoUrl || '').trim(),
      notes: (notes || '').trim(),
      status: 'submitted',
      grade: 'Pending Review',
      score: 0,
      feedback: 'Our principal mentor is reviewing your implementation against the design spec.',
      submittedAt: new Date(),
    });

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully! Feedback will be published within 24 hours.',
      assignment,
    });
  } catch (error) {
    console.error('Submit Assignment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Enrolled Courses for authenticated Student
// @route   GET /api/student/courses
// @access  Private
const getStudentCourses = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    const userId = student.userId;

    let enrollments = [];
    if (userId) {
      enrollments = await CourseEnrollment.find({ user: userId }).sort({ enrolledAt: -1 }).lean();
    }
    if (enrollments.length === 0) {
      enrollments = await Enrollment.find({ userEmail }).sort({ enrolledAt: -1 }).lean();
    }

    if (enrollments.length === 0 && req.user?.enrolledCourses?.length > 0) {
      enrollments = req.user.enrolledCourses.map((c) => ({
        courseId: c.courseId,
        courseTitle: c.title,
        title: c.title,
        category: 'Software Engineering',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=340&fit=crop&auto=format',
        mentor: 'Senior Technical Architect',
        progress: c.progress || 0,
        status: 'active',
        enrolledAt: c.enrolledAt || new Date(),
      }));
    }

    res.json({
      success: true,
      count: enrollments.length,
      courses: enrollments,
    });
  } catch (error) {
    console.error('Get Student Courses Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Learning Progress, Weekly Activity & Analytics
// @route   GET /api/student/progress
// @access  Private
const getStudentProgress = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    const userId = student.userId;

    let progressRecords = [];
    if (userId) {
      progressRecords = await CourseProgress.find({ user: userId }).lean();
    }
    if (progressRecords.length === 0) {
      progressRecords = await Progress.find({ userEmail }).lean();
    }

    const overallProgress = progressRecords.length > 0
      ? Math.round(progressRecords.reduce((acc, curr) => acc + (curr.progressPercent || 0), 0) / progressRecords.length)
      : 0;

    const totalCompletedLectures = progressRecords.reduce(
      (acc, curr) => acc + (curr.completedLectures?.length || curr.completedLessons?.length || 0),
      0
    );

    const totalWatchMinutes = progressRecords.reduce(
      (acc, curr) => acc + (curr.totalTimeSpentMinutes || ((curr.learningHours || 0) * 60) || 0),
      0
    );
    const totalHours = Math.round(totalWatchMinutes / 60);

    const analytics = await StudentAnalytics.findOne({ userEmail }).lean();

    const weeklyActivity = [
      { day: 'Mon', hours: 0, lessons: 0 },
      { day: 'Tue', hours: 0, lessons: 0 },
      { day: 'Wed', hours: 0, lessons: 0 },
      { day: 'Thu', hours: 0, lessons: 0 },
      { day: 'Fri', hours: 0, lessons: 0 },
      { day: 'Sat', hours: 0, lessons: 0 },
      { day: 'Sun', hours: 0, lessons: 0 },
    ];

    res.json({
      success: true,
      overallProgress,
      lessonsCompleted: totalCompletedLectures,
      totalHours,
      weeklyStreak: analytics?.streak?.current || 0,
      xp: analytics?.xp || 0,
      badges: analytics?.badges?.filter((b) => b.unlocked) || [],
      progressList: progressRecords,
      weeklyActivity,
    });
  } catch (error) {
    console.error('Get Student Progress Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: Ensure modules and lessons exist for courseId, auto-seed if empty
const ensureCourseContentExists = async (courseId) => {
  const existingCount = await Lesson.countDocuments({ courseId });
  if (existingCount > 0) return;

  // Check if course has a matching slug or title in courses
  let courseTitle = 'Enterprise Full Stack & Cloud Mastery';
  try {
    const courseDoc = await Course.findById(courseId);
    if (courseDoc && courseDoc.title) {
      courseTitle = courseDoc.title;
    }
  } catch {
    // Not an ObjectId
  }

  const mod1 = await Module.create({
    courseId,
    moduleNumber: 1,
    title: 'Module 1: Architecture & Distributed Core',
    description: 'Core concepts, production architecture patterns, thread safety, and concurrency.',
    duration: '2 hours 30 mins',
    order: 1,
  });

  const mod2 = await Module.create({
    courseId,
    moduleNumber: 2,
    title: 'Module 2: High-Throughput Processing & Microservices',
    description: 'Event queues, stream processing, caching strategies, and resilience.',
    duration: '3 hours 15 mins',
    order: 2,
  });

  await Lesson.create([
    {
      courseId,
      moduleId: mod1._id.toString(),
      moduleTitle: mod1.title,
      lessonNumber: 1,
      title: 'Enterprise Architecture & System Topology',
      duration: '15:20',
      durationSeconds: 920,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'System topology, high-availability setups, and cloud design trade-offs.',
      notes: '### System Architecture Notes\n- Monolith to Distributed Services migration\n- Decoupled event-driven patterns\n- Production monitoring & observability',
      resources: [
        { title: 'Architecture Blueprint (PDF)', url: 'https://krtech.edu/resources/blueprint.pdf', type: 'pdf' },
      ],
      isFreePreview: true,
      order: 1,
    },
    {
      courseId,
      moduleId: mod1._id.toString(),
      moduleTitle: mod1.title,
      lessonNumber: 2,
      title: 'Memory Models, Concurrency & Thread Optimization',
      duration: '22:45',
      durationSeconds: 1365,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'Analyzing thread dumps, avoiding deadlocks, and optimizing memory allocation.',
      notes: '### Concurrency & Threading Notes\n- Thread safety primitives\n- Race conditions and atomic primitives\n- High-scale latency profiling',
      resources: [
        { title: 'Concurrency Cheatsheet', url: 'https://krtech.edu/resources/concurrency.pdf', type: 'pdf' },
      ],
      isFreePreview: false,
      order: 2,
    },
    {
      courseId,
      moduleId: mod2._id.toString(),
      moduleTitle: mod2.title,
      lessonNumber: 3,
      title: 'Event Streaming & Idempotent Consumer Patterns',
      duration: '26:10',
      durationSeconds: 1570,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'Guaranteed message delivery, handling poison pills, and consumer group rebalancing.',
      notes: '### Event Streaming Notes\n- At-least-once vs exactly-once semantics\n- Dead Letter Queues (DLQ)\n- Distributed idempotency keys',
      resources: [
        { title: 'Streaming Patterns Guide', url: 'https://krtech.edu/resources/streaming.pdf', type: 'pdf' },
      ],
      isFreePreview: false,
      order: 3,
    },
    {
      courseId,
      moduleId: mod2._id.toString(),
      moduleTitle: mod2.title,
      lessonNumber: 4,
      title: 'Distributed Caching & Circuit Breaker Fault Tolerance',
      duration: '19:40',
      durationSeconds: 1180,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      description: 'Multi-tier cache invalidation, cache stampede prevention, and fallback decorators.',
      notes: '### Fault Tolerance Notes\n- Circuit Breakers: Closed, Open, Half-Open states\n- Exponential backoff retry policies\n- Distributed lock lease timeouts',
      resources: [
        { title: 'Fault Tolerance Config (PDF)', url: 'https://krtech.edu/resources/fault-tolerance.pdf', type: 'pdf' },
      ],
      isFreePreview: false,
      order: 4,
    },
  ]);

  await CourseContent.findOneAndUpdate(
    { courseId },
    {
      courseId,
      title: courseTitle,
      overview: `Hands-on industry curriculum for ${courseTitle}. Master real-world cloud architectures, scalable backend systems, and fault-tolerant microservices.`,
      totalLessons: 4,
      totalDuration: '5 hours 45 mins',
      modules: [
        { moduleNumber: 1, title: mod1.title, lessonsCount: 2, duration: mod1.duration },
        { moduleNumber: 2, title: mod2.title, lessonsCount: 2, duration: mod2.duration },
      ],
    },
    { upsert: true, new: true }
  );
};

// @desc    Get Course Details with Progress and Modules Summary
// @route   GET /api/student/course/:courseId
// @access  Public / OptionalAuth
const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userEmail = getEffectiveEmail(req);

    await ensureCourseContentExists(courseId);

    // 1. Fetch Course Info
    let courseInfo = await CourseContent.findOne({ courseId }).lean();
    if (!courseInfo) {
      const courseDoc = await Course.findOne({
        $or: [{ courseId }, { slug: courseId }]
      }).lean();
      if (courseDoc) {
        courseInfo = {
          courseId,
          title: courseDoc.title,
          overview: courseDoc.description || courseDoc.subTitle || 'Comprehensive enterprise course',
          totalLessons: 7,
          totalDuration: '45 hours',
        };
      } else {
        courseInfo = {
          courseId,
          title: 'Complete Enterprise Software Architecture & Cloud Mastery',
          overview: 'Comprehensive full-stack, distributed microservices, and cloud-native architecture training.',
          totalLessons: 7,
          totalDuration: '45 hours',
        };
      }
    }

    // 2. Fetch User Progress
    let progressDoc = await CourseProgress.findOne({ courseId, userEmail }).lean();
    if (!progressDoc) {
      progressDoc = await Progress.findOne({ courseId, userEmail }).lean();
    }

    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedLessons = progressDoc?.completedLessons || progressDoc?.completedLectures || [];
    const completedCount = completedLessons.length;
    const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    // 3. Check Enrollment Status
    const enrollment = await Enrollment.findOne({ courseId, userEmail });
    const isEnrolled = !!enrollment || true; // Allow seamless preview/learning access

    // 4. Fetch Modules Count
    const modulesCount = await Module.countDocuments({ courseId });

    res.json({
      success: true,
      course: {
        ...courseInfo,
        courseId,
        instructor: 'Dr. Rajesh Kumar (Principal Technical Architect Staff Architect)',
        level: 'Intermediate to Advanced',
        rating: 4.9,
        reviewsCount: 1420,
        enrolledStudentsCount: 3840,
        lastUpdated: 'September 2026',
        certificateIncluded: true,
      },
      progress: {
        progressPercent: progressDoc?.progressPercent ?? progressPercent,
        completedLessons,
        completedCount,
        totalLessons,
        currentLesson: progressDoc?.currentLesson || 'Welcome & Enterprise Architecture Blueprint',
        lastAccessed: progressDoc?.lastAccessed || progressDoc?.updatedAt || new Date(),
      },
      modulesCount,
      enrolled: isEnrolled,
    });
  } catch (error) {
    console.error('Get Course Details Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Course Modules with Nested Lessons and Progress
// @route   GET /api/student/course/:courseId/modules
// @access  Public / OptionalAuth
const getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userEmail = getEffectiveEmail(req);

    await ensureCourseContentExists(courseId);

    const modules = await Module.find({ courseId }).sort({ moduleNumber: 1, order: 1 }).lean();
    const allLessons = await Lesson.find({ courseId }).sort({ lessonNumber: 1, order: 1 }).lean();

    // Fetch user progress
    const progressDoc = await CourseProgress.findOne({ courseId, userEmail }).lean() ||
                        await Progress.findOne({ courseId, userEmail }).lean();

    const completedLessonIds = (progressDoc?.completedLessons || progressDoc?.completedLectures || []).map(String);

    const modulesWithLessons = modules.map((mod) => {
      const modLessons = allLessons.filter(
        (l) => l.moduleId === mod._id.toString() || l.moduleTitle === mod.title
      );

      const completedCount = modLessons.filter(
        (l) => completedLessonIds.includes(l._id.toString()) || completedLessonIds.includes(String(l.lessonNumber))
      ).length;

      const modProgress = modLessons.length > 0 ? Math.round((completedCount / modLessons.length) * 100) : 0;

      return {
        ...mod,
        totalLessonsCount: modLessons.length,
        completedLessonsCount: completedCount,
        progressPercent: modProgress,
        lessons: modLessons.map((les) => ({
          ...les,
          isCompleted: completedLessonIds.includes(les._id.toString()) || completedLessonIds.includes(String(les.lessonNumber)),
        })),
      };
    });

    res.json({
      success: true,
      courseId,
      modulesCount: modulesWithLessons.length,
      modules: modulesWithLessons,
    });
  } catch (error) {
    console.error('Get Course Modules Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Lessons for a Course
// @route   GET /api/student/course/:courseId/lessons
// @access  Public / OptionalAuth
const getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userEmail = getEffectiveEmail(req);

    await ensureCourseContentExists(courseId);

    const lessons = await Lesson.find({ courseId }).sort({ lessonNumber: 1, order: 1 }).lean();

    const progressDoc = await CourseProgress.findOne({ courseId, userEmail }).lean() ||
                        await Progress.findOne({ courseId, userEmail }).lean();

    const completedLessonIds = (progressDoc?.completedLessons || progressDoc?.completedLectures || []).map(String);

    const mappedLessons = lessons.map((les) => ({
      ...les,
      isCompleted: completedLessonIds.includes(les._id.toString()) || completedLessonIds.includes(String(les.lessonNumber)),
    }));

    res.json({
      success: true,
      courseId,
      count: mappedLessons.length,
      lessons: mappedLessons,
    });
  } catch (error) {
    console.error('Get Course Lessons Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Course Learning Progress (Mark Complete, Auto-update)
// @route   PATCH /api/student/course/:courseId/progress
// @access  Public / OptionalAuth
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, completed = true, currentLessonTitle, watchTimeSeconds } = req.body;
    const userEmail = getEffectiveEmail(req);
    let userId = req.user?._id;

    if (!userId) {
      const user = await User.findOne({ email: userEmail });
      if (user) userId = user._id;
    }

    const totalLessons = await Lesson.countDocuments({ courseId });

    // Find or create CourseProgress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      $or: [{ user: userId }, { userEmail: userEmail }],
    });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        user: userId || new mongoose.Types.ObjectId(),
        courseId,
        completedLessons: [],
        progressPercent: 0,
        currentLesson: currentLessonTitle || 'Module 1: Architecture & Distributed Systems',
        learningHours: 1,
        lastAccessed: new Date(),
      });
    }

    if (lessonId) {
      const lessonIdStr = String(lessonId);
      const exists = courseProgress.completedLessons.includes(lessonIdStr);

      if (completed && !exists) {
        courseProgress.completedLessons.push(lessonIdStr);
      } else if (!completed && exists) {
        courseProgress.completedLessons = courseProgress.completedLessons.filter(
          (id) => id !== lessonIdStr
        );
      }
    }

    const completedCount = courseProgress.completedLessons.length;
    const newProgressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    courseProgress.progressPercent = newProgressPercent;
    if (currentLessonTitle) {
      courseProgress.currentLesson = currentLessonTitle;
    }
    courseProgress.lastAccessed = new Date();
    if (watchTimeSeconds && watchTimeSeconds > 0) {
      courseProgress.learningHours = Math.round(((courseProgress.learningHours || 1) * 3600 + watchTimeSeconds) / 3600 * 10) / 10;
    }

    await courseProgress.save();

    // Sync with legacy Progress model
    await Progress.findOneAndUpdate(
      { userEmail, courseId },
      {
        userEmail,
        courseId,
        courseTitle: courseId,
        progressPercent: newProgressPercent,
        completedLectures: courseProgress.completedLessons,
        currentLectureTitle: courseProgress.currentLesson,
        lastAccessed: new Date(),
      },
      { upsert: true, new: true }
    );

    // Sync with Enrollment
    await Enrollment.findOneAndUpdate(
      { userEmail, courseId },
      {
        progressPercent: newProgressPercent,
        status: newProgressPercent >= 100 ? 'completed' : 'active',
        completedAt: newProgressPercent >= 100 ? new Date() : null,
      }
    );

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: {
        progressPercent: newProgressPercent,
        completedLessons: courseProgress.completedLessons,
        completedCount,
        totalLessons,
        currentLesson: courseProgress.currentLesson,
        learningHours: courseProgress.learningHours,
        lastAccessed: courseProgress.lastAccessed,
      },
    });
  } catch (error) {
    console.error('Update Course Progress Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Course Assignment
// @route   POST /api/student/course/:courseId/assignment
// @access  Public / OptionalAuth
const submitCourseAssignment = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.body.courseId || 'crs-java-fullstack-2026';
    const { assignmentId, githubUrl, liveDemoUrl = '', notes = '', fileUrl = '', fileName = '' } = req.body;
    const userEmail = getEffectiveEmail(req);
    let userId = req.user?._id;
    const studentName = req.user?.name || 'Student Engineer';

    if (!githubUrl && !fileUrl && !fileName) {
      return res.status(400).json({
        success: false,
        message: 'A GitHub repository URL or uploaded file (PDF/ZIP) is required for evaluation',
      });
    }

    if (!userId) {
      const user = await User.findOne({ email: userEmail });
      if (user) userId = user._id;
    }

    const validAssignmentId = (assignmentId && mongoose.Types.ObjectId.isValid(assignmentId))
      ? new mongoose.Types.ObjectId(assignmentId)
      : new mongoose.Types.ObjectId();

    const effectiveGithubUrl = githubUrl || fileUrl || (fileName ? `https://krtech.in/uploads/${fileName}` : 'https://krtech.in/submissions/file.zip');

    // 1. Create document in Submission collection
    const submission = await Submission.create({
      assignmentId: validAssignmentId,
      courseId,
      user: userId || new mongoose.Types.ObjectId(),
      userEmail,
      studentName,
      githubUrl: effectiveGithubUrl,
      liveDemoUrl,
      notes: notes || (fileName ? `Uploaded file: ${fileName}` : ''),
      fileUrl: fileUrl || effectiveGithubUrl,
      status: 'submitted',
      grade: 'Pending Evaluation',
      score: 0,
      feedback: 'Our Senior Technical Mentor is evaluating your code modularity, architecture patterns, and test suites.',
      submittedAt: new Date(),
    });

    // 2. If valid Assignment document exists, push to its submissions array
    if (assignmentId && mongoose.Types.ObjectId.isValid(assignmentId)) {
      await Assignment.findByIdAndUpdate(assignmentId, {
        $push: {
          submissions: {
            userId: userId || new mongoose.Types.ObjectId(),
            userEmail,
            studentName,
            githubUrl: effectiveGithubUrl,
            liveDemoUrl,
            notes,
            status: 'submitted',
            submittedAt: new Date(),
          },
        },
      });
    }

    // 3. Record in CourseProgress completedAssignments
    if (assignmentId) {
      await CourseProgress.findOneAndUpdate(
        { courseId, userEmail },
        { $addToSet: { completedAssignments: String(assignmentId) } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully for mentor code review',
      submission,
    });
  } catch (error) {
    console.error('Submit Course Assignment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getEnrollments,
  createEnrollment,
  getProgress,
  markLectureCompleted,
  getLectures,
  getLectureById,
  getAssignments,
  submitAssignment,
  getStudentCourses,
  getStudentProgress,
  getCourseDetails,
  getCourseModules,
  getCourseLessons,
  updateCourseProgress,
  submitCourseAssignment,
};

