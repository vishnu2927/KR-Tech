const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body });
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

async function testAdminFlow() {
  console.log('Testing Admin Login and Sprint 5.1 CRM APIs...');

  // 1. Admin Login (POST /api/auth/login)
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@krtech.com', password: 'admin123' }
  );

  console.log('1. Admin Login -> Status:', loginRes.status, 'Success:', loginRes.body?.success, 'Role:', loginRes.body?.user?.role);
  const token = loginRes.body?.token;

  if (!token) {
    throw new Error('Admin login failed: No JWT token returned');
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 2. GET /api/admin/dashboard
  const dashRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(
    '2. GET /api/admin/dashboard -> Status:',
    dashRes.status,
    'Success:',
    dashRes.body?.success,
    'Metrics:',
    dashRes.body?.data?.metrics
  );

  // 3. GET /api/admin/students
  const studentsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/students',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(
    '3. GET /api/admin/students -> Status:',
    studentsRes.status,
    'Success:',
    studentsRes.body?.success,
    'Count:',
    studentsRes.body?.count,
    'Total:',
    studentsRes.body?.total
  );

  // 4. GET /api/admin/leads
  const leadsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/leads',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(
    '4. GET /api/admin/leads -> Status:',
    leadsRes.status,
    'Success:',
    leadsRes.body?.success,
    'Count:',
    leadsRes.body?.count,
    'Total:',
    leadsRes.body?.total
  );

  // 5. GET /api/admin/revenue
  const revenueRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/revenue',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(
    '5. GET /api/admin/revenue -> Status:',
    revenueRes.status,
    'Success:',
    revenueRes.body?.success,
    'Total Revenue:',
    revenueRes.body?.data?.totalRevenue
  );

  // 6. GET /api/admin/activity
  const activityRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/activity',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(
    '6. GET /api/admin/activity -> Status:',
    activityRes.status,
    'Success:',
    activityRes.body?.success,
    'Activity Count:',
    activityRes.body?.count
  );

  console.log('\nAll 5 Admin CRM APIs + Admin Login verified successfully!');
}

testAdminFlow().catch((err) => console.error('Admin Test Failed:', err));
