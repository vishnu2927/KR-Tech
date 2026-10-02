import fs from 'fs';

const content = fs.readFileSync('src/data/coursesData.ts', 'utf8');
const blocks = content.split(/\{\s*id:\s*["']/);
const courses = [];

for (let i = 1; i < blocks.length; i++) {
  const b = blocks[i];
  const id = b.substring(0, b.indexOf('"'));
  const title = (b.match(/title:\s*["']([^"']+)["']/) || [])[1] || '';
  const price = (b.match(/price:\s*["']([^"']+)["']/) || [])[1] || '';
  const originalPrice = (b.match(/originalPrice:\s*["']([^"']*)["']/) || [])[1] || '';
  const duration = (b.match(/duration:\s*["']([^"']+)["']/) || [])[1] || '';
  const categoryGroup = (b.match(/categoryGroup:\s*["']([^"']+)["']/) || [])[1] || '';
  const category = (b.match(/category:\s*["']([^"']+)["']/) || [])[1] || '';
  courses.push({ id, title, price, originalPrice, duration, categoryGroup, category });
}

console.log('Total courses:', courses.length);
const inrCourses = courses.filter(c => c.price.includes('₹') || c.price.toLowerCase().includes('inr') || c.price.toLowerCase().includes('rs'));
console.log('Courses with INR price:', inrCourses.length);
console.log('\nAll INR Courses:');
inrCourses.forEach(c => {
  console.log(`- [${c.id}] ${c.title} | Price: ${c.price} | Orig: ${c.originalPrice} | Duration: ${c.duration} | Cat: ${c.categoryGroup}`);
});

const usdCourses = courses.filter(c => c.price.startsWith('$'));
console.log('\nCourses with USD price:', usdCourses.length);

const nonHourDurations = courses.filter(c => !c.duration.toLowerCase().includes('hour'));
console.log('\nCourses without Hours in duration:', nonHourDurations.length);
console.log('\nSample non-hour durations:');
nonHourDurations.forEach(c => {
  console.log(`- [${c.id}] ${c.title} | Duration: "${c.duration}"`);
});
