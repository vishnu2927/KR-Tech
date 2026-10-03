/**
 * Safe Local Test Suite for Resend HTTP Email Transport
 * Verifies payload construction, HTML handling, PDF Buffer base64 conversion,
 * provider response handling, non-2xx errors, fallback transport, and secret redaction.
 * DOES NOT SEND REAL EMAILS.
 */

const assert = require('assert');

// Save original environment
const originalEnv = { ...process.env };
const originalFetch = global.fetch;

// Mock EmailLog database methods to prevent MongoDB buffering timeout in test environment
const EmailLog = require('./models/EmailLog');
const originalCreate = EmailLog.create;
const originalFindByIdAndUpdate = EmailLog.findByIdAndUpdate;

EmailLog.create = async (doc) => ({
  _id: 'mock_log_id_' + Date.now(),
  ...doc,
});

EmailLog.findByIdAndUpdate = async (id, update) => ({
  _id: id,
  ...update,
});

let capturedLogs = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

function interceptLogs() {
  capturedLogs = [];
  console.error = (...args) => {
    capturedLogs.push(args.map(String).join(' '));
  };
  console.warn = (...args) => {
    capturedLogs.push(args.map(String).join(' '));
  };
  console.log = (...args) => {
    capturedLogs.push(args.map(String).join(' '));
  };
}

function restoreLogs() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
}

