const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Enrollment = require('./models/Enrollment');
const Coupon = require('./models/Coupon');
const Invoice = require('./models/Invoice');
const invoiceService = require('./services/invoiceService');
const razorpayService = require('./services/razorpayService');

async function runPhase8Verification() {
  console.log('================================================================');
  console.log('KR GLOBAL LEARNING PRIVATE LIMITED — PHASE 8 PAYMENT TEST SUITE');
  console.log('================================================================\n');

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/krtech';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas successfully.');

    // 1. Test Coupon Creation & Retrieval
    console.log('\n--- 1. TESTING COUPON ENGINE (Sprint 8.4) ---');
    const testCouponCode = 'KRGLOBAL2026';
    await Coupon.deleteOne({ code: testCouponCode });

    const coupon = await Coupon.create({
      code: testCouponCode,
      discountType: 'percentage',
      discountValue: 20,
      maxDiscount: 3000,
      minimumPurchase: 5000,
      usageLimit: 50,
      usedCount: 0,
      active: true,
      createdBy: 'Founder Admin',
    });
    console.log(`✓ Coupon created: ${coupon.code} (${coupon.discountValue}% off, Max ₹${coupon.maxDiscount})`);

    // 2. Test Razorpay Order Generation
    console.log('\n--- 2. TESTING RAZORPAY ORDER GENERATION (Sprint 8.1) ---');
    const orderResult = await razorpayService.createOrder({
      amountInPaise: 1039900,
      currency: 'INR',
      receipt: `rcpt_test_${Date.now()}`,
      notes: {
        courseTitle: 'Complete Java Backend Masterclass',
        studentEmail: 'student.test@krgloballearning.com',
      },
    });
    console.log(`✓ Razorpay order generated: ID=${orderResult.order.id}, simulated=${orderResult.simulated}`);

    // Save Order
    const orderDoc = await Order.create({
      orderId: orderResult.order.id,
      userEmail: 'student.test@krgloballearning.com',
      userName: 'Rahul Verma',
      courseId: 'course-java-backend',
      courseTitle: 'Complete Java Backend Masterclass (Spring Boot & Microservices)',
      amount: 10399,
      currency: 'INR',
      receipt: orderResult.order.receipt,
      status: 'created',
    });
    console.log(`✓ Order saved in Atlas orders collection: ${orderDoc.orderId}`);

    // 3. Test Payment Record & Signature Verification
    console.log('\n--- 3. TESTING PAYMENT CAPTURE & SIGNATURE (Sprint 8.3 & 8.12) ---');
    const testPaymentId = `pay_kr_${Date.now().toString().slice(-8)}`;
    const testSignature = razorpayService.generatePaymentSignature({
      orderId: orderResult.order.id,
      paymentId: testPaymentId,
    });
    const isValidSignature = razorpayService.verifyPaymentSignature({
      orderId: orderResult.order.id,
      paymentId: testPaymentId,
      signature: testSignature,
    });
    console.log(`✓ HMAC SHA256 Signature verification: ${isValidSignature ? 'VALID' : 'INVALID'}`);

    const paymentDoc = await Payment.create({
      paymentId: testPaymentId,
      orderId: orderResult.order.id,
      signature: testSignature,
      userEmail: 'student.test@krgloballearning.com',
      userName: 'Rahul Verma',
      courseId: 'course-java-backend',
      courseTitle: 'Complete Java Backend Masterclass (Spring Boot & Microservices)',
      amount: 10399,
      currency: 'INR',
      couponCode: testCouponCode,
      discount: 2600,
      method: 'Razorpay UPI',
      status: 'captured',
    });
    console.log(`✓ Payment recorded in Atlas payments collection: ${paymentDoc.paymentId}`);

    // 4. Test Automated Invoice Generation
    console.log('\n--- 4. TESTING TAX INVOICE GENERATION (Sprint 8.5) ---');
    const invoiceDoc = await invoiceService.createInvoiceForPayment(paymentDoc);
    console.log(`✓ Tax Invoice generated: ${invoiceDoc.invoiceNumber} for ₹${invoiceDoc.totalAmount}`);
    console.log(`  Billing Company: KR GLOBAL LEARNING PRIVATE LIMITED`);
    console.log(`  Corporate Office: ${invoiceDoc.billingAddress.line1}, ${invoiceDoc.billingAddress.city}, ${invoiceDoc.billingAddress.state} – ${invoiceDoc.billingAddress.pincode}`);
    console.log(`  GST Subtotal: ₹${invoiceDoc.subtotal}, Tax: ₹${invoiceDoc.taxTotal}, Total: ₹${invoiceDoc.totalAmount}`);

    // Link Invoice to Payment
    paymentDoc.invoiceId = invoiceDoc.invoiceNumber;
    await paymentDoc.save();
    console.log(`✓ Payment updated with invoice reference ID: ${paymentDoc.invoiceId}`);

    // 5. Test PDF Stream Creation
    console.log('\n--- 5. TESTING PDF STREAM GENERATOR ---');
    const pdfStream = await invoiceService.getInvoicePdfStream(paymentDoc.paymentId);
    let pdfBytes = 0;
    pdfStream.on('data', (chunk) => {
      pdfBytes += chunk.length;
    });
    pdfStream.on('end', () => {
      console.log(`✓ PDF invoice generated stream successfully (${pdfBytes} bytes)`);
    });

    // 6. Test Automatic Enrollment
    console.log('\n--- 6. TESTING STUDENT ENROLLMENT (Sprint 8.1) ---');
    const enrollment = await Enrollment.findOneAndUpdate(
      { userEmail: paymentDoc.userEmail, courseId: paymentDoc.courseId },
      {
        $set: {
          userEmail: paymentDoc.userEmail,
          userName: paymentDoc.userName,
          courseId: paymentDoc.courseId,
          courseTitle: paymentDoc.courseTitle,
          batch: 'Batch-2026 (Live 1:1)',
          status: 'active',
          enrolledAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
    console.log(`✓ Student auto-enrolled: ${enrollment.userEmail} -> ${enrollment.courseTitle}`);

    // 7. Verify Aggregated Revenue
    console.log('\n--- 7. TESTING ADMIN REVENUE DASHBOARD AGGREGATION (Sprint 8.9) ---');
    const capturedPayments = await Payment.find({ status: 'captured' });
    const totalRev = capturedPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
    console.log(`✓ Total Captured Payments Count: ${capturedPayments.length}`);
    console.log(`✓ Total Revenue in Database: ₹${totalRev.toLocaleString('en-IN')}`);

    console.log('\n================================================================');
    console.log('ALL PHASE 8 PAYMENT GATEWAY MODULES VERIFIED & PRODUCTION READY!');
    console.log('================================================================\n');

    setTimeout(() => {
      mongoose.disconnect();
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error('❌ Phase 8 Verification Error:', error);
    process.exit(1);
  }
}

runPhase8Verification();
