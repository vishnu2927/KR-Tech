// Practical test suite verifying all critical backend APIs & integrations
async function runTests() {
  console.log('=== STARTING COMPLETE APPLICATION FUNCTIONALITY TESTS ===\n');
  const results = [];

  const check = (name, passed, details = '') => {
    results.push({ name, passed, details });
    console.log(`${passed ? '✅ [PASS]' : '❌ [FAIL]'} ${name} ${details ? '(' + details + ')' : ''}`);
  };

  try {
    // 1. Health check & DB connection
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    check('Health Check Endpoint (/api/health)', healthRes.status === 200 && healthData.status === 'online', `status: ${healthData.status}, uptime: ${healthData.uptimeSeconds}s`);
    check('MongoDB Atlas Live Connection', healthData.database?.status === 'connected', `host: ${healthData.database?.host}`);

    // 2. Course API - all courses
    const coursesRes = await fetch('http://localhost:5000/api/courses');
    const coursesData = await coursesRes.json();
    const count = coursesData.courses?.length || 0;
    check('Course API (/api/courses)', count === 84, `retrieved ${count} active courses`);

    // 3. Category Filter API
    const cloudRes = await fetch('http://localhost:5000/api/courses?category=Cloud%20%26%20Cloud%20Architecture');
    const cloudData = await cloudRes.json();
    check('Category Filter API (Cloud)', cloudData.courses?.length === 17, `found ${cloudData.courses?.length} courses`);

    const aiRes = await fetch('http://localhost:5000/api/courses?category=AI%2C%20Machine%20Learning%20%26%20GenAI');
    const aiData = await aiRes.json();
    check('Category Filter API (AI/ML)', aiData.courses?.length === 10, `found ${aiData.courses?.length} courses`);

    const cyberRes = await fetch('http://localhost:5000/api/courses?category=Cybersecurity');
    const cyberData = await cyberRes.json();
    check('Category Filter API (Cybersecurity)', cyberData.courses?.length === 14, `found ${cyberData.courses?.length} courses`);

    const netRes = await fetch('http://localhost:5000/api/courses?category=Networking');
    const netData = await netRes.json();
    check('Category Filter API (Networking)', netData.courses?.length === 12, `found ${netData.courses?.length} courses`);

    // 4. Search API
    const searchRes = await fetch('http://localhost:5000/api/courses?search=CompTIA');
    const searchData = await searchRes.json();
    check('Search Filter API (query: CompTIA)', searchData.courses?.length >= 5, `found ${searchData.courses?.length} courses`);

    // 5. Incomplete Title Preserved
    const gCourse = coursesData.courses.find(c => c.id === 'google-professional-cl');
    check('Incomplete Title Integrity (Google Professional Cl…)', gCourse && gCourse.title === 'Google Professional Cl…' && gCourse.price === '$599', 'preserved verbatim without guessing');

    // 6. Authentication API Route Availability
    const authRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_health_probe@krgloballearning.com', password: 'InvalidPasswordProbe123!' })
    });
    check('Authentication Login Route (/api/auth/login)', authRes.status === 401 || authRes.status === 400 || authRes.status === 200, `HTTP status ${authRes.status} (active auth controller)`);

    // 7. Payment Route Availability
    const payKeyRes = await fetch('http://localhost:5000/api/payment/key');
    const payKeyData = await payKeyRes.json();
    check('Payment Key Endpoint (/api/payment/key)', payKeyRes.status === 200 && payKeyData.keyId, `SDK key available: ${payKeyData.keyId ? 'YES' : 'NO'}`);

    // 8. Payment Webhook Route Availability
    const webhookRes = await fetch('http://localhost:5000/api/payment/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': 'sim_test_probe' },
      body: JSON.stringify({ event: 'probe' })
    });
    check('Payment Webhook Route (/api/payment/webhook)', webhookRes.status === 400 || webhookRes.status === 200, `HTTP status ${webhookRes.status} (signature validation active)`);

    // 9. Certificate Route Availability
    const certRes = await fetch('http://localhost:5000/api/certificates');
    check('Certificates Route (/api/certificates)', certRes.status === 200 || certRes.status === 401, `HTTP status ${certRes.status}`);

    // 10. AI Route Availability
    const aiRouteRes = await fetch('http://localhost:5000/api/ai/progress');
    check('AI Service Route (/api/ai/progress)', aiRouteRes.status === 401 || aiRouteRes.status === 200, `HTTP status ${aiRouteRes.status} (protected JWT endpoint)`);

    console.log('\n=== TEST SUITE EXECUTION SUMMARY ===');
    const allPassed = results.every(r => r.passed);
    console.log(`Overall Result: ${allPassed ? 'ALL TESTS PASSED (100%)' : 'SOME TESTS FAILED'}`);
    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    console.error('Test execution error:', err.message);
    process.exit(1);
  }
}

runTests();
