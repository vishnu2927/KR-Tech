const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');

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
      return res.json({
        success: true,
        verified: certificate.verified !== false,
        message: 'Official KR Tech Credential Verified',
        certificate,
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

// @desc    Issue / create a new certificate
// @route   POST /api/certificates
// @access  Private/Admin
const createCertificate = async (req, res) => {
  try {
    const {
      title,
      category,
      studentName,
      completionDate,
      credentialId,
      grade,
      skills,
      verified,
    } = req.body;

    if (!title || !category || !studentName || !credentialId) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, student name, and credential ID are required.',
      });
    }

    const existing = await Certificate.findOne({
      credentialId: { $regex: new RegExp(`^${credentialId.trim()}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A certificate with credential ID ${credentialId} already exists.`,
      });
    }

    const certificate = await Certificate.create({
      title: title.trim(),
      category: category.trim(),
      studentName: studentName.trim(),
      completionDate: completionDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      credentialId: credentialId.trim().toUpperCase(),
      grade: grade || 'Grade A+ (96%)',
      skills: Array.isArray(skills)
        ? skills
        : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      verified: verified !== false,
    });

    res.status(201).json({
      success: true,
      message: 'Certificate registered successfully in MongoDB Atlas.',
      certificate,
    });
  } catch (error) {
    console.error('Create Certificate Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCertificates,
  verifyCertificate,
  createCertificate,
};
