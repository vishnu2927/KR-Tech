const mongoose = require('mongoose');
const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Get All Batches with filtering, search & pagination
// @route   GET /api/batches or /api/admin/batches
// @access  Private (Admin / Mentor / Counselor)
const getBatches = async (req, res) => {
  try {
    const { search = '', status = 'All', page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { batchCode: { $regex: search.trim(), $options: 'i' } },
        { mentorName: { $regex: search.trim(), $options: 'i' } },
        { courseTitle: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const total = await Batch.countDocuments(query);
    let batches = await Batch.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // If database is empty, seed initial high-standard cohorts
    if (batches.length === 0 && !search && status === 'All') {
      const defaultBatches = [
        {
          name: 'Java Backend Cloud Architecture 2026',
          batchCode: 'KR-JAVA-26A',
          courseId: 'crs-java-fullstack-2026',
          courseTitle: 'Complete Java Backend Development with Spring Boot 3 & Cloud',
          mentorName: 'Rajesh Kumar (Principal Technical Architect)',
          mentorEmail: 'rajesh.kumar@krtech.in',
          zoomLink: 'https://zoom.us/j/98234112233',
          schedule: {
            days: ['Mon', 'Wed', 'Fri'],
            time: '08:00 PM - 10:00 PM IST',
            startDate: new Date('2026-08-01'),
            endDate: new Date('2026-11-30'),
          },
          capacity: 60,
          status: 'Active',
          description: 'Production Spring Boot, Microservices, Kafka event streaming, and AWS cloud deployment cohort.',
          students: [
            { name: 'Aditya Sharma', email: 'aditya.sharma@krtech.edu', attendancePercent: 96 },
            { name: 'Rohan Deshmukh', email: 'rohan.desh@techmail.com', attendancePercent: 88 },
          ],
        },
        {
          name: 'MERN Stack & Next.js 15 Full Stack Masters',
          batchCode: 'KR-MERN-26B',
          courseId: 'mern-fullstack-pro',
          courseTitle: 'MERN Full Stack Web Development Mastery Bootcamp',
          mentorName: 'Amit Verma (Principal Systems Architect)',
          mentorEmail: 'amit.verma@krtech.in',
          zoomLink: 'https://meet.google.com/kr-mern-2026',
          schedule: {
            days: ['Tue', 'Thu', 'Sat'],
            time: '07:30 PM - 09:30 PM IST',
            startDate: new Date('2026-08-15'),
            endDate: new Date('2026-12-15'),
          },
          capacity: 50,
          status: 'Active',
          description: 'React 19, Next.js 15 App Router, TypeScript, GraphQL, Docker, and CI/CD pipelines.',
          students: [
            { name: 'Kavya Patel', email: 'kavya.patel@gmail.com', attendancePercent: 92 },
            { name: 'Meenakshi Iyer', email: 'meenakshi.iyer@gmail.com', attendancePercent: 90 },
          ],
        },
        {
          name: 'AWS & Azure Solutions Architect Cohort',
          batchCode: 'KR-CLOUD-26C',
          courseId: 'aws-cloud-architect',
          courseTitle: 'AWS Certified Solutions Architect Associate (SAA-C03)',
          mentorName: 'Vikram Nair (Staff Software Engineer Cloud)',
          mentorEmail: 'vikram.nair@krtech.in',
          zoomLink: 'https://zoom.us/j/77665544332',
          schedule: {
            days: ['Sat', 'Sun'],
            time: '10:00 AM - 01:00 PM IST',
            startDate: new Date('2026-09-01'),
            endDate: new Date('2026-12-01'),
          },
          capacity: 40,
          status: 'Active',
          description: 'Enterprise VPC architectures, Kubernetes EKS, Terraform IaC, and Cost Optimization.',
          students: [
            { name: 'Siddharth Verma', email: 'sid.verma@outlook.com', attendancePercent: 98 },
          ],
        },
      ];
      batches = await Batch.insertMany(defaultBatches);
    }

    res.json({
      success: true,
      count: batches.length,
      total: total || batches.length,
      page: Number(page),
      batches,
    });
  } catch (error) {
    console.error('Get Batches Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Batch by ID
// @route   GET /api/batches/:id
// @access  Private
const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, batch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a New Batch
// @route   POST /api/batches or /api/admin/batches
// @access  Private (Admin / superAdmin)
const createBatch = async (req, res) => {
  try {
    const {
      name,
      batchCode,
      courseId,
      courseTitle,
      mentorName,
      mentorEmail,
      zoomLink,
      schedule,
      capacity = 60,
      status = 'Active',
      description,
    } = req.body;

    if (!name || !batchCode) {
      return res.status(400).json({
        success: false,
        message: 'Batch Name and Batch Code are required',
      });
    }

    const existing = await Batch.findOne({ batchCode: batchCode.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Batch Code '${batchCode}' is already registered`,
      });
    }

    const newBatch = await Batch.create({
      name: name.trim(),
      batchCode: batchCode.trim().toUpperCase(),
      courseId: courseId || 'mern-fullstack-pro',
      courseTitle: courseTitle || name,
      mentorName: mentorName || 'Rajesh Kumar (Principal Technical Architect)',
      mentorEmail: mentorEmail || 'rajesh.mentor@krtech.in',
      zoomLink: zoomLink || 'https://zoom.us/j/krtech-classroom',
      schedule: schedule || {
        days: ['Mon', 'Wed', 'Fri'],
        time: '08:00 PM - 10:00 PM IST',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      capacity: Number(capacity) || 60,
      status: status || 'Active',
      description: description || 'Live interactive batch with hands-on labs and certification preparation.',
      students: [],
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully in MongoDB Atlas',
      batch: newBatch,
    });
  } catch (error) {
    console.error('Create Batch Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Batch
// @route   PUT /api/batches/:id or /api/admin/batches/:id
// @access  Private (Admin / superAdmin)
const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const updated = await Batch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Batch updated successfully',
      batch: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Batch
// @route   DELETE /api/batches/:id or /api/admin/batches/:id
// @access  Private (Admin / superAdmin)
const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    await Batch.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: `Batch '${batch.batchCode}' successfully deleted`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Student to Batch
// @route   POST /api/batches/:id/students
// @access  Private (Admin / Counselor)
const addStudentToBatch = async (req, res) => {
  try {
    const { name, email, phone = '' } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Student Name and Email required' });
    }

    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const alreadyEnrolled = batch.students.some((s) => s.email.toLowerCase() === email.toLowerCase());
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Student already enrolled in this batch' });
    }

    batch.students.push({
      name,
      email,
      phone,
      enrolledAt: new Date(),
      attendancePercent: 100,
    });

    await batch.save();
    res.json({
      success: true,
      message: `Student '${name}' enrolled in batch ${batch.batchCode}`,
      batch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  addStudentToBatch,
};
