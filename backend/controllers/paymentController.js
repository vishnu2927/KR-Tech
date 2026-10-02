const mongoose = require('mongoose');
const razorpayService = require('../services/razorpayService');
const invoiceService = require('../services/invoiceService');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { createInvoicePdfStream } = require('../utils/pdfInvoiceGenerator');
const { sendPaymentSuccessEmail } = require('../services/emailService');
const { sendPaymentSuccessWA } = require('../services/whatsappService');

// @desc    Get Razorpay Public Key ID
// @route   GET /api/payment/key
// @access  Public
const getRazorpayKey = (req, res) => {
  res.json({
    success: true,
    keyId: razorpayService.getKeyId(),
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Public (or Protected)
const createOrder = async (req, res) => {
  try {
    const { courseId, courseTitle, amount, currency = 'INR', userEmail, userName } = req.body;

    if (!courseId || !courseTitle || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Course ID, Course Title, and Amount are required to generate an order.',
      });
    }

    const numericAmount = Number(amount);
    let finalAmount = numericAmount;
    let appliedDiscount = 0;
    let appliedCouponCode = null;

    if (req.body.couponCode) {
      const cleanCoupon = String(req.body.couponCode).toUpperCase().trim();
      const coupon = await Coupon.findOne({ code: cleanCoupon, isActive: true });
      if (coupon && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
        if (!coupon.minOrderAmount || numericAmount >= coupon.minOrderAmount) {
          if (coupon.discountType === 'percentage') {
            appliedDiscount = Math.round((numericAmount * coupon.discountValue) / 100);
            if (coupon.maxDiscount && appliedDiscount > coupon.maxDiscount) {
              appliedDiscount = coupon.maxDiscount;
            }
          } else {
            appliedDiscount = coupon.discountValue;
          }
          appliedDiscount = Math.min(appliedDiscount, numericAmount);
          finalAmount = Math.max(1, numericAmount - appliedDiscount);
          appliedCouponCode = coupon.code;
          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
        }
      }
    }

    const amountInPaise = Math.round(finalAmount * 100);
    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;
    const studentEmail = (userEmail || (req.user && req.user.email) || 'student@krtech.edu').toLowerCase().trim();
    const studentName = userName || (req.user && req.user.name) || 'KR Tech Student';

    // Generate Order via Razorpay Service
    const { order: rzpOrder, simulated } = await razorpayService.createOrder({
      amountInPaise,
      currency,
      receipt,
      notes: {
        courseId: String(courseId),
        courseTitle: String(courseTitle),
        studentEmail,
        couponCode: appliedCouponCode || 'NONE',
        discount: String(appliedDiscount),
      },
    });

    // Save Order into MongoDB Atlas
    const orderDoc = await Order.create({
      orderId: rzpOrder.id,
      userId: req.user ? req.user._id : null,
      userEmail: studentEmail,
      userName: studentName,
      courseId: String(courseId),
      courseTitle: String(courseTitle),
      amount: numericAmount,
      currency,
      receipt,
      status: 'created',
    });

    res.status(201).json({
      success: true,
      message: 'Razorpay order created successfully',
      order: rzpOrder,
      orderDoc,
      keyId: razorpayService.getKeyId(),
      simulated,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating Razorpay order',
    });
  }
};

// @desc    Verify Razorpay Payment Signature & Enroll Student
// @route   POST /api/payment/verify
// @access  Public (or Protected)
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      courseTitle,
      amount,
      userEmail,
      userName,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment ID are required for verification.',
      });
    }

    // Cryptographic signature verification via Razorpay Service
    const isValidSignature = razorpayService.verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Razorpay payment signature. Payment verification failed.',
      });
    }

    const studentEmail = (userEmail || (req.user && req.user.email) || 'student@krtech.edu').toLowerCase().trim();
    const studentName = userName || (req.user && req.user.name) || 'KR Tech Student';
    const numericAmount = Number(amount) || 12999;
    const finalCourseId = String(courseId || 'course-enrolled');
    const finalCourseTitle = String(courseTitle || 'KR Tech Live Mentorship Program');

    // 1. Save or Update Payment Record in MongoDB Atlas
    let paymentDoc = await Payment.findOne({ paymentId: razorpay_payment_id });
    if (!paymentDoc) {
      paymentDoc = await Payment.create({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature || 'verified_hmac_sha256',
        userId: req.user ? req.user._id : null,
        userEmail: studentEmail,
        userName: studentName,
        courseId: finalCourseId,
        courseTitle: finalCourseTitle,
        amount: numericAmount,
        currency: 'INR',
        method: 'Razorpay UPI/Card/NetBanking',
        status: 'captured',
      });
    }

    // 2. Update Order status to 'paid' in MongoDB Atlas
    await Order.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'paid' },
      { new: true }
    );

    // 3. Upsert into MongoDB Atlas 'enrollments' Collection
    await Enrollment.findOneAndUpdate(
      { userEmail: studentEmail, courseId: finalCourseId },
      {
        $set: {
          userEmail: studentEmail,
          userName: studentName,
          courseId: finalCourseId,
          courseTitle: finalCourseTitle,
          category: req.body.category || 'Software Engineering',
          mentor: req.body.mentor || 'Senior Technical Architect',
          batch: req.body.batch || 'Batch-2026 (Live 1:1)',
          status: 'active',
          enrolledAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // 4. Auto-Enroll Student into User Account Document
    let user = null;
    if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    } else if (studentEmail) {
      user = await User.findOne({ email: studentEmail });
    }

    let isNewlyEnrolled = false;
    if (user) {
      const alreadyEnrolled = (user.enrolledCourses || []).some(
        (c) => c.courseId === finalCourseId || c.title.toLowerCase() === finalCourseTitle.toLowerCase()
      );

      if (!alreadyEnrolled) {
        user.enrolledCourses.push({
          courseId: finalCourseId,
          title: finalCourseTitle,
          progress: 5,
          enrolledAt: new Date(),
        });
        await user.save();
        isNewlyEnrolled = true;
      }
    }

    // 5. Auto-Generate Official Tax Invoice in MongoDB Atlas
    let invoiceDoc = null;
    try {
      invoiceDoc = await invoiceService.createInvoiceForPayment(paymentDoc);
      if (invoiceDoc && invoiceDoc.invoiceNumber) {
        paymentDoc.invoiceId = invoiceDoc.invoiceNumber;
        await paymentDoc.save();
      }
    } catch (invErr) {
      console.warn('Auto invoice creation notice:', invErr.message);
    }

    // 6. Trigger automated Payment Success email & WhatsApp confirmation
    sendPaymentSuccessEmail(paymentDoc).catch((mailErr) => {
      console.warn('Payment Success Email Dispatch Notice:', mailErr.message);
    });

    const studentPhone = req.body.phone || req.body.userPhone || (user && user.phone);
    if (studentPhone) {
      sendPaymentSuccessWA({
        phone: studentPhone,
        name: studentName,
        courseTitle: paymentDoc.courseTitle,
        amount: paymentDoc.amount,
        paymentId: paymentDoc.paymentId,
        orderId: paymentDoc.orderId,
      }).catch((waErr) => {
        console.warn('Payment Success WhatsApp Dispatch Notice:', waErr.message);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and student enrolled successfully in MongoDB Atlas!',
      payment: paymentDoc,
      invoice: invoiceDoc,
      invoiceId: invoiceDoc ? invoiceDoc.invoiceNumber : paymentDoc.invoiceId,
      enrolled: isNewlyEnrolled,
      courseTitle: paymentDoc.courseTitle,
      receiptNumber: paymentDoc._id,
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error verifying Razorpay payment',
    });
  }
};

// @desc    Get Authenticated Student Payments & Orders History
// @route   GET /api/payment/my-payments
// @access  Private / Optional Session
const getMyPayments = async (req, res) => {
  try {
    const studentEmail = (
      req.user?.email ||
      req.query?.email ||
      'aditya.sharma@krtech.edu'
    ).toLowerCase().trim();

    const [payments, orders, enrollments] = await Promise.all([
      Payment.find({ userEmail: studentEmail }).sort({ createdAt: -1 }),
      Order.find({ userEmail: studentEmail }).sort({ createdAt: -1 }),
      Enrollment.find({ userEmail: studentEmail }).sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      count: payments.length,
      payments,
      orders,
      enrollments,
    });
  } catch (error) {
    console.error('Get My Payments Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Payments (Admin CRM)
// @route   GET /api/payment/all
// @access  Private/Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Get All Payments Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Aggregated Payment Analytics & Revenue (Admin)
// @route   GET /api/payment/stats
// @access  Private/Admin
const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments({ status: 'captured' });
    const payments = await Payment.find({ status: 'captured' });
    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const totalOrders = await Order.countDocuments();
    const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalPayments,
        totalOrders,
        purchasedCoursesCount: totalPayments,
        currency: 'INR',
        recentPayments,
      },
    });
  } catch (error) {
    console.error('Get Payment Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Razorpay Webhook Handler
// @route   POST /api/payment/webhook
// @access  Public (Signature Verified)
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const isValid = razorpayService.verifyWebhookSignature({
      rawBody: req.body,
      signature,
    });

    if (process.env.RAZORPAY_WEBHOOK_SECRET && !isValid) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' && payload && payload.payment) {
      const rzpPayment = payload.payment.entity;
      await Payment.findOneAndUpdate(
        { paymentId: rzpPayment.id },
        {
          paymentId: rzpPayment.id,
          orderId: rzpPayment.order_id,
          amount: rzpPayment.amount / 100,
          currency: rzpPayment.currency,
          userEmail: rzpPayment.email,
          status: 'captured',
        },
        { upsert: true, new: true }
      );
    }

    res.json({ status: 'ok', received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download Official Tax Invoice PDF
// @route   GET /api/payments/invoice/:paymentId
// @access  Public / OptionalAuth
const downloadInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params;
    let payment = await Payment.findOne({
      $or: [
        { paymentId },
        { orderId: paymentId },
        { _id: mongoose.Types.ObjectId.isValid(paymentId) ? paymentId : null },
      ],
    });

    if (!payment) {
      payment = {
        paymentId: paymentId || 'pay_sample_2026',
        orderId: 'order_sample_2026',
        userName: req.user?.name || 'Student Engineer',
        userEmail: req.user?.email || 'student@krtech.edu',
        courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices',
        amount: 12999,
        createdAt: new Date(),
      };
    }

    const doc = await createInvoicePdfStream(payment);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="KRTech_Invoice_${payment.paymentId}.pdf"`
    );

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('Invoice PDF Download Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Admin Payments & Orders with Analytics
// @route   GET /api/admin/payments
// @access  Private (Admin Role)
const getAdminPayments = async (req, res) => {
  try {
    const { search = '', status = '', page = 1, limit = 50 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { courseTitle: { $regex: search, $options: 'i' } },
        { paymentId: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    const [payments, totalPayments, orders, totalOrders, coupons] = await Promise.all([
      Payment.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Payment.countDocuments(query),
      Order.find().sort({ createdAt: -1 }).limit(20),
      Order.countDocuments(),
      Coupon.find().sort({ usedCount: -1 }).limit(10),
    ]);

    // Aggregate monthly revenue
    const monthlyRevenueAgg = await Payment.aggregate([
      { $match: { status: 'captured' } },
      {
        $group: {
          _id: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate Best-Selling Courses
    const bestSellingCourses = await Payment.aggregate([
      { $match: { status: 'captured' } },
      {
        $group: {
          _id: '$courseTitle',
          totalRevenue: { $sum: '$amount' },
          enrollments: { $sum: 1 },
        },
      },
      { $sort: { enrollments: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      count: payments.length,
      total: totalPayments,
      totalOrders,
      payments,
      orders,
      monthlyRevenue: monthlyRevenueAgg.map((m) => ({
        month: m._id,
        revenue: m.revenue,
        orders: m.count,
      })),
      bestSellingCourses: bestSellingCourses.map((b) => ({
        courseTitle: b._id,
        revenue: b.totalRevenue,
        enrollments: b.enrollments,
      })),
      couponAnalytics: {
        totalCoupons: coupons.length,
        coupons,
      },
    });
  } catch (error) {
    console.error('Get Admin Payments Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Payment by ID (orderId, paymentId, or Mongo _id)
// @route   GET /api/payments/:id
// @access  OptionalAuth / Admin
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({
      $or: [
        { paymentId: id },
        { orderId: id },
        { invoiceId: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `Payment record not found for "${id}"`,
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Get Payment By ID Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Revenue Breakdown (Admin CRM)
// @route   GET /api/admin/payments/revenue
// @access  Private/Admin
const getRevenueAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [allPayments, todayPayments, monthlyPayments] = await Promise.all([
      Payment.find({ status: 'captured' }),
      Payment.find({ status: 'captured', createdAt: { $gte: today } }),
      Payment.find({ status: 'captured', createdAt: { $gte: firstDayOfMonth } }),
    ]);

    const totalRevenue = allPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const todayRevenue = todayPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const monthlyRevenue = monthlyPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

    // Monthly breakdown
    const trend = await Payment.aggregate([
      { $match: { status: 'captured' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      todayRevenue,
      monthlyRevenue,
      totalRevenue,
      successfulPayments: allPayments.length,
      trend,
    });
  } catch (error) {
    console.error('Get Revenue Analytics Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Recent Payments (Admin CRM)
// @route   GET /api/admin/payments/recent
// @access  Private/Admin
const getRecentPayments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '10');
    const recent = await Payment.find().sort({ createdAt: -1 }).limit(limit);
    res.json({
      success: true,
      count: recent.length,
      payments: recent,
    });
  } catch (error) {
    console.error('Get Recent Payments Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRazorpayKey,
  createOrder,
  verifyPayment,
  getMyPayments,
  getPaymentHistory: getMyPayments,
  getAllPayments,
  getPaymentById,
  getPaymentStats,
  getAdminPayments,
  getRevenueAnalytics,
  getRecentPayments,
  downloadInvoice,
  handleWebhook,
};
