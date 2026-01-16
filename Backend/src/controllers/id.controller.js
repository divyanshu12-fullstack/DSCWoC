import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.model.js';
import { generateQr } from '../utils/generateQr.js';
import { drawIdCard } from '../utils/drawIdCard.js';

const MAX_GENERATIONS = 2; // Back to limit of 2
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get template path based on user role
function getTemplatePath(role) {
  const roleTemplates = {
    'Contributor': 'id-template-contributor.png',
    'Mentor': 'id-template-mentor.png',
    'Admin': 'id-template-admin.png',
  };
  // Default to contributor template for Participant or any other role
  const templateFile = roleTemplates[role] || 'id-template-contributor.png';
  return path.join(__dirname, '../../assets', templateFile);
}

// Generate auth key in format DSW-26-XXXX
function generateAuthKey() {
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `DSW-26-${randomPart}`;
}

export const generateIdCard = async (req, res, next) => {
  try {
    const { email, linkedinId, name, githubId } = req.body || {};
    const file = req.file;

    if (!name) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!githubId) {
      return res.status(400).json({ message: 'GitHub ID is required' });
    }

    if (!linkedinId) {
      return res.status(400).json({ message: 'LinkedIn ID is required' });
    }

    if (!file) {
      return res.status(400).json({ message: 'Profile photo is required' });
    }

    // ===== PRODUCTION MODE: Query database for user role and check generation limit =====
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Email not found. Please register first for DSCWoC 2026.',
        generationsLeft: 0
      });
    }

    // Check generation limit
    const generationsRemaining = MAX_GENERATIONS - (user.idGeneratedCount || 0);
    if (generationsRemaining <= 0) {
      return res.status(429).json({ 
        message: 'Generation limit reached. You can only generate 2 ID cards.',
        generationsLeft: 0
      });
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

    // Generate QR with auth key
    const qrBuffer = await generateQr(user.authKey);

    // Get the appropriate template based on user role
    const templatePath = getTemplatePath(user.role);

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

    // ✅ ONLY INCREMENT COUNTER AFTER SUCCESSFUL GENERATION
    user.idGeneratedCount = (user.idGeneratedCount || 0) + 1;
    await user.save();

    // Send response with headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="DSCWoC_2026_${user.role}_Card.png"`);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-User-Role', user.role);
    res.setHeader('X-Generations-Left', generationsRemaining - 1);
    
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
