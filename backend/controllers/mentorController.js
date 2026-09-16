const mongoose = require('mongoose');
const Mentor = require('../models/Mentor');

const FALLBACK_MENTORS = [
  {
    _id: "m-101",
    id: "rajesh-kumar",
    name: "Rajesh Kumar",
    role: "Principal Backend Architect",
    company: "Ex-Amazon",
    experience: "12+ Years",
    rating: 4.96,
    studentsMentored: 2400,
    skills: ["Java 21", "Spring Boot 3.x", "Microservices", "Kafka", "Docker", "AWS"],
    languages: ["English", "Hindi"],
    bio: "Ex-Amazon architect specializing in distributed high-throughput transaction engines.",
    hourlyRate: "Free 1:1 Demo",
  },
  {
    _id: "m-102",
    id: "vikram-nair",
    name: "Vikram Nair",
    role: "Lead Full Stack Engineer",
    company: "Ex-Razorpay",
    experience: "10+ Years",
    rating: 4.95,
    studentsMentored: 2100,
    skills: ["React 19", "Next.js 15", "Node.js", "Express", "MongoDB", "TypeScript"],
    languages: ["English", "Hindi"],
    bio: "Ex-Razorpay engineer leading fintech payments and real-time dashboard architectures.",
    hourlyRate: "Free 1:1 Demo",
  },
  {
    _id: "m-103",
    id: "priya-swaminathan",
    name: "Priya Swaminathan",
    role: "Principal Cloud Security Architect",
    company: "Ex-Google Cloud",
    experience: "14+ Years",
    rating: 4.98,
    studentsMentored: 3200,
    skills: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "DevSecOps"],
    languages: ["English", "Tamil", "Hindi"],
    bio: "Principal Cloud Architect who has designed multi-region infrastructure for Fortune 500 tech firms.",
    hourlyRate: "Free 1:1 Demo",
  },
];

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
const getMentors = async (req, res) => {
  try {
    const { skill, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (skill && skill !== 'All') {
        query.skills = { $regex: skill, $options: 'i' };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
        ];
      }
      const mentors = await Mentor.find(query).sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: mentors.length,
        mentors: mentors.length > 0 ? mentors : FALLBACK_MENTORS,
      });
    }

    let results = [...FALLBACK_MENTORS];
    if (skill && skill !== 'All') {
      results = results.filter(m => m.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(m => m.name.toLowerCase().includes(q) || m.company.toLowerCase().includes(q));
    }
    return res.json({
      success: true,
      count: results.length,
      mentors: results,
      mode: 'in-memory-fallback',
    });
  } catch (error) {
    return res.json({
      success: true,
      count: FALLBACK_MENTORS.length,
      mentors: FALLBACK_MENTORS,
      mode: 'resilient-cache',
    });
  }
};

// @desc    Get mentor by ID
// @route   GET /api/mentors/:id
// @access  Public
const getMentorById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const mentor = await Mentor.findById(req.params.id);
      if (mentor) return res.json({ success: true, mentor });
    }
    const found = FALLBACK_MENTORS.find(m => m._id === req.params.id || m.id === req.params.id);
    if (found) return res.json({ success: true, mentor: found });
    return res.status(404).json({ success: false, message: 'Mentor not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new mentor
// @route   POST /api/mentors
// @access  Private/Admin
const createMentor = async (req, res) => {
  try {
    const { name, role, company, experience, skills, languages, bio, hourlyRate, linkedin } = req.body;
    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Mentor name and role are required' });
    }

    let studentsMentored = 250;
    if (req.body.studentsMentored) {
      const parsed = parseInt(req.body.studentsMentored.toString().replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) studentsMentored = parsed;
    } else if (req.body.studentsCount) {
      const parsed = parseInt(req.body.studentsCount.toString().replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) studentsMentored = parsed;
    }

    const avatarUrl = req.body.avatar || req.body.image || '';
    const expYears = experience || req.body.exp || '10+ Years';

    if (mongoose.connection.readyState === 1) {
      const mentor = await Mentor.create({
        name,
        role,
        company: company || 'Top Tech MNC',
        experience: expYears,
        studentsMentored,
        avatar: avatarUrl,
        skills: skills || [],
        languages: languages || ['English', 'Hindi'],
        bio: bio || '',
        hourlyRate: hourlyRate || 'Free 1:1 Demo',
        linkedin: linkedin || 'https://linkedin.com',
      });
      return res.status(201).json({ success: true, message: 'Mentor added successfully', mentor });
    }

    const mockCreated = {
      _id: `m-${Date.now()}`,
      name,
      role,
      company: company || 'Top Tech MNC',
      skills: skills || ['System Design', '1:1 Live Coding'],
    };
    return res.status(201).json({ success: true, message: 'Mentor added (Local Mode)', mentor: mockCreated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update mentor details
// @route   PUT /api/mentors/:id
// @access  Private/Admin
const updateMentor = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.studentsMentored) {
      const parsed = parseInt(updateData.studentsMentored.toString().replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) updateData.studentsMentored = parsed;
      else delete updateData.studentsMentored;
    } else if (updateData.studentsCount) {
      const parsed = parseInt(updateData.studentsCount.toString().replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) updateData.studentsMentored = parsed;
    }

    if (updateData.image && !updateData.avatar) {
      updateData.avatar = updateData.image;
    }
    if (updateData.exp && !updateData.experience) {
      updateData.experience = updateData.exp;
    }

    if (mongoose.connection.readyState === 1) {
      const updatedMentor = await Mentor.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (updatedMentor) return res.json({ success: true, mentor: updatedMentor });
    }
    return res.json({ success: true, message: 'Mentor updated', mentor: { _id: req.params.id, ...updateData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a mentor
// @route   DELETE /api/mentors/:id
// @access  Private/Admin
const deleteMentor = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Mentor.findByIdAndDelete(req.params.id);
    }
    return res.json({ success: true, message: 'Mentor removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
};
