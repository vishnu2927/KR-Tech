import fs from 'fs';
import path from 'path';

console.log('=== STARTING COURSE PRICING & DURATION CONVERSION ===\n');

// 1. Read src/data/coursesData.ts
const filePath = 'src/data/coursesData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Ensure Course interface has durationHours: number
if (!content.includes('durationHours: number;')) {
  content = content.replace(
    'duration: string;',
    'duration: string;\n  durationHours: number;'
  );
  console.log('✅ Added durationHours: number to Course interface');
}

// Mapping of the 31 non-USD courses to sensible USD prices and Hours
// And mapping of all 84 courses to exact training Hours
const courseUpdates = {
  // Software Development (7 courses)
  'java-backend': { price: '$499', duration: '180 Hours', durationHours: 180 },
  'mern-stack': { price: '$499', duration: '150 Hours', durationHours: 150 },
  'react-frontend': { price: '$399', duration: '90 Hours', durationHours: 90 },
  'nodejs-backend': { price: '$399', duration: '120 Hours', durationHours: 120 },
  'python-mastery': { price: '$349', duration: '80 Hours', durationHours: 80 },
  'data-science': { price: '$549', duration: '120 Hours', durationHours: 120 },
  'dsa-competitive': { price: '$399', duration: '120 Hours', durationHours: 120 },

  // Cloud & Cloud Architecture (17 courses - preserve approved USD prices, convert duration to Hours)
  'aws-certified-cloud-practitioner': { price: '$499', duration: '40 Hours', durationHours: 40 },
  'aws-solutions-architect': { price: '$549', duration: '80 Hours', durationHours: 80 },
  'aws-solutions-architect-professional': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'aws-developer': { price: '$549', duration: '80 Hours', durationHours: 80 },
  'aws-sysops-administrator': { price: '$549', duration: '80 Hours', durationHours: 80 },
  'aws-devops-engineer-professional': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'aws-security-specialty': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'aws-advanced-networking-specialty': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'azure-az900': { price: '$499', duration: '40 Hours', durationHours: 40 },
  'azure-az104': { price: '$549', duration: '80 Hours', durationHours: 80 },
  'azure-solutions-architect': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'azure-devops-engineer-az400': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'azure-network-engineer-az700': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'azure-security-engineer-az500': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'gcp-digital-leader': { price: '$599', duration: '40 Hours', durationHours: 40 },
  'gcp-associate-cloud-engineer': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'google-professional-cl': { price: '$599', duration: '100 Hours', durationHours: 100 },

  // AI, Machine Learning & GenAI (10 courses - preserve approved USD prices, convert duration to Hours)
  'aws-ai-practitioner': { price: '$499', duration: '40 Hours', durationHours: 40 },
  'aws-machine-learning-engineer-associate': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'aws-machine-learning-specialty': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'azure-ai-fundamentals-ai900': { price: '$499', duration: '40 Hours', durationHours: 40 },
  'azure-ai-engineer-associate-ai103': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'google-professional-machine-learning-engineer': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'google-cloud-generative-ai-leader': { price: '$599', duration: '40 Hours', durationHours: 40 },
  'databricks-generative-ai-engineer-associate': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'databricks-machine-learning-associate': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'databricks-machine-learning-professional': { price: '$599', duration: '100 Hours', durationHours: 100 },

  // Cybersecurity (14 courses - preserve approved USD prices, convert duration to Hours)
  'comptia-security-plus': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'comptia-cysa-plus': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'comptia-pentest-plus': { price: '$699', duration: '80 Hours', durationHours: 80 },
  'comptia-casp-plus-securityx': { price: '$699', duration: '100 Hours', durationHours: 100 },
  'comptia-network-plus': { price: '$699', duration: '80 Hours', durationHours: 80 },
  'ceh-certified-ethical-hacker': { price: '$799', duration: '100 Hours', durationHours: 100 },
  'cissp-mastery': { price: '$899', duration: '120 Hours', durationHours: 120 },
  'cism-management': { price: '$699', duration: '80 Hours', durationHours: 80 },
  'cisa-auditing': { price: '$699', duration: '80 Hours', durationHours: 80 },
  'crisc-risk-information-systems-control': { price: '$799', duration: '80 Hours', durationHours: 80 },
  'ccsp-cloud-security': { price: '$799', duration: '100 Hours', durationHours: 100 },
  'giac-penetration-tester-gpen': { price: '$699', duration: '100 Hours', durationHours: 100 },
  'palo-alto-firewall': { price: '$699', duration: '80 Hours', durationHours: 80 },
  'fortinet-nse-fcp-cybersecurity': { price: '$699', duration: '80 Hours', durationHours: 80 },

  // Networking (12 courses - preserve approved USD prices, convert duration to Hours)
  'cisco-ccna': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'cisco-ccnp-enterprise': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'cisco-ccnp-security': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'cisco-ccnp-data-center': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'cisco-ccie-enterprise-infrastructure': { price: '$599', duration: '120 Hours', durationHours: 120 },
  'cisco-ccie-security': { price: '$599', duration: '120 Hours', durationHours: 120 },
  'cisco-devnet-associate': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'cisco-cyberops-associate': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'fortinet-certified-fundamentals-cybersecurity': { price: '$599', duration: '40 Hours', durationHours: 40 },
  'fortinet-certified-associate-cybersecurity': { price: '$599', duration: '80 Hours', durationHours: 80 },
  'fortinet-certified-professional': { price: '$599', duration: '100 Hours', durationHours: 100 },
  'fortinet-certified-solution-specialist': { price: '$599', duration: '100 Hours', durationHours: 100 },

  // Microsoft & IT (7 courses)
  'microsoft-365-admin': { price: '$449', duration: '60 Hours', durationHours: 60 },
  'windows-server-admin': { price: '$449', duration: '75 Hours', durationHours: 75 },
  'active-directory-mastery': { price: '$399', duration: '45 Hours', durationHours: 45 },
  'git-github-devops': { price: '$249', duration: '30 Hours', durationHours: 30 },
  'servicenow-admin': { price: '$549', duration: '60 Hours', durationHours: 60 },
  'itil-4-foundation': { price: '$399', duration: '30 Hours', durationHours: 30 },
  'microsoft-professional': { price: '$299', duration: '30 Hours', durationHours: 30 },

  // Data & Analytics (5 courses)
  'power-bi-pl300': { price: '$499', duration: '75 Hours', durationHours: 75 },
  'tableau-desktop-specialist': { price: '$449', duration: '60 Hours', durationHours: 60 },
  'splunk-power-user': { price: '$499', duration: '60 Hours', durationHours: 60 },
  'sql-data-analytics': { price: '$299', duration: '40 Hours', durationHours: 40 },
  'excel-data-analytics': { price: '$199', duration: '30 Hours', durationHours: 30 },

  // Project Management (5 courses)
  'pmp-certification': { price: '$699', duration: '100 Hours', durationHours: 100 },
  'prince2-foundation': { price: '$549', duration: '60 Hours', durationHours: 60 },
  'scrum-master-csm': { price: '$449', duration: '40 Hours', durationHours: 40 },
  'safe-agilist': { price: '$499', duration: '50 Hours', durationHours: 50 },
  'togaf-enterprise-architecture': { price: '$599', duration: '90 Hours', durationHours: 90 },

  // Enterprise Technologies (7 courses - Salesforce & SAP)
  'salesforce-admin': { price: '$499', duration: '75 Hours', durationHours: 75 },
  'salesforce-developer': { price: '$549', duration: '90 Hours', durationHours: 90 },
  'sap-fico': { price: '$599', duration: '110 Hours', durationHours: 110 },
  'sap-mm': { price: '$549', duration: '90 Hours', durationHours: 90 },
  'sap-sd': { price: '$549', duration: '90 Hours', durationHours: 90 },
  'sap-abap': { price: '$599', duration: '110 Hours', durationHours: 110 },
  'sap-successfactors': { price: '$549', duration: '75 Hours', durationHours: 75 },
};

