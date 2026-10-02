const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const Course = require('./models/Course');

async function syncCourses() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is missing');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connected to MongoDB Atlas');

  // Read coursesData.ts
  const content = fs.readFileSync(path.join(__dirname, '../src/data/coursesData.ts'), 'utf8');

  // Parse courses array
  const courseBlocks = content.split(/\{\s*id:\s*["']/);
  const courses = [];

  for (let i = 1; i < courseBlocks.length; i++) {
    const block = courseBlocks[i];
    const id = block.substring(0, block.indexOf('"'));
    const titleMatch = block.match(/title:\s*["']([^"']+)["']/);
    const catMatch = block.match(/category:\s*["']([^"']+)["']/);
    const groupMatch = block.match(/categoryGroup:\s*["']([^"']+)["']/);
    const durMatch = block.match(/duration:\s*["']([^"']+)["']/);
    const levelMatch = block.match(/level:\s*["']([^"']+)["']/);
    const ratingMatch = block.match(/rating:\s*["']([^"']+)["']/);
    const studentsMatch = block.match(/students:\s*["']([^"']+)["']/);
    const priceMatch = block.match(/price:\s*["']([^"']+)["']/);
    const origPriceMatch = block.match(/originalPrice:\s*["']([^"']*)["']/);
    const badgeMatch = block.match(/badge:\s*["']([^"']+)["']/);
    const imgMatch = block.match(/image:\s*["']([^"']+)["']/);

    // Extract features
    let features = [];
    const featsMatch = block.match(/features:\s*\[([\s\S]*?)\]/);
    if (featsMatch) {
      features = featsMatch[1]
        .split(',')
        .map(f => f.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
    const durHoursMatch = block.match(/durationHours:\s*([0-9]+)/);
    const resolvedHours = durHoursMatch ? parseInt(durHoursMatch[1]) : (durMatch ? parseInt(durMatch[1].replace(/[^0-9]/g, '')) || 80 : 80);
    const resolvedDuration = durMatch ? (durMatch[1].includes('Hours') ? durMatch[1] : `${resolvedHours} Hours`) : `${resolvedHours} Hours`;

    courses.push({
      id,
      title: titleMatch ? titleMatch[1] : id,
      category: catMatch ? catMatch[1] : 'Technology',
      categoryGroup: groupMatch ? groupMatch[1] : '',
      duration: resolvedDuration,
      durationHours: resolvedHours,
      level: levelMatch ? levelMatch[1] : 'Intermediate',
      rating: ratingMatch ? parseFloat(ratingMatch[1]) : 4.9,
      studentsCount: studentsMatch ? parseInt(studentsMatch[1].replace(/[^0-9]/g, '')) * 100 : 1200,
      price: priceMatch ? priceMatch[1] : '$599',
      originalPrice: origPriceMatch ? origPriceMatch[1] : '',
      badge: badgeMatch ? badgeMatch[1] : '',
      image: imgMatch ? imgMatch[1] : '',
      highlights: features,
      description: `Comprehensive One-on-One industry certification training for ${titleMatch ? titleMatch[1] : id} with live capstone projects and mentor guidance.`
    });
  }

  console.log(`Parsed ${courses.length} courses from coursesData.ts`);

  let modifiedCount = 0;
  let addedCount = 0;

  for (const c of courses) {
    // Check if course already exists by id or title
    const existing = await Course.findOne({
      $or: [
        { id: c.id },
        { title: { $regex: new RegExp(`^${c.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      ]
    });

    if (existing) {
      existing.id = c.id;
      existing.title = c.title;
      existing.category = c.category;
      existing.categoryGroup = c.categoryGroup;
      existing.duration = c.duration;
      existing.durationHours = c.durationHours;
      existing.level = c.level;
      existing.rating = c.rating;
      existing.price = c.price;
      existing.originalPrice = c.originalPrice;
      existing.highlights = c.highlights;
      if (c.image) existing.image = c.image;
      await existing.save();
      modifiedCount++;
    } else {
      await Course.create({
        id: c.id,
        title: c.title,
        category: c.category,
        categoryGroup: c.categoryGroup,
        duration: c.duration,
        durationHours: c.durationHours,
        level: c.level,
        rating: c.rating,
        studentsCount: c.studentsCount,
        price: c.price,
        originalPrice: c.originalPrice,
        highlights: c.highlights,
        image: c.image,
        description: c.description
      });
      addedCount++;
    }
  }

  const totalInDb = await Course.countDocuments();
  console.log('--- SYNC RESULTS ---');
  console.log(`Modified courses: ${modifiedCount}`);
  console.log(`Newly added courses: ${addedCount}`);
  console.log(`Total courses in Atlas DB: ${totalInDb}`);

  await mongoose.disconnect();
}

syncCourses().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
