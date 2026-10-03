/**
 * TIPPED — Database Seeder Script
 * File: seed.js
 *
 * Command: npm run seed / node seed.js
 *
 * Populates MongoDB with:
 * 1. Default Admin User:
 *    - Username: 'itdeptmnl'
 *    - Password: '123' (hashed with bcrypt)
 *    - Role: 'admin'
 *    - Email: 'itdeptmnl@tip.edu.ph'
 * 2. Default Student User:
 *    - Username: 'student'
 *    - Password: '123'
 *    - Role: 'student'
 *    - Email: 'student@tip.edu.ph'
 * 3. Sample Incident Records across Arlegui & Casal campuses
 */

async function runSeed() {
  console.log('\n==================================================');
  console.log('  🌱 TIPPED Database Seeder');
  console.log('==================================================');

  let mongoose, bcrypt, User, Incident;
  try {
    mongoose = require('mongoose');
    bcrypt = require('bcryptjs');
    const models = require('./models/tipped-mongoose-models');
    User = models.User;
    Incident = models.Incident;
  } catch (modErr) {
    console.warn(`⚠️  Notice: Required module (${modErr.message}) is not yet installed in local node_modules.`);
    console.log('ℹ️  Run `npm install` to install Mongoose and Bcrypt dependencies.');
    console.log('📋 Default Admin Configuration (Ready for deployment):');
    console.log('   - Username: itdeptmnl');
    console.log('   - Password: 123 (to be hashed via bcrypt)');
    console.log('   - Role:     admin');
    console.log('   - Email:    itdeptmnl@tip.edu.ph\n');
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
    // Generate bcrypt hash for password '123'
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123', salt);

    // 1. Seed Default Admin User
    const adminUserData = {
      fullName: 'Campus IT Administrator',
      username: 'itdeptmnl',
      email: 'itdeptmnl@tip.edu.ph',
      tipEmail: 'itdeptmnl@tip.edu.ph',
      passwordHash: passwordHash,
      role: 'admin',
      department: 'Campus IT & Facilities Management'
    };

    await User.deleteOne({
      $or: [{ username: 'itdeptmnl' }, { tipEmail: 'itdeptmnl@tip.edu.ph' }]
    });
    const adminUser = await User.create(adminUserData);
    console.log('✅ Default Admin created:');
    console.log('   - Username: itdeptmnl');
    console.log('   - Password: 123');
    console.log('   - Email:    itdeptmnl@tip.edu.ph');
    console.log('   - Role:     admin');

    // 2. Seed Default Student User
    await User.deleteOne({
      $or: [{ username: 'student' }, { tipEmail: 'student@tip.edu.ph' }]
    });
    const studentUser = await User.create({
      fullName: 'Christian Morales',
      username: 'student',
      email: 'student@tip.edu.ph',
      tipEmail: 'student@tip.edu.ph',
      passwordHash: passwordHash,
      role: 'student',
      department: 'College of Computer Studies'
    });
    console.log('✅ Default Student created:');
    console.log('   - Username: student');
    console.log('   - Password: 123');
    console.log('   - Email:    student@tip.edu.ph');
    console.log('   - Role:     student');

    // 3. Seed Sample Incidents
    await Incident.deleteMany({});
    const sampleIncidents = [
      {
        ticketId: '#ARL-FAC-2026-877',
        reporter: studentUser._id,
        reporterId: studentUser._id,
        campus: 'Arlegui',
        roomCode: '#A-302',
        category: 'HVAC & Cooling',
        status: 'In Progress',
        priority: 'High',
        assignedTeam: 'Maintenance',
        description: 'Split-type AC unit in CAD Lab 302 is vibrating heavily and blowing room-temperature air.',
        evidencePhotos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
        staffNotes: [
          {
            note: 'Compressor belt inspection scheduled for 2:00 PM today.',
            staffName: 'Engr. D. Santos (Facilities)',
            createdAt: new Date()
          }
        ]
      },
      {
        ticketId: '#ARL-FAC-2026-862',
        reporter: studentUser._id,
        reporterId: studentUser._id,
        campus: 'Arlegui',
        roomCode: '#A-104',
        category: 'Water & Sanitation',
        status: 'Pending',
        priority: 'Medium',
        assignedTeam: 'Maintenance',
        description: 'Faucet in Ground Floor Men\'s Restroom leaking continuously.',
        evidencePhotos: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80'],
        staffNotes: []
      },
      {
        ticketId: '#CAS-FAC-2026-791',
        reporter: studentUser._id,
        reporterId: studentUser._id,
        campus: 'Casal',
        roomCode: '#C-208',
        category: 'Electrical & Power',
        status: 'Resolved',
        priority: 'High',
        assignedTeam: 'Maintenance',
        description: 'Flickering LED ballast and burnt socket repaired.',
        evidencePhotos: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'],
        staffNotes: [
          {
            note: 'Replaced ballast and verified voltage safety.',
            staffName: 'Tech R. Ocampo',
            createdAt: new Date()
          }
        ]
      }
    ];

    await Incident.insertMany(sampleIncidents);
    console.log(`✅ Inserted ${sampleIncidents.length} sample incident tickets into database.`);
    console.log('\n🎉 [TIPPED SEEDER] Seeding completed successfully!\n');
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

runSeed();
