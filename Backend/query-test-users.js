import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import connectDB from './src/config/database.js';

async function getTestUsers() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not set in .env');
      process.exit(1);
    }

    await connectDB();

    // Get first 10 users with email, fullName, role, idGeneratedCount
    const users = await User.find({})
      .select('email fullName role idGeneratedCount authKey github_username')
      .limit(10)
      .lean();

    if (users.length === 0) {
      console.log('No users found in database');
      process.exit(0);
    }

    console.log('\n✅ TEST USER IDs FOR ADMIN ID CARDS TAB\n');
    console.log('='.repeat(80));
    
    users.forEach((user, idx) => {
      console.log(`\n${idx + 1}. ${user.fullName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   GitHub: @${user.github_username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID Cards Generated: ${user.idGeneratedCount || 0}/2`);
      console.log(`   Auth Key: ${user.authKey || 'Not yet generated'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`\nTotal users in database: ${await User.countDocuments()}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

getTestUsers();
