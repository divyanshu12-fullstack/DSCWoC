#!/usr/bin/env node

import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function addTestUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dscwoc');
    console.log('\n✅ Connected to MongoDB\n');

    const testUser1 = {
      email: 'test.contributor@example.com',
      fullName: 'Test Contributor',
      github_id: 'test-contributor-001',
      github_username: 'testcontributor',
      role: 'Contributor',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      isActive: true,
      stats: {
        totalPRs: 5,
        mergedPRs: 3,
        prPoints: 150,
        bonusPoints: 0,
        points: 150,
        rank: 45,
      },
      idGeneratedCount: 0,
    };

    const testUser2 = {
      email: 'test.admin@example.com',
      fullName: 'Test Admin',
      github_id: 'test-admin-001',
      github_username: 'testadmin',
      role: 'Admin',
      avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
      isActive: true,
      stats: {
        totalPRs: 20,
        mergedPRs: 18,
        prPoints: 500,
        bonusPoints: 100,
        points: 600,
        rank: 5,
      },
      idGeneratedCount: 0,
    };

    const existing1 = await User.findOne({ email: testUser1.email });
    const existing2 = await User.findOne({ email: testUser2.email });

    if (!existing1) {
      await User.create(testUser1);
      console.log('✅ Test User 1 (Contributor) Added');
      console.log('   Email: test.contributor@example.com');
      console.log('   GitHub: testcontributor');
    } else {
      console.log('⏭️  Test User 1 already exists');
    }

    if (!existing2) {
      await User.create(testUser2);
      console.log('✅ Test User 2 (Admin) Added');
      console.log('   Email: test.admin@example.com');
      console.log('   GitHub: testadmin');
    } else {
      console.log('⏭️  Test User 2 already exists');
    }

    const total = await User.countDocuments();
    const stats = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);

    console.log('\n📊 Database Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Users: ${total}`);
    stats.forEach(s => console.log(`  ${s._id}: ${s.count}`));

    console.log('\n🧪 Ready to Test ID Card Generation!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test User 1 (Contributor):');
    console.log('  Email: test.contributor@example.com');
    console.log('  Max Generations: 2/2\n');
    console.log('Test User 2 (Admin):');
    console.log('  Email: test.admin@example.com');
    console.log('  Max Generations: 2/2\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTestUsers();
