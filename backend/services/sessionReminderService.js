/**
 * Session Reminder Service (24h + 30m Automations)
 * Checks scheduled LiveSessions and triggers email notifications for enrolled students.
 */

const LiveSession = require('../models/LiveSession');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const { sendSessionReminderEmail } = require('./emailService');

let intervalId = null;

/**
 * Scan upcoming live sessions and dispatch 24-hour and 30-minute reminder emails.
 * @returns {Promise<{ checked: number, sent24h: number, sent30m: number }>}
 */
const checkAndSendReminders = async () => {
  const result = { checked: 0, sent24h: 0, sent30m: 0 };

  try {
    const now = Date.now();
    const window24h = 24 * 60 * 60 * 1000;
    const window30m = 30 * 60 * 1000;

    // Fetch scheduled sessions in the future (within next 25h)
    const upcomingSessions = await LiveSession.find({
      status: 'scheduled',
      scheduledAt: {
        $gt: new Date(now),
        $lte: new Date(now + 25 * 60 * 60 * 1000),
      },
    }).populate('course');

    result.checked = upcomingSessions.length;

    for (const session of upcomingSessions) {
      const scheduledTime = new Date(session.scheduledAt).getTime();
      const timeRemaining = scheduledTime - now;

      // 1. Check 24-Hour Reminder (Between 0 and 24 hours away)
      if (!session.reminderSent24h && timeRemaining > 0 && timeRemaining <= window24h) {
        const recipients = await getRecipientsForSession(session);

        for (const recipient of recipients) {
          try {
            await sendSessionReminderEmail({
              email: recipient.email,
              name: recipient.name,
              session,
              type: '24h',
            });
            result.sent24h++;
          } catch (err) {
            console.error(`Error sending 24h reminder to ${recipient.email}:`, err.message);
          }
        }

        session.reminderSent24h = true;
        await session.save();
        console.log(`⏰ [ReminderService] 24h reminders dispatched for session: "${session.title}" (${recipients.length} recipients)`);
      }

      // 2. Check 30-Minute Reminder (Between 0 and 30 minutes away)
      if (!session.reminderSent30m && timeRemaining > 0 && timeRemaining <= window30m) {
        const recipients = await getRecipientsForSession(session);

        for (const recipient of recipients) {
          try {
            await sendSessionReminderEmail({
              email: recipient.email,
              name: recipient.name,
              session,
              type: '30m',
            });
            result.sent30m++;
          } catch (err) {
            console.error(`Error sending 30m reminder to ${recipient.email}:`, err.message);
          }
        }

        session.reminderSent30m = true;
        await session.save();
        console.log(`🚨 [ReminderService] 30m reminders dispatched for session: "${session.title}" (${recipients.length} recipients)`);
      }
    }
  } catch (error) {
    console.error('SessionReminderService error:', error);
  }

  return result;
};

/**
 * Retrieve eligible students for a live session based on course enrollment or fallback active students.
 */
const getRecipientsForSession = async (session) => {
  const recipientsMap = new Map();

  try {
    // A. Query Enrollments matching course
    const courseIdStr = session.course?._id ? session.course._id.toString() : session.course?.toString();
    if (courseIdStr) {
      const enrollments = await Enrollment.find({
        $or: [
          { courseId: courseIdStr },
          { courseId: session.course?.id },
        ],
      }).limit(50);

      for (const enr of enrollments) {
        if (enr.userEmail) {
          recipientsMap.set(enr.userEmail.toLowerCase(), {
            email: enr.userEmail,
            name: enr.userName || 'Student',
          });
        }
      }
    }

    // B. Fallback: If no enrollments exist (e.g. dev/staging environment), pick demo students
    if (recipientsMap.size === 0) {
      const demoUsers = await User.find({ role: { $in: ['student', 'user'] } }).limit(5);
      for (const u of demoUsers) {
        if (u.email) {
          recipientsMap.set(u.email.toLowerCase(), {
            email: u.email,
            name: u.name || 'Student',
          });
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch enrollment recipients:', err.message);
  }

  return Array.from(recipientsMap.values());
};

/**
 * Start periodic background check (default every 60 seconds)
 */
const startReminderScheduler = (intervalMs = 60000) => {
  if (intervalId) return;

  console.log(`🕒 [ReminderService] Live Session reminder background worker started (${intervalMs / 1000}s interval)`);
  
  // Run an initial check shortly after startup
  setTimeout(() => {
    checkAndSendReminders().catch(() => {});
  }, 5000);

  intervalId = setInterval(() => {
    checkAndSendReminders().catch((err) => {
      console.error('Scheduled reminder check failure:', err.message);
    });
  }, intervalMs);
};

const stopReminderScheduler = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('⏹️ [ReminderService] Live Session reminder worker stopped.');
  }
};

module.exports = {
  checkAndSendReminders,
  startReminderScheduler,
  stopReminderScheduler,
};
