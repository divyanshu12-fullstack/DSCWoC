import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const username = process.argv[2] || 'Abhishekhack2909';
const role = process.argv[3] || 'Admin';

async function promoteUser() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const result = await mongoose.connection.db.collection('users').updateOne(
    { github_username: username },
    { $set: { role: role } }
  );
  
  if (result.modifiedCount > 0) {
    console.log(`✅ User "${username}" promoted to "${role}"`);
  } else {
    console.log(`❌ User "${username}" not found or already has role "${role}"`);
  }
  
  // Show all users
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log('\nAll users:');
  users.forEach(u => console.log(`  - ${u.github_username}: ${u.role}`));
  
  await mongoose.connection.close();
}

promoteUser();
