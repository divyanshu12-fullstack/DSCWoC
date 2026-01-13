import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './src/models/User.model.js';
import PullRequest from './src/models/PullRequest.model.js';
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

  // 1) Recalculate PR points (respects pointsOverride)
  let prChanged = 0;
  let prTotal = 0;
  for await (const pr of PullRequest.find({}).cursor()) {
    prTotal += 1;
    const before = pr.points || 0;
    pr.calculatePoints();
    const after = pr.points || 0;
    if (before !== after) {
      await pr.save();
      prChanged += 1;
    }
  }

  // 2) Recalculate user stats and badges
  const filter = role ? { role } : {};
  const users = await User.find(filter);

  let userChanged = 0;
  for (const user of users) {
    const before = user.stats?.points || 0;
    await user.updateStats();
    await Badge.checkAndAwardBadges(user._id);
    const after = user.stats?.points || 0;
    if (before !== after) userChanged += 1;
  }

  // 3) Update ranks
  await User.updateRanks();

  console.log(
    `✅ Leaderboard recomputed. PRs: ${prTotal} scanned, ${prChanged} changed. Users: ${users.length} recomputed, ${userChanged} points-changed.`
  );

  await mongoose.connection.close();
}

main().catch(async (err) => {
  console.error('Failed to recompute leaderboard:', err);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
