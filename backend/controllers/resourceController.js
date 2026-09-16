const mongoose = require('mongoose');
const Resource = require('../models/Resource');

// @desc    Get all resources with search and category filtering
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error('Get Resources Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resource by ID or slug
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    let resource = null;

    // 1. Try finding by MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      resource = await Resource.findById(id);
    }

    // 2. Try finding by custom 'id' (slug)
    if (!resource) {
      resource = await Resource.findOne({
        $or: [
          { id: id },
          { id: id.toLowerCase() },
          { title: { $regex: new RegExp(`^${id.replace(/-/g, ' ')}$`, 'i') } },
        ],
      });
    }

    // 3. Try fuzzy title match
    if (!resource) {
      resource = await Resource.findOne({
        title: { $regex: id.replace(/-/g, ' '), $options: 'i' },
      });
    }

    if (resource) {
      return res.json({ success: true, resource });
    }

    return res.status(404).json({ success: false, message: 'Resource not found in MongoDB Atlas library' });
  } catch (error) {
    console.error('Get Resource By ID Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track a download for resource (increments counter)
// @route   POST /api/resources/:id/download
// @access  Public
const trackDownload = async (req, res) => {
  try {
    const { id } = req.params;
    let resource = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      resource = await Resource.findById(id);
    }
    if (!resource) {
      resource = await Resource.findOne({ id });
    }

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Increment numeric count if parseable, or append
    let current = parseFloat(resource.downloadsCount) || 12.5;
    if (resource.downloadsCount.includes('k')) {
      current = (current + 0.1).toFixed(1) + 'k';
    } else {
      current = Math.round(current + 1).toString();
    }
    resource.downloadsCount = current;
    await resource.save();

    res.json({
      success: true,
      message: 'Download tracked in Atlas',
      downloadsCount: resource.downloadsCount,
      downloadUrl: resource.downloadUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const { title, category, description, format, fileSize, tags, content } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const resource = await Resource.create({
      id: slug,
      title: title.trim(),
      category: category.trim(),
      description: description || '',
      format: format || 'PDF',
      fileSize: fileSize || '3.5 MB',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t) => t.trim()),
      content: content || '',
    });

    res.status(201).json({
      success: true,
      message: 'Resource created in MongoDB Atlas',
      resource,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  trackDownload,
  createResource,
};
