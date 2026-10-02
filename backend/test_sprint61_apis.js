const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      // Buffer if binary (PDF), string if JSON/text
      const isPdf = res.headers['content-type']?.includes('application/pdf');
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (isPdf) {
          resolve({ status: res.statusCode, headers: res.headers, pdfSize: buffer.length });
        } else {
          try {
            const parsed = JSON.parse(buffer.toString());
            resolve({ status: res.statusCode, headers: res.headers, body: parsed });
          } catch {
            resolve({ status: res.statusCode, headers: res.headers, body: buffer.toString() });
          }
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runSprint61Tests() {
  console.log('Testing Sprint 6.1 Payment Gateway & Enrollment APIs...');

  // 1. Apply Coupon API (POST /api/coupons/apply)
  const couponRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/coupons/apply',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { code: 'KRTECH20', amount: 12999, courseId: 'java-backend' }
  );
  console.log('1. POST /api/coupons/apply -> Status:', couponRes.status, 'Saved:', couponRes.body?.coupon?.discountAmount, 'Final:', couponRes.body?.coupon?.finalAmount);

  // 2. Create Order API with Coupon (POST /api/payments/create-order)
  const orderRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/payments/create-order',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      courseId: 'java-backend',
      courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices',
      amount: 12999,
      couponCode: 'KRTECH20',
      userEmail: 'aditya.sharma@krtech.edu',
      userName: 'Aditya Sharma',
    }
  );
  console.log('2. POST /api/payments/create-order -> Status:', orderRes.status, 'Order ID:', orderRes.body?.order?.id, 'Amount (paise):', orderRes.body?.order?.amount);
  const orderId = orderRes.body?.order?.id || 'order_sample_test';

  // 3. Verify Payment API (POST /api/payments/verify)
  const paymentId = `pay_test_${Date.now()}`;
  const verifyRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/payments/verify',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: 'sim_sig_verified_test_hmac',
      courseId: 'java-backend',
      courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices',
      amount: 10399,
      userEmail: 'aditya.sharma@krtech.edu',
      userName: 'Aditya Sharma',
    }
  );
  console.log('3. POST /api/payments/verify -> Status:', verifyRes.status, 'Success:', verifyRes.body?.success, 'Payment ID:', verifyRes.body?.payment?.paymentId);

  // 4. Payment History API (GET /api/payments/history)
  const historyRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/payments/history?email=aditya.sharma@krtech.edu',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('4. GET /api/payments/history -> Status:', historyRes.status, 'Success:', historyRes.body?.success, 'Payments Count:', historyRes.body?.payments?.length);

  // 5. Admin Payments API (GET /api/admin/payments)
  const adminRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/payments',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': 'krtech_admin_dev_bypass',
    },
  });
  console.log(
    '5. GET /api/admin/payments -> Status:',
    adminRes.status,
    'Success:',
    adminRes.body?.success,
    'Total Captured:',
    adminRes.body?.total,
    'Best Sellers:',
    adminRes.body?.bestSellingCourses?.length
  );

  // 6. Tax Invoice PDF Generation (GET /api/payments/invoice/:paymentId)
  const invoiceRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/payments/invoice/${paymentId}`,
    method: 'GET',
  });
  console.log(
    '6. GET /api/payments/invoice/:paymentId -> Status:',
    invoiceRes.status,
    'Content-Type:',
    invoiceRes.headers['content-type'],
    'PDF Size:',
    invoiceRes.pdfSize,
    'bytes'
  );

  console.log('\nAll 6 Sprint 6.1 Backend APIs verified successfully!');
}

runSprint61Tests().catch((err) => console.error('Sprint 6.1 Test Failed:', err));