async function runTests() {
  console.log('🚀 Starting Resend HTTP Transport Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  const { sendViaResendHttp, sendEmailDirect, verifySmtp } = require('./services/emailService');

  // TEST A: Resend dispatcher payload construction
  try {
    process.env.RESEND_API_KEY = 're_test_dummy_key_abc123';
    process.env.RESEND_FROM = '"KR Global Learning" <admissions@krgloballearning.org>';
    process.env.RESEND_REPLY_TO = 'support@krgloballearning.org';

    let capturedUrl = null;
    let capturedOptions = null;

    global.fetch = async (url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: 'resend_msg_test_001' }),
      };
    };

    const result = await sendViaResendHttp({
      from: '"KR Global Learning" <admissions@krgloballearning.org>',
      to: 'student@example.com',
      subject: 'Welcome to KR Global Learning',
      html: '<h1>Welcome</h1>',
      replyTo: 'support@krgloballearning.org',
    });

    assert.strictEqual(capturedUrl, 'https://api.resend.com/emails');
    assert.strictEqual(capturedOptions.method, 'POST');
    assert.strictEqual(capturedOptions.headers['Authorization'], 'Bearer re_test_dummy_key_abc123');
    assert.strictEqual(capturedOptions.headers['Content-Type'], 'application/json');

    const body = JSON.parse(capturedOptions.body);
    assert.strictEqual(body.from, '"KR Global Learning" <admissions@krgloballearning.org>');
    assert.deepStrictEqual(body.to, ['student@example.com']);
    assert.strictEqual(body.subject, 'Welcome to KR Global Learning');
    assert.strictEqual(body.html, '<h1>Welcome</h1>');
    assert.strictEqual(body.reply_to, 'support@krgloballearning.org');
    assert.strictEqual(body.attachments, undefined); // Optional field omitted when empty
    assert.strictEqual(result.id, 'resend_msg_test_001');

    console.log('✅ TEST A PASSED: Resend dispatcher payload construction and optional fields verified.');
    passed++;
  } catch (err) {
    console.error('❌ TEST A FAILED:', err.message);
    failed++;
  }

  // TEST B: HTML email handling
  try {
    let capturedBody = null;
    global.fetch = async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: 'resend_html_002' }),
      };
    };

    const complexHtml = '<div style="background-color: #070913; color: #ffffff;"><p>Hello &amp; Welcome — KR Global Learning™</p></div>';
    await sendViaResendHttp({
      to: ['user1@test.com', 'user2@test.com'],
      subject: 'Special Offer & Course Update',
      html: complexHtml,
    });

    assert.strictEqual(capturedBody.html, complexHtml);
    assert.deepStrictEqual(capturedBody.to, ['user1@test.com', 'user2@test.com']);

    console.log('✅ TEST B PASSED: HTML email formatting, styling, and multi-recipient handling verified.');
    passed++;
  } catch (err) {
    console.error('❌ TEST B FAILED:', err.message);
    failed++;
  }

  // TEST C: PDF Buffer -> base64 conversion
  try {
    let capturedBody = null;
    global.fetch = async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: 'resend_pdf_003' }),
      };
    };

    const dummyPdfBuffer = Buffer.from('%PDF-1.4 Mock Certificate Content for Testing KR Global Learning');
    const expectedBase64 = dummyPdfBuffer.toString('base64');

    await sendViaResendHttp({
      to: 'student@example.com',
      subject: 'Your Certificate',
      html: '<p>Attached is your certificate</p>',
      attachments: [
        {
          filename: 'KR_Certificate_KRT-2026.pdf',
          content: dummyPdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    assert.ok(capturedBody.attachments && capturedBody.attachments.length === 1);
    assert.strictEqual(capturedBody.attachments[0].filename, 'KR_Certificate_KRT-2026.pdf');
    assert.strictEqual(capturedBody.attachments[0].content, expectedBase64);
    assert.strictEqual(capturedBody.attachments[0].content_type, 'application/pdf');

    console.log('✅ TEST C PASSED: PDF Buffer to base64 conversion and attachment schema verified.');
    passed++;
  } catch (err) {
    console.error('❌ TEST C FAILED:', err.message);
    failed++;
  }

  // TEST D: Successful provider response handling
  try {
    process.env.RESEND_API_KEY = 're_test_success_mode';
    global.fetch = async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ id: 're_live_success_999' }),
    });

    const result = await sendEmailDirect({
      to: 'aditya@example.com',
      template: 'welcome',
      data: { name: 'Aditya Sharma' },
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.messageId, 're_live_success_999');

    console.log('✅ TEST D PASSED: Successful provider response handling and messageId propagation verified.');
    passed++;
  } catch (err) {
    console.error('❌ TEST D FAILED:', err.message);
    failed++;
  }

  // TEST E: Non-2xx response handling & invalid JSON
  try {
    // Subtest E1: 422 Unprocessable Entity
    global.fetch = async () => ({
      ok: false,
      status: 422,
      text: async () => JSON.stringify({ message: 'Domain krgloballearning.org not verified in Resend' }),
    });

    let caughtError = null;
    try {
      await sendViaResendHttp({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });
    } catch (err) {
      caughtError = err;
    }
    assert.ok(caughtError);
    assert.ok(caughtError.message.includes('422'));
    assert.ok(caughtError.message.includes('Domain krgloballearning.org not verified in Resend'));

    // Subtest E2: 502 Bad Gateway / Non-JSON
    global.fetch = async () => ({
      ok: false,
      status: 502,
      text: async () => '<html><body>502 Bad Gateway</body></html>',
    });

    let caughtJsonError = null;
    try {
      await sendViaResendHttp({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });
    } catch (err) {
      caughtJsonError = err;
    }
    assert.ok(caughtJsonError);
    assert.ok(caughtJsonError.message.includes('invalid JSON'));
    assert.ok(caughtJsonError.message.includes('502'));

    // Subtest E3: sendEmailDirect graceful error capture
    interceptLogs();
    const directResult = await sendEmailDirect({
      to: 'fail@example.com',
      template: 'welcome',
      data: { name: 'Failing User' },
    });
    restoreLogs();

    assert.strictEqual(directResult.success, false);
    assert.ok(directResult.error);

    console.log('✅ TEST E PASSED: Non-2xx response, invalid JSON, and graceful error bubbling verified.');
    passed++;
  } catch (err) {
    restoreLogs();
    console.error('❌ TEST E FAILED:', err.message);
    failed++;
  }

  // TEST F: Missing RESEND_API_KEY falls back to existing transport
  try {
    delete process.env.RESEND_API_KEY;

    let fetchCalled = false;
    global.fetch = async () => {
      fetchCalled = true;
      throw new Error('fetch should NOT be called when RESEND_API_KEY is unset');
    };

    const fallbackResult = await sendEmailDirect({
      to: 'localdev@example.com',
      template: 'welcome',
      data: { name: 'Local Developer' },
    });

    assert.strictEqual(fetchCalled, false, 'Fetch must not be called when RESEND_API_KEY is missing');
    assert.strictEqual(fallbackResult.success, true);
    assert.ok(fallbackResult.messageId, 'Fallback transport must produce a messageId');

    console.log('✅ TEST F PASSED: Missing RESEND_API_KEY falls back seamlessly to Nodemailer/Ethereal transport.');
    passed++;
  } catch (err) {
    console.error('❌ TEST F FAILED:', err.message);
    failed++;
  }

  // TEST G: API key never appears in logs
  try {
    const sensitiveKey = 're_live_secret_key_super_classified_987654';
    process.env.RESEND_API_KEY = sensitiveKey;

    interceptLogs();

    global.fetch = async () => {
      throw new Error(`Connection failed with Bearer ${sensitiveKey} authorization token`);
    };

    const directResult = await sendEmailDirect({
      to: 'student@example.com',
      template: 'welcome',
      data: { name: 'Aditya' },
    });

    restoreLogs();

    assert.strictEqual(directResult.success, false);
    // Check returned error string
    assert.strictEqual(directResult.error.includes(sensitiveKey), false, 'API key must not appear in result.error');
    assert.ok(directResult.error.includes('[REDACTED]'), 'Secret should be redacted');

    // Check all captured logs
    const allLogs = capturedLogs.join(' ');
    assert.strictEqual(allLogs.includes(sensitiveKey), false, 'API key must NEVER be printed to logs or console');

    console.log('✅ TEST G PASSED: Strict secret redaction verified; API key never appears in logs or error objects.');
    passed++;
  } catch (err) {
    restoreLogs();
    console.error('❌ TEST G FAILED:', err.message);
    failed++;
  }

  // TEST H: verifySmtp diagnostic reports Resend when RESEND_API_KEY configured
  try {
    process.env.RESEND_API_KEY = 're_test_key_diagnostics';
    const statusWithResend = await verifySmtp();
    assert.strictEqual(statusWithResend.verified, true);
    assert.strictEqual(statusWithResend.host, 'api.resend.com');
    assert.strictEqual(statusWithResend.port, 443);

    delete process.env.RESEND_API_KEY;
    const statusFallback = await verifySmtp();
    assert.strictEqual(statusFallback.verified, true);
    assert.notStrictEqual(statusFallback.host, 'api.resend.com');

    console.log('✅ TEST H PASSED: verifySmtp correctly reports Resend HTTP provider when RESEND_API_KEY is present, and Nodemailer fallback otherwise.');
    passed++;
  } catch (err) {
    console.error('❌ TEST H FAILED:', err.message);
    failed++;
  }

  // Restore environment & global fetch
  for (const k of Object.keys(process.env)) {
    if (!(k in originalEnv)) {
      delete process.env[k];
    } else {
      process.env[k] = originalEnv[k];
    }
  }
  global.fetch = originalFetch;
  EmailLog.create = originalCreate;
  EmailLog.findByIdAndUpdate = originalFindByIdAndUpdate;

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  restoreLogs();
  console.error('Fatal test error:', err);
  process.exit(1);
});
