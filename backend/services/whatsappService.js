const https = require('https');
const WhatsAppLog = require('../models/WhatsAppLog');

const CLIENT_URL =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://krgloballearning.com'
    : 'http://localhost:5173');

/**
 * Format phone number to E.164 standard (+91 for Indian 10-digit numbers)
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.length === 10) return `+91${cleaned}`;
  if (cleaned.length === 12 && cleaned.startsWith('91')) return `+${cleaned}`;
  return `+${cleaned}`;
};

/**
 * Template Message Generators
 */
const getWhatsAppTemplateMessage = (template, data = {}) => {
  const name = data.name || data.studentName || 'Student';
  const course = data.course || data.courseTitle || 'One-on-One Live Mentorship Track';

  switch (template) {
    case 'demo_confirmation':
    case 'demo-confirmation':
    case 'demo': {
      const date = data.date || 'Tomorrow';
      const time = data.time || '7:00 PM IST';
      const mentor = data.mentor || 'Senior Technical Architect';
      const meetLink = data.meetLink || `${CLIENT_URL}/demo/room-live`;

      const text = `🎯 *KR Global Learning One-on-One Live Demo Confirmed!*

Hi ${name}, your personalized One-on-One live demo session for *${course}* has been scheduled successfully.

📅 *Date:* ${date}
⏰ *Time:* ${time}
👨‍🏫 *Assigned Mentor:* ${mentor}
🔗 *Live Room:* ${meetLink}

💡 _Please join via laptop with microphone enabled. Your mentor will conduct live code walk-throughs._
— *KR Global Learning Team*`;

      return {
        templateName: 'krtech_demo_confirmation',
        text,
        parameters: { name, course, date, time, mentor, meetLink },
      };
    }

    case 'payment_success':
    case 'payment-success':
    case 'payment': {
      const amount = data.amount ? Number(data.amount).toLocaleString('en-IN') : '14,999';
      const paymentId = data.paymentId || 'pay_' + Date.now().toString().slice(-8);
      const orderId = data.orderId || 'order_' + Date.now().toString().slice(-8);
      const dashboardUrl = `${CLIENT_URL}/dashboard`;

      const text = `💳 *Enrollment Confirmed — Payment Successful!*

Hi ${name}, welcome to *${course}* at KR Global Learning!

💰 *Amount Paid:* ₹${amount}
🧾 *Payment ID:* ${paymentId}
📦 *Order ID:* ${orderId}

🚀 Your LMS access & One-on-One private batch channel have been activated.
🔗 *Student Portal:* ${dashboardUrl}

— *KR Global Learning Admissions Team*`;

      return {
        templateName: 'krtech_payment_success',
        text,
        parameters: { name, course, amount, paymentId, orderId, dashboardUrl },
      };
    }

    case 'upcoming_batch_reminder':
    case 'upcoming-batch-reminder':
    case 'batch_reminder': {
      const date = data.date || 'This Saturday';
      const time = data.time || '10:00 AM IST';
      const mentor = data.mentor || 'Lead Systems Architect';
      const orientationUrl = `${CLIENT_URL}/orientation`;

      const text = `⏳ *Upcoming Batch Reminder — Starting Soon!*

Hi ${name}, your live batch for *${course}* commences shortly.

📅 *First Session:* ${date} at ${time}
👨‍🏫 *Lead Mentor:* ${mentor}
📁 *Orientation Guide:* ${orientationUrl}

💡 _Please review pre-reads in your portal and test your Docker/IDE setup prior to session 1._
— *KR Global Learning Operations*`;

      return {
        templateName: 'krtech_batch_reminder',
        text,
        parameters: { name, course, date, time, mentor, orientationUrl },
      };
    }

    case 'live_class_reminder':
    case 'live-class-reminder':
    case 'class_reminder': {
      const time = data.time || 'in 15 Minutes';
      const topic = data.topic || `${course} — Live Pair Programming`;
      const roomUrl = data.roomUrl || `${CLIENT_URL}/student/live-session`;

      const text = `🔴 *Live Class Alert: Starting ${time}!*

Hi ${name}, your One-on-One live pair-programming session for *${topic}* is about to begin.

💻 *Direct Class Link:* ${roomUrl}

Please ensure your GitHub repository and IDE are open for interactive live code reviews!
— *KR Global Learning Live Desk*`;

      return {
        templateName: 'krtech_live_class_alert',
        text,
        parameters: { name, topic, time, roomUrl },
      };
    }

    case 'certificate_ready':
    case 'certificate-ready':
    case 'certificate': {
      const certId = data.certId || data.credentialId || `KRT-${Date.now().toString().slice(-6)}`;
      const grade = data.grade || 'Grade A+ (Distinction)';
      const issueDate = data.issueDate || new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      const verifyUrl = `${CLIENT_URL}/certificates?id=${encodeURIComponent(certId)}`;

      const text = `🏆 *Congratulations! Your Official Certificate is Ready!*

Hi ${name}, your verified certificate of completion for *${course}* is now officially registered on the KR Global Learning registry.

🆔 *Credential ID:* ${certId}
⭐ *Performance:* ${grade}
📅 *Issue Date:* ${issueDate}

Verify, showcase, and download your cryptographically verified credential:
🔗 ${verifyUrl}

— *KR Global Learning Credential Registry*`;

      return {
        templateName: 'krtech_certificate_ready',
        text,
        parameters: { name, course, certId, grade, issueDate, verifyUrl },
      };
    }

    default: {
      const text = data.text || `Notification from KR Global Learning for ${name}.`;
      return {
        templateName: 'krtech_general_notification',
        text,
        parameters: data,
      };
    }
  }
};

