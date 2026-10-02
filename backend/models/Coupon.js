const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: 'Promotional discount on KR Global Learning live mentorship enrollment',
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    maxDiscount: {
      type: Number,
      default: 5000,
    },
    minimumPurchase: {
      type: Number,
      default: 4999,
    },
    minOrderAmount: {
      type: Number,
      default: 4999,
    },
    validCourses: [
      {
        type: String,
        trim: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    usageLimit: {
      type: Number,
      default: 1000,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'coupons',
  }
);

// Sync aliases
couponSchema.pre('save', function (next) {
  if (this.active !== undefined && this.isActive === undefined) {
    this.isActive = this.active;
  } else if (this.isActive !== undefined && this.active === undefined) {
    this.active = this.isActive;
  } else if (this.active !== undefined && this.isActive !== undefined) {
    this.active = this.isActive;
  }

  if (this.minimumPurchase !== undefined && this.minOrderAmount === undefined) {
    this.minOrderAmount = this.minimumPurchase;
  } else if (this.minOrderAmount !== undefined && this.minimumPurchase === undefined) {
    this.minimumPurchase = this.minOrderAmount;
  } else if (this.minOrderAmount !== undefined && this.minimumPurchase !== undefined) {
    this.minOrderAmount = this.minimumPurchase;
  }

  if (this.expiryDate !== undefined && this.expiresAt === undefined) {
    this.expiresAt = this.expiryDate;
  } else if (this.expiresAt !== undefined && this.expiryDate === undefined) {
    this.expiryDate = this.expiresAt;
  } else if (this.expiresAt !== undefined && this.expiryDate !== undefined) {
    this.expiresAt = this.expiryDate;
  }

  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
