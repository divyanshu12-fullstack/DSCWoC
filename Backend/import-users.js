import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse CSV line properly handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Determine role based on which fields have data
function determineRole(row, headers) {
  // Check if it's a Contributor (has GitHub Username in contributor section)
  const contributorGithubIdx = headers.indexOf('1. GitHub Username');
  const mentorGithubIdx = headers.indexOf('3. GitHub Username');
  const projectNameIdx = headers.indexOf('1. Project Name');

  // If project name has data, it's an Admin
  if (row[projectNameIdx] && row[projectNameIdx].trim()) {
    return 'Admin';
  }

  // If mentor GitHub has data, it's a Mentor
  if (row[mentorGithubIdx] && row[mentorGithubIdx].trim() && !row[contributorGithubIdx]) {
    return 'Mentor';
  }

  // Default to Contributor
  return 'Contributor';
}

// Extract data based on role
function extractUserData(row, headers, role) {
  const getColumn = (columnName) => {
    const idx = headers.indexOf(columnName);
    return idx >= 0 ? row[idx] : '';
  };

  let userData = {
    email: '',
    fullName: '',
    github_username: '',
    linkedinUrl: '',
    role: role,
    isActive: true,
    stats: {
      totalPRs: 0,
      mergedPRs: 0,
      prPoints: 0,
      bonusPoints: 0,
      points: 0,
      rank: 0,
    },
  };

  if (role === 'Contributor') {
    userData.email = getColumn('4. Email Address') || getColumn('Email Address');
    userData.fullName = getColumn('1. Full Name');
    userData.github_username = getColumn('1. GitHub Username')?.replace('https://github.com/', '').replace('github.com/', '');

    const githubCol = getColumn('1. GitHub Username');
    if (githubCol) {
      userData.github_username = githubCol
        .replace('https://github.com/', '')
        .replace('http://github.com/', '')
        .replace('github.com/', '')
        .replace(/\/$/, '');
    }
  } else if (role === 'Mentor') {
    userData.email = getColumn('1. Email Address');
    userData.fullName = getColumn('1. Full Name');
    userData.github_username = getColumn('3. GitHub Username')?.replace('https://github.com/', '').replace('github.com/', '');
    userData.linkedinUrl = getColumn('5. LinkedIn Profile');

    const githubCol = getColumn('3. GitHub Username');
    if (githubCol) {
      userData.github_username = githubCol
        .replace('https://github.com/', '')
        .replace('http://github.com/', '')
        .replace('github.com/', '')
        .replace(/\/$/, '');
    }
  } else if (role === 'Admin') {
    userData.email = getColumn('6. Maintainer email');
    userData.fullName = getColumn('5. Maintainer name');
    userData.github_username = getColumn('7. Maintainer GitHub username')?.replace('https://github.com/', '').replace('github.com/', '');

    const githubCol = getColumn('7. Maintainer GitHub username');
    if (githubCol) {
      userData.github_username = githubCol
        .replace('https://github.com/', '')
        .replace('http://github.com/', '')
        .replace('github.com/', '')
        .replace(/\/$/, '');
    }
  }

  return userData;
}

async function importUsers(csvPath) {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dscwoc');
    console.log('✅ Connected to MongoDB');

    // Read CSV
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    
    const headers = parseCSVLine(lines[0]);
    console.log(`📋 Found ${headers.length} columns`);
    console.log(`👥 Found ${lines.length - 1} data rows\n`);

    let imported = 0;
    let skipped = 0;
    let duplicates = 0;

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      try {
        const row = parseCSVLine(lines[i]);
        const role = determineRole(row, headers);
        const userData = extractUserData(row, headers, role);

        // Validate required fields
        if (!userData.email || !userData.email.includes('@')) {
          skipped++;
          continue;
        }

        if (!userData.fullName || userData.fullName.trim() === '') {
          skipped++;
          continue;
        }

        if (!userData.github_username || userData.github_username.trim() === '') {
          skipped++;
          continue;
        }

        // Check if user already exists
        const existing = await User.findOne({ 
          $or: [
            { email: userData.email.toLowerCase() },
            { github_username: userData.github_username }
          ]
        });

        if (existing) {
          duplicates++;
          continue;
        }

        // Create new user with required GitHub OAuth fields
        const newUser = new User({
          ...userData,
          email: userData.email.toLowerCase(),
          github_id: `${userData.github_username}-${Date.now()}`, // Temp ID
          avatar_url: `https://avatars.githubusercontent.com/u/${Math.random().toString().slice(2, 10)}?v=4`,
        });

        await newUser.save();
        imported++;

        if (imported % 10 === 0) {
          console.log(`⏳ Imported ${imported} users...`);
        }
      } catch (rowError) {
        console.error(`❌ Error on row ${i}:`, rowError.message);
        skipped++;
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`✅ Imported: ${imported}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`🔄 Duplicates: ${duplicates}`);

    // Get role breakdown
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    console.log(`\n🎯 Users by Role:`);
    roleStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Import complete!');
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run import
const csvPath = process.argv[2];
if (!csvPath) {
  console.error('❌ Please provide CSV file path');
  console.log('Usage: node import-users.js <csv-path>');
  process.exit(1);
}

if (!fs.existsSync(csvPath)) {
  console.error(`❌ File not found: ${csvPath}`);
  process.exit(1);
}

importUsers(csvPath);
