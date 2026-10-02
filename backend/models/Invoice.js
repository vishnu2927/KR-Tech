const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    paymentId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    orderId: {
      type: String,
      default: '',
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    customerPhone: {
      type: String,
      default: '',
      trim: true,
    },
    billingAddress: {
      line1: { type: String, default: 'Unit No. 615, Artha Mart, Tech Zone IV' },
      city: { type: String, default: 'Greater Noida West' },
      state: { type: String, default: 'Uttar Pradesh' },
      pincode: { type: String, default: '201318' },
      country: { type: String, default: 'India' },
    },
    items: [
      {
        courseId: { type: String, required: true },
        courseTitle: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        taxRate: { type: Number, default: 18 }, // 18% GST standard
        taxAmount: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    taxTotal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Refunded', 'Void'],
      default: 'Paid',
      index: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay UPI / Online Card / NetBanking',
    },
    pdfDownloadUrl: {
      type: String,
      default: '',
    },
    verificationUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'invoices',
  }
);

invoiceSchema.index({ customerEmail: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
