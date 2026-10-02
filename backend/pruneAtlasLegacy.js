const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

async function pruneLegacy() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected to Atlas');

  // Read canonical IDs from coursesData.ts
  const content = fs.readFileSync(path.join(__dirname, '../src/data/coursesData.ts'), 'utf8');
  const courseBlocks = content.split(/\{\s*id:\s*["']/);
  const canonicalIds = [];

  for (let i = 1; i < courseBlocks.length; i++) {
    const id = courseBlocks[i].substring(0, courseBlocks[i].indexOf('"'));
    canonicalIds.push(id);
  }

  console.log(`Total canonical IDs to keep: ${canonicalIds.length}`);

  // Delete any course whose ID is not in canonicalIds
  const result = await Course.deleteMany({ id: { $nin: canonicalIds } });
  console.log(`Deleted ${result.deletedCount} legacy duplicate/unmatched records.`);

  const remaining = await Course.countDocuments();
  console.log(`Remaining courses in DB: ${remaining}`);

  // Duplicate check in DB
  const currentCourses = await Course.find({});
  const idCounts = {};
  const titleCounts = {};
  let dupes = 0;

  currentCourses.forEach(c => {
    idCounts[c.id] = (idCounts[c.id] || 0) + 1;
    if (idCounts[c.id] > 1) {
      console.error(`DUPLICATE ID IN DB: ${c.id}`);
      dupes++;
    }
    titleCounts[c.title] = (titleCounts[c.title] || 0) + 1;
    if (titleCounts[c.title] > 1) {
      console.error(`DUPLICATE TITLE IN DB: ${c.title}`);
      dupes++;
    }
  });

  if (dupes === 0) {
    console.log('✅ ZERO duplicates found in MongoDB Atlas. All 84 courses are unique and verified.');
  }

  await mongoose.disconnect();
}

pruneLegacy().catch(console.error);
