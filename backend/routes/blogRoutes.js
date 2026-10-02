const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} = require('../controllers/blogController');

router.get('/', getBlogs);
router.post('/', createBlog);
router.get('/:slug', getBlogBySlug);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/:id/like', likeBlog);

module.exports = router;
