import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './src/models/User.model.js';
import Badge from './src/models/Badge.model.js';

dotenv.config();

const role = process.argv[2]; // optional: Contributor | Mentor | Admin

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Missing MONGODB_URI in environment.');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const filter = role ? { role } : {};
  const users = await User.find(filter).select('_id github_username stats').lean(false);

  let changed = 0;
  for (const user of users) {
    const before = user.stats?.points || 0;

    // Recompute PR-derived stats and keep bonusPoints
    await user.updateStats();
    await Badge.checkAndAwardBadges(user._id);

    const after = user.stats?.points || 0;
    if (before !== after) changed += 1;
  }

  await User.updateRanks();

  console.log(`✅ Recalculated stats for ${users.length} users. Points changed for ${changed} users.`);

  await mongoose.connection.close();
}

main().catch(async (err) => {
  console.error('Failed to recalculate stats:', err);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
