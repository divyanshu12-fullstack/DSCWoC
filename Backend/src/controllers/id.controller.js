import fs from 'fs';
import path from 'path';
import User from '../models/User.model.js';
import { generateQr } from '../utils/generateQr.js';
import { drawIdCard } from '../utils/drawIdCard.js';

const MAX_GENERATIONS = 2; // Back to limit of 2
const templatePath = path.join(process.cwd(), 'assets', 'id-template.png');

// Generate auth key in format DSW-26-XXXX
function generateAuthKey() {
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `DSW-26-${randomPart}`;
}

export const generateIdCard = async (req, res, next) => {
  try {
    const { email, linkedinId } = req.body || {};
    const file = req.file;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!linkedinId) {
      return res.status(400).json({ message: 'LinkedIn ID is required' });
    }

    // ===== TESTING MODE: Skip database lookup =====
    // Uncomment below for production mode
    /*
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Email not found. Please register first for DSCWoC 2026.' });
    }

    // Generate auth key if doesn't exist
    if (!user.authKey) {
      let authKey;
      let isUnique = false;
      
      // Keep generating until we get a unique key
      while (!isUnique) {
        authKey = generateAuthKey();
        const existing = await User.findOne({ authKey });
        if (!existing) isUnique = true;
      }
      
      user.authKey = authKey;
    }

    // Update LinkedIn URL
    const linkedinUrl = linkedinId.startsWith('http') 
      ? linkedinId 
      : `https://linkedin.com/in/${linkedinId}`;
    user.linkedinUrl = linkedinUrl;

    if (user.idGeneratedCount >= MAX_GENERATIONS) {
      return res.status(429).json({ message: 'Generation limit reached. You can only generate 2 ID cards.' });
    }
    */

    // ===== TESTING: Use dummy user data =====
    const authKey = generateAuthKey();
    const linkedinUrl = linkedinId.startsWith('http') 
      ? linkedinId 
      : `https://linkedin.com/in/${linkedinId}`;
    
    const user = {
      fullName: 'Test User',
      role: 'Participant',
      github_username: 'testuser',
      linkedinUrl: linkedinUrl,
      authKey: authKey,
      email: email,
    };

    // Generate QR with auth key
    const qrBuffer = await generateQr(user.authKey);

    const idBuffer = await drawIdCard({
      templatePath,
      photoBuffer: file.buffer,
      qrBuffer,
      user: {
        fullName: user.fullName,
        role: user.role,
        github_username: user.github_username,
        linkedinUrl: user.linkedinUrl,
        authKey: user.authKey,
        email: user.email,
      },
    });

    // ===== TESTING: Skip database update =====
    // Uncomment below for production mode
    /*
    // Increment count and save user with updated authKey and LinkedIn
    user.idGeneratedCount = (user.idGeneratedCount || 0) + 1;
    await user.save();
    */

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="DSWC_ID.png"');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(idBuffer);
  } catch (err) {
    return next(err);
  }
};

export const verifyAuthKey = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Missing id parameter' });
    }

    const user = await User.findOne({ authKey: id }).lean();
    if (!user) {
      return res.status(404).json({ valid: false, message: 'Invalid ID' });
    }

    return res.status(200).json({
      valid: true,
      name: user.fullName,
      role: user.role,
      github: user.github_username,
      linkedin: user.linkedinUrl || null,
    });
  } catch (err) {
    return next(err);
  }
};
