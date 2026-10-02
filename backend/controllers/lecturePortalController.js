const Lecture = require('../models/Lecture');
const WatchHistory = require('../models/WatchHistory');
const Progress = require('../models/Progress');
const StudentAnalytics = require('../models/StudentAnalytics');

// Helper to extract email
const getEmail = (req) => {
  return (
    req.user?.email ||
    req.query.email ||
    req.body.email ||
    'aditya.sharma@krtech.edu'
  ).toLowerCase().trim();
};

/**
 * @desc    Get all lectures with optional course/module/search filters and student progress
 * @route   GET /api/portal/lectures
 */
const getLectures = async (req, res) => {
  try {
    const { courseId, search, moduleNumber } = req.query;
    const email = getEmail(req);

    const query = {};
    if (courseId && courseId !== 'all') {
      query.courseId = courseId;
    }
    if (moduleNumber) {
      query.moduleNumber = Number(moduleNumber);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const lectures = await Lecture.find(query)
      .sort({ moduleNumber: 1, lectureNumber: 1 })
      .lean();

    // Attach student watch history if exists
    const historyList = await WatchHistory.find({ userEmail: email }).lean();
    const historyMap = new Map();
    historyList.forEach((h) => historyMap.set(String(h.lectureId), h));

    const enriched = lectures.map((lec) => {
      const h = historyMap.get(String(lec._id));
      return {
        ...lec,
        userProgress: h
          ? {
              watchedSeconds: h.watchedSeconds,
              durationSeconds: h.durationSeconds,
              progressPercent: h.progressPercent,
              completed: h.completed,
              lastWatchedAt: h.lastWatchedAt,
            }
          : {
              watchedSeconds: 0,
              durationSeconds: (lec.durationMinutes || 45) * 60,
              progressPercent: 0,
              completed: false,
              lastWatchedAt: null,
            },
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      lectures: enriched,
    });
  } catch (error) {
    console.error('Get Lectures Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve lectures', error: error.message });
  }
};

/**
 * @desc    Get single lecture detail with chapters, notes, attachments, and user progress
 * @route   GET /api/portal/lectures/:id
 */
const getLectureById = async (req, res) => {
  try {
    const { id } = req.params;
    const email = getEmail(req);

    let lecture = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      lecture = await Lecture.findById(id).lean();
    }
    if (!lecture) {
      lecture = await Lecture.findOne({
        $or: [{ _id: id }, { courseId: id }],
      }).lean();
    }

    if (!lecture) {
      return res.status(404).json({ success: false, message: 'Lecture not found' });
    }

    // Fetch user watch history & notes
    const history = await WatchHistory.findOne({
      userEmail: email,
      lectureId: String(lecture._id),
    }).lean();

    res.json({
      success: true,
      lecture: {
        ...lecture,
        userProgress: history
          ? {
              watchedSeconds: history.watchedSeconds,
              durationSeconds: history.durationSeconds,
              progressPercent: history.progressPercent,
              completed: history.completed,
              lastWatchedAt: history.lastWatchedAt,
              personalNotes: history.personalNotes || '',
            }
          : {
              watchedSeconds: 0,
              durationSeconds: (lecture.durationMinutes || 45) * 60,
              progressPercent: 0,
              completed: false,
              lastWatchedAt: null,
              personalNotes: '',
            },
      },
    });
  } catch (error) {
    console.error('Get Lecture By ID Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve lecture details', error: error.message });
  }
};

/**
 * @desc    Get in-progress lectures for Continue Watching shelf
 * @route   GET /api/portal/lectures/continue-watching
 */
const getContinueWatching = async (req, res) => {
  try {
    const email = getEmail(req);

    const historyItems = await WatchHistory.find({
      userEmail: email,
      progressPercent: { $gt: 0, $lt: 95 },
      completed: false,
    })
      .sort({ lastWatchedAt: -1 })
      .limit(6)
      .lean();

    // Populate lecture details for each item
    const continueItems = await Promise.all(
      historyItems.map(async (item) => {
        let lec = null;
        if (item.lectureId.match(/^[0-9a-fA-F]{24}$/)) {
          lec = await Lecture.findById(item.lectureId).lean();
        } else {
          lec = await Lecture.findOne({ _id: item.lectureId }).lean();
        }

        const mins = Math.floor(item.watchedSeconds / 60);
        const secs = Math.floor(item.watchedSeconds % 60);
        const resumeTimestamp = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        return {
          lectureId: item.lectureId,
          courseId: item.courseId,
          title: lec?.title || item.lectureTitle,
          courseTitle: item.courseTitle || lec?.moduleTitle || 'KR Tech Cohort Track',
          thumbnail: lec?.thumbnail || item.thumbnail,
          instructor: lec?.instructor || item.instructor,
          watchedSeconds: item.watchedSeconds,
          durationSeconds: item.durationSeconds,
          progressPercent: item.progressPercent,
          resumeTimestamp,
          lastWatchedAt: item.lastWatchedAt,
          videoUrl: lec?.videoUrl || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
          chapters: lec?.chapters || [],
        };
      })
    );

    res.json({
      success: true,
      count: continueItems.length,
      items: continueItems,
    });
  } catch (error) {
    console.error('Continue Watching Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch continue watching items', error: error.message });
  }
};