/**
 * Dispatch WhatsApp Message via Meta Cloud API or Realistic Fallback Simulator
 */
const sendWhatsAppMessage = async ({ to, template, data = {}, metadata = {} }) => {
  const recipient = formatPhoneNumber(to);
  const normalizedTemplate = (template || 'general').replace(/-/g, '_').toLowerCase();
  const templatePayload = getWhatsAppTemplateMessage(normalizedTemplate, data);

  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v21.0';
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '109283746592018';
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';

  // Check if live Meta API credentials exist and are non-placeholder
  const hasLiveCredentials =
    accessToken &&
    !accessToken.includes('...') &&
    !accessToken.includes('placeholder') &&
    phoneNumberId &&
    phoneNumberId.length > 5;

  const standardPayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient.replace('+', ''),
    type: 'text',
    text: {
      preview_url: true,
      body: templatePayload.text,
    },
  };

  if (!hasLiveCredentials) {
    // Production Simulation Mode: Generates Meta Cloud API wamid compliant IDs
    const mockWaMessageId = `wamid.HBg${Date.now()}KRTECH${Math.random().toString(36).substring(2, 9).toUpperCase()}==`;

    let logDoc = null;
    try {
      logDoc = await WhatsAppLog.create({
        recipient,
        template: normalizedTemplate.includes('demo') ? 'demo_confirmation'
          : normalizedTemplate.includes('payment') ? 'payment_success'
          : normalizedTemplate.includes('batch') ? 'upcoming_batch_reminder'
          : normalizedTemplate.includes('class') ? 'live_class_reminder'
          : normalizedTemplate.includes('certificate') ? 'certificate_ready'
          : 'general',
        status: 'simulated',
        waMessageId: mockWaMessageId,
        messagePreview: templatePayload.text,
        parameters: templatePayload.parameters,
        payload: standardPayload,
        response: {
          messaging_product: 'whatsapp',
          contacts: [{ input: recipient, wa_id: recipient.replace('+', '') }],
          messages: [{ id: mockWaMessageId, message_status: 'accepted' }],
        },
        metadata,
      });
    } catch (dbErr) {
      console.warn('Notice writing WhatsAppLog to MongoDB:', dbErr.message);
    }

    return {
      success: true,
      mode: 'simulated',
      waMessageId: mockWaMessageId,
      recipient,
      template: normalizedTemplate,
      messagePreview: templatePayload.text,
      logId: logDoc ? logDoc._id : null,
    };
  }

  // Live Meta WhatsApp Business Cloud API Dispatch
  return new Promise((resolve) => {
    const postData = JSON.stringify(standardPayload);
    const options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: `/${apiVersion}/${phoneNumberId}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', async () => {
        let parsed = {};
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = { raw: body };
        }

        const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
        const waMessageId = parsed.messages && parsed.messages[0] ? parsed.messages[0].id : null;

        let logDoc = null;
        try {
          logDoc = await WhatsAppLog.create({
            recipient,
            template: normalizedTemplate,
            status: isSuccess ? 'sent' : 'failed',
            waMessageId: waMessageId || `failed_${Date.now()}`,
            messagePreview: templatePayload.text,
            parameters: templatePayload.parameters,
            payload: standardPayload,
            response: parsed,
            error: isSuccess ? undefined : parsed.error?.message || `HTTP ${res.statusCode}`,
            metadata,
          });
        } catch (dbErr) {
          console.warn('Notice writing WhatsAppLog to MongoDB:', dbErr.message);
        }

        resolve({
          success: isSuccess,
          mode: 'live_meta_cloud_api',
          waMessageId,
          recipient,
          statusCode: res.statusCode,
          response: parsed,
          logId: logDoc ? logDoc._id : null,
        });
      });
    });

    req.on('error', async (err) => {
      console.error('WhatsApp Meta Cloud API dispatch error:', err.message);
      let logDoc = null;
      try {
        logDoc = await WhatsAppLog.create({
          recipient,
          template: normalizedTemplate,
          status: 'failed',
          messagePreview: templatePayload.text,
          parameters: templatePayload.parameters,
          payload: standardPayload,
          error: err.message,
          metadata,
        });
      } catch (dbErr) {
        // ignore
      }

      resolve({
        success: false,
        error: err.message,
        logId: logDoc ? logDoc._id : null,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Request timeout to Meta Cloud API' });
    });

    req.write(postData);
    req.end();
  });
};

/**
 * Retry a Failed WhatsApp Message
 */
const retryFailedWhatsAppMessage = async (logId) => {
  const log = await WhatsAppLog.findById(logId);
  if (!log) {
    throw new Error(`WhatsApp log record not found for id ${logId}`);
  }

  // Update status to retrying
  log.status = 'retrying';
  log.retryCount = (log.retryCount || 0) + 1;
  log.lastRetryAt = new Date();
  await log.save();

  // Attempt re-dispatch
  const result = await sendWhatsAppMessage({
    to: log.recipient,
    template: log.template,
    data: log.parameters,
    metadata: { ...log.metadata, retriedFrom: log._id },
  });

  if (result.success) {
    log.status = result.mode === 'simulated' ? 'simulated' : 'sent';
    log.waMessageId = result.waMessageId;
    log.error = undefined;
    log.response = result.response || { retrySuccess: true };
    await log.save();
  } else {
    log.status = 'failed';
    log.error = result.error;
    await log.save();
  }

  return {
    success: result.success,
    log,
    result,
  };
};

/**
 * Convenience Dispatchers
 */
const sendDemoConfirmationWA = async (lead) => {
  if (!lead.phone) return null;
  return sendWhatsAppMessage({
    to: lead.phone,
    template: 'demo_confirmation',
    data: {
      name: lead.name,
      course: lead.course,
      date: lead.demoDate || 'Tomorrow',
      time: lead.demoTime || '7:00 PM IST',
      mentor: 'Senior Industry Mentor',
    },
    metadata: { leadId: lead._id || lead.id },
  });
};

const sendPaymentSuccessWA = async ({ phone, name, courseTitle, amount, paymentId, orderId }) => {
  if (!phone) return null;
  return sendWhatsAppMessage({
    to: phone,
    template: 'payment_success',
    data: {
      name,
      courseTitle,
      amount,
      paymentId,
      orderId,
    },
    metadata: { paymentId, orderId },
  });
};

const sendUpcomingBatchReminderWA = async ({ phone, name, courseTitle, date, time, mentor }) => {
  if (!phone) return null;
  return sendWhatsAppMessage({
    to: phone,
    template: 'upcoming_batch_reminder',
    data: {
      name,
      courseTitle,
      date,
      time,
      mentor,
    },
  });
};

const sendLiveClassReminderWA = async ({ phone, name, topic, time, roomUrl }) => {
  if (!phone) return null;
  return sendWhatsAppMessage({
    to: phone,
    template: 'live_class_reminder',
    data: {
      name,
      topic,
      time,
      roomUrl,
    },
  });
};

const sendCertificateReadyWA = async ({ phone, name, courseTitle, certId, grade, issueDate }) => {
  if (!phone) return null;
  return sendWhatsAppMessage({
    to: phone,
    template: 'certificate_ready',
    data: {
      name,
      courseTitle,
      certId,
      grade,
      issueDate,
    },
    metadata: { certId },
  });
};

module.exports = {
  formatPhoneNumber,
  getWhatsAppTemplateMessage,
  sendWhatsAppMessage,
  retryFailedWhatsAppMessage,
  sendDemoConfirmationWA,
  sendPaymentSuccessWA,
  sendUpcomingBatchReminderWA,
  sendLiveClassReminderWA,
  sendCertificateReadyWA,
};
