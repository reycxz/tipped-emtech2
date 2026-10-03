/**
 * TIPPED — Admin & Department Staff Seeder Script
 * File: scripts/seedAdmin.js
 *
 * Command: npm run seed:admin / node scripts/seedAdmin.js
 *
 * Creates or updates:
 * 1. SUPER ADMIN (Overseer View):
 *    - Username: 'superadmin'
 *    - Email: 'admin@tip.edu.ph'
 *    - Password: 'admin123'
 *    - Role: 'admin'
 *
 * 2. DEPARTMENT STAFF (Filtered View):
 *    - Username: 'itdeptmnl'
 *    - Email: 'it@tip.edu.ph'
 *    - Password: '123'
 *    - Role: 'staff'
 *    - Department: 'ITSO'
 */

async function runAdminSeed() {
  console.log('\n==================================================');
  console.log('  🛡️ TIPPED Super Admin & Staff Accounts Seeder');
  console.log('==================================================');

  let mongoose, bcrypt, User;
  try {
    mongoose = require('mongoose');
    bcrypt = require('bcryptjs');
    const models = require('../models/tipped-mongoose-models');
    User = models.User;
  } catch (modErr) {
    console.warn(`⚠️  Notice: ${modErr.message}`);
    console.log('ℹ️  Run `npm install` if running on a live Node environment with MongoDB.');
    console.log('📋 Prepared Admin & Staff Credentials:');
    console.log('   [1] Super Admin:  username: superadmin | email: admin@tip.edu.ph | pass: admin123 | role: admin');
    console.log('   [2] Dept Staff:   username: itdeptmnl  | email: it@tip.edu.ph    | pass: 123      | role: staff | dept: ITSO\n');
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tipped-db';
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('✅ MongoDB connected successfully.');
  } catch (connErr) {
    console.warn('⚠️  Could not connect to MongoDB server:', connErr.message);
    console.log('ℹ️  Ensure your local/remote MongoDB daemon is active.');
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const superAdminHash = await bcrypt.hash('admin123', salt);
    const staffHash = await bcrypt.hash('123', salt);

    // 1. Seed / Update Super Admin
    await User.deleteOne({
      $or: [{ username: 'superadmin' }, { email: 'admin@tip.edu.ph' }, { tipEmail: 'admin@tip.edu.ph' }]
    });

    const superAdmin = await User.create({
      fullName: 'Super Administrator',
      username: 'superadmin',
      email: 'admin@tip.edu.ph',
      tipEmail: 'admin@tip.edu.ph',
      passwordHash: superAdminHash,
      role: 'admin',
      department: 'Executive Operations'
    });

    console.log('✅ Super Admin Created / Updated:');
    console.log('   - Username:   superadmin');
    console.log('   - Email:      admin@tip.edu.ph');
    console.log('   - Password:   admin123');
    console.log('   - Role:       admin');
    console.log('   - Department: Executive Operations');

    // 2. Seed / Update Department Staff (ITSO)
    await User.deleteOne({
      $or: [{ username: 'itdeptmnl' }, { email: 'it@tip.edu.ph' }, { tipEmail: 'it@tip.edu.ph' }]
    });

    const deptStaff = await User.create({
      fullName: 'ITSO Department Staff',
      username: 'itdeptmnl',
      email: 'it@tip.edu.ph',
      tipEmail: 'it@tip.edu.ph',
      passwordHash: staffHash,
      role: 'staff',
      department: 'ITSO'
    });

    console.log('✅ Department Staff Created / Updated:');
    console.log('   - Username:   itdeptmnl');
    console.log('   - Email:      it@tip.edu.ph');
    console.log('   - Password:   123');
    console.log('   - Role:       staff');
    console.log('   - Department: ITSO');

    console.log('\n🎉 [TIPPED SEEDER] Super Admin & Staff accounts seeded successfully!\n');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

runAdminSeed();
