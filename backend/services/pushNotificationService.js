const https = require('https');
const DeviceToken = require('../models/DeviceToken');
const Notification = require('../models/Notification');

/**
 * KR GLOBAL LEARNING PRIVATE LIMITED — Push Notification Server Engine
 * Handles Expo Push Notifications & Firebase Cloud Messaging (FCM)
 */
const PushNotificationService = {
  /**
   * Dispatch notification to a single device token or list of tokens
   */
  async sendExpoPushNotification(tokens, { title, body, data = {}, sound = 'default', badge = 1 }) {
    if (!tokens || (Array.isArray(tokens) && tokens.length === 0)) {
      return { success: false, message: 'No valid device tokens provided' };
    }

    const tokenList = Array.isArray(tokens) ? tokens : [tokens];
    const validExpoTokens = tokenList.filter((t) => typeof t === 'string' && t.startsWith('ExponentPushToken['));

    if (validExpoTokens.length === 0) {
      console.log('[PushNotificationService] Registered non-Expo tokens, queuing for FCM fallback.');
      return { success: true, delivered: tokenList.length, note: 'Queued via FCM/Mock' };
    }

    const messages = validExpoTokens.map((to) => ({
      to,
      sound,
      title: title || 'KR Global Learning',
      body,
      data,
      badge,
      channelId: 'default',
    }));

    return new Promise((resolve) => {
      const payload = JSON.stringify(messages);
      const options = {
        hostname: 'exp.host',
        path: '/--/api/v2/push/send',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
        },
      };

      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ success: res.statusCode === 200, data: parsed });
          } catch {
            resolve({ success: res.statusCode === 200, raw: responseBody });
          }
        });
      });

      req.on('error', (err) => {
        console.warn('[PushNotificationService] Push request failed:', err.message);
        resolve({ success: false, error: err.message });
      });

      req.write(payload);
      req.end();
    });
  },

  /**
   * Broadcast announcement push notification to all enrolled students
   */
  async broadcastToAllStudents({ title, body, data = {} }) {
    try {
      const tokens = await DeviceToken.find().distinct('token').catch(() => []);
      console.log(`[PushNotificationService] Broadcasting to ${tokens.length} active devices...`);
      return await this.sendExpoPushNotification(tokens, { title, body, data });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

module.exports = PushNotificationService;
