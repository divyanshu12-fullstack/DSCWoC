import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './src/config/database.js';
import User from './src/models/User.model.js';

/**
 * Reset or decrement a user's ID card generation count.
 * Usage:
 *   node reset-id-count.js <email> [--set=0]
 *
 * Examples:
 *   node reset-id-count.js user@example.com            # decrement by 1 (min 0)
 *   node reset-id-count.js user@example.com --set=0   # force set to 0
 */

const args = process.argv.slice(2);
const emailArg = args.find((a) => !a.startsWith('--'));
const setArg = args.find((a) => a.startsWith('--set='));

if (!emailArg) {
  console.error('Error: email is required.');
  console.error('Usage: node reset-id-count.js <email> [--set=0]');
  process.exit(1);
}

const targetEmail = emailArg.toLowerCase();
const forceSetToZero = setArg === '--set=0';

async function main() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not set. Load your .env or export it.');
      process.exit(1);
    }

    await connectDB();

    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      console.error(`Not found: No user with email "${targetEmail}"`);
      process.exit(1);
    }

    const before = user.idGeneratedCount || 0;
    if (forceSetToZero) {
      user.idGeneratedCount = 0;
    } else {
      user.idGeneratedCount = Math.max(0, before - 1);
    }

    await user.save();

    const after = user.idGeneratedCount || 0;
    console.log('✅ Reset complete');
    console.log({
      email: user.email,
      name: user.fullName,
      role: user.role,
      authKey: user.authKey || null,
      idGeneratedCountBefore: before,
      idGeneratedCountAfter: after,
    });
  } catch (err) {
    console.error('❌ Reset failed:', err?.message || err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

main();
