const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const Certificate = require('./models/Certificate');

const SEED_CERTIFICATES = [
  {
    title: 'Java Backend & Spring Boot Microservices Architecture',
    category: 'Java Backend',
    studentName: 'Aditya Sharma',
    completionDate: 'Aug 2026',
    credentialId: 'KRT-2026-JAVA-9102',
    grade: 'Grade A+ (96%)',
    skills: ['Java 21', 'Spring Boot 3.x', 'Microservices', 'Kafka', 'Docker'],
    verified: true,
  },
  {
    title: 'MERN Full Stack & Next.js 15 SaaS Engineering',
    category: 'MERN Stack',
    studentName: 'Kavya Patel',
    completionDate: 'Jul 2026',
    credentialId: 'KRT-2026-MERN-8401',
    grade: 'Grade A (94%)',
    skills: ['React 19', 'Node.js', 'Express', 'MongoDB', 'Next.js'],
    verified: true,
  },
  {
    title: 'AWS Certified Solutions Architect Associate Track',
    category: 'AWS',
    studentName: 'Siddharth Verma',
    completionDate: 'Aug 2026',
    credentialId: 'KRT-2026-AWS-7729',
    grade: 'Grade A+ (98%)',
    skills: ['AWS VPC', 'EC2 & S3', 'IAM', 'ECS Fargate', 'CloudFormation'],
    verified: true,
  },
  {
    title: 'Microsoft Azure Administrator (AZ-104) & Hybrid Cloud',
    category: 'Azure',
    studentName: 'Meenakshi Iyer',
    completionDate: 'Aug 2026',
    credentialId: 'KRT-2026-AZ-6612',
    grade: 'Grade A (92%)',
    skills: ['Azure Entra ID', 'Virtual Networks', 'ARM Templates', 'Azure Backup'],
    verified: true,
  },
  {
    title: 'Certified Ethical Hacker (CEH) & SOC Threat Hunting',
    category: 'Cyber Security',
    studentName: 'Rohan Deshmukh',
    completionDate: 'Jul 2026',
    credentialId: 'KRT-2026-SEC-5503',
    grade: 'Grade A+ (97%)',
    skills: ['Ethical Hacking', 'Wireshark', 'Burp Suite', 'SIEM Splunk', 'Firewalls'],
    verified: true,
  },
  {
    title: 'Certified Ethical Hacker (CEH v12) Master Track',
    category: 'Cyber Security',
    studentName: 'Rohan Deshmukh',
    completionDate: 'Jul 2026',
    credentialId: 'KRT-2026-CEH-5503',
    grade: 'Grade A+ (97%)',
    skills: ['Burp Suite', 'Metasploit', 'Splunk', 'Nmap', 'Wireshark'],
    verified: true,
  },
  {
    title: 'Microsoft Power BI Data Analyst (PL-300) & Analytics',
    category: 'Power BI',
    studentName: 'Ananya Roy',
    completionDate: 'Jun 2026',
    credentialId: 'KRT-2026-PBI-4491',
    grade: 'Grade A (95%)',
    skills: ['Power BI', 'DAX Modeling', 'Advanced SQL', 'Tableau', 'ETL'],
    verified: true,
  },
  {
    title: 'SAP S/4HANA FICO Financial Accounting Consultant',
    category: 'SAP',
    studentName: 'Vikram Malhotra',
    completionDate: 'Jul 2026',
    credentialId: 'KRT-2026-SAP-3382',
    grade: 'Grade A+ (99%)',
    skills: ['SAP FICO', 'General Ledger', 'Accounts Payable', 'Asset Accounting', 'S/4HANA'],
    verified: true,
  },
  {
    title: 'SAP S/4HANA Financial Accounting (FICO) Specialist',
    category: 'SAP',
    studentName: 'Ananya Roy',
    completionDate: 'Aug 2026',
    credentialId: 'KRT-2026-SAP-4391',
    grade: 'Grade A (95%)',
    skills: ['SAP FICO', 'General Ledger', 'Accounts Payable', 'Asset Accounting'],
    verified: true,
  },
  {
    title: 'Salesforce Administrator & Platform Developer (PD1)',
    category: 'Salesforce',
    studentName: 'Pooja Hegde',
    completionDate: 'Aug 2026',
    credentialId: 'KRT-2026-SF-2210',
    grade: 'Grade A (93%)',
    skills: ['Salesforce Admin', 'Apex Programming', 'Lightning LWC', 'Flows', 'SOQL'],
    verified: true,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('Connected to Atlas successfully!');

    let inserted = 0;
    let updated = 0;

    for (const cert of SEED_CERTIFICATES) {
      const existing = await Certificate.findOne({ credentialId: cert.credentialId });
      if (existing) {
        await Certificate.updateOne({ credentialId: cert.credentialId }, { $set: cert });
        updated++;
        console.log(`✓ Updated: ${cert.credentialId} (${cert.studentName})`);
      } else {
        await Certificate.create(cert);
        inserted++;
        console.log(`+ Inserted: ${cert.credentialId} (${cert.studentName})`);
      }
    }

    const count = await Certificate.countDocuments();
    console.log(`\nCertificates Sync Complete!`);
    console.log(`Total in MongoDB Atlas: ${count} (Inserted: ${inserted}, Updated: ${updated})`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
