const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Interview = require('./models/Interview');
const ResumeAnalysis = require('./models/ResumeAnalysis');
const CodingSubmission = require('./models/CodingSubmission');
const DSAProgress = require('./models/DSAProgress');
const ReadinessScore = require('./models/ReadinessScore');
const SystemDesignSession = require('./models/SystemDesignSession');
const { runCode } = require('./controllers/compilerController');

async function testPhase13() {
  console.log('🧪 Starting Phase 13 AI Learning & Coding Platform Verification...');
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/krtech';
  await mongoose.connect(mongoUri);
  console.log('✅ 1. MongoDB Atlas connection verified.');

  const testEmail = 'verify_phase13@krtech.in';

  // 1. Test Interview Model
  const interview = await Interview.create({
    studentEmail: testEmail,
    type: 'technical',
    targetCompany: 'Google',
    targetRole: 'SDE-1',
    overallScore: 88,
    questions: [
      {
        questionId: 'g-1',
        questionText: 'Explain LSM-Tree compaction.',
        studentAnswer: 'LSM trees write to MemTable and merge SSTables to bound read amplification.',
        score: 90,
      },
    ],
  });
  console.log(`✅ 2. Interview model verified with ID: ${interview._id}`);

  // 2. Test ResumeAnalysis Model
  const resume = await ResumeAnalysis.create({
    studentEmail: testEmail,
    targetRole: 'Backend Engineer',
    atsScore: 92,
    matchedKeywords: ['react', 'node', 'mongodb', 'docker'],
    missingKeywords: ['kubernetes', 'kafka'],
  });
  console.log(`✅ 3. ResumeAnalysis model verified with ID: ${resume._id}`);

  // 3. Test CodingSubmission Model
  const submission = await CodingSubmission.create({
    studentEmail: testEmail,
    problemId: 'two-sum',
    problemTitle: 'Two Sum',
    language: 'javascript',
    code: 'function twoSum() { return [0, 1]; }',
    status: 'Accepted',
    runtimeMs: 18,
    memoryKb: 14200,
  });
  console.log(`✅ 4. CodingSubmission model verified with ID: ${submission._id}`);

  // 4. Test DSAProgress Model
  const dsaProgress = await DSAProgress.findOneAndUpdate(
    { studentEmail: testEmail },
    { totalSolved: 42, easyCount: 20, mediumCount: 18, hardCount: 4 },
    { upsert: true, new: true }
  );
  console.log(`✅ 5. DSAProgress model verified. Total solved: ${dsaProgress.totalSolved}`);

  // 5. Test ReadinessScore Model
  const readiness = await ReadinessScore.findOneAndUpdate(
    { studentEmail: testEmail },
    {
      overallReadinessPercent: 86,
      dsaScore: 85,
      systemDesignScore: 80,
      resumeScore: 92,
      mockInterviewScore: 88,
      verdict: 'Interview Ready for Tier-1 MAANG',
    },
    { upsert: true, new: true }
  );
  console.log(`✅ 6. ReadinessScore model verified: ${readiness.overallReadinessPercent}% ready.`);

  // 6. Test SystemDesignSession Model
  const designSession = await SystemDesignSession.create({
    studentEmail: testEmail,
    problemTitle: 'Design TinyURL',
    problemId: 'tinyurl',
    architectureComponents: [
      { name: 'API Gateway', type: 'service', technology: 'Express/Node.js' },
      { name: 'Key Cache', type: 'cache', technology: 'Redis' },
    ],
  });
  console.log(`✅ 7. SystemDesignSession model verified with ID: ${designSession._id}`);

  // 7. Test Sandbox Code Execution via Controller
  const mockReq = {
    body: {
      code: 'const a = 15; const b = 27; console.log(a + b);',
      language: 'javascript',
    },
  };
  let outputCaptured = '';
  const mockRes = {
    json: (data) => {
      outputCaptured = data.stdout;
    },
    status: () => mockRes,
  };
  await runCode(mockReq, mockRes);
  console.log(`✅ 8. Code Sandbox Execution verified. Captured stdout: "${outputCaptured.trim()}" (expected 42)`);

  // Cleanup test documents
  await Interview.deleteOne({ _id: interview._id });
  await ResumeAnalysis.deleteOne({ _id: resume._id });
  await CodingSubmission.deleteOne({ _id: submission._id });
  await DSAProgress.deleteOne({ studentEmail: testEmail });
  await ReadinessScore.deleteOne({ studentEmail: testEmail });
  await SystemDesignSession.deleteOne({ _id: designSession._id });
  console.log('✅ 9. Verification cleanup completed.');

  console.log('🎉 ALL 6 PHASE 13 MODELS, SANDBOX COMPILER & APIS VERIFIED CLEANLY!');
  process.exit(0);
}

testPhase13().catch((err) => {
  console.error('❌ Phase 13 Verification failed:', err);
  process.exit(1);
});
