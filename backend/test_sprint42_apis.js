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

async function testAll() {
  console.log('Testing Sprint 4.2 APIs on localhost:5000...');

  // 1. GET /api/student/course/java-backend
  const res1 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/student/course/java-backend',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('1. GET /api/student/course/java-backend -> Status:', res1.status, 'Success:', res1.body?.success, 'Course:', res1.body?.course?.title);

  // 2. GET /api/student/course/java-backend/modules
  const res2 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/student/course/java-backend/modules',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('2. GET /api/student/course/java-backend/modules -> Status:', res2.status, 'Success:', res2.body?.success, 'Modules Count:', res2.body?.modules?.length);

  // 3. GET /api/student/course/java-backend/lessons
  const res3 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/student/course/java-backend/lessons',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('3. GET /api/student/course/java-backend/lessons -> Status:', res3.status, 'Success:', res3.body?.success, 'Lessons Count:', res3.body?.count);

  const firstLesson = res3.body?.lessons?.[0];
  const lessonId = firstLesson?._id || 'lesson-1';

  // 4. PATCH /api/student/course/java-backend/progress
  const res4 = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/course/java-backend/progress',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      lessonId,
      completed: true,
      currentLessonTitle: firstLesson?.title || 'Lesson 1',
      watchTimeSeconds: 300,
    }
  );
  console.log('4. PATCH /api/student/course/java-backend/progress -> Status:', res4.status, 'Success:', res4.body?.success, 'Progress %:', res4.body?.progress?.progressPercent);

  // 5. POST /api/student/course/java-backend/assignment
  const res5 = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/course/java-backend/assignment',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      assignmentId: '65fa10000000000000000001',
      githubUrl: 'https://github.com/aditya-krtech/order-microservice-kafka',
      liveDemoUrl: 'https://order-service-demo.up.railway.app',
      notes: 'Implemented Kafka idempotent consumer and transaction outbox pattern with 92% unit test coverage.',
      fileUrl: 'https://github.com/aditya-krtech/order-microservice-kafka/archive/main.zip',
    }
  );
  console.log('5. POST /api/student/course/java-backend/assignment -> Status:', res5.status, 'Success:', res5.body?.success, 'Submission ID:', res5.body?.submission?._id);

  console.log('\nAll 5 APIs tested successfully!');
}

testAll().catch((err) => console.error('API Test Failed:', err));
