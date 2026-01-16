import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

async function updateUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'test.idcard.once@example.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('📧 Email:', user.email);
    console.log('🔴 Old Role:', user.role);
    console.log('🔴 Old ID Count:', user.idGeneratedCount);

    // Update role and reset count
    user.role = 'Admin';
    user.idGeneratedCount = 0;
    await user.save();

    console.log('\n✅ User updated successfully!');
    console.log('🟠 New Role:', user.role);
    console.log('🟠 New ID Count:', user.idGeneratedCount);
    console.log('🐙 GitHub:', '@' + user.github_username);
    console.log('🎫 Auth Key:', user.authKey);
    console.log('\n💡 User can now generate 2 new ID cards with Admin template!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateUser();
