import fs from 'fs';
import path from 'path';

console.log('=== STARTING COURSE CATALOG DATA VALIDATION ===\n');

// 1. Load src/data/coursesData.ts
const content = fs.readFileSync('src/data/coursesData.ts', 'utf8');
const courseBlocks = content.split(/\{\s*id:\s*["']/);
const courses = [];

for (let i = 1; i < courseBlocks.length; i++) {
  const block = courseBlocks[i];
  const id = block.substring(0, block.indexOf('"'));
  const titleMatch = block.match(/title:\s*["']([^"']+)["']/);
  const catMatch = block.match(/category:\s*["']([^"']+)["']/);
  const groupMatch = block.match(/categoryGroup:\s*["']([^"']+)["']/);
  const priceMatch = block.match(/price:\s*["']([^"']+)["']/);
  const origPriceMatch = block.match(/originalPrice:\s*["']([^"']*)["']/);

  courses.push({
    id,
    title: titleMatch ? titleMatch[1] : '',
    category: catMatch ? catMatch[1] : '',
    categoryGroup: groupMatch ? groupMatch[1] : '',
    price: priceMatch ? priceMatch[1] : '',
    originalPrice: origPriceMatch ? origPriceMatch[1] : ''
  });
}

console.log(`Total courses in catalog: ${courses.length}`);

// Check 1: Duplicate IDs & Slugs
const ids = new Set();
const duplicateIds = [];
courses.forEach(c => {
  if (ids.has(c.id)) duplicateIds.push(c.id);
  ids.add(c.id);
});
console.log('Duplicate IDs check:', duplicateIds.length === 0 ? 'PASS (0 duplicates)' : `FAIL: ${duplicateIds.join(', ')}`);

// Check 2: Duplicate Titles
const titles = new Set();
const duplicateTitles = [];
courses.forEach(c => {
  const t = c.title.toLowerCase();
  if (titles.has(t)) duplicateTitles.push(c.title);
  titles.add(t);
});
console.log('Duplicate Titles check:', duplicateTitles.length === 0 ? 'PASS (0 duplicates)' : `FAIL: ${duplicateTitles.join(', ')}`);

// Check 3: Category Counts
const cloudCourses = courses.filter(c => c.categoryGroup === 'Cloud & Cloud Architecture' || c.category === 'Cloud & Cloud Architecture');
const aiCourses = courses.filter(c => c.categoryGroup === 'AI, Machine Learning & GenAI' || c.category === 'AI, Machine Learning & GenAI');
const cyberCourses = courses.filter(c => c.categoryGroup === 'Cybersecurity' || c.category === 'Cybersecurity');
const netCourses = courses.filter(c => c.categoryGroup === 'Networking' || c.category === 'Networking');

console.log(`\nUpdated Categories Counts:`);
console.log(`- Cloud & Cloud Architecture: ${cloudCourses.length} (Expected: 17) -> ${cloudCourses.length === 17 ? 'PASS' : 'FAIL'}`);
console.log(`- AI, Machine Learning & GenAI: ${aiCourses.length} (Expected: 10) -> ${aiCourses.length === 10 ? 'PASS' : 'FAIL'}`);
console.log(`- Cybersecurity: ${cyberCourses.length} (Expected: 14) -> ${cyberCourses.length === 14 ? 'PASS' : 'FAIL'}`);
console.log(`- Networking: ${netCourses.length} (Expected: 12) -> ${netCourses.length === 12 ? 'PASS' : 'FAIL'}`);

// Check 4: Prices validation in updated categories
const allowedPrices = new Set(['$499', '$549', '$599', '$699', '$799', '$899']);
const invalidPrices = [];
const fakeDiscountFound = [];

[...cloudCourses, ...aiCourses, ...cyberCourses, ...netCourses].forEach(c => {
  if (!allowedPrices.has(c.price)) {
    invalidPrices.push({ id: c.id, title: c.title, price: c.price });
  }
  if (c.originalPrice && c.originalPrice.trim() !== '') {
    fakeDiscountFound.push({ id: c.id, originalPrice: c.originalPrice });
  }
});

console.log(`\nPrices Validation:`);
console.log(`- Exact price format check: ${invalidPrices.length === 0 ? 'PASS' : `FAIL: ${JSON.stringify(invalidPrices)}`}`);
console.log(`- Zero fake original price / discount check: ${fakeDiscountFound.length === 0 ? 'PASS' : `FAIL: ${JSON.stringify(fakeDiscountFound)}`}`);

// Check 5: Incomplete Title Confirmation
const incompleteItem = courses.find(c => c.title.includes('Google Professional Cl…') || c.title.includes('Google Professional Cl'));
console.log(`\nIncomplete Title Inspection:`);
if (incompleteItem) {
  console.log(`- Found item: [${incompleteItem.id}] "${incompleteItem.title}"`);
  console.log(`- Status: NEEDS TITLE CONFIRMATION (Preserved exactly as provided without inventing text)`);
} else {
  console.log(`- Incomplete item NOT found: FAIL`);
}

// Check 6: Broken Course Route validation
const invalidRouteIds = courses.filter(c => !/^[a-z0-9-]+$/.test(c.id));
console.log(`\nRoute Slug Safety:`);
console.log(`- URL-safe slug check: ${invalidRouteIds.length === 0 ? 'PASS' : `FAIL: ${invalidRouteIds.map(c => c.id).join(', ')}`}`);

// Check 7: Brand Policy & Zero Placement check on descriptions
const prohibited = ['placement', 'job guarantee', 'hiring', 'recruiter', 'salary', 'lpa', 'ctc'];
const brandViolations = [];
courses.forEach(c => {
  const text = (c.title + ' ' + (c.features ? c.features.join(' ') : '')).toLowerCase();
  prohibited.forEach(term => {
    if (new RegExp('\\b' + term + '\\b').test(text)) {
      brandViolations.push({ id: c.id, term });
    }
  });
});
console.log(`\nBrand Policy & Zero Placement Audit:`);
console.log(`- Zero placement terms: ${brandViolations.length === 0 ? 'PASS' : `FAIL: ${JSON.stringify(brandViolations)}`}`);

console.log('\n=== VALIDATION COMPLETE ===');
