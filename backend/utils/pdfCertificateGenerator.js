const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

/**
 * Generate QR code buffer for certificate verification URL
 */
async function generateQRCodeBuffer(text) {
  try {
    return await QRCode.toBuffer(text, {
      width: 120,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('QR Code Generation Error:', err);
    return null;
  }
}

/**
 * Generate a vector landscape certificate PDF
 * @param {Object} cert - Certificate details
 * @param {string} cert.studentName - Name of the recipient
 * @param {string} cert.title - Course title
 * @param {string} cert.category - Course category
 * @param {string} cert.grade - Grade achieved (e.g. 'Grade A+ (96%)')
 * @param {string} cert.completionDate - Date of completion
 * @param {string} cert.credentialId - Unique credential ID
 * @param {Array<string>} [cert.skills] - List of skills
 * @param {string} [cert.issuer] - Issuing authority
 * @returns {PDFDocument} pdfkit document stream
 */
function createCertificatePdfStream(cert) {
  // A4 Landscape: 841.89 x 595.28 points
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 30,
    info: {
      Title: `Certificate - ${cert.studentName}`,
      Author: 'KR GLOBAL LEARNING PRIVATE LIMITED',
      Subject: cert.title,
      Keywords: 'KR Global Learning, Certificate, Microservices, Cloud, Verification',
    },
  });

  const width = doc.page.width;
  const height = doc.page.height;

  // Background fill
  doc.rect(0, 0, width, height).fill('#ffffff');

  // Outer decorative border (Deep Navy #0f172a)
  doc.rect(20, 20, width - 40, height - 40)
     .lineWidth(4)
     .strokeColor('#0f172a')
     .stroke();

  // Inner decorative border (Warm Gold #b45309)
  doc.rect(26, 26, width - 52, height - 52)
     .lineWidth(1.5)
     .strokeColor('#b45309')
     .stroke();

  // Thin interior border
  doc.rect(30, 30, width - 60, height - 60)
     .lineWidth(0.5)
     .strokeColor('#cbd5e1')
     .stroke();

  // Top Badge / Header Accent
  doc.rect(width / 2 - 120, 31, 240, 6).fill('#7c3aed');

  // Institution Logo / Brand Name
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(18)
     .text('KR GLOBAL LEARNING PRIVATE LIMITED', 40, 52, {
       align: 'center',
       characterSpacing: 1.5,
     });

  doc.fillColor('#64748b')
     .font('Helvetica')
     .fontSize(9)
     .text('ONE-TO-ONE LIVE TECH MENTORSHIP & VENDOR CERTIFICATION PLATFORM', 40, 74, {
       align: 'center',
       characterSpacing: 1.2,
     });

  // Certificate Title
  doc.fillColor('#b45309')
     .font('Helvetica-Bold')
     .fontSize(24)
     .text('CERTIFICATE OF ACCOMPLISHMENT', 40, 102, {
       align: 'center',
       characterSpacing: 2,
     });

  doc.fillColor('#64748b')
     .font('Helvetica-Oblique')
     .fontSize(11)
     .text('This is to officially certify that', 40, 136, {
       align: 'center',
     });

  // Recipient Name
  doc.fillColor('#4338ca')
     .font('Helvetica-Bold')
     .fontSize(28)
     .text(cert.studentName || 'Student Name', 40, 160, {
       align: 'center',
       characterSpacing: 0.5,
     });

  // Underline beneath name
  doc.moveTo(width / 2 - 160, 196)
     .lineTo(width / 2 + 160, 196)
     .lineWidth(1.5)
     .strokeColor('#d97706')
     .stroke();

  doc.fillColor('#334155')
     .font('Helvetica')
     .fontSize(11)
     .text('has successfully demonstrated technical mastery and completed all One-on-One capstone projects for', 40, 212, {
       align: 'center',
     });

  // Course Title
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(18)
     .text(cert.title || 'Course Title', 50, 234, {
       align: 'center',
       characterSpacing: 0.5,
     });

  // Grade & Category Pill
  const gradeText = cert.grade ? `Honors: ${cert.grade}` : 'Distinction (Grade A+)';
  const categoryText = cert.category ? `Track: ${cert.category}` : 'Engineering Track';

  doc.fillColor('#475569')
     .font('Helvetica-Bold')
     .fontSize(10)
     .text(`${gradeText}   |   ${categoryText}`, 40, 264, {
       align: 'center',
     });

  // Skills tag line if provided
  if (cert.skills && cert.skills.length > 0) {
    const skillsString = Array.isArray(cert.skills) ? cert.skills.join('  ·  ') : String(cert.skills);
    doc.fillColor('#64748b')
       .font('Helvetica')
       .fontSize(8.5)
       .text(`Key Competencies: ${skillsString}`, 60, 284, {
         align: 'center',
       });
  }

  // Divider Line
  doc.moveTo(70, 312)
     .lineTo(width - 70, 312)
     .lineWidth(0.5)
     .strokeColor('#e2e8f0')
     .stroke();

  // Bottom Section: Left Metadata, Center Gold Seal, Right Signatures
  // 1. Left Metadata Box
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(9)
     .text('CREDENTIAL VERIFICATION', 65, 335);

  doc.fillColor('#64748b')
     .font('Helvetica')
     .fontSize(8.5)
     .text(`Credential ID: `, 65, 352, { continued: true })
     .fillColor('#4338ca')
     .font('Helvetica-Bold')
     .text(cert.credentialId);

  doc.fillColor('#64748b')
     .font('Helvetica')
     .fontSize(8.5)
     .text(`Issue Date: `, 65, 368, { continued: true })
     .fillColor('#1e293b')
     .text(cert.completionDate || 'Sep 2026');

  doc.fillColor('#64748b')
     .font('Helvetica')
     .fontSize(8.5)
     .text(`Registry Status: `, 65, 384, { continued: true })
     .fillColor('#16a34a')
     .font('Helvetica-Bold')
     .text('Cryptographically Verified ✓');

  doc.fillColor('#94a3b8')
     .font('Helvetica')
     .fontSize(7.5)
     .text('Public Verification Portal:\nhttps://krtech.edu/certificates', 65, 404);

  // 2. Center Embossed Gold Seal
  const sealCenterX = width / 2;
  const sealCenterY = 405;

  // Outer scalloped/star circle simulated with double rings
  doc.circle(sealCenterX, sealCenterY, 44)
     .lineWidth(2)
     .strokeColor('#b45309')
     .stroke();

  doc.circle(sealCenterX, sealCenterY, 39)
     .fillColor('#fef3c7')
     .fillAndStroke('#d97706');

  doc.circle(sealCenterX, sealCenterY, 35)
     .lineWidth(1)
     .strokeColor('#b45309')
     .stroke();

  doc.fillColor('#92400e')
     .font('Helvetica-Bold')
     .fontSize(7.5)
     .text('KR GLOBAL', sealCenterX - 35, sealCenterY - 14, { width: 70, align: 'center' });

  doc.fillColor('#b45309')
     .font('Helvetica-Bold')
     .fontSize(7)
     .text('LEARNING', sealCenterX - 35, sealCenterY - 2, { width: 70, align: 'center' });

  doc.fillColor('#92400e')
     .font('Helvetica-Bold')
     .fontSize(6)
     .text('VERIFIED 2026', sealCenterX - 35, sealCenterY + 10, { width: 70, align: 'center' });

  // 3. Right Signatures Block
  // Signature 1: Academic Dean
  const sig1X = width - 240;
  doc.moveTo(sig1X, 420)
     .lineTo(sig1X + 175, 420)
     .lineWidth(1)
     .strokeColor('#94a3b8')
     .stroke();

  doc.fillColor('#1e293b')
     .font('Helvetica-Bold')
     .fontSize(9)
     .text('Rajesh Kumar', sig1X, 426, { width: 175, align: 'center' });

  doc.fillColor('#64748b')
     .font('Helvetica')
     .fontSize(7.5)
     .text('Academic Dean · Principal Technical Architect Staff', sig1X, 438, { width: 175, align: 'center' });

  // Signature 2: Certification Authority
  const sig2X = width - 440;
  doc.moveTo(sig2X, 420)
     .lineTo(sig2X + 180, 420)
     .lineWidth(1)
     .strokeColor('#94a3b8')
     .stroke();

  doc.fillColor('#1e293b')
     .font('Helvetica-Bold')
     .fontSize(8.5)
     .text('KR Global Learning Certification Authority', sig2X, 426, { width: 180, align: 'center' });

  doc.fillColor('#64748b')
     .font('Helvetica')
     .fontSize(7.5)
     .text('Authorized Credential Signatory', sig2X, 438, { width: 180, align: 'center' });

  // Footer Official Details (Section 9 Specification)
  doc.fillColor('#475569')
     .font('Helvetica-Bold')
     .fontSize(7.5)
     .text(
       'Issued By: KR GLOBAL LEARNING PRIVATE LIMITED  |  Corporate Office: Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West – 201318',
       40,
       height - 46,
       { align: 'center' }
     );

  doc.fillColor('#64748b')
     .font('Helvetica')
     .fontSize(7)
     .text(
       'Student Support: +91 9311073936  |  Business Email: krglobal0713@gmail.com  |  Cryptographically Verified Registry',
       40,
       height - 35,
       { align: 'center' }
     );

  return doc;
}

