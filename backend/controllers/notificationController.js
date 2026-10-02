const Notification = require('../models/Notification');

// @desc    Get all notifications with unread count and filtering
// @route   GET /api/notifications
// @access  Public / Authenticated
exports.getNotifications = async (req, res) => {
  try {
    const { type, isRead, recipient, limit = 50 } = req.query;

    const filter = {};

    // Type filter
    if (type && type !== 'all') {
      filter.type = type;
    }

    // Read/Unread filter
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true' || isRead === true;
    }

    // Recipient matching: specific recipient OR broadcast ('all')
    if (recipient) {
      filter.$or = [{ recipient: 'all' }, { recipient: recipient }];
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    // Calculate unread count
    const unreadCountFilter = { isRead: false };
    if (recipient) {
      unreadCountFilter.$or = [{ recipient: 'all' }, { recipient: recipient }];
    }
    const unreadCount = await Notification.countDocuments(unreadCountFilter);

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Public / Authenticated
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { userIdentifier } = req.body; // user email or id for broadcast tracking

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    if (userIdentifier && !notification.readBy.includes(userIdentifier)) {
      notification.readBy.push(userIdentifier);
    }
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    console.error('Mark As Read Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Public / Authenticated
exports.markAllAsRead = async (req, res) => {
  try {
    const { recipient } = req.body;

    const filter = { isRead: false };
    if (recipient) {
      filter.$or = [{ recipient: 'all' }, { recipient: recipient }];
    }

    const result = await Notification.updateMany(filter, { $set: { isRead: true } });

    res.json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Mark All As Read Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new notification (Admin announcement, Course reminder, Demo reminder)
// @route   POST /api/notifications
// @access  Admin / System
exports.createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type = 'announcement',
      recipient = 'all',
      recipientRole = 'all',
      priority = 'normal',
      actionUrl = '',
      metadata = {},
      createdBy,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required fields',
      });
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      recipient,
      recipientRole,
      priority,
      actionUrl,
      metadata,
      createdBy: createdBy || { name: 'KR Tech Admin', role: 'Staff Instructor' },
    });

    res.status(201).json({
      success: true,
      message: 'Notification published successfully',
      notification,
    });
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Admin
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Public / Admin
exports.getNotificationStats = async (req, res) => {
  try {
    const total = await Notification.countDocuments();
    const unread = await Notification.countDocuments({ isRead: false });

    const byType = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        total,
        unread,
        byType,
      },
    });
  } catch (error) {
    console.error('Notification Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
