const Invoice = require('../models/Invoice');
const invoiceService = require('../services/invoiceService');

// @desc    Get Invoice Metadata by ID or Payment ID
// @route   GET /api/invoices/:id
// @access  Public / OptionalAuth
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { invoiceNumber: id },
        { paymentId: id },
        { orderId: id },
      ],
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: `Invoice not found for reference "${id}"`,
      });
    }

    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error('Get Invoice Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Stream Invoice PDF Download
// @route   GET /api/invoices/download/:id
// @access  Public / OptionalAuth
const downloadInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await invoiceService.getInvoicePdfStream(id);

    const safeFilename = `KR_Global_Learning_Invoice_${id.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('Download Invoice Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice PDF stream',
    });
  }
};

// @desc    Get All Invoices (Admin / Student)
// @route   GET /api/invoices
// @access  OptionalAuth / Admin
const getAllInvoices = async (req, res) => {
  try {
    const query = {};
    if (req.query.email) {
      query.customerEmail = req.query.email.toLowerCase().trim();
    } else if (req.user && req.user.role !== 'admin') {
      query.customerEmail = req.user.email.toLowerCase().trim();
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error('Get All Invoices Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInvoiceById,
  downloadInvoicePdf,
  getAllInvoices,
};
