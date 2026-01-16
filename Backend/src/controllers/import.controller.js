import Project from '../models/Project.model.js';
import User from '../models/User.model.js';
import { HTTP_STATUS } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Parse CSV text to array of objects
 */
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have header row and at least one data row');
  }

  // Parse header - handle both comma and tab separated
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim());
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });
      data.push(row);
    }
  }

  return data;
};

/**
 * Map CSV row to project data
 * Expected columns: project_name, github_url, description, difficulty, mentor_github, tech_stack, tags
 */
const mapRowToProject = (row) => {
  // Try different possible column names
  const name = row.project_name || row.name || row.title || '';
  const githubUrl = row.github_url || row.github || row.repo_url || row.repository || '';
  const description = row.description || row.desc || '';
  const difficulty = row.difficulty || row.level || 'Intermediate';
  const mentorGithub = row.mentor_github || row.mentor || row.mentor_username || '';
  const techStack = row.tech_stack || row.technologies || row.tech || '';
  const tags = row.tags || row.labels || '';

  if (!name || !githubUrl) {
    return null;
  }

  // Parse GitHub URL to get owner and repo
  const match = githubUrl.match(/github\.com\/([\w\-\.]+)\/([\w\-\.]+)/);
  if (!match) {
    return null;
  }

  return {
    name,
    github_url: githubUrl.replace(/\.git$/, ''),
    github_owner: match[1],
    github_repo: match[2],
    description,
    difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(difficulty) ? difficulty : 'Intermediate',
    mentor_github: mentorGithub,
    tech_stack: techStack ? techStack.split(',').map(t => t.trim()).filter(Boolean) : [],
    tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
  };
};

/**
 * @desc    Import projects from CSV/Sheet data
 * @route   POST /api/v1/admin/import/projects
 * @access  Private (Admin only)
 */
