import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function addTestUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dscwoc');
    console.log('✅ Connected to MongoDB\n');

    // Test User 1 - Contributor
    const testUser1 = {
      email: 'test.contributor@example.com',
      fullName: 'Test Contributor',
      github_id: 'test-contributor-001',
      github_username: 'testcontributor',
      githubUrl: 'https://github.com/testcontributor',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      role: 'Contributor',
      linkedinUrl: 'https://linkedin.com/in/testcontributor',
      college: 'Test College',
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

    // Test User 2 - Admin
    const testUser2 = {
      email: 'test.admin@example.com',
      fullName: 'Test Admin',
      github_id: 'test-admin-001',
      github_username: 'testadmin',
      githubUrl: 'https://github.com/testadmin',
      avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
      role: 'Admin',
      linkedinUrl: 'https://linkedin.com/in/testadmin',
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

    // Check if test users already exist
    const existing1 = await User.findOne({ email: testUser1.email });
    const existing2 = await User.findOne({ email: testUser2.email });

    if (existing1) {
      console.log('⏭️  Test User 1 already exists, skipping...');
    } else {
      const user1 = new User(testUser1);
      await user1.save();
      console.log('✅ Test User 1 Created');
      console.log(`   Email: ${testUser1.email}`);
      console.log(`   Role: ${testUser1.role}`);
      console.log(`   GitHub: ${testUser1.github_username}\n`);
    }

    if (existing2) {
      console.log('⏭️  Test User 2 already exists, skipping...');
    } else {
      const user2 = new User(testUser2);
      await user2.save();
      console.log('✅ Test User 2 Created');
      console.log(`   Email: ${testUser2.email}`);
      console.log(`   Role: ${testUser2.role}`);
      console.log(`   GitHub: ${testUser2.github_username}\n`);
    }

    // Show all test users
    console.log('📋 Current Test Users in Database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const testUsers = await User.find({ 
      email: { $in: ['test.contributor@example.com', 'test.admin@example.com'] }
    }).lean();

    testUsers.forEach((u, i) => {
      console.log(`\n${i + 1}. ${u.fullName}`);
      console.log(`   Email: ${u.email}`);
      console.log(`   GitHub: ${u.github_username}`);
      console.log(`   Role: ${u.role}`);
      console.log(`   Generations Left: ${2 - (u.idGeneratedCount || 0)}/2`);
    });

    // Get database stats
    const total = await User.countDocuments();
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Database Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Users: ${total}`);
    roleStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    console.log('\n✅ Test setup complete!');
    console.log('\n🧪 You can now test ID card generation with:');
    console.log('   Email: test.contributor@example.com');
    console.log('   Email: test.admin@example.com');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTestUsers();
