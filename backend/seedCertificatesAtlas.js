const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Certificate = require('./models/Certificate');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const CERT_DATA = [
  {
    title: 'Enterprise Java 21 & Distributed Microservices Engineering',
    category: 'Java Backend',
    studentName: 'Aditya Sharma',
    studentEmail: 'aditya.sharma@krtech.edu',
    completionDate: 'Sep 12, 2026',
    credentialId: 'KRT-2026-JAVA-9102',
    grade: 'Grade A+ (Distinction · 98%)',
    skills: ['Java 21', 'Spring Boot 3', 'Kafka Event Streaming', 'Docker', 'Kubernetes', 'Redis Caching'],
    issuer: 'KR GLOBAL LEARNING PRIVATE LIMITED',
    accreditation: 'KR Global Learning Verified Training Credential',
    verified: true,
  },
  {
    title: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
    category: 'AWS',
    studentName: 'Aditya Sharma',
    studentEmail: 'aditya.sharma@krtech.edu',
    completionDate: 'Sep 01, 2026',
    credentialId: 'KRT-2026-AWS-7729',
    grade: 'Grade A+ (Distinction · 96%)',
    skills: ['AWS VPC', 'ECS Fargate', 'Lambda', 'Terraform', 'CloudFront', 'S3 Glacier'],
    issuer: 'KR GLOBAL LEARNING PRIVATE LIMITED',
    accreditation: 'KR Global Learning Verified Training Credential',
    verified: true,
  },
  {
    title: 'MERN Stack Full Stack Web Development Mastery Bootcamp',
    category: 'MERN Stack',
    studentName: 'Kavya Patel',
    studentEmail: 'kavya.patel@gmail.com',
    completionDate: 'Aug 28, 2026',
    credentialId: 'KRT-2026-MERN-8841',
    grade: 'Grade A+ (Distinction · 95%)',
    skills: ['React 19', 'Next.js 15', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Tailwind CSS'],
    issuer: 'KR GLOBAL LEARNING PRIVATE LIMITED',
    accreditation: 'KR Global Learning Verified Training Credential',
    verified: true,
  },
  {
    title: 'Enterprise Cyber Security & Ethical Hacking Mastery (CEH v12)',
    category: 'Cyber Security',
    studentName: 'Rahul Verma',
    studentEmail: 'rahul.verma@outlook.com',
    completionDate: 'Aug 20, 2026',
    credentialId: 'KRT-2026-SEC-6612',
    grade: 'Grade A (Distinction · 92%)',
    skills: ['Penetration Testing', 'SIEM / Splunk', 'Network Hardening', 'OWASP Top 10', 'Wireshark'],
    issuer: 'KR GLOBAL LEARNING PRIVATE LIMITED',
    accreditation: 'KR Global Learning Verified Training Credential',
    verified: true,
  },
];

async function seedCertificates() {
  console.log('Connecting to MongoDB Atlas to synchronize certificates & QR codes...');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected to: ${mongoose.connection.name}`);

  for (const cert of CERT_DATA) {
    const verifyUrl = `${CLIENT_URL}/certificates?verify=${encodeURIComponent(cert.credentialId)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    });

    await Certificate.findOneAndUpdate(
      { credentialId: cert.credentialId },
      {
        ...cert,
        qrCodeDataUrl,
        pdfUrl: `/api/certificates/${cert.credentialId}/pdf`,
      },
      { upsert: true, new: true }
    );
    console.log(`✓ Synchronized Certificate: ${cert.credentialId} (${cert.studentName})`);
  }

  // Also update any other existing certificates that lack qrCodeDataUrl
  const existingWithoutQr = await Certificate.find({
    $or: [{ qrCodeDataUrl: { $exists: false } }, { qrCodeDataUrl: null }],
  });

  for (const c of existingWithoutQr) {
    const verifyUrl = `${CLIENT_URL}/certificates?verify=${encodeURIComponent(c.credentialId)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    });
    c.qrCodeDataUrl = qrCodeDataUrl;
    c.pdfUrl = `/api/certificates/${c.credentialId}/pdf`;
    await c.save();
    console.log(`✓ Backfilled QR Code for: ${c.credentialId}`);
  }

  const total = await Certificate.countDocuments();
  console.log(`\n✅ Certificates Collection in MongoDB Atlas now contains ${total} verified records!`);
  await mongoose.disconnect();
}

seedCertificates().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
