const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;

async function runAtlasBackup() {
  console.log('🚀 [BackupService] Initializing KR GLOBAL LEARNING Atlas Backup...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas cluster.');

    const backupDir = path.join(__dirname, '..', 'backups', `backup_${Date.now()}`);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const collections = [
      'users',
      'courses',
      'payments',
      'invoices',
      'submissions',
      'certificates',
      'supportTickets',
      'activityLogs',
      'companySettings',
    ];

    const stats = {};

    for (const collName of collections) {
      try {
        const data = await mongoose.connection.db.collection(collName).find({}).toArray();
        const filePath = path.join(backupDir, `${collName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        stats[collName] = data.length;
        console.log(`📦 Backed up ${collName}: ${data.length} records`);
      } catch (err) {
        console.warn(`⚠️ Skipped ${collName}:`, err.message);
      }
    }

    const manifest = {
      backupTimestamp: new Date().toISOString(),
      companyName: 'KR GLOBAL LEARNING PRIVATE LIMITED',
      environment: process.env.NODE_ENV || 'production',
      database: mongoose.connection.name,
      stats,
    };

    fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(`\n🎉 Backup completed successfully in: ${backupDir}`);
    await mongoose.disconnect();
    return { success: true, backupDir, manifest };
  } catch (err) {
    console.error('❌ Backup failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runAtlasBackup();
}

module.exports = runAtlasBackup;
