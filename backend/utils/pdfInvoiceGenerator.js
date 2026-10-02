const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

async function generateQRCodeBuffer(text) {
  try {
    return await QRCode.toBuffer(text, {
      width: 100,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Invoice QR Code Generation Error:', err);
    return null;
  }
}

/**
 * Generate an official A4 portrait Tax Invoice PDF
 * @param {Object} payment - Payment and invoice details
 * @returns {Promise<PDFDocument>} pdfkit document stream
 */
async function createInvoicePdfStream(payment) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `KR Global Learning Tax Invoice - ${payment.paymentId}`,
      Author: 'KR GLOBAL LEARNING PRIVATE LIMITED',
      Subject: `Invoice for ${payment.courseTitle}`,
    },
  });

  const invoiceNo = `INV-${new Date(payment.createdAt || Date.now()).getFullYear()}-${String(payment.paymentId).slice(-6).toUpperCase()}`;
  const invoiceDate = new Date(payment.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const qrBuffer = await generateQRCodeBuffer(
    `https://krgloballearning.com/verify-invoice?id=${payment.paymentId}&order=${payment.orderId}`
  );

  // 1. Header Bar
  doc
    .rect(0, 0, doc.page.width, 100)
    .fill('#090d16');

  // Company Branding
  doc
    .fillColor('#8b5cf6')
    .fontSize(20)
    .font('Helvetica-Bold')
    .text('KR GLOBAL LEARNING', 40, 30);

  doc
    .fillColor('#06b6d4')
    .fontSize(10)
    .font('Helvetica')
    .text('KR GLOBAL LEARNING PRIVATE LIMITED', 40, 56);

  doc
    .fillColor('#94a3b8')
    .fontSize(8)
    .text('Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318', 40, 70);

  // Header Right: Invoice Tag
  doc
    .fillColor('#ffffff')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('TAX INVOICE', 400, 32, { align: 'right', width: 155 });

  doc
    .fillColor('#10b981')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('● PAYMENT RECEIVED', 400, 56, { align: 'right', width: 155 });

  doc
    .fillColor('#cbd5e1')
    .fontSize(9)
    .font('Helvetica')
    .text(`Invoice #: ${invoiceNo}`, 400, 72, { align: 'right', width: 155 });

  // 2. Invoice Details Grid (Y = 120)
  doc.y = 120;
  const startY = 125;

  // Billed To (Left)
  doc
    .fillColor('#475569')
    .fontSize(8)
    .font('Helvetica-Bold')
    .text('BILLED TO (STUDENT):', 40, startY);

  doc
    .fillColor('#0f172a')
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(payment.userName || 'Student Engineer', 40, startY + 14);

  doc
    .fillColor('#475569')
    .fontSize(9)
    .font('Helvetica')
    .text(`Email: ${payment.userEmail || 'student@krtech.edu'}`, 40, startY + 30)
    .text(`Phone: ${payment.userPhone || '+91 98765 43210'}`, 40, startY + 44)
    .text('Place of Supply: Uttar Pradesh (09)', 40, startY + 58);

  // Order Details (Right)
  doc
    .fillColor('#475569')
    .fontSize(8)
    .font('Helvetica-Bold')
    .text('ORDER & TRANSACTION DETAILS:', 340, startY);

  doc
    .fillColor('#0f172a')
    .fontSize(9)
    .font('Helvetica')
    .text(`Invoice Date: ${invoiceDate}`, 340, startY + 14)
    .text(`Razorpay Order ID: ${payment.orderId || 'N/A'}`, 340, startY + 28)
    .text(`Transaction ID: ${payment.paymentId || 'N/A'}`, 340, startY + 42)
    .text(`Payment Gateway: Razorpay (100% Secure)`, 340, startY + 56);

  // 3. Line Items Table Header (Y = 220)
  const tableTop = 220;
  doc
    .rect(40, tableTop, 515, 24)
    .fill('#f1f5f9');

  doc
    .fillColor('#334155')
    .fontSize(8)
    .font('Helvetica-Bold')
    .text('ITEM & CURRICULUM DESCRIPTION', 50, tableTop + 7)
    .text('BATCH / DURATION', 280, tableTop + 7)
    .text('QTY', 420, tableTop + 7)
    .text('AMOUNT (INR)', 470, tableTop + 7, { align: 'right', width: 75 });

  // Line Item 1: Course Track
  const itemY = tableTop + 34;
  doc
    .fillColor('#0f172a')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(payment.courseTitle || 'Enterprise Software Architecture', 50, itemY, { width: 220 });

  doc
    .fillColor('#64748b')
    .fontSize(8)
    .font('Helvetica')
    .text('Includes One-on-One Live Mentorship, Code Reviews, Capstones & Verified Certificate', 50, itemY + 14, { width: 220 });

  doc
    .fillColor('#334155')
    .fontSize(9)
    .text('Batch-2026 (Live One-on-One)', 280, itemY);

  doc
    .fillColor('#334155')
    .fontSize(9)
    .text('1', 425, itemY);

  const totalPaid = payment.amount || 12999;
  const baseAmount = Math.round(totalPaid / 1.18);
  const gstAmount = totalPaid - baseAmount;

  doc
    .fillColor('#0f172a')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(`₹${baseAmount.toLocaleString('en-IN')}`, 470, itemY, { align: 'right', width: 75 });

  // Divider
  doc
    .moveTo(40, itemY + 40)
    .lineTo(555, itemY + 40)
    .stroke('#e2e8f0');

  // 4. Financial Calculations Summary (Y = 320)
  const calcY = itemY + 50;

  doc
    .fillColor('#475569')
    .fontSize(9)
    .font('Helvetica')
    .text('Course Tuition Fee (Subtotal):', 320, calcY)
    .text(`₹${baseAmount.toLocaleString('en-IN')}`, 470, calcY, { align: 'right', width: 75 });

  doc
    .text('Integrated GST @ 18% (IGST):', 320, calcY + 18)
    .text(`₹${gstAmount.toLocaleString('en-IN')}`, 470, calcY + 18, { align: 'right', width: 75 });

  doc
    .rect(310, calcY + 38, 245, 30)
    .fill('#0f172a');

  doc
    .fillColor('#ffffff')
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('TOTAL AMOUNT PAID:', 320, calcY + 48)
    .text(`₹${totalPaid.toLocaleString('en-IN')}`, 470, calcY + 48, { align: 'right', width: 75 });

  // 5. QR Code and Signatures (Y = 460)
  const bottomY = 460;

  if (qrBuffer) {
    doc.image(qrBuffer, 40, bottomY, { width: 75, height: 75 });
    doc
      .fillColor('#64748b')
      .fontSize(7)
      .font('Helvetica')
      .text('Scan to verify digital invoice authenticity on KR Global Learning portal', 40, bottomY + 80, { width: 140 });
  }

  // Terms & Conditions (Middle)
  doc
    .fillColor('#334155')
    .fontSize(8)
    .font('Helvetica-Bold')
    .text('TERMS & LEARNING GUARANTEE:', 190, bottomY);

  doc
    .fillColor('#64748b')
    .fontSize(7)
    .font('Helvetica')
    .text('• Lifetime LMS video player access with HD 1080p architecture walkthroughs.', 190, bottomY + 14)
    .text('• One-on-One Live pairing sessions with verified Principal Mentors from Tier-1 MNCs.', 190, bottomY + 26)
    .text('• Capstone projects code evaluated with automated testing and PR reviews.', 190, bottomY + 38)
    .text('• 100% Money-Back Satisfaction Guarantee (within 7 days of course launch).', 190, bottomY + 50);

  // Authorized Signature (Right)
  doc
    .fillColor('#334155')
    .fontSize(8)
    .font('Helvetica-Bold')
    .text('KR GLOBAL LEARNING PRIVATE LIMITED', 370, bottomY, { align: 'right', width: 185 });

  doc
    .fillColor('#64748b')
    .fontSize(7)
    .text('Authorized Finance Signatory', 390, bottomY + 40, { align: 'right', width: 165 })
    .text('Digitally Signed & Validated in MongoDB Atlas', 390, bottomY + 52, { align: 'right', width: 165 });

  // Footer Note
  // Footer Note (Section 10 Specification)
  doc
    .rect(0, doc.page.height - 48, doc.page.width, 48)
    .fill('#0f172a');

  doc
    .fillColor('#cbd5e1')
    .fontSize(7.5)
    .font('Helvetica-Bold')
    .text(
      'KR GLOBAL LEARNING PRIVATE LIMITED  |  Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, UP – 201318',
      40,
      doc.page.height - 40,
      { align: 'center', width: 515 }
    );

  doc
    .fillColor('#94a3b8')
    .fontSize(7)
    .font('Helvetica')
    .text(
      'Customer Support (24×7 Available): +91 9311073936  |  Email: krglobal0713@gmail.com',
      40,
      doc.page.height - 28,
      { align: 'center', width: 515 }
    );

  doc
    .fillColor('#64748b')
    .fontSize(6.5)
    .font('Helvetica')
    .text(
      'Customer Support Availability: 24 Hours × 7 Days  |  Official Computer-Generated Tax Invoice (No ink signature required)',
      40,
      doc.page.height - 16,
      { align: 'center', width: 515 }
    );

  return doc;
}

module.exports = {
  createInvoicePdfStream,
};
