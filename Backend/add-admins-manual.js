import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const adminsToAdd = [
  { email: 'parth.23bce11758@vitbhopal.ac.in', name: 'Parth Bhanti', regNo: '23BCE11758' },
  { email: 'himanshu.23bcy10127@vitbhopal.ac.in', name: 'Himanshu Gaur', regNo: '23BCY10127' },
  { email: 'shreyas.24bai10018@vitbhopal.ac.in', name: 'Shreyas Mene', regNo: '24BAI10018' },
  { email: 'prem.23mip10019@vitbhopal.ac.in', name: 'Prem Kumar R', regNo: '23MIP10019' },
  { email: 'mayank.23bcy10074@vitbhopal.ac.in', name: 'Mayank Agarwal', regNo: '23BCY10074' },
  { email: 'yonesh.23mei10006@vitbhopal.ac.in', name: 'Yonesh Murugan N B', regNo: '23MEI10006' },
  { email: 'neel.24bce10303@vitbhopal.ac.in', name: 'NEEL PANDEY', regNo: '24BCE10303' },
];

async function addAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let added = 0;
    let skipped = 0;

    for (const admin of adminsToAdd) {
      const existing = await User.findOne({ 
        $or: [
          { email: admin.email.toLowerCase() },
          { github_username: { $regex: `^${admin.regNo}`, $options: 'i' } }
        ]
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${admin.name} (${admin.email}) - Already exists`);
        skipped++;
        continue;
      }

      const newUser = new User({
        email: admin.email.toLowerCase(),
        fullName: admin.name,
        name: admin.name,
        registrationNo: admin.regNo,
        github_username: admin.regNo,
        github_id: `${admin.regNo}-${Date.now()}`,
        role: 'Admin',
        avatar_url: `https://avatars.githubusercontent.com/u/${Math.random().toString().slice(2, 10)}?v=4`,
        isActive: true,
        stats: {
          totalPRs: 0,
          mergedPRs: 0,
          prPoints: 0,
          bonusPoints: 0,
          points: 0,
          rank: 0,
        },
      });

      await newUser.save();
      console.log(`✅ Added: ${admin.name} (${admin.email})`);
      added++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Added: ${added}`);
    console.log(`⏭️  Skipped: ${skipped}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addAdmins();
