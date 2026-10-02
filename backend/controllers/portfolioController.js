const Portfolio = require('../models/Portfolio');

// Helper to seed a default portfolio for a user
function getDefaultPortfolioData(userId, user) {
  const name = user?.name || 'Aditya Sharma';
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') || `student-${Date.now()}`;

  return {
    student: userId,
    handle: slug,
    fullName: name,
    title: 'Senior Full Stack & Cloud Engineer',
    bio: 'Software engineer passionate about high-concurrency Java Spring Boot microservices, React 19 web platforms, and automated cloud deployments on AWS & Kubernetes.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces&auto=format',
    location: 'Bengaluru, India',
    skills: ['Java 21', 'Spring Boot 3', 'React 19', 'TypeScript', 'Apache Kafka', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL'],
    projects: [
      {
        title: 'Distributed Real-Time Payment Ingestion Engine',
        description: 'High-throughput payment reconciliation microservice processing 15,000+ RPS with Apache Kafka, Spring Boot 3, and Redis caching.',
        liveUrl: 'https://demo-payments.krtech.edu',
        githubUrl: 'https://github.com/example/distributed-payments',
        techStack: ['Java 21', 'Spring Boot', 'Kafka', 'Redis', 'PostgreSQL'],
        stars: 48,
        highlight: true,
      },
      {
        title: 'Cloud-Native Telemetry & Analytics Dashboard',
        description: 'Full-stack observability suite built with React 19, TypeScript, Prometheus metrics exporter, and interactive chart visualizations.',
        liveUrl: 'https://telemetry.krtech.edu',
        githubUrl: 'https://github.com/example/react-cloud-telemetry',
        techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Docker'],
        stars: 32,
        highlight: false,
      },
    ],
    experience: [
      {
        role: 'Full Stack Engineering Intern',
        company: 'CloudScale Technologies',
        duration: 'Jan 2024 - Present',
        description: 'Built RESTful microservices, automated CI/CD deployment pipelines, and authored integration tests.',
      },
    ],
    education: [
      {
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'National Institute of Technology (NIT)',
        year: '2020 - 2024',
        score: '8.8 CGPA',
      },
    ],
    certifications: [
      {
        title: 'Enterprise Backend Microservices & Apache Kafka',
        credentialId: 'KR-CERT-884920',
        issuer: 'KR Tech Academy',
        issueDate: 'Sep 2026',
        verifyUrl: 'http://localhost:8443/verify/KR-CERT-884920',
      },
      {
        title: 'AWS Certified Solutions Architect – Associate',
        credentialId: 'AWS-SAA-83921',
        issuer: 'Amazon Web Services',
        issueDate: 'Jun 2026',
        verifyUrl: 'https://aws.amazon.com/verification',
      },
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      leetcode: 'https://leetcode.com',
      website: 'https://krtech.edu',
    },
    isPublished: true,
  };
}

// @desc    Get current user's portfolio or auto-initialize
// @route   GET /api/portfolio/me
// @access  Private / Student
const getMyPortfolio = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    let portfolio = await Portfolio.findOne({ student: userId });

    if (!portfolio) {
      const defaultData = getDefaultPortfolioData(userId, req.user);
      portfolio = await Portfolio.create(defaultData);
    }

    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Get my portfolio error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio.' });
  }
};

// @desc    Create or update current user's portfolio
// @route   POST /api/portfolio
// @access  Private / Student
const savePortfolio = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const updateData = req.body;

    // Ensure handle is clean
    if (updateData.handle) {
      updateData.handle = updateData.handle.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { student: userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully!',
      data: portfolio,
    });
  } catch (error) {
    console.error('Save portfolio error:', error);
    res.status(500).json({ success: false, message: 'Failed to save portfolio.' });
  }
};

// @desc    Get public portfolio by handle
// @route   GET /api/portfolio/:handle
// @access  Public
const getPublicPortfolio = async (req, res) => {
  try {
    const { handle } = req.params;
    const portfolio = await Portfolio.findOne({ handle: handle.toLowerCase(), isPublished: true });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found.' });
    }

    // Increment views counter
    portfolio.viewsCount += 1;
    await portfolio.save();

    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Get public portfolio error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch public portfolio.' });
  }
};

module.exports = {
  getMyPortfolio,
  savePortfolio,
  getPublicPortfolio,
};
