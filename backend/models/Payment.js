const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: [true, 'Payment ID is required'],
      unique: true,
      index: true,
      trim: true,
    },
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      index: true,
      trim: true,
    },
    signature: {
      type: String,
      default: '',
      trim: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    userName: {
      type: String,
      default: 'KR Global Learning Student',
      trim: true,
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      trim: true,
      index: true,
    },
    courseName: {
      type: String,
      default: '',
      trim: true,
    },
    courseTitle: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    couponCode: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    gst: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    invoiceId: {
      type: String,
      default: '',
      trim: true,
    },
    invoiceNumber: {
      type: String,
      default: '',
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay UPI/Card/NetBanking',
      trim: true,
    },
    method: {
      type: String,
      default: 'Razorpay UPI/Card/NetBanking',
      trim: true,
    },
    status: {
      type: String,
      enum: ['captured', 'paid', 'created', 'pending', 'failed', 'refunded'],
      default: 'captured',
      index: true,
    },
    refundReason: {
      type: String,
      default: '',
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'payments',
  }
);

// Pre-save hook to ensure studentId/userId and courseName/courseTitle and method/paymentMethod stay in sync
paymentSchema.pre('save', function (next) {
  if (!this.studentId && this.userId) {
    this.studentId = this.userId;
  } else if (!this.userId && this.studentId) {
    this.userId = this.studentId;
  }

  if (!this.courseName && this.courseTitle) {
    this.courseName = this.courseTitle;
  } else if (!this.courseTitle && this.courseName) {
    this.courseTitle = this.courseName;
  }

  if (!this.paymentMethod && this.method) {
    this.paymentMethod = this.method;
  } else if (!this.method && this.paymentMethod) {
    this.method = this.paymentMethod;
  }

  if (!this.gst && this.taxAmount) {
    this.gst = this.taxAmount;
  } else if (!this.taxAmount && this.gst) {
    this.taxAmount = this.gst;
  }

  if (!this.invoiceNumber && this.invoiceId) {
    this.invoiceNumber = this.invoiceId;
  } else if (!this.invoiceId && this.invoiceNumber) {
    this.invoiceId = this.invoiceNumber;
  }

  next();
});

paymentSchema.index({ userEmail: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
