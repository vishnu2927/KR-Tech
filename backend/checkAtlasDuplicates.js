const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

async function checkAtlasCourses() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected to Atlas');

  const allInDb = await Course.find({});
  console.log('Total in DB:', allInDb.length);

  // Read coursesData.ts to get the canonical 84 IDs
  const content = fs.readFileSync(path.join(__dirname, '../src/data/coursesData.ts'), 'utf8');
  const courseBlocks = content.split(/\{\s*id:\s*["']/);
  const canonicalIds = new Set();
  const canonicalTitles = new Set();

  for (let i = 1; i < courseBlocks.length; i++) {
    const id = courseBlocks[i].substring(0, courseBlocks[i].indexOf('"'));
    const titleMatch = courseBlocks[i].match(/title:\s*["']([^"']+)["']/);
    canonicalIds.add(id);
    if (titleMatch) canonicalTitles.add(titleMatch[1].toLowerCase());
  }

  console.log('Canonical IDs count:', canonicalIds.size);

  const matched = [];
  const unmatched = [];

  allInDb.forEach(c => {
    if (canonicalIds.has(c.id)) {
      matched.push(c);
    } else {
      unmatched.push(c);
    }
  });

  console.log('Matched canonical:', matched.length);
  console.log('Unmatched legacy entries:', unmatched.length);

  unmatched.forEach(c => {
    console.log(`Unmatched: [${c.id}] | ${c.category} | ${c.title}`);
  });

  await mongoose.disconnect();
}

checkAtlasCourses().catch(console.error);