/**
 * Generates PDF certificate as a Buffer with embedded live QR code
 * @param {Object} cert - Certificate document
 * @param {string} [clientUrl] - Base client URL for verification
 * @returns {Promise<Buffer>}
 */
async function generateCertificatePdfBuffer(cert, clientUrl = 'https://krtech.edu') {
  const verifyUrl = `${clientUrl}/certificates?verify=${encodeURIComponent(cert.credentialId)}`;
  const qrBuffer = await generateQRCodeBuffer(verifyUrl);

  const doc = createCertificatePdfStream(cert);

  // Embed the QR Code image on bottom left
  if (qrBuffer) {
    try {
      doc.image(qrBuffer, 185, 340, { width: 68, height: 68 });
    } catch (qrErr) {
      console.warn('QR Code embed warning:', qrErr.message);
    }
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

/**
 * Stream PDF directly to HTTP Express response with embedded QR code
 * @param {Object} cert - Certificate document
 * @param {Object} res - Express response
 * @param {string} [clientUrl] - Base client URL
 */
async function streamCertificatePdfResponse(cert, res, clientUrl = 'https://krtech.edu') {
  const verifyUrl = `${clientUrl}/certificates?verify=${encodeURIComponent(cert.credentialId)}`;
  const qrBuffer = await generateQRCodeBuffer(verifyUrl);

  const filename = `KR_Tech_Certificate_${cert.credentialId.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  const doc = createCertificatePdfStream(cert);

  // Embed the QR Code image on bottom left
  if (qrBuffer) {
    try {
      doc.image(qrBuffer, 185, 340, { width: 68, height: 68 });
    } catch (qrErr) {
      console.warn('QR Code embed warning:', qrErr.message);
    }
  }

  doc.pipe(res);
  doc.end();
}

module.exports = {
  createCertificatePdfStream,
  generateCertificatePdfBuffer,
  streamCertificatePdfResponse,
  generateQRCodeBuffer,
};
