const WhatsAppLog = require('../models/WhatsAppLog');
const {
  sendWhatsAppMessage,
  retryFailedWhatsAppMessage,
  getWhatsAppTemplateMessage,
} = require('../services/whatsappService');

// @desc    Get all WhatsApp Logs (Admin)
// @route   GET /api/whatsapp/logs
// @access  Private/Admin
const getWhatsAppLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const template = req.query.template;
    const status = req.query.status;
    const search = req.query.search;

    const query = {};
    if (template && template !== 'All') query.template = template;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.recipient = { $regex: search.trim(), $options: 'i' };
    }

    const total = await WhatsAppLog.countDocuments(query);
    const logs = await WhatsAppLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      logs,
    });
  } catch (error) {
    console.error('Get WhatsApp Logs Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get WhatsApp Analytics & Dispatch Stats (Admin)
// @route   GET /api/whatsapp/stats
// @access  Private/Admin
const getWhatsAppStats = async (req, res) => {
  try {
    const totalDispatched = await WhatsAppLog.countDocuments();
    const sentCount = await WhatsAppLog.countDocuments({ status: { $in: ['sent', 'delivered', 'read', 'simulated'] } });
    const failedCount = await WhatsAppLog.countDocuments({ status: 'failed' });
    const retriedCount = await WhatsAppLog.countDocuments({ retryCount: { $gt: 0 } });

    const templateStats = await WhatsAppLog.aggregate([
      { $group: { _id: '$template', count: { $sum: 1 } } },
    ]);

    const recentLogs = await WhatsAppLog.find().sort({ createdAt: -1 }).limit(8);

    res.json({
      success: true,
      stats: {
        totalDispatched,
        sentCount,
        failedCount,
        retriedCount,
        deliveryRate: totalDispatched > 0 ? Math.round((sentCount / totalDispatched) * 100) : 100,
        byTemplate: templateStats,
        recentLogs,
      },
    });
  } catch (error) {
    console.error('Get WhatsApp Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Dispatch Test WhatsApp Message
// @route   POST /api/whatsapp/send-test
// @access  Public (or Protected Admin)
const sendTestMessage = async (req, res) => {
  try {
    const { to, template, data } = req.body;

    if (!to || !template) {
      return res.status(400).json({
        success: false,
        message: 'Recipient phone ("to") and template ("template") are required.',
      });
    }

    const defaultData = {
      name: 'Aditya Sharma',
      course: 'Full Stack MERN Mastery Bootcamp',
      courseTitle: 'Full Stack MERN Mastery Bootcamp',
      date: 'Tomorrow',
      time: '7:00 PM IST',
      mentor: 'Rajesh Kumar (Principal Technical Architect)',
      amount: 14999,
      paymentId: 'pay_test_rzp_' + Date.now().toString().slice(-6),
      orderId: 'order_test_' + Date.now().toString().slice(-6),
      certId: 'KRT-2026-MERN-8401',
      grade: 'Grade A+ (98%)',
      topic: 'Microservices & Redis Caching',
    };

    const result = await sendWhatsAppMessage({
      to,
      template,
      data: { ...defaultData, ...(data || {}) },
      metadata: { isTest: true },
    });

    res.json({
      success: result.success,
      message: result.success
        ? `WhatsApp message (${template}) dispatched successfully to ${to}`
        : `Failed to dispatch WhatsApp message: ${result.error}`,
      details: result,
    });
  } catch (error) {
    console.error('Send Test WhatsApp Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Retry a Failed WhatsApp Message
// @route   POST /api/whatsapp/retry/:id
// @access  Private/Admin
const retryMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const retryResult = await retryFailedWhatsAppMessage(id);

    res.json({
      success: retryResult.success,
      message: retryResult.success
        ? `WhatsApp message ${id} retried successfully!`
        : `Retry failed: ${retryResult.result?.error || 'Unknown error'}`,
      details: retryResult,
    });
  } catch (error) {
    console.error('Retry WhatsApp Message Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Preview WhatsApp Template Text
// @route   GET /api/whatsapp/preview/:template
// @access  Public
const previewTemplate = (req, res) => {
  const { template } = req.params;
  const mockData = {
    name: 'Aditya Sharma',
    course: 'Complete Java Backend Microservices Track',
    courseTitle: 'Complete Java Backend Microservices Track',
    date: 'Sep 22, 2026',
    time: '7:00 PM IST',
    mentor: 'Rajesh Kumar (Staff Architect)',
    amount: 14999,
    paymentId: 'pay_live_test_7781',
    orderId: 'order_test_9921',
    certId: 'KRT-2026-JAVA-9102',
    grade: 'Grade A+ (96%)',
    issueDate: 'Sep 17, 2026',
    topic: 'Kafka Event Streaming Architecture',
  };

  const preview = getWhatsAppTemplateMessage(template, mockData);
  res.json({
    success: true,
    template,
    templateName: preview.templateName,
    text: preview.text,
    parameters: preview.parameters,
  });
};

// @desc    Meta Cloud API Webhook Verification Handshake
// @route   GET /api/whatsapp/webhook
// @access  Public
const handleWebhookVerification = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'krtech_wa_verify_token_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('✅ Meta WhatsApp Webhook verified successfully');
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ success: false, message: 'Forbidden: Invalid verification token' });
};

// @desc    Meta Cloud API Webhook Event Receiver
// @route   POST /api/whatsapp/webhook
// @access  Public
const handleWebhookEvent = async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.statuses && value.statuses.length > 0) {
        const statusObj = value.statuses[0];
        const waMessageId = statusObj.id;
        const status = statusObj.status; // 'sent', 'delivered', 'read', 'failed'

        if (waMessageId && ['sent', 'delivered', 'read', 'failed'].includes(status)) {
          await WhatsAppLog.findOneAndUpdate(
            { waMessageId },
            {
              status,
              response: statusObj,
              ...(status === 'failed' ? { error: statusObj.errors?.[0]?.message || 'Delivery failed' } : {}),
            }
          );
        }
      }
    }

    res.status(200).send('EVENT_RECEIVED');
  } catch (err) {
    console.error('WhatsApp Webhook Event Error:', err);
    res.status(200).send('EVENT_RECEIVED'); // Meta expects 200 to prevent retries
  }
};

module.exports = {
  getWhatsAppLogs,
  getWhatsAppStats,
  sendTestMessage,
  retryMessage,
  previewTemplate,
  handleWebhookVerification,
  handleWebhookEvent,
};
