import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function getAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const admins = await User.find({ role: 'Admin' }).select('email name github registrationNo');
    
    console.log(`📋 Found ${admins.length} Admins:\n`);
    console.log('─'.repeat(80));
    
    admins.forEach((admin, idx) => {
      console.log(`${idx + 1}. ${admin.name || 'N/A'}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   GitHub: ${admin.github || 'N/A'}`);
      console.log(`   Registration No: ${admin.registrationNo || 'N/A'}`);
      console.log('');
    });

    console.log('─'.repeat(80));
    console.log(`✅ Total Admins: ${admins.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getAdmins();