let inrConvertedCount = 0;
let durationConvertedCount = 0;
let usdPreservedCount = 0;

// Parse the file block by block and replace
for (const [id, update] of Object.entries(courseUpdates)) {
  const idRegex = new RegExp(`(id:\\s*["']${id}["'][\\s\\S]*?)(price:\\s*["'][^"']+["'])([\\s\\S]*?)(originalPrice:\\s*["'][^"']*["'])([\\s\\S]*?)(duration:\\s*["'][^"']+["'])`);
  const match = content.match(idRegex);
  
  if (match) {
    const oldPriceMatch = match[2];
    const oldDurMatch = match[6];
    
    if (oldPriceMatch.includes('₹') || oldPriceMatch.toLowerCase().includes('inr')) {
      inrConvertedCount++;
    } else {
      usdPreservedCount++;
    }
    
    if (!oldDurMatch.includes('Hours')) {
      durationConvertedCount++;
    }

    content = content.replace(idRegex, (full, p1, p2, p3, p4, p5, p6) => {
      // Return updated block with duration, durationHours, price, and clean originalPrice
      return `${p1}price: "${update.price}"${p3}originalPrice: ""${p5}duration: "${update.duration}",\n    durationHours: ${update.durationHours}`;
    });
  } else {
    // Try matching if duration appears before price
    const durFirstRegex = new RegExp(`(id:\\s*["']${id}["'][\\s\\S]*?)(duration:\\s*["'][^"']+["'])([\\s\\S]*?)(price:\\s*["'][^"']+["'])([\\s\\S]*?)(originalPrice:\\s*["'][^"']*["'])`);
    const match2 = content.match(durFirstRegex);
    if (match2) {
      if (match2[4].includes('₹') || match2[4].toLowerCase().includes('inr')) {
        inrConvertedCount++;
      } else {
        usdPreservedCount++;
      }
      if (!match2[2].includes('Hours')) {
        durationConvertedCount++;
      }
      content = content.replace(durFirstRegex, (full, p1, p2, p3, p4, p5, p6) => {
        return `${p1}duration: "${update.duration}",\n    durationHours: ${update.durationHours}${p3}price: "${update.price}"${p5}originalPrice: ""`;
      });
    } else {
      console.warn(`⚠️ Could not match course block for ID: ${id}`);
    }
  }
}

fs.writeFileSync(filePath, content, 'utf8');

console.log('Conversion Results for src/data/coursesData.ts:');
console.log(`- INR courses converted to USD: ${inrConvertedCount} (Expected: 31)`);
console.log(`- Approved USD courses preserved: ${usdPreservedCount} (Expected: 53)`);
console.log(`- Courses converted to Hours duration: ${durationConvertedCount} (Expected: 84)`);
