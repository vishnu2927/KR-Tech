const uniqueId = Date.now();
const testEmail = `auth_test_${uniqueId}@krtech.edu`;
const testPhone = `98765${String(uniqueId).slice(-5)}`; // 10 digits
const testPassword = 'Password123#Secure';

const BASE_URL = 'http://localhost:5173/api/auth';

async function runAuthHardeningTests() {
  console.log('==================================================');
  console.log('AUTHENTICATION HARDENING COMPREHENSIVE TEST SUITE');
  console.log('==================================================\n');

  let allPassed = true;

  // 1. TEST A: Register fresh account (Email A, Phone P)
  console.log('[TEST A] Register Fresh Account (email: ' + testEmail + ')');
  const resA = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Auth Test User',
      email: testEmail,
      phone: testPhone,
      password: testPassword,
      role: 'admin', // Attempt privilege escalation in payload
    }),
  });
  const dataA = await resA.json();
  const passA = resA.status === 201 && dataA.success && dataA.user.role === 'student';
  console.log(`Result: Status ${resA.status}, Role assigned: '${dataA.user?.role}' -> ${passA ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passA) allPassed = false;

  // 2. TEST B: Duplicate Email with Different Phone
  console.log('\n[TEST B] Duplicate Email (Same Email, Different Phone)');
  const resB = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Duplicate Email User',
      email: testEmail,
      phone: `91111${String(uniqueId).slice(-5)}`,
      password: testPassword,
    }),
  });
  const dataB = await resB.json();
  const passB = resB.status === 409 && dataB.message.includes('email');
  console.log(`Result: Status ${resB.status}, Message: '${dataB.message}' -> ${passB ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passB) allPassed = false;

  // 3. TEST C: Duplicate Phone with Different Email
  console.log('\n[TEST C] Duplicate Phone (Different Email, Same Phone)');
  const resC = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Duplicate Phone User',
      email: `diff_${uniqueId}@krtech.edu`,
      phone: testPhone,
      password: testPassword,
    }),
  });
  const dataC = await resC.json();
  const passC = resC.status === 409 && dataC.message.includes('phone');
  console.log(`Result: Status ${resC.status}, Message: '${dataC.message}' -> ${passC ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passC) allPassed = false;

  // 4. TEST D: Case-Insensitive Email Duplicate
  console.log('\n[TEST D] Case-Insensitive Email Duplicate (' + testEmail.toUpperCase() + ')');
  const resD = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Case Test User',
      email: testEmail.toUpperCase(),
      phone: `92222${String(uniqueId).slice(-5)}`,
      password: testPassword,
    }),
  });
  const dataD = await resD.json();
  const passD = resD.status === 409 && dataD.message.includes('email');
  console.log(`Result: Status ${resD.status}, Message: '${dataD.message}' -> ${passD ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passD) allPassed = false;

  // 5. TEST E: Equivalent Phone Normalization Duplicate (+91 with spaces)
  console.log('\n[TEST E] Equivalent Phone Normalization Duplicate (+91 ' + testPhone.slice(0, 5) + ' ' + testPhone.slice(5) + ')');
  const resE = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Phone Norm User',
      email: `diff2_${uniqueId}@krtech.edu`,
      phone: `+91 ${testPhone.slice(0, 5)} ${testPhone.slice(5)}`,
      password: testPassword,
    }),
  });
  const dataE = await resE.json();
  const passE = resE.status === 409 && dataE.message.includes('phone');
  console.log(`Result: Status ${resE.status}, Message: '${dataE.message}' -> ${passE ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passE) allPassed = false;

  // 6. TEST F: Valid Login
  console.log('\n[TEST F] Valid Login with Correct Credentials');
  const resF = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const dataF = await resF.json();
  const token = dataF.token;
  const refreshToken = dataF.refreshToken;
  const passF = resF.status === 200 && dataF.success && Boolean(token) && !dataF.user.password;
  console.log(`Result: Status ${resF.status}, Auth token received, Password not exposed -> ${passF ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passF) allPassed = false;

  // 7. TEST G: Login with Wrong Password
  console.log('\n[TEST G] Login with Wrong Password');
  const resG = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'WrongPassword!',
    }),
  });
  const dataG = await resG.json();
  const passG = resG.status === 401 && dataG.message === 'Invalid email or password';
  console.log(`Result: Status ${resG.status}, Generic error message -> ${passG ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passG) allPassed = false;

  // 8. TEST H: Login with Nonexistent Email
  console.log('\n[TEST H] Login with Nonexistent Email');
  const resH = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nonexistent_user_9999999@krtech.edu',
      password: testPassword,
    }),
  });
  const dataH = await resH.json();
  const passH = resH.status === 401 && dataH.message === 'Invalid email or password';
  console.log(`Result: Status ${resH.status}, Generic error message (Anti-Enumeration) -> ${passH ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passH) allPassed = false;

  // 9. TEST I & J: Session & Profile Access with Valid Token
  console.log('\n[TEST I & J] Profile Access (GET /api/auth/profile)');
  const resProfile = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const dataProfile = await resProfile.json();
  const passProfile = resProfile.status === 200 && dataProfile.user?.email === testEmail.toLowerCase();
  console.log(`Result: Status ${resProfile.status}, User verified: ${dataProfile.user?.name} -> ${passProfile ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passProfile) allPassed = false;

  // 10. TEST K: Admin Authorization Security (Student user attempting Admin route)
  console.log('\n[TEST K] Admin Route Protection (Student trying to access GET /api/auth/students)');
  const resAdmin = await fetch(`${BASE_URL}/students`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const passAdmin = resAdmin.status === 403;
  console.log(`Result: Status ${resAdmin.status} (Forbidden) -> ${passAdmin ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passAdmin) allPassed = false;

  // 11. TEST L: Refresh Token Handling
  console.log('\n[TEST L] Refresh Token Exchange (POST /api/auth/refresh-token)');
  const resRefresh = await fetch(`${BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const dataRefresh = await resRefresh.json();
  const passRefresh = resRefresh.status === 200 && Boolean(dataRefresh.token);
  console.log(`Result: Status ${resRefresh.status}, New Access Token Issued -> ${passRefresh ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passRefresh) allPassed = false;

  // 12. TEST M: Logout Invalidation
  console.log('\n[TEST M] Logout (POST /api/auth/logout)');
  const resLogout = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const dataLogout = await resLogout.json();
  const passLogout = resLogout.status === 200 && dataLogout.success;
  console.log(`Result: Status ${resLogout.status}, Session invalidated -> ${passLogout ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passLogout) allPassed = false;

  // 13. TEST N: Refresh Token Rejected After Logout
  console.log('\n[TEST N] Refresh Token Rejected After Logout');
  const resRefreshAfter = await fetch(`${BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const passRefreshAfter = resRefreshAfter.status === 401;
  console.log(`Result: Status ${resRefreshAfter.status} (Unauthorized) -> ${passRefreshAfter ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!passRefreshAfter) allPassed = false;

  console.log('\n==================================================');
  if (allPassed) {
    console.log('ALL AUTHENTICATION HARDENING TESTS PASSED (100%)');
  } else {
    console.log('SOME TESTS FAILED');
  }
  console.log('==================================================');

  if (!allPassed) process.exit(1);
}

runAuthHardeningTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
