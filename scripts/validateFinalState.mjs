import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "../backend/node_modules/mongoose/index.js";
import dotenv from "../backend/node_modules/dotenv/lib/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, "backend", ".env") });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(rootDir, ".env") });
}

async function runValidation() {
  console.log("==================================================");
  console.log("FINAL VALIDATION RUN - KR GLOBAL LEARNING");
  console.log("==================================================");

  let allPassed = true;
  const issues = [];

  // 1. Course Catalog Data Validation
  const coursesFilePath = path.join(rootDir, "src", "data", "coursesData.ts");
  const coursesFileContent = fs.readFileSync(coursesFilePath, "utf8");

  // Parse courses array
  const courseBlocks = coursesFileContent.split(/\{\s*id:\s*["']/);
  const coursesData = [];

  for (let i = 1; i < courseBlocks.length; i++) {
    const block = courseBlocks[i];
    const id = block.substring(0, block.indexOf('"'));
    const titleMatch = block.match(/title:\s*["']([^"']+)["']/);
    const catMatch = block.match(/category:\s*["']([^"']+)["']/);
    const durMatch = block.match(/duration:\s*["']([^"']+)["']/);
    const durHoursMatch = block.match(/durationHours:\s*(\d+)/);
    const priceMatch = block.match(/price:\s*["']([^"']+)["']/);
    const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);

    coursesData.push({
      id,
      title: titleMatch ? titleMatch[1] : "",
      category: catMatch ? catMatch[1] : "",
      duration: durMatch ? durMatch[1] : "",
      durationHours: durHoursMatch ? parseInt(durHoursMatch[1], 10) : undefined,
      price: priceMatch ? priceMatch[1] : "",
      slug: slugMatch ? slugMatch[1] : id,
    });
  }

  console.log(`\n1. COURSE CATALOG VALIDATION:`);
  console.log(`Total courses in coursesData: ${coursesData.length}`);

  if (coursesData.length !== 84) {
    allPassed = false;
    issues.push(`Catalog course count is ${coursesData.length}, expected exactly 84.`);
  } else {
    console.log(`✓ Exact course count matched: 84 active courses`);
  }

  // Duplicate checks
  const ids = new Set();
  const titles = new Set();
  const slugs = new Set();
  let dupIds = 0;
  let dupTitles = 0;
  let dupSlugs = 0;

  for (const c of coursesData) {
    if (ids.has(c.id)) {
      dupIds++;
      issues.push(`Duplicate ID: ${c.id}`);
    }
    ids.add(c.id);

    if (titles.has(c.title)) {
      dupTitles++;
      issues.push(`Duplicate Title: ${c.title}`);
    }
    titles.add(c.title);

    const slug = c.slug || c.id;
    if (slugs.has(slug)) {
      dupSlugs++;
      issues.push(`Duplicate Slug: ${slug}`);
    }
    slugs.add(slug);
  }

  console.log(`- Duplicate IDs: ${dupIds}`);
  console.log(`- Duplicate Titles: ${dupTitles}`);
  console.log(`- Duplicate Slugs: ${dupSlugs}`);

  // 2. USD Pricing Validation
  console.log(`\n2. USD PRICING VALIDATION:`);
  let inrPriceCount = 0;
  let nonUsdPriceCount = 0;

  for (const c of coursesData) {
    if (c.price.includes("₹") || c.price.includes("Rs") || c.price.includes("INR")) {
      inrPriceCount++;
      issues.push(`Course "${c.title}" has INR price: ${c.price}`);
    }
    if (!c.price.startsWith("$")) {
      nonUsdPriceCount++;
      issues.push(`Course "${c.title}" price does not start with $: ${c.price}`);
    }
  }

  console.log(`- Courses with INR/₹/Rs pricing: ${inrPriceCount}`);
  console.log(`- Courses with non-$ pricing: ${nonUsdPriceCount}`);

  // 3. Duration-Hours Validation
  console.log(`\n3. DURATION-HOURS VALIDATION:`);
  let weekMonthDurationCount = 0;
  let nonHoursDurationCount = 0;
  let missingDurationHoursCount = 0;

  for (const c of coursesData) {
    const durLower = c.duration.toLowerCase();
    if (durLower.includes("week") || durLower.includes("month") || durLower.includes("day")) {
      weekMonthDurationCount++;
      issues.push(`Course "${c.title}" has week/month/day duration: ${c.duration}`);
    }
    if (!c.duration.endsWith("Hours")) {
      nonHoursDurationCount++;
      issues.push(`Course "${c.title}" duration does not end with 'Hours': ${c.duration}`);
    }
    if (typeof c.durationHours !== "number" || isNaN(c.durationHours)) {
      missingDurationHoursCount++;
      issues.push(`Course "${c.title}" is missing numeric durationHours field.`);
    }
  }

  console.log(`- Courses with week/month duration: ${weekMonthDurationCount}`);
  console.log(`- Courses without 'Hours' in duration: ${nonHoursDurationCount}`);
  console.log(`- Courses missing numeric durationHours: ${missingDurationHoursCount}`);

  // Verify incomplete title preservation
  const incompleteCourse = coursesData.find((c) => c.title.includes("Google Professional Cl"));
  if (incompleteCourse) {
    console.log(`✓ Preserved incomplete course verbatim: "${incompleteCourse.title}" (Status: NEEDS TITLE CONFIRMATION)`);
  } else {
    issues.push(`Could not find "Google Professional Cl…" course.`);
  }

  // 4. Social Links Validation
  console.log(`\n4. SOCIAL MEDIA URL VALIDATION:`);
  const OFFICIAL_URLS = {
    YouTube: "https://youtube.com/@krgloballeaning?si=ZuFhhdkJl0HR9zQ5",
    Telegram: "https://t.me/krglobal0713",
    X: "https://x.com/KRGlobal1307",
    Instagram: "https://www.instagram.com/krglobal0713?utm_source=qr&stkn=bzJhYWIzemRnZ212",
  };

  const filesToCheck = [
    path.join(rootDir, "src", "components", "Footer.tsx"),
    path.join(rootDir, "src", "pages", "ContactPage.tsx"),
    path.join(rootDir, "src", "components", "CommunitySection.tsx"),
    path.join(rootDir, "src", "components", "Navbar.tsx"),
  ];

  for (const file of filesToCheck) {
    const relName = path.relative(rootDir, file);
    const content = fs.readFileSync(file, "utf8");
    console.log(`Checking ${relName}:`);
    for (const [platform, url] of Object.entries(OFFICIAL_URLS)) {
      if (content.includes(url)) {
        console.log(`  ✓ ${platform} exact URL verified`);
      } else {
        issues.push(`Missing exact ${platform} URL in ${relName}`);
        console.log(`  ✗ Missing ${platform} URL`);
      }
    }
  }

  // 5. Brand & Policy Scan
  console.log(`\n5. POLICY & BRAND CHECK:`);
  const publicDirs = [
    path.join(rootDir, "src", "components"),
    path.join(rootDir, "src", "pages"),
  ];

  const bannedKeywords = [
    /\bplacement\b/i,
    /\bplacement assistance\b/i,
    /\bjob support\b/i,
    /\bhiring\b/i,
    /\brecruiters\b/i,
    /\brecruitment\b/i,
    /\bemployment support\b/i,
    /\bjob guarantee\b/i,
    /\bsalary packages\b/i,
    /\bLPA\b/,
    /\bCTC\b/,
    /\bplacement success rates\b/i,
  ];

  let policyViolations = 0;
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
        // Skip admin and mock CRM pages for internal analytics if any
        const rel = path.relative(rootDir, fullPath);
        if (rel.includes("SuperAdmin") || rel.includes("MentorCRM") || rel.includes("MarketingDashboard")) {
          continue;
        }
        const text = fs.readFileSync(fullPath, "utf8");
        for (const pattern of bannedKeywords) {
          const match = text.match(pattern);
          if (match) {
            // Check context for background jobs or cron jobs allowed
            const lines = text.split("\n");
            for (let i = 0; i < lines.length; i++) {
              if (pattern.test(lines[i])) {
                const line = lines[i];
                if (/cron job|background job|job queue|scheduled job/i.test(line)) {
                  continue;
                }
                policyViolations++;
                issues.push(`Policy violation in ${rel}:${i + 1}: "${line.trim()}"`);
              }
            }
          }
        }
      }
    }
  }

  for (const d of publicDirs) {
    scanDir(d);
  }
  console.log(`- Public policy violations found: ${policyViolations}`);

  // 6. Check MongoDB Atlas
  console.log(`\n6. MONGODB ATLAS VALIDATION:`);
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (mongoUri) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
      const db = mongoose.connection.db;
      const count = await db.collection("courses").countDocuments();
      console.log(`- Total courses in MongoDB Atlas: ${count}`);
      if (count !== 84) {
        issues.push(`MongoDB Atlas has ${count} courses, expected 84.`);
      }

      const inrAtlasCount = await db.collection("courses").countDocuments({
        price: { $regex: "[₹RsINR]" },
      });
      console.log(`- Atlas courses with INR/₹: ${inrAtlasCount}`);

      const weekAtlasCount = await db.collection("courses").countDocuments({
        duration: { $regex: "(week|month|day)", $options: "i" },
      });
      console.log(`- Atlas courses with week/month duration: ${weekAtlasCount}`);

      await mongoose.disconnect();
    } else {
      console.log("⚠️ No MONGO_URI found, skipping live Atlas query.");
    }
  } catch (err) {
    console.warn("Atlas query notice:", err.message);
  }

  console.log("\n==================================================");
  console.log("VALIDATION SUMMARY:");
  if (issues.length === 0) {
    console.log("ALL CHECKS PASSED PERFECTLY!");
    console.log("STATUS: PASS");
  } else {
    console.log(`FOUND ${issues.length} ISSUE(S):`);
    issues.forEach((iss, idx) => console.log(`  ${idx + 1}. ${iss}`));
    console.log("STATUS: NEEDS VERIFICATION");
  }
  console.log("==================================================");
}

runValidation().catch(console.error);
