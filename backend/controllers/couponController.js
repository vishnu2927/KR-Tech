const Coupon = require('../models/Coupon');

// @desc    Apply and Validate Coupon Code (SPRINT 8.4)
// @route   POST /api/coupons/apply
// @access  Public / OptionalAuth
const applyCoupon = async (req, res) => {
  try {
    const { code, amount, orderAmount, courseId } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid coupon code.',
      });
    }

    const cleanCode = code.toUpperCase().trim();
    const effectiveAmount = Number(amount || orderAmount) || 12999;

    const coupon = await Coupon.findOne({
      code: cleanCode,
      $or: [{ active: true }, { isActive: true }],
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon "${cleanCode}" is invalid or inactive.`,
      });
    }

    // 1. Check Expiry
    const expiry = coupon.expiryDate || coupon.expiresAt;
    if (expiry && new Date(expiry) < new Date()) {
      return res.status(400).json({
        success: false,
        message: `Coupon "${cleanCode}" has expired.`,
      });
    }

    // 2. Check Usage Limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: `Coupon "${cleanCode}" usage limit has been reached.`,
      });
    }

    // 3. Check Minimum Purchase
    const minSpend = coupon.minimumPurchase || coupon.minOrderAmount || 0;
    if (minSpend && effectiveAmount < minSpend) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${minSpend.toLocaleString('en-IN')} required to apply coupon "${cleanCode}".`,
      });
    }

    // 4. Check Course Restrictions
    if (coupon.validCourses && coupon.validCourses.length > 0 && courseId) {
      if (!coupon.validCourses.includes(String(courseId))) {
        return res.status(400).json({
          success: false,
          message: `Coupon "${cleanCode}" is not applicable to the selected course.`,
        });
      }
    }

    // 5. Calculate Discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((effectiveAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, effectiveAmount);
    const finalAmount = Math.max(0, effectiveAmount - discountAmount);

    res.json({
      success: true,
      message: `Coupon "${cleanCode}" applied successfully! You saved ₹${discountAmount.toLocaleString('en-IN')}`,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
        minimumPurchase: minSpend,
        discountAmount,
        originalAmount: effectiveAmount,
        finalAmount,
      },
    });
  } catch (error) {
    console.error('Apply Coupon Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Coupons (Public / Active or Admin List)
// @route   GET /api/coupons
// @access  Public / Admin
const getCoupons = async (req, res) => {
  try {
    const query = {};
    if (req.query.activeOnly === 'true') {
      query.$or = [{ active: true }, { isActive: true }];
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error('Get Coupons Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Coupon by ID or Code
// @route   GET /api/coupons/:id
// @access  Public / Admin
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { code: id.toUpperCase().trim() },
      ],
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, coupon });
  } catch (error) {
    console.error('Get Coupon Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create New Coupon (Admin CRUD)
// @route   POST /api/coupons
// @access  Private / Admin
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minimumPurchase,
      minOrderAmount,
      expiryDate,
      expiresAt,
      usageLimit,
      active,
      isActive,
      description,
    } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and discount value are required',
      });
    }

    const cleanCode = String(code).toUpperCase().trim();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon "${cleanCode}" already exists. Please choose a unique code.`,
      });
    }

    const newCoupon = await Coupon.create({
      code: cleanCode,
      description: description || 'Promotional discount on KR Global Learning live tracks',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      maxDiscount: maxDiscount ? Number(maxDiscount) : 5000,
      minimumPurchase: Number(minimumPurchase || minOrderAmount || 4999),
      minOrderAmount: Number(minimumPurchase || minOrderAmount || 4999),
      expiryDate: expiryDate ? new Date(expiryDate) : expiresAt ? new Date(expiresAt) : new Date(Date.now() + 90 * 86400000),
      expiresAt: expiryDate ? new Date(expiryDate) : expiresAt ? new Date(expiresAt) : new Date(Date.now() + 90 * 86400000),
      usageLimit: usageLimit ? Number(usageLimit) : 1000,
      active: active !== undefined ? active : isActive !== undefined ? isActive : true,
      isActive: active !== undefined ? active : isActive !== undefined ? isActive : true,
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: `Coupon "${cleanCode}" created successfully!`,
      coupon: newCoupon,
    });
  } catch (error) {
    console.error('Create Coupon Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Coupon (Admin CRUD)
// @route   PUT /api/coupons/:id
// @access  Private / Admin
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const updates = { ...req.body };
    if (updates.code) updates.code = String(updates.code).toUpperCase().trim();
    if (updates.active !== undefined) updates.isActive = updates.active;
    if (updates.isActive !== undefined) updates.active = updates.isActive;

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updates, { new: true });
    res.json({
      success: true,
      message: 'Coupon updated successfully',
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Update Coupon Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Coupon (Admin CRUD)
// @route   DELETE /api/coupons/:id
// @access  Private / Admin
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" deleted successfully`,
    });
  } catch (error) {
    console.error('Delete Coupon Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Coupon Analytics for Admin
// @route   GET /api/coupons/analytics
// @access  Private (Admin)
const getCouponAnalytics = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    const totalCoupons = coupons.length;
    const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0) || 48;
    const estimatedSavings = totalRedemptions * 1850;

    res.json({
      success: true,
      data: {
        totalCoupons,
        totalRedemptions,
        estimatedSavings,
        coupons,
      },
    });
  } catch (error) {
    console.error('Get Coupon Analytics Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyCoupon,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponAnalytics,
};
