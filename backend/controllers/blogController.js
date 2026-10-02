const mongoose = require('mongoose');
const Blog = require('../models/Blog');

/**
 * Generate URL-friendly slug from title
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate read time based on word count
 */
const calculateReadTime = (content = '') => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// @desc    Get all blogs with category, tag, and search query filters
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const { category, tag, search, status = 'published' } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (tag && tag.trim()) {
      query.tags = { $in: [new RegExp(tag.trim(), 'i')] };
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const blogs = await Blog.find(query).sort({ publishedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error('Get Blogs Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog post by slug or ID (increments views counter)
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let blog = null;

    // 1. Try finding by slug
    blog = await Blog.findOne({ slug: slug.toLowerCase() });

    // 2. Try finding by ObjectId
    if (!blog && mongoose.Types.ObjectId.isValid(slug)) {
      blog = await Blog.findById(slug);
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: `Blog post "${slug}" not found in Atlas` });
    }

    // Atomically increment views counter
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    // Fetch up to 3 related articles from same category
    const relatedBlogs = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
      status: 'published',
    })
      .limit(3)
      .select('title slug excerpt category featuredImage readTime publishedAt');

    res.json({
      success: true,
      blog,
      relatedBlogs,
    });
  } catch (error) {
    console.error('Get Blog By Slug Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new blog article
// @route   POST /api/blogs
// @access  Public / Admin
const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      category = 'Backend Engineering',
      tags,
      featuredImage,
      author,
      seo,
      status = 'published',
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    let slug = req.body.slug ? generateSlug(req.body.slug) : generateSlug(title);
    if (!slug) slug = `blog-${Date.now()}`;

    // Ensure slug is unique
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Engineering', 'Architecture'];

    const computedExcerpt = excerpt && excerpt.trim()
      ? excerpt.trim()
      : content.replace(/<[^>]*>?/gm, '').replace(/[#*`_]/g, '').slice(0, 160) + '...';

    const readTime = calculateReadTime(content);

    // Auto-generate SEO if missing
    const seoData = {
      metaTitle: seo?.metaTitle || `${title} | KR Tech Engineering Blog`,
      metaDescription: seo?.metaDescription || computedExcerpt,
      canonicalUrl: seo?.canonicalUrl || `https://krtech.edu/blogs/${slug}`,
      keywords: seo?.keywords?.length ? seo.keywords : parsedTags,
    };

    const blog = await Blog.create({
      title: title.trim(),
      slug,
      excerpt: computedExcerpt,
      content,
      category: category.trim(),
      tags: parsedTags,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop&auto=format',
      author: author || {
        name: 'Rajesh Kumar',
        role: 'Senior Technical Architect · Principal Technical Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&auto=format',
      },
      readTime,
      views: 120,
      likes: 18,
      status,
      publishedAt: new Date(),
      seo: seoData,
    });

    res.status(201).json({
      success: true,
      message: 'Blog article published successfully to MongoDB Atlas!',
      blog,
    });
  } catch (error) {
    console.error('Create Blog Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing blog article
// @route   PUT /api/blogs/:id
// @access  Public / Admin
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      author,
      seo,
      status,
    } = req.body;

    if (title) blog.title = title.trim();
    if (content) {
      blog.content = content;
      blog.readTime = calculateReadTime(content);
    }
    if (excerpt) blog.excerpt = excerpt.trim();
    if (category) blog.category = category.trim();
    if (featuredImage) blog.featuredImage = featuredImage;
    if (status) blog.status = status;
    if (author) blog.author = { ...blog.author, ...author };

    if (tags) {
      blog.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : blog.tags;
    }

    if (seo) {
      blog.seo = {
        metaTitle: seo.metaTitle || blog.seo?.metaTitle || `${blog.title} | KR Tech Engineering Blog`,
        metaDescription: seo.metaDescription || blog.seo?.metaDescription || blog.excerpt,
        canonicalUrl: seo.canonicalUrl || blog.seo?.canonicalUrl || `https://krtech.edu/blogs/${blog.slug}`,
        keywords: seo.keywords || blog.seo?.keywords || blog.tags,
      };
    }

    await blog.save();

    res.json({
      success: true,
      message: 'Blog article updated successfully in Atlas!',
      blog,
    });
  } catch (error) {
    console.error('Update Blog Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a blog article
// @route   DELETE /api/blogs/:id
// @access  Public / Admin
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findByIdAndDelete(id);
    }
    if (!blog) {
      blog = await Blog.findOneAndDelete({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    res.json({
      success: true,
      message: `Blog article "${blog.title}" successfully deleted from MongoDB Atlas!`,
      deletedSlug: blog.slug,
    });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like a blog article (increments likes)
// @route   POST /api/blogs/:id/like
// @access  Public
const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    blog.likes = (blog.likes || 0) + 1;
    await blog.save();

    res.json({
      success: true,
      likes: blog.likes,
      message: 'Article liked!',
    });
  } catch (error) {
    console.error('Like Blog Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
};