/**
 * @desc    Update watch progress (seconds, completion)
 * @route   POST /api/portal/lectures/:id/progress
 */
const updateWatchProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const email = getEmail(req);
    const { watchedSeconds = 0, durationSeconds = 2700, completed = false } = req.body;

    let lecture = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      lecture = await Lecture.findById(id).lean();
    }
    if (!lecture) {
      lecture = await Lecture.findOne({ _id: id }).lean();
    }

    const safeDuration = durationSeconds > 0 ? durationSeconds : (lecture?.durationMinutes || 45) * 60;
    const calcPercent = Math.min(100, Math.round((watchedSeconds / safeDuration) * 100));
    const isCompleted = completed || calcPercent >= 90;

    const updatedHistory = await WatchHistory.findOneAndUpdate(
      { userEmail: email, lectureId: String(id) },
      {
        $set: {
          userEmail: email,
          lectureId: String(id),
          courseId: lecture?.courseId || 'general',
          lectureTitle: lecture?.title || 'Recorded Lecture Session',
          courseTitle: lecture?.moduleTitle || 'KR Tech Engineering Cohort',
          thumbnail: lecture?.thumbnail || '',
          instructor: lecture?.instructor || 'Senior Technical Architect',
          watchedSeconds,
          durationSeconds: safeDuration,
          progressPercent: calcPercent,
          completed: isCompleted,
          lastWatchedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // If marked as completed, update student Course Progress
    if (isCompleted && lecture?.courseId) {
      const progressDoc = await Progress.findOne({
        userEmail: email,
        courseId: lecture.courseId,
      });

      if (progressDoc) {
        if (!progressDoc.completedLectures.includes(String(id))) {
          progressDoc.completedLectures.push(String(id));
          const totalLecCount = await Lecture.countDocuments({ courseId: lecture.courseId });
          const denom = totalLecCount > 0 ? totalLecCount : 10;
          progressDoc.progressPercent = Math.min(
            100,
            Math.round((progressDoc.completedLectures.length / denom) * 100)
          );
          progressDoc.lastActiveAt = new Date();
          await progressDoc.save();

          // Award +50 XP for completing a lecture
          try {
            await StudentAnalytics.findOneAndUpdate(
              { userEmail: email },
              {
                $inc: { xp: 50 },
                $push: {
                  xpActivities: {
                    $each: [
                      {
                        title: `Finished Lecture: ${lecture.title}`,
                        xp: 50,
                        type: 'lecture',
                        timestamp: new Date(),
                      },
                    ],
                    $position: 0,
                  },
                },
              }
            );
          } catch (xpErr) {
            console.warn('XP increment ignored:', xpErr.message);
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Playback progress updated successfully',
      progress: updatedHistory,
    });
  } catch (error) {
    console.error('Update Progress Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update watch progress', error: error.message });
  }
};

/**
 * @desc    Save personal student notes for a lecture
 * @route   POST /api/portal/lectures/:id/notes
 */
const saveStudentNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const email = getEmail(req);
    const { notes = '' } = req.body;

    const history = await WatchHistory.findOneAndUpdate(
      { userEmail: email, lectureId: String(id) },
      {
        $set: {
          personalNotes: notes,
          lastWatchedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Personal lecture notes saved successfully to MongoDB Atlas!',
      notes: history.personalNotes,
    });
  } catch (error) {
    console.error('Save Notes Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save lecture notes', error: error.message });
  }
};

/**
 * @desc    Increment attachment download count and return download info
 * @route   POST /api/portal/lectures/:id/attachments/:attachmentId/download
 */
const downloadAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res.status(404).json({ success: false, message: 'Lecture not found' });
    }

    const attachment = lecture.attachments.find(
      (a) => String(a.id) === String(attachmentId) || String(a._id) === String(attachmentId)
    );

    if (!attachment) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    attachment.downloadCount = (attachment.downloadCount || 0) + 1;
    await lecture.save();

    res.json({
      success: true,
      message: 'Attachment download tracked',
      downloadCount: attachment.downloadCount,
      fileUrl: attachment.fileUrl,
      fileName: attachment.name,
    });
  } catch (error) {
    console.error('Download Attachment Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process attachment download', error: error.message });
  }
};

/**
 * @desc    Get student full watch history
 * @route   GET /api/portal/lectures/history
 */
const getWatchHistory = async (req, res) => {
  try {
    const email = getEmail(req);
    const history = await WatchHistory.find({ userEmail: email })
      .sort({ lastWatchedAt: -1 })
      .lean();

    res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error('Get Watch History Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get watch history', error: error.message });
  }
};

module.exports = {
  getLectures,
  getLectureById,
  getContinueWatching,
  updateWatchProgress,
  saveStudentNotes,
  downloadAttachment,
  getWatchHistory,
};
