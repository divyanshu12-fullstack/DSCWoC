import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

async function addTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const githubUsername = 'admgensameer';
    
    // Check if user exists
    let user = await User.findOne({ github_username: githubUsername });
    
    if (user) {
      console.log(`✓ User ${githubUsername} already exists`);
      console.log(`  - Name: ${user.fullName}`);
      console.log(`  - Role: ${user.role}`);
      console.log(`  - ID Generated: ${user.idGeneratedCount || 0}/2`);
    } else {
      // Create new test user
      user = await User.create({
        github_id: '12345678',
        github_username: githubUsername,
        fullName: 'Sameer Admin',
        email: 'sameer@dscvitb.in',
        role: 'Admin',
        githubUrl: `https://github.com/${githubUsername}`,
        linkedinUrl: 'https://linkedin.com/in/sameer',
        idGeneratedCount: 0
      });
      console.log(`✓ Created test user: ${githubUsername}`);
    }

    console.log('\n✅ Ready to generate ID card!');
    console.log(`   Visit: http://localhost:5173/generate-id`);
    console.log(`   GitHub Username: ${githubUsername}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addTestUser();