export const importProjects = async (req, res) => {
  try {
    const { csvData, overwrite = false } = req.body;

    if (!csvData) {
      return errorResponse(res, 'CSV data is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Parse CSV
    let rows;
    try {
      rows = parseCSV(csvData);
    } catch (err) {
      return errorResponse(res, `Failed to parse CSV: ${err.message}`, HTTP_STATUS.BAD_REQUEST);
    }

    if (rows.length === 0) {
      return errorResponse(res, 'No valid data rows found in CSV', HTTP_STATUS.BAD_REQUEST);
    }

    const results = {
      total: rows.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is header, and we're 0-indexed

      try {
        const projectData = mapRowToProject(row);

        if (!projectData) {
          results.skipped++;
          results.errors.push({ row: rowNum, error: 'Missing required fields (name or github_url)' });
          continue;
        }

        // Check if project already exists
        const existingProject = await Project.findOne({
          github_owner: projectData.github_owner,
          github_repo: projectData.github_repo,
        });

        // Find mentor by GitHub username
        let mentorId = null;
        if (projectData.mentor_github) {
          const mentor = await User.findOne({ 
            github_username: { $regex: new RegExp(`^${projectData.mentor_github}$`, 'i') }
          });
          if (mentor) {
            mentorId = mentor._id;
          } else {
            logger.warn(`Mentor not found: ${projectData.mentor_github} for project ${projectData.name}`);
          }
        }

        if (existingProject) {
          if (overwrite) {
            // Update existing project
            existingProject.name = projectData.name;
            existingProject.description = projectData.description;
            existingProject.difficulty = projectData.difficulty;
            existingProject.tech_stack = projectData.tech_stack;
            existingProject.tags = projectData.tags;
            if (mentorId) existingProject.mentor = mentorId;
            await existingProject.save();
            results.updated++;
          } else {
            results.skipped++;
            results.errors.push({ row: rowNum, error: `Project already exists: ${projectData.github_owner}/${projectData.github_repo}` });
          }
        } else {
          // Create new project
          const newProject = new Project({
            name: projectData.name,
            description: projectData.description,
            github_url: projectData.github_url,
            github_owner: projectData.github_owner,
            github_repo: projectData.github_repo,
            difficulty: projectData.difficulty,
            tech_stack: projectData.tech_stack,
            tags: projectData.tags,
            mentor: mentorId || req.user._id, // Default to current admin if no mentor
            isActive: true,
            isApproved: true, // Auto-approve when imported by admin
          });
          await newProject.save();
          results.created++;
        }
      } catch (err) {
        results.errors.push({ row: rowNum, error: err.message });
      }
    }

    logger.info(`Projects import by ${req.user.github_username}: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`);

    successResponse(res, results, `Import completed: ${results.created} created, ${results.updated} updated`);

  } catch (error) {
    logger.error('Error importing projects:', error);
    errorResponse(res, 'Failed to import projects', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * @desc    Get CSV template for projects import
 * @route   GET /api/v1/admin/import/template
 * @access  Private (Admin only)
 */
export const getImportTemplate = async (req, res) => {
  const template = `project_name,github_url,description,difficulty,mentor_github,tech_stack,tags
StreamVerse,https://github.com/Abhishekhack2909/StreamVerse,A streaming platform,Intermediate,Abhishekhack2909,"React,Node.js,MongoDB","web,fullstack"
Example Project,https://github.com/owner/repo,Project description,Beginner,mentor_username,"Python,Django","api,backend"`;

  successResponse(res, { template }, 'CSV template generated');
};

/**
 * @desc    Import users/participants from CSV
 * @route   POST /api/v1/admin/import/users
 * @access  Private (Admin only)
 */
export const importUsers = async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return errorResponse(res, 'CSV data is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Parse CSV
    let rows;
    try {
      rows = parseCSV(csvData);
    } catch (err) {
      return errorResponse(res, `Failed to parse CSV: ${err.message}`, HTTP_STATUS.BAD_REQUEST);
    }

    if (rows.length === 0) {
      return errorResponse(res, 'No valid data rows found in CSV', HTTP_STATUS.BAD_REQUEST);
    }

    const results = {
      total: rows.length,
      added: 0,
      skipped: 0,
      duplicates: 0,
      errors: [],
      roleBreakdown: {
        Contributor: 0,
        Mentor: 0,
        Admin: 0,
      },
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is header, and we're 0-indexed

      try {
        // Map CSV columns (handle various naming conventions)
        const email = row.email || row.email_address || row['4. email address'] || '';
        const name = row.name || row.full_name || row.fullname || row['1. full name'] || '';
        const githubUsername = row.github_username || row.github || row['1. github username'] || '';
        const role = (row.role || row.position || 'Contributor').trim();

        // Validate required fields
        if (!email || !email.includes('@')) {
          results.skipped++;
          results.errors.push({
            row: rowNum,
            email: email || 'N/A',
            name: name || 'N/A',
            reason: 'Invalid or missing email address',
          });
          continue;
        }

        if (!name || name.trim() === '') {
          results.skipped++;
          results.errors.push({
            row: rowNum,
            email,
            name: 'N/A',
            reason: 'Missing name',
          });
          continue;
        }

        // Validate role
        const validRoles = ['Contributor', 'Mentor', 'Admin'];
        const normalizedRole = validRoles.includes(role) ? role : 'Contributor';

        // Check if user already exists
        const existing = await User.findOne({
          $or: [
            { email: email.toLowerCase() },
            { github_username: githubUsername.toLowerCase() }
          ]
        });

        if (existing) {
          results.duplicates++;
          results.errors.push({
            row: rowNum,
            email,
            name,
            reason: `User already exists (${existing.email})`,
          });
          continue;
        }

        // Create new user
        const newUser = new User({
          email: email.toLowerCase(),
          fullName: name.trim(),
          name: name.trim(),
          github_username: githubUsername || email.split('@')[0],
          github_id: `${email}-${Date.now()}`,
          role: normalizedRole,
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
        results.added++;
        results.roleBreakdown[normalizedRole]++;

      } catch (err) {
        results.skipped++;
        results.errors.push({
          row: rowNum,
          email: row.email || 'N/A',
          name: row.name || 'N/A',
          reason: err.message,
        });
      }
    }

    logger.info(
      `Users import by ${req.user.github_username}: ${results.added} added, ${results.duplicates} duplicates, ${results.skipped} skipped`
    );

    successResponse(res, results, `Import completed: ${results.added} users added`);

  } catch (error) {
    logger.error('Error importing users:', error);
    errorResponse(res, 'Failed to import users', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
