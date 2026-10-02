const express = require('express');
const router = express.Router();
const {
  getInvoiceById,
  downloadInvoicePdf,
  getAllInvoices,
} = require('../controllers/invoiceController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getAllInvoices);
router.get('/download/:id', optionalAuth, downloadInvoicePdf);
router.get('/:id', optionalAuth, getInvoiceById);

module.exports = router;
