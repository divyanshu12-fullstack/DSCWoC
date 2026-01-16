import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import connectDB from './src/config/database.js';

/**
 * Add test users specifically for Admin ID Cards tab testing
 * Usage: node add-test-id-users.js
 */

async function addTestIdUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Test User 1 - Never generated ID card
    const testUser1 = {
      email: 'test.idcard.fresh@example.com',
      fullName: 'Fresh User (No ID Cards)',
      github_id: 'test-idcard-fresh-001',
      github_username: 'testidcardfresh',
      githubUrl: 'https://github.com/testidcardfresh',
      avatar_url: 'https://api.github.com/users/github/avatar_url?size=200',
      role: 'Contributor',
      linkedinUrl: 'https://linkedin.com/in/testidcardfresh',
      college: 'Test University',
      isActive: true,
      stats: {
        totalPRs: 3,
        mergedPRs: 2,
        prPoints: 100,
        bonusPoints: 0,
        points: 100,
        rank: 50,
      },
      idGeneratedCount: 0,
      authKey: null,
    };

    // Test User 2 - 1 ID card generated (can still generate 1 more)
    const testUser2 = {
      email: 'test.idcard.once@example.com',
      fullName: 'Once Generated (1/2 Cards)',
      github_id: 'test-idcard-once-001',
      github_username: 'testidcardonce',
      githubUrl: 'https://github.com/testidcardonce',
      avatar_url: 'https://api.github.com/users/github/avatar_url?size=200',
      role: 'Contributor',
      linkedinUrl: 'https://linkedin.com/in/testidcardonce',
      college: 'Test University',
      isActive: true,
      stats: {
        totalPRs: 5,
        mergedPRs: 4,
        prPoints: 200,
        bonusPoints: 0,
        points: 200,
        rank: 40,
      },
      idGeneratedCount: 1,
      authKey: 'DSW-26-9999',
    };

    // Test User 3 - Limit reached (2/2 - needs grace retry)
    const testUser3 = {
      email: 'test.idcard.limit@example.com',
      fullName: 'Limit Reached (2/2 Cards)',
      github_id: 'test-idcard-limit-001',
      github_username: 'testidcardlimit',
      githubUrl: 'https://github.com/testidcardlimit',
      avatar_url: 'https://api.github.com/users/github/avatar_url?size=200',
      role: 'Contributor',
      linkedinUrl: 'https://linkedin.com/in/testidcardlimit',
      college: 'Test University',
      isActive: true,
      stats: {
        totalPRs: 8,
        mergedPRs: 7,
        prPoints: 350,
        bonusPoints: 50,
        points: 400,
        rank: 25,
      },
      idGeneratedCount: 2,
      authKey: 'DSW-26-5555',
    };

    const testUsers = [testUser1, testUser2, testUser3];
    console.log('📝 Adding test users for Admin ID Cards testing...\n');

    for (const testUser of testUsers) {
      const existing = await User.findOne({ email: testUser.email });

      if (existing) {
        console.log(`⏭️  "${testUser.fullName}" already exists, skipping...`);
      } else {
        const user = new User(testUser);
        await user.save();
        console.log(`✅ Created: ${testUser.fullName}`);
        console.log(`   📧 Email: ${testUser.email}`);
        console.log(`   🐙 GitHub: @${testUser.github_username}`);
        console.log(`   🎫 ID Cards: ${testUser.idGeneratedCount}/2`);
        console.log(`   🔑 Auth Key: ${testUser.authKey || 'Not yet generated'}\n`);
      }
    }

    // Show summary
    console.log('━'.repeat(70));
    console.log('📋 ADMIN ID CARDS TAB TEST USERS:\n');
    
    const createdUsers = await User.find({ 
      email: { $in: testUsers.map(u => u.email) }
    }).lean();

    createdUsers.forEach((u, i) => {
      console.log(`${i + 1}. ${u.fullName}`);
      console.log(`   📧 ${u.email}`);
      console.log(`   🎫 Cards: ${u.idGeneratedCount || 0}/2`);
      console.log(`   💡 Use for: ${
        u.idGeneratedCount === 0 ? 'Test full generation flow' :
        u.idGeneratedCount === 1 ? 'Test decrement grace retry' :
        'Test reset grace retry (limit reached)'
      }\n`);
    });

    console.log('✨ Ready to test Admin ID Cards tab!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

addTestIdUsers();
