const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Certificate = require('../models/Certificate');
const { sendCertificateEmail } = require('../services/emailService');
const { sendCertificateReadyWA } = require('../services/whatsappService');
const {
  streamCertificatePdfResponse,
  generateCertificatePdfBuffer,
} = require('../utils/pdfCertificateGenerator');

const CLIENT_URL =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://www.krgloballearning.org'
    : 'http://localhost:5173');

/**
 * Generate a unique credential ID with format: KRT-2026-CAT-XXXXX
 */
const generateUniqueCredentialId = (category = 'TECH') => {
  const cleanCat = category.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'TECH';
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `KRT-2026-${cleanCat}-${randomDigits}`;
};

// @desc    Get all certificates with search and category filtering
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { credentialId: { $regex: q, $options: 'i' } },
        { studentName: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const certificates = await Certificate.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    console.error('Get Certificates Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify certificate by Credential ID (e.g. KRT-2026-JAVA-9102)
// @route   GET /api/certificates/verify/:credentialId or GET /api/certificates/:credentialId
// @access  Public
const verifyCertificate = async (req, res) => {
  try {
    const credentialId = (req.params.credentialId || req.params.id || '').trim();

    if (!credentialId) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Credential ID parameter is required.',
      });
    }

    // 1. Case-insensitive exact search on credentialId
    let certificate = await Certificate.findOne({
      credentialId: { $regex: new RegExp(`^${credentialId}$`, 'i') },
    });

    // 2. If not found and is valid MongoDB ObjectId, try findById
    if (!certificate && mongoose.Types.ObjectId.isValid(credentialId)) {
      certificate = await Certificate.findById(credentialId);
    }

    // 3. If still not found, try fuzzy search
    if (!certificate) {
      certificate = await Certificate.findOne({
        $or: [
          { credentialId: { $regex: credentialId, $options: 'i' } },
          { studentName: { $regex: new RegExp(`^${credentialId}$`, 'i') } },
        ],
      });
    }

    if (certificate) {
      const verifyUrl = `${CLIENT_URL}/certificates?verify=${encodeURIComponent(certificate.credentialId)}`;
      let qrCodeDataUrl = certificate.qrCodeDataUrl;

      // Dynamically generate QR code if not stored
      if (!qrCodeDataUrl) {
        try {
          qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
            width: 200,
            margin: 1,
            color: { dark: '#0f172a', light: '#ffffff' },
          });
        } catch (qrErr) {
          console.warn('QR generation in verify warning:', qrErr.message);
        }
      }

      return res.json({
        success: true,
        verified: certificate.verified !== false,
        message: 'Official KR Tech Credential Verified',
        certificate: {
          ...certificate.toObject(),
          qrCodeDataUrl,
          verifyUrl,
          downloadPdfUrl: `/api/certificates/${certificate.credentialId}/pdf`,
        },
      });
    }

    return res.status(404).json({
      success: false,
      verified: false,
      message: `Invalid or unverified credential ID "${credentialId}". No matching record found in KR Tech official registry.`,
    });
  } catch (error) {
    console.error('Verify Certificate Error:', error);
    res.status(500).json({ success: false, verified: false, message: error.message });
  }
};

