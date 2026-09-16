const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');
const Mentor = require('./models/Mentor');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Resource = require('./models/Resource');
const Certificate = require('./models/Certificate');

async function seedComplete55Courses() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to MongoDB:', mongoose.connection.name);

  // Read coursesData.ts
  const rawData = fs.readFileSync(path.join(__dirname, '../src/data/coursesData.ts'), 'utf8');
  
  // Extract ALL_COURSES items
  const titleMatches = [...rawData.matchAll(/title:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const categoryMatches = [...rawData.matchAll(/category:\s*["']([^"']+)["']/g)].map(m => m[1]);
  
  // Deduplicate and structure into 55 distinct courses
  const titles = [...new Set(titleMatches)].filter(t => !t.includes("Week") && !t.includes("Syllabus") && t.length > 10);
  
  console.log(`Found ${titles.length} unique course titles in catalog.`);
  
  const courseDocs = titles.map((title, idx) => {
    let cat = "Software Development";
    if (title.includes("AWS") || title.includes("Cloud") || title.includes("GCP")) cat = "Cloud Computing";
    else if (title.includes("Security") || title.includes("Hacker") || title.includes("CEH") || title.includes("SOC")) cat = "Cyber Security";
    else if (title.includes("Cisco") || title.includes("Network") || title.includes("CCNA") || title.includes("CCNP")) cat = "Networking";
    else if (title.includes("Power BI") || title.includes("Tableau") || title.includes("SQL") || title.includes("Data")) cat = "Data & Analytics";
    else if (title.includes("SAP") || title.includes("Salesforce") || title.includes("ServiceNow")) cat = "Enterprise Technologies";
    else if (title.includes("PMP") || title.includes("Scrum") || title.includes("TOGAF") || title.includes("ITIL")) cat = "Project Management";
    else if (title.includes("Azure") || title.includes("Windows") || title.includes("Active Directory")) cat = "Microsoft & IT";
    else if (title.includes("Java")) cat = "Java Backend";
    else if (title.includes("MERN")) cat = "MERN Stack";
    else if (title.includes("React")) cat = "React";
    else if (title.includes("Python")) cat = "Python";
    else if (title.includes("AI") || title.includes("Machine Learning")) cat = "AI & ML";
    else if (title.includes("DSA") || title.includes("Algorithms")) cat = "DSA";

    return {
      id: title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      category: cat,
      description: `Comprehensive 1:1 live industry training for ${title} with real-world capstone projects and placement preparation.`,
      duration: idx % 2 === 0 ? "3 Months" : "4.5 Months",
      level: idx % 3 === 0 ? "Beginner" : (idx % 3 === 1 ? "Intermediate" : "Advanced"),
      rating: +(4.85 + (idx % 15) * 0.01).toFixed(2),
      studentsCount: 1000 + idx * 350,
      price: 11999 + (idx % 8) * 1000,
      originalPrice: 22000 + (idx % 8) * 1500,
      isPopular: idx < 12,
      highlights: ["1:1 Live Mentorship", "Real-World Industry Capstones", "Flexible Scheduling", "Placement Support"],
    };
  });

  await Course.deleteMany({});
  const inserted = await Course.insertMany(courseDocs);
  console.log(`✅ Successfully seeded ${inserted.length} courses into MongoDB!`);

  const count = await Course.countDocuments();
  console.log(`Total Courses in MongoDB: ${count}`);
  await mongoose.disconnect();
}

seedComplete55Courses().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
