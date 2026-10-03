/**
 * KR Tech Enterprise HTML Responsive Email Templates
 * Premium Dark & Modern aesthetic with gradient accents, company branding, and CTA buttons.
 */

const CLIENT_URL =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://www.krgloballearning.org'
    : 'http://localhost:5173');

const renderBaseLayout = ({ title, preheader, content, ctaText, ctaUrl }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #070913;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #070913;
      padding-bottom: 40px;
    }
    .main-card {
      background-color: #0F172A;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #1E293B;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%);
      padding: 36px 30px;
      text-align: center;
      border-bottom: 1px solid #334155;
    }
    .logo-badge {
      display: inline-block;
      padding: 8px 18px;
      background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%);
      border-radius: 12px;
      font-weight: 800;
      font-size: 20px;
      color: #FFFFFF;
      letter-spacing: 1px;
      text-decoration: none;
    }
    .content-body {
      padding: 36px 30px;
      line-height: 1.65;
      font-size: 15px;
      color: #CBD5E1;
    }
    h1, h2, h3 {
      color: #FFFFFF;
      margin-top: 0;
      font-weight: 700;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
      margin-top: 24px;
    }
    .meta-box {
      background-color: #1E293B;
      border-radius: 14px;
      padding: 20px;
      margin: 24px 0;
      border: 1px solid #334155;
    }
    .meta-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #334155;
      font-size: 14px;
    }
    .meta-item:last-child {
      border-bottom: none;
    }
    .footer {
      text-align: center;
      padding: 30px;
      font-size: 12px;
      color: #64748B;
      line-height: 1.7;
    }
    .footer a {
      color: #38BDF8;
      text-decoration: none;
      margin: 0 8px;
    }
    .social-bar {
      margin-bottom: 16px;
    }
    .social-link {
      display: inline-block;
      margin: 0 6px;
      color: #94A3B8 !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader || title}
  </div>

  <table class="wrapper" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding-top: 30px;">
        <table class="main-card" width="100%" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td class="header">
              <a href="${CLIENT_URL}" class="logo-badge" style="font-size: 15px; font-weight: 800; letter-spacing: 0.5px;">KR GLOBAL LEARNING PRIVATE LIMITED</a>
              <div style="font-size: 11px; color: #94A3B8; margin-top: 8px; letter-spacing: 0.5px; text-transform: uppercase;">
                One-to-One Live Tech Mentorship & Vendor Certification Platform
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-body">
              ${content}

              ${
                ctaText && ctaUrl
                  ? `
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${ctaUrl}" class="btn" target="_blank">${ctaText} →</a>
                </div>
              `
                  : ''
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" style="padding: 28px 24px; text-align: center; font-size: 13px; color: #CBD5E1; border-top: 1px solid #334155; background-color: #0B1120;">
              <div style="font-weight: 800; color: #FFFFFF; font-size: 15px; margin-bottom: 6px; letter-spacing: 0.5px;">
                KR GLOBAL LEARNING PRIVATE LIMITED
              </div>
              <div style="font-size: 12px; color: #94A3B8; margin-bottom: 14px;">
                Learn. Build. Grow. Globally.
              </div>
              
              <div style="margin-bottom: 14px; line-height: 1.8; font-size: 12px;">
                <strong style="color: #38BDF8;">Customer Support (24×7 Available):</strong> <a href="tel:+919311073936" style="color: #38BDF8; text-decoration: none;">+91 9311073936</a><br>
                <strong style="color: #F59E0B;">Business Email:</strong> <a href="mailto:krglobal0713@gmail.com" style="color: #F59E0B; text-decoration: none;">krglobal0713@gmail.com</a>
              </div>

              <div style="margin-bottom: 14px; font-size: 11px; color: #94A3B8; line-height: 1.6; max-width: 440px; margin-left: auto; margin-right: auto;">
                <strong style="color: #CBD5E1;">Corporate Office:</strong><br>
                Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318
              </div>

              <p style="margin: 0; font-size: 11px; color: #64748B; border-top: 1px solid #1E293B; padding-top: 12px;">
                © 2026 KR GLOBAL LEARNING PRIVATE LIMITED
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * 1. Welcome Email
 */
const getWelcomeTemplate = (data) => {
  const name = data.name || 'Student';
  const email = data.email || '';
  const loginUrl = `${CLIENT_URL}/login`;

  const content = `
    <h2 style="font-size: 22px; color: #FFFFFF; margin-bottom: 12px;">Welcome to KR Global Learning, ${name}! 🚀</h2>
    <p>We are thrilled to welcome you to India's premier One-on-One Live EdTech pair-programming academy.</p>
    <p>Your student account has been successfully provisioned on MongoDB Atlas. You now have unrestricted access to:</p>
    
    <div style="background-color: #1E293B; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid #334155;">
      <ul style="margin: 0; padding-left: 20px; color: #E2E8F0;">
        <li style="margin-bottom: 8px;"><strong>One-on-One Live Senior Mentorship:</strong> Learn directly from Tier-1 MNC architects.</li>
        <li style="margin-bottom: 8px;"><strong>Curated Course Catalog:</strong> 55+ production-grade tracks in Java, Cloud, MERN, AI & DevOps.</li>
        <li style="margin-bottom: 8px;"><strong>Free Resources & Cheatsheets:</strong> Hand-crafted architectural guides and PDFs.</li>
        <li><strong>Global Certification Hub:</strong> Official verifiable credentials with unique ID.</li>
      </ul>
    </div>

    <p style="margin-top: 16px;">Ready to elevate your engineering career? Sign in to your personalized student dashboard below:</p>
  `;

  return {
    subject: `Welcome to KR Global Learning, ${name}! Your Account is Live 🚀`,
    html: renderBaseLayout({
      title: 'Welcome to KR Global Learning',
      preheader: 'Your One-on-One Live Learning Journey Begins Here',
      content,
      ctaText: 'Access Student Dashboard',
      ctaUrl: loginUrl,
    }),
  };
};

/**
 * 2. Demo Booking Confirmation Email
 */
const getDemoBookingTemplate = (data) => {
  const name = data.name || 'Student';
  const course = data.course || 'One-on-One Live Engineering Mentorship';
  const date = data.date || 'Within 24 Hours';
  const time = data.time || 'Preferred Slot';
  const mentor = data.mentor || 'Senior Industry Mentor';
  const demoUrl = `${CLIENT_URL}/student/dashboard`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background: rgba(16, 185, 129, 0.2); color: #34D399; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">
        Slot Confirmed
      </span>
    </div>

    <h2 style="font-size: 22px; color: #FFFFFF; margin-bottom: 12px;">Your One-on-One Live Demo Session is Confirmed! 🎯</h2>
    <p>Hi ${name}, thank you for scheduling your personalized One-on-One live demo session. Here are your booking details:</p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #1E293B; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Selected Course</td>
        <td style="padding: 12px 16px; color: #F8FAFC; font-weight: 600; font-size: 13px;">${course}</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Assigned Mentor</td>
        <td style="padding: 12px 16px; color: #38BDF8; font-weight: 600; font-size: 13px;">${mentor}</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Scheduled Slot</td>
        <td style="padding: 12px 16px; color: #F8FAFC; font-weight: 600; font-size: 13px;">${date} at ${time}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Session Format</td>
        <td style="padding: 12px 16px; color: #34D399; font-weight: 600; font-size: 13px;">One-on-One Interactive Screen Sharing & Live Code Demo</td>
      </tr>
    </table>

    <p style="font-size: 14px; color: #94A3B8;">
      💡 <em>Tip: Please join 5 minutes early with your camera & mic tested. Your mentor will review live course capstones with you.</em>
    </p>
  `;

  return {
    subject: `Demo Confirmed: ${course} with Senior Mentor 🎯`,
    html: renderBaseLayout({
      title: 'Demo Session Confirmed',
      preheader: `Your slot for ${course} is scheduled`,
      content,
      ctaText: 'View My Booking Details',
      ctaUrl: demoUrl,
    }),
  };
};

/**
 * 3. Payment Success Email
 */
const getPaymentSuccessTemplate = (data) => {
  const name = data.name || 'KR Tech Student';
  const courseTitle = data.courseTitle || 'One-on-One Live Mentorship Track';
  const amount = data.amount || '14,999';
  const paymentId = data.paymentId || 'pay_sim_' + Date.now().toString().slice(-8);
  const orderId = data.orderId || 'order_sim_' + Date.now().toString().slice(-8);
  const date = data.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const courseUrl = `${CLIENT_URL}/dashboard`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background: rgba(16, 185, 129, 0.2); color: #34D399; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">
        ✓ Payment Verified & Captured
      </span>
    </div>

    <h2 style="font-size: 22px; color: #FFFFFF; margin-bottom: 12px;">Payment Successful! Welcome to ${courseTitle} 💳</h2>
    <p>Hi ${name}, your payment has been successfully confirmed through Razorpay. Your seat is officially reserved in MongoDB Atlas.</p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #1E293B; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Course Enrolled</td>
        <td style="padding: 12px 16px; color: #F8FAFC; font-weight: 600; font-size: 13px;">${courseTitle}</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Amount Paid</td>
        <td style="padding: 12px 16px; color: #34D399; font-weight: 700; font-size: 16px;">₹${typeof amount === 'number' ? amount.toLocaleString('en-IN') : amount}</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Razorpay Payment ID</td>
        <td style="padding: 12px 16px; color: #38BDF8; font-family: monospace; font-size: 12px;">${paymentId}</td>
      </tr>
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Order Reference</td>
        <td style="padding: 12px 16px; color: #CBD5E1; font-family: monospace; font-size: 12px;">${orderId}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #94A3B8; font-size: 13px;">Date & Gateway</td>
        <td style="padding: 12px 16px; color: #F8FAFC; font-size: 13px;">${date} via Razorpay Secure</td>
      </tr>
    </table>

    <p style="font-size: 14px; color: #CBD5E1;">
      Your LMS credentials and Slack private batch channel invite have been attached to your student dashboard.
    </p>
  `;

  return {
    subject: `Payment Receipt: ${courseTitle} (ID: ${paymentId}) 💳`,
    html: renderBaseLayout({
      title: 'Payment Confirmation',
      preheader: `Payment of ₹${amount} received for ${courseTitle}`,
      content,
      ctaText: 'Access Course in Dashboard',
      ctaUrl: courseUrl,
    }),
  };
};

/**
 * 4. Certificate Delivery Email
 */
const getCertificateDeliveryTemplate = (data) => {
  const name = data.name || 'Graduate';
  const courseTitle = data.courseTitle || 'Advanced Software Engineering';
  const certId = data.certId || `CERT-KR-${Date.now().toString().slice(-6)}`;
  const grade = data.grade || 'Distinction';
  const issueDate = data.issueDate || new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  const certUrl = `${CLIENT_URL}/certificates?id=${encodeURIComponent(certId)}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background: rgba(234, 179, 8, 0.2); color: #FACC15; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 9999px; border: 1px solid rgba(234, 179, 8, 0.3); text-transform: uppercase;">
        🏆 Official Certification
      </span>
    </div>

    <h2 style="font-size: 22px; color: #FFFFFF; margin-bottom: 12px;">Congratulations on Graduating, ${name}! 🎓</h2>
    <p>We are delighted to confer upon you the official <strong>KR GLOBAL LEARNING Certificate of Completion</strong> for demonstrating excellence in <strong>${courseTitle}</strong>.</p>

    <div style="background: linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%); border: 1px solid #6366F1; border-radius: 14px; padding: 24px; text-align: center; margin: 24px 0;">
      <div style="font-size: 11px; color: #A5B4FC; text-transform: uppercase; letter-spacing: 1px;">Credential Verification Identifier</div>
      <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; font-family: monospace; margin: 8px 0;">${certId}</div>
      <div style="font-size: 13px; color: #34D399; font-weight: 600;">Grade: ${grade} · Issued: ${issueDate}</div>
    </div>

    <p style="font-size: 14px; color: #CBD5E1;">
      This certificate is cryptographically signed and publicly verifiable by employers worldwide via our QR / Verification Portal.
    </p>
  `;

  return {
    subject: `Official Certificate of Accomplishment: ${courseTitle} (${certId}) 🏆`,
    html: renderBaseLayout({
      title: 'Certificate Awarded',
      preheader: `Congratulations! Your certificate for ${courseTitle} is ready`,
      content,
      ctaText: 'Verify & Download Certificate',
      ctaUrl: certUrl,
    }),
  };
};

/**
 * 5. Forgot Password OTP Email
 */
const getOtpResetTemplate = (data) => {
  const name = data.name || 'Student';
  const otp = data.otp || Math.floor(100000 + Math.random() * 900000);
  const expiryMinutes = data.expiryMinutes || 10;
  const emailParam = data.email ? encodeURIComponent(data.email) : '';
  const resetUrl = `${CLIENT_URL}/reset-password?email=${emailParam}&otp=${otp}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background: rgba(239, 68, 68, 0.2); color: #F87171; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 9999px; border: 1px solid rgba(239, 68, 68, 0.3); text-transform: uppercase;">
        🔒 Security Verification
      </span>
    </div>

    <h2 style="font-size: 22px; color: #FFFFFF; margin-bottom: 12px;">Password Reset Verification Code</h2>
    <p>Hi ${name}, we received a request to reset your password for your KR Global Learning student account.</p>
    <p>Use the 6-digit One-Time Password (OTP) below to authenticate your identity:</p>

    <div style="background-color: #1E293B; border-radius: 14px; padding: 22px; text-align: center; margin: 24px 0; border: 1px dashed #6366F1;">
      <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #38BDF8; font-family: monospace;">
        ${otp}
      </div>
      <div style="font-size: 12px; color: #94A3B8; margin-top: 8px;">
        Valid for the next ${expiryMinutes} minutes only
      </div>
    </div>

    <p style="font-size: 13px; color: #94A3B8;">
      ⚠️ If you did not request a password reset, please ignore this email or notify security at <a href="mailto:krglobal0713@gmail.com" style="color: #38BDF8;">krglobal0713@gmail.com</a>.
    </p>
  `;

  return {
    subject: `KR Global Learning Password Reset Code: ${otp} 🔒`,
    html: renderBaseLayout({
      title: 'Password Reset OTP',
      preheader: `Your verification code is ${otp}`,
      content,
      ctaText: 'Reset Password Now',
      ctaUrl: resetUrl,
    }),
  };
};

/**
 * 6. Live Session 24-Hour Reminder Email
 */
const getSessionReminder24hTemplate = (data) => {
  const name = data.name || 'Engineer';
  const sessionTitle = data.sessionTitle || data.title || 'Live Interactive Masterclass';
  const mentorName = data.mentorName || 'Principal Tech Mentor';
  const scheduledTimeStr = data.scheduledTimeStr || (data.scheduledAt ? new Date(data.scheduledAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' }) : 'Tomorrow');
  const platform = (data.platform || 'Zoom').toUpperCase();
  const meetingLink = data.meetingLink || `${CLIENT_URL}/live/session/${data.sessionId || ''}`;
  const meetingId = data.meetingId || 'Provided on session page';
  const meetingPassword = data.meetingPassword || 'N/A';
  const sessionUrl = `${CLIENT_URL}/live/session/${data.sessionId || ''}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background: rgba(124, 58, 237, 0.2); color: #C084FC; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 9999px; border: 1px solid rgba(124, 58, 237, 0.3); text-transform: uppercase;">
        ⏰ 24-Hour Session Reminder
      </span>
    </div>

    <h2 style="font-size: 22px; color: #FFFFFF; margin-bottom: 12px;">Your Live Class Starts Tomorrow!</h2>
    <p>Hi ${name}, this is an automated reminder that your scheduled live mentoring class is taking place in 24 hours.</p>

    <div style="background-color: #1E293B; border-radius: 14px; padding: 22px; margin: 24px 0; border: 1px solid #334155;">
      <h3 style="color: #38BDF8; font-size: 18px; margin-top: 0; margin-bottom: 12px;">${sessionTitle}</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #94A3B8; width: 130px;">📅 Date & Time:</td>
          <td style="padding: 6px 0; color: #F1F5F9; font-weight: 600;">${scheduledTimeStr}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94A3B8;">👨‍🏫 Mentor:</td>
          <td style="padding: 6px 0; color: #F1F5F9; font-weight: 600;">${mentorName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94A3B8;">🎥 Platform:</td>
          <td style="padding: 6px 0; color: #A78BFA; font-weight: 600;">${platform}</td>
        </tr>
        ${meetingId ? `
        <tr>
          <td style="padding: 6px 0; color: #94A3B8;">🔑 Meeting ID:</td>
          <td style="padding: 6px 0; color: #38BDF8; font-family: monospace;">${meetingId}</td>
        </tr>` : ''}
        ${meetingPassword && meetingPassword !== 'N/A' ? `
        <tr>
          <td style="padding: 6px 0; color: #94A3B8;">🔒 Passcode:</td>
          <td style="padding: 6px 0; color: #38BDF8; font-family: monospace;">${meetingPassword}</td>
        </tr>` : ''}
      </table>
    </div>

    <p style="font-size: 14px; color: #94A3B8;">
      💡 <strong>Preparation Tip:</strong> Join 5 minutes early to test your audio & video. You can download the session to your personal calendar (.ics) via the session link below.
    </p>
  `;

  return {
    subject: `Reminder: "${sessionTitle}" starts in 24 hours ⏰`,
    html: renderBaseLayout({
      title: 'Live Session Tomorrow',
      preheader: `Your live session with ${mentorName} begins tomorrow`,
      content,
      ctaText: 'Open Live Session Page',
      ctaUrl: sessionUrl,
    }),
  };
};

/**
 * 7. Live Session 30-Minute Final Call Email
 */
const getSessionReminder30mTemplate = (data) => {
  const name = data.name || 'Engineer';
  const sessionTitle = data.sessionTitle || data.title || 'Live Interactive Masterclass';
  const mentorName = data.mentorName || 'Principal Tech Mentor';
  const scheduledTimeStr = data.scheduledTimeStr || 'In 30 Minutes';
  const platform = (data.platform || 'Zoom').toUpperCase();
  const meetingLink = data.meetingLink || `${CLIENT_URL}/live/session/${data.sessionId || ''}`;
  const meetingId = data.meetingId || '';
  const meetingPassword = data.meetingPassword || '';
  const sessionUrl = `${CLIENT_URL}/live/session/${data.sessionId || ''}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background: rgba(239, 68, 68, 0.25); color: #FCA5A5; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 9999px; border: 1px solid rgba(239, 68, 68, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
        🚨 Starting in 30 Minutes — Final Call
      </span>
    </div>

    <h2 style="font-size: 22px; color: #FFFFFF; margin-bottom: 12px; text-align: center;">Get Ready! Session Starts Shortly</h2>
    <p>Hi ${name}, your live interactive class <strong>${sessionTitle}</strong> begins in just <strong>30 minutes</strong>.</p>

    <div style="background-color: #1E293B; border-radius: 14px; padding: 22px; margin: 24px 0; border: 1px solid #EF4444;">
      <h3 style="color: #F87171; font-size: 18px; margin-top: 0; margin-bottom: 12px;">${sessionTitle}</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #94A3B8; width: 130px;">⏰ Time:</td>
          <td style="padding: 6px 0; color: #F1F5F9; font-weight: 600;">${scheduledTimeStr}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94A3B8;">👨‍🏫 Mentor:</td>
          <td style="padding: 6px 0; color: #F1F5F9; font-weight: 600;">${mentorName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94A3B8;">🎥 Platform:</td>
          <td style="padding: 6px 0; color: #A78BFA; font-weight: 600;">${platform}</td>
        </tr>
        ${meetingId ? `
        <tr>
          <td style="padding: 6px 0; color: #94A3B8;">🔑 Meeting ID:</td>
          <td style="padding: 6px 0; color: #38BDF8; font-family: monospace;">${meetingId}</td>
        </tr>` : ''}
        ${meetingPassword ? `
        <tr>
          <td style="padding: 6px 0; color: #94A3B8;">🔒 Passcode:</td>
          <td style="padding: 6px 0; color: #38BDF8; font-family: monospace;">${meetingPassword}</td>
        </tr>` : ''}
      </table>
    </div>

    <div style="text-align: center; margin: 26px 0;">
      <a href="${sessionUrl}" class="btn" style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); display: inline-block; padding: 14px 32px; border-radius: 12px; color: #FFFFFF; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);">
        Join Live Room Now 🚀
      </a>
    </div>

    <p style="font-size: 13px; color: #94A3B8; text-align: center;">
      Attendance will be automatically logged when you join the session room.
    </p>
  `;

  return {
    subject: `🚨 STARTING IN 30 MINS: "${sessionTitle}" with ${mentorName}`,
    html: renderBaseLayout({
      title: 'Live Session Starting Soon',
      preheader: `Final call! Live session begins in 30 minutes`,
      content,
      ctaText: 'Enter Classroom',
      ctaUrl: sessionUrl,
    }),
  };
};

/**
 * Sprint 12.12: Course Enrollment Confirmation Template
 */
const getCourseEnrollmentTemplate = ({ studentName = 'Student', courseTitle = 'Advanced Technology Track', mentorName = 'Senior Technology Mentor', dashboardUrl = `${CLIENT_URL}/dashboard` }) => {
  const content = `
    <h2>Welcome to Your Course Enrollment! 🎓</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Congratulations on enrolling in <strong>${courseTitle}</strong> at <strong>KR GLOBAL LEARNING PRIVATE LIMITED</strong>. Your dedicated technology mentor has been assigned and your learning curriculum is ready in your portal.</p>
    
    <div class="meta-box">
      <div class="meta-item"><span>📚 Course Track:</span><strong>${courseTitle}</strong></div>
      <div class="meta-item"><span>👨‍🏫 Lead Mentor:</span><strong>${mentorName}</strong></div>
      <div class="meta-item"><span>🎯 Delivery:</span><strong>One-on-One Live Sessions & Capstones</strong></div>
      <div class="meta-item"><span>🏆 Target:</span><strong>Industry Vendor Certification</strong></div>
    </div>

    <p>Access your student dashboard now to review your weekly learning roadmap, schedule upcoming classes, and explore hands-on project labs.</p>
  `;

  return {
    subject: `🎉 Enrollment Confirmed: "${courseTitle}" — KR Global Learning`,
    html: renderBaseLayout({
      title: 'Course Enrollment Confirmed',
      preheader: `You are now enrolled in ${courseTitle}`,
      content,
      ctaText: 'Go to Student Dashboard',
      ctaUrl: dashboardUrl,
    }),
  };
};

/**
 * Sprint 12.12: Study Reminder Template
 */
const getStudyReminderTemplate = ({ studentName = 'Student', topic = 'Upcoming Module', streakDays = 3, plannerUrl = `${CLIENT_URL}/study-planner` }) => {
  const content = `
    <h2>Keep Your Learning Momentum Going! ⚡</h2>
    <p>Hello <strong>${studentName}</strong>,</p>
    <p>You currently have an active <strong>${streakDays}-day study streak</strong>. Consistency is the key to mastering complex system design, cloud infrastructure, and modern programming patterns.</p>
    
    <div class="meta-box">
      <div class="meta-item"><span>🔥 Current Streak:</span><strong>${streakDays} Days Active</strong></div>
      <div class="meta-item"><span>📖 Recommended Focus:</span><strong>${topic}</strong></div>
      <div class="meta-item"><span>🤖 AI Study Assistant:</span><strong>Active 24×7 in Portal</strong></div>
    </div>

    <p>Jump back into your study planner or generate quick AI flashcards to keep your streak alive today.</p>
  `;

  return {
    subject: `🔥 Study Reminder: Keep your ${streakDays}-day streak active!`,
    html: renderBaseLayout({
      title: 'Daily Study Reminder',
      preheader: `Don't break your ${streakDays}-day learning streak!`,
      content,
      ctaText: 'Open Study Planner',
      ctaUrl: plannerUrl,
    }),
  };
};

/**
 * Sprint 12.12: Weekly Learning Progress Template
 */
const getWeeklyProgressTemplate = ({ studentName = 'Student', hoursSpent = 8, completedLessons = 4, progressPercent = 75, analyticsUrl = `${CLIENT_URL}/analytics` }) => {
  const content = `
    <h2>Your Weekly Learning Summary 📊</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Here is your weekly progress report at <strong>KR GLOBAL LEARNING PRIVATE LIMITED</strong>. Great work advancing through your hands-on curriculum this week.</p>
    
    <div class="meta-box">
      <div class="meta-item"><span>⏱️ Learning Time:</span><strong>${hoursSpent} Hours</strong></div>
      <div class="meta-item"><span>✅ Completed Lessons:</span><strong>${completedLessons} Modules</strong></div>
      <div class="meta-item"><span>📈 Course Progression:</span><strong>${progressPercent}% Complete</strong></div>
    </div>

    <p>Review your detailed performance metrics and upcoming live sessions on your personal analytics dashboard.</p>
  `;

  return {
    subject: `📊 Your Weekly Progress Report (${progressPercent}% Completed) — KR Global Learning`,
    html: renderBaseLayout({
      title: 'Weekly Learning Progress',
      preheader: `You logged ${hoursSpent} hours of practical coding this week`,
      content,
      ctaText: 'View Learning Analytics',
      ctaUrl: analyticsUrl,
    }),
  };
};

/**
 * Sprint 12.12: Assignment Reminder Template
 */
const getAssignmentReminderTemplate = ({ studentName = 'Student', assignmentTitle = 'Distributed Capstone PR', dueDate = 'Tomorrow at 11:59 PM', portalUrl = `${CLIENT_URL}/assignments` }) => {
  const content = `
    <h2>Assignment Submission Reminder 📌</h2>
    <p>Hello <strong>${studentName}</strong>,</p>
    <p>This is a reminder that your practical assignment <strong>"${assignmentTitle}"</strong> is due on <strong>${dueDate}</strong>.</p>
    
    <div class="meta-box">
      <div class="meta-item"><span>📝 Assignment:</span><strong>${assignmentTitle}</strong></div>
      <div class="meta-item"><span>📅 Deadline:</span><strong>${dueDate}</strong></div>
      <div class="meta-item"><span>🔍 Evaluation:</span><strong>Line-by-line Mentor GitHub Review</strong></div>
    </div>

    <p>Submit your GitHub repository link or code solution in the assignment portal before the deadline to receive prompt mentor feedback.</p>
  `;

  return {
    subject: `⏰ Assignment Due Soon: "${assignmentTitle}"`,
    html: renderBaseLayout({
      title: 'Assignment Reminder',
      preheader: `Reminder: ${assignmentTitle} is due on ${dueDate}`,
      content,
      ctaText: 'Submit Assignment',
      ctaUrl: portalUrl,
    }),
  };
};

module.exports = {
  renderBaseLayout,
  getWelcomeTemplate,
  getDemoBookingTemplate,
  getPaymentSuccessTemplate,
  getCertificateDeliveryTemplate,
  getOtpResetTemplate,
  getSessionReminder24hTemplate,
  getSessionReminder30mTemplate,
  getCourseEnrollmentTemplate,
  getStudyReminderTemplate,
  getWeeklyProgressTemplate,
  getAssignmentReminderTemplate,
};
