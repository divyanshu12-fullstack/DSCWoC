import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import connectDB from './src/config/database.js';

async function updateUserRole() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    const email = 'test.idcard.fresh@example.com';
    const newRole = 'Admin';

    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    console.log(`✅ Role updated successfully!\n`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔴 Old Role: ${oldRole}`);
    console.log(`🟠 New Role: ${newRole}`);
    console.log(`🐙 GitHub: @${user.github_username}`);
    console.log(`🎫 ID Cards: ${user.idGeneratedCount}/2\n`);
    
    console.log('💡 Next ID card generated will use the Admin template!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

updateUserRole();
