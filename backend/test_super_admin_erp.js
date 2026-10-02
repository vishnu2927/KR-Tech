const http = require('http');

const endpoints = [
  { name: '11.1 Dashboard', path: '/api/super-admin/dashboard' },
  { name: '11.2 Students CRM', path: '/api/super-admin/students' },
  { name: '11.3 Courses', path: '/api/super-admin/courses' },
  { name: '11.5 Live Classes', path: '/api/super-admin/live-classes' },
  { name: '11.6 Assignments', path: '/api/super-admin/assignments' },
  { name: '11.7 Certificates', path: '/api/super-admin/certificates' },
  { name: '11.8 Payment CRM', path: '/api/super-admin/payments' },
  { name: '11.9 Email CRM', path: '/api/super-admin/email-crm' },
  { name: '11.10 Support Tickets', path: '/api/super-admin/support' },
  { name: '11.11 Content Library', path: '/api/super-admin/content' },
  { name: '11.12 Analytics Center', path: '/api/super-admin/analytics' },
  { name: '11.13 Role Management', path: '/api/super-admin/roles' },
  { name: '11.14 Company Settings', path: '/api/super-admin/settings' },
  { name: '11.15 Activity Logs', path: '/api/super-admin/activity-logs' },
];

function testEndpoint(ep) {
  return new Promise((resolve) => {
    http.get(
      'http://localhost:5000' + ep.path,
      { headers: { 'x-admin-key': 'krtech_admin_dev_bypass' } },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch (e) {}
          const ok = res.statusCode === 200 && parsed?.success;
          console.log(`[${ok ? 'PASS' : 'FAIL'}] ${ep.name} -> HTTP ${res.statusCode} (success: ${parsed?.success})`);
          resolve({ ...ep, status: res.statusCode, ok });
        });
      }
    ).on('error', (err) => {
      console.log(`[ERR] ${ep.name} -> ${err.message}`);
      resolve({ ...ep, error: err.message, ok: false });
    });
  });
}

async function runAll() {
  console.log('--- TESTING SUPER ADMIN ERP ENDPOINTS ---');
  let passCount = 0;
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    if (res.ok) passCount++;
  }
  console.log(`\nRESULTS: ${passCount} / ${endpoints.length} endpoints passed.`);
}

runAll();
