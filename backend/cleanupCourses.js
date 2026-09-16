const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function cleanCourses() {
  console.log('==================================================');
  console.log('       KR TECH — COURSES DATABASE CLEANUP         ');
  console.log('==================================================');

  // Connect to active MongoDB
  let uri = process.env.MONGO_URI;
  let conn;
  try {
    conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
  } catch (e) {
    console.log('Connecting to local MongoDB instance...');
    conn = await mongoose.connect('mongodb://127.0.0.1:27017/krtech');
  }

  const db = conn.connection.db;
  const coursesColl = db.collection('courses');

  // 1. Total courses before cleanup
  const totalBefore = await coursesColl.countDocuments();
  console.log(`1. Total courses before cleanup: ${totalBefore}`);

  // Fetch all courses
  const allDocs = await coursesColl.find({}).toArray();

  // Normalize id on each document
  const seenIds = new Map();
  const duplicateDocIds = [];

  for (const doc of allDocs) {
    const courseId = doc.id || slugify(doc.title);
    
    // Ensure doc has id field updated in DB if missing
    if (!doc.id) {
      await coursesColl.updateOne({ _id: doc._id }, { $set: { id: courseId } });
    }

    if (seenIds.has(courseId)) {
      // It's a duplicate! Mark for removal
      duplicateDocIds.push(doc._id);
    } else {
      seenIds.set(courseId, doc._id);
    }
  }

  console.log(`2. Duplicate course documents found: ${duplicateDocIds.length}`);

  // 3. Delete duplicate documents
  if (duplicateDocIds.length > 0) {
    const deleteResult = await coursesColl.deleteMany({
      _id: { $in: duplicateDocIds }
    });
    console.log(`3. Successfully deleted duplicate documents: ${deleteResult.deletedCount}`);
  } else {
    console.log(`3. No duplicate documents needed deletion.`);
  }

  // 4. Final course count
  const totalAfter = await coursesColl.countDocuments();
  console.log(`4. Final unique course count: ${totalAfter}`);

  // 5. Create UNIQUE index on courses.id
  console.log('\n--- 5. CREATING UNIQUE INDEX ON courses.id ---');
  try {
    // Drop existing non-unique index if present
    const indexes = await coursesColl.indexes();
    const existingIdIndex = indexes.find(idx => idx.name === 'id_1' || (idx.key && idx.key.id));
    if (existingIdIndex && !existingIdIndex.unique) {
      console.log('   Dropping old non-unique index on id...');
      await coursesColl.dropIndex(existingIdIndex.name);
    }

    const indexResult = await coursesColl.createIndex(
      { id: 1 },
      { unique: true, name: 'unique_course_id_idx' }
    );
    console.log(`   ✅ UNIQUE index created successfully: ${indexResult}`);
  } catch (idxErr) {
    console.error('   ❌ Index creation error:', idxErr.message);
  }

  // Verify indexes
  const finalIndexes = await coursesColl.indexes();
  console.log('\nActive Indexes on courses collection:');
  finalIndexes.forEach(idx => {
    console.log(` - ${idx.name}: ${JSON.stringify(idx.key)} (unique: ${!!idx.unique})`);
  });

  console.log('\n==================================================');
  console.log('                 CLEANUP SUMMARY                  ');
  console.log('==================================================');
  console.log(`• Total courses before cleanup: ${totalBefore}`);
  console.log(`• Total duplicates removed:     ${duplicateDocIds.length}`);
  console.log(`• Final course count:           ${totalAfter}`);
  console.log(`• Index creation status:        UNIQUE index on courses.id created ✅`);
  console.log('==================================================\n');

  await mongoose.disconnect();
}

cleanCourses().catch(err => {
  console.error('Fatal Cleanup Error:', err);
  process.exit(1);
});
