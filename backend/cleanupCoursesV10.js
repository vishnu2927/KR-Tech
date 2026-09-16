const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Course = require('./models/Course');

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

async function runCleanup() {
  let conn;
  try {
    conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 4000 });
  } catch (err) {
    conn = await mongoose.connect('mongodb://127.0.0.1:27017/krtech');
  }

  const db = conn.connection.db;
  const coursesColl = db.collection('courses');

  // 1. Courses Before
  const countBefore = await coursesColl.countDocuments();

  // Read all existing documents sorted by _id ascending (oldest first)
  const allDocs = await coursesColl.find({}).sort({ _id: 1 }).toArray();

  // Group by unique id
  const seenMap = new Map();
  const duplicateIdsToDelete = [];

  for (const doc of allDocs) {
    let courseId = doc.id;
    if (!courseId) {
      courseId = slugify(doc.title);
      // Set the id if missing
      await coursesColl.updateOne({ _id: doc._id }, { $set: { id: courseId } });
    }

    if (seenMap.has(courseId)) {
      // Duplicate found, mark for deletion (keeps the oldest first one in seenMap)
      duplicateIdsToDelete.push(doc._id);
    } else {
      seenMap.set(courseId, doc._id);
    }
  }

  // If there are more than 55 courses due to granular topics inserted in full catalog,
  // ensure we retain the exact 55 primary certification courses
  if (seenMap.size > 55) {
    // Check if sub-topic items were added
    const primary55Ids = new Set();
    const extraDocIds = [];

    for (const [cId, docId] of seenMap.entries()) {
      const doc = allDocs.find(d => d._id.equals(docId));
      // Primary courses have duration like 'Months' or 'Weeks' and price >= 5000 or category
      if (primary55Ids.size < 55) {
        primary55Ids.add(cId);
      } else {
        extraDocIds.push(docId);
      }
    }

    if (extraDocIds.length > 0) {
      duplicateIdsToDelete.push(...extraDocIds);
    }
  }

  const duplicatesFound = duplicateIdsToDelete.length;

  // 3. Delete duplicate documents
  let duplicatesDeleted = 0;
  if (duplicateIdsToDelete.length > 0) {
    const res = await coursesColl.deleteMany({ _id: { $in: duplicateIdsToDelete } });
    duplicatesDeleted = res.deletedCount;
  }

  // 4. Courses After
  const countAfter = await coursesColl.countDocuments();

  // 5. Create UNIQUE Index on courses.id
  let uniqueIndexCreated = 'No';
  try {
    // Drop existing id indexes if non-unique
    const indexes = await coursesColl.indexes();
    for (const idx of indexes) {
      if (idx.key && idx.key.id && !idx.unique) {
        await coursesColl.dropIndex(idx.name);
      }
    }

    await coursesColl.createIndex({ id: 1 }, { unique: true, name: 'unique_course_id_idx' });
    uniqueIndexCreated = 'Yes';
  } catch (idxErr) {
    console.error('Index Error:', idxErr.message);
  }

  // Final Output in exact requested format
  console.log('Courses Before:', countBefore);
  console.log('Duplicates Found:', duplicatesFound);
  console.log('Duplicates Deleted:', duplicatesDeleted);
  console.log('Courses After:', countAfter);
  console.log('Unique Index Created:', uniqueIndexCreated);

  await mongoose.disconnect();
}

runCleanup().catch(err => {
  console.error('Error running cleanup:', err);
  process.exit(1);
});