// @desc    Download / Stream Vector PDF Certificate
// @route   GET /api/certificates/:credentialId/pdf or GET /api/certificates/download/:credentialId
// @access  Public
const downloadCertificatePdf = async (req, res) => {
  try {
    const credentialId = (req.params.credentialId || req.params.id || '').trim();

    if (!credentialId) {
      return res.status(400).json({ success: false, message: 'Credential ID is required.' });
    }

    let certificate = await Certificate.findOne({
      credentialId: { $regex: new RegExp(`^${credentialId}$`, 'i') },
    });

    if (!certificate && mongoose.Types.ObjectId.isValid(credentialId)) {
      certificate = await Certificate.findById(credentialId);
    }

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: `Certificate "${credentialId}" not found in KR Tech registry.`,
      });
    }

    await streamCertificatePdfResponse(certificate, res, CLIENT_URL);
  } catch (error) {
    console.error('Download Certificate PDF Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// @desc    Generate a new certificate with unique ID, QR code, and optional email
// @route   POST /api/certificates/generate
// @access  Public / Admin
const generateCertificate = async (req, res) => {
  try {
    const {
      studentName,
      title,
      category = 'Tech',
      studentEmail,
      grade = 'Grade A+ (96%)',
      completionDate,
      skills,
      sendEmail = false,
    } = req.body;

    const certTitle = (title || req.body.courseTitle || '').trim();

    if (!studentName || !certTitle) {
      return res.status(400).json({
        success: false,
        message: 'Student name and course title are required.',
      });
    }

    // Generate unique credential ID
    let credentialId = req.body.credentialId ? req.body.credentialId.trim().toUpperCase() : null;
    if (!credentialId) {
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        attempts++;
        const candidate = generateUniqueCredentialId(category);
        const exists = await Certificate.findOne({ credentialId: candidate });
        if (!exists) {
          credentialId = candidate;
          isUnique = true;
        }
      }
    }

    const verifyUrl = `${CLIENT_URL}/certificates?verify=${encodeURIComponent(credentialId)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    });

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Architecture', 'Enterprise Code', 'Production Ready'];

    const formattedDate = completionDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const certificate = await Certificate.create({
      studentName: studentName.trim(),
      studentEmail: studentEmail ? studentEmail.trim().toLowerCase() : undefined,
      title: certTitle,
      category: category.trim(),
      completionDate: formattedDate,
      credentialId,
      grade,
      skills: parsedSkills,
      verified: true,
      qrCodeDataUrl,
      pdfUrl: `/api/certificates/${credentialId}/pdf`,
      issuer: 'KR GLOBAL LEARNING PRIVATE LIMITED',
      accreditation: 'KR Global Learning Verified Training Credential',
    });

    // Generate PDF Buffer for Email Attachment if requested
    let mailResult = null;
    if (sendEmail && studentEmail) {
      try {
        const pdfBuffer = await generateCertificatePdfBuffer(certificate, CLIENT_URL);
        mailResult = await sendCertificateEmail({
          recipientEmail: studentEmail.trim().toLowerCase(),
          studentName: certificate.studentName,
          courseTitle: certificate.title,
          certId: certificate.credentialId,
          grade: certificate.grade,
          issueDate: certificate.completionDate,
          pdfBuffer,
        });
      } catch (mailErr) {
        console.warn('Notice sending certificate delivery email:', mailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: `Certificate ${credentialId} generated successfully!`,
      certificate,
      verifyUrl,
      downloadPdfUrl: `/api/certificates/${credentialId}/pdf`,
      emailSent: !!mailResult?.success,
    });
  } catch (error) {
    console.error('Generate Certificate Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Issue / create a new certificate (Admin legacy)
// @route   POST /api/certificates
// @access  Private/Admin
const createCertificate = async (req, res) => {
  return generateCertificate(req, res);
};

// @desc    Email Certificate to student / recipient with PDF attached
// @route   POST /api/certificates/send-email
// @access  Public
const emailCertificate = async (req, res) => {
  try {
    const email = req.body.email;
    const credentialId = req.body.credentialId || req.body.certId;

    if (!email || !credentialId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email and Credential ID are required.',
      });
    }

    const cert = await Certificate.findOne({
      credentialId: { $regex: new RegExp(`^${credentialId.trim()}$`, 'i') },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: `Certificate with credential ID "${credentialId}" was not found in MongoDB Atlas.`,
      });
    }

    // Generate PDF buffer to attach directly in email
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateCertificatePdfBuffer(cert, CLIENT_URL);
    } catch (pdfErr) {
      console.warn('PDF buffer generation warning for email:', pdfErr.message);
    }

    const mailResult = await sendCertificateEmail({
      recipientEmail: email.toLowerCase().trim(),
      studentName: cert.studentName,
      courseTitle: cert.title,
      certId: cert.credentialId,
      grade: cert.grade,
      issueDate: cert.completionDate,
      pdfBuffer,
    });

    // Optionally dispatch WhatsApp alert if student phone is provided
    if (req.body.phone) {
      sendCertificateReadyWA({
        phone: req.body.phone,
        name: cert.studentName,
        courseTitle: cert.title,
        certId: cert.credentialId,
        grade: cert.grade,
        issueDate: cert.completionDate,
      }).catch((waErr) => {
        console.warn('Certificate WhatsApp Notice:', waErr.message);
      });
    }

    res.json({
      success: true,
      message: `Certificate ${cert.credentialId} dispatched with PDF attachment to ${email}!`,
      mailResult,
    });
  } catch (error) {
    console.error('Email Certificate Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send Certificate Ready alert via WhatsApp
// @route   POST /api/certificates/send-whatsapp
// @access  Public
const whatsappCertificate = async (req, res) => {
  try {
    const phone = req.body.phone;
    const credentialId = req.body.credentialId || req.body.certId;

    if (!phone || !credentialId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient phone and Credential ID are required.',
      });
    }

    const cert = await Certificate.findOne({
      credentialId: { $regex: new RegExp(`^${credentialId.trim()}$`, 'i') },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: `Certificate with credential ID "${credentialId}" was not found in MongoDB Atlas.`,
      });
    }

    const waResult = await sendCertificateReadyWA({
      phone,
      name: cert.studentName,
      courseTitle: cert.title,
      certId: cert.credentialId,
      grade: cert.grade,
      issueDate: cert.completionDate,
    });

    res.json({
      success: true,
      message: `WhatsApp notification for Certificate ${cert.credentialId} dispatched to ${phone}!`,
      waResult,
    });
  } catch (error) {
    console.error('WhatsApp Certificate Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCertificates,
  verifyCertificate,
  downloadCertificatePdf,
  generateCertificate,
  createCertificate,
  emailCertificate,
  whatsappCertificate,
};
