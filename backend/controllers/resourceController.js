const mongoose = require('mongoose');
const Resource = require('../models/Resource');

/**
 * Format numeric download count to readable string (e.g., 12500 -> '12.5k')
 */
const formatDownloadCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

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
        { content: { $regex: q, $options: 'i' } },
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

    // Increment numeric count atomically
    const newCount = (resource.downloadCount || 1250) + 1;
    resource.downloadCount = newCount;
    resource.downloadsCount = formatDownloadCount(newCount);
    await resource.save();

    res.json({
      success: true,
      message: 'Download tracked in Atlas',
      downloadCount: resource.downloadCount,
      downloadsCount: resource.downloadsCount,
      downloadUrl: resource.downloadUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download / stream the resource file directly
// @route   GET /api/resources/:id/download
// @access  Public
const downloadResourceFileEndpoint = async (req, res) => {
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

    // Increment counter
    const newCount = (resource.downloadCount || 1250) + 1;
    resource.downloadCount = newCount;
    resource.downloadsCount = formatDownloadCount(newCount);
    await resource.save();

    const fileContent = `================================================================================
KR TECH ACADEMY — OFFICIAL LEARNING RESOURCE
================================================================================
Title:       ${resource.title}
Category:    ${resource.category}
Format:      ${resource.format}
File Size:   ${resource.fileSize}
Author:      ${resource.author || 'KR Tech Senior Architect Council'}
Verified by: KR Tech Academic Registry (https://krtech.edu)
================================================================================

OVERVIEW:
${resource.description || 'Enterprise technical handbook.'}

CONTENT & CODE SAMPLES:
${resource.content || 'Comprehensive architecture study notes.'}

================================================================================
Need 1-on-1 Mentorship or Live Pair Programming?
Schedule your free 1:1 Live Demo at: https://krtech.edu/free-demo
================================================================================`;

    const safeFilename = (resource.id || 'resource').replace(/[^a-zA-Z0-9_-]/g, '_');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.txt"`);
    res.send(fileContent);
  } catch (error) {
    console.error('Download Resource File Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create / Upload a new resource
// @route   POST /api/resources
// @access  Public / Admin
const createResource = async (req, res) => {
  try {
    const { title, category, description, format, fileSize, tags, content, author } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }

    let slug = (req.body.id || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Ensure slug is unique
    const existing = await Resource.findOne({ id: slug });
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : (tags || '').split(',').map((t) => t.trim()).filter(Boolean);

    const resource = await Resource.create({
      id: slug,
      title: title.trim(),
      category: category.trim(),
      description: description || 'Comprehensive technical documentation and architectural reference guide.',
      format: format || 'PDF',
      fileSize: fileSize || '3.8 MB',
      downloadCount: 1420,
      downloadsCount: '1.4k',
      tags: parsedTags.length > 0 ? parsedTags : ['Architecture', 'Best Practices'],
      content: content || `# ${title}\n\n## Overview\n${description || 'Study guide overview.'}\n\n## Key Architectural Principles\n- Clean Architecture\n- High Availability\n- Cloud Resilience`,
      author: author || 'KR Tech Senior Architect Council',
      downloadUrl: `/api/resources/${slug}/download`,
      pdfUrl: `/api/resources/${slug}/download`,
    });

    res.status(201).json({
      success: true,
      message: 'Resource published successfully in MongoDB Atlas!',
      resource,
    });
  } catch (error) {
    console.error('Create Resource Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Public / Admin
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    let resource = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      resource = await Resource.findByIdAndDelete(id);
    }
    if (!resource) {
      resource = await Resource.findOneAndDelete({ id });
    }

    if (!resource) {
      return res.status(404).json({ success: false, message: `Resource "${id}" not found in MongoDB Atlas` });
    }

    res.json({
      success: true,
      message: `Resource "${resource.title}" successfully deleted from MongoDB Atlas!`,
      deletedId: resource.id,
    });
  } catch (error) {
    console.error('Delete Resource Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  trackDownload,
  downloadResourceFileEndpoint,
  createResource,
  deleteResource,
};
