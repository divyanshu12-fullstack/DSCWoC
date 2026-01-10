import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  getOverview,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  adjustUserPoints,
  getUserPRHistory,
  getAllProjects,
  createProject,
  updateProject,
  assignMentor,
  toggleProjectStatus,
  getAllPRs,
  updatePRStatus,
  adjustPRPoints,
  addPRNote,
  getLeaderboard,
  recalculatePoints,
  getAllBadges,
  assignBadge,
  exportUsers,
  exportPRs,
  exportLeaderboard
} from '../controllers/admin.controller.js';
import {
  getAllContacts,
  updateContactStatus,
  deleteContact,
  getContactStats
} from '../controllers/contact.controller.js';
import {
  importProjects,
  getImportTemplate
} from '../controllers/import.controller.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ==================== OVERVIEW / MISSION CONTROL ====================
router.get('/overview', getOverview);

// ==================== IMPORT FROM SHEET ====================
router.post('/import/projects', importProjects);
router.get('/import/template', getImportTemplate);

// ==================== USER MANAGEMENT ====================
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/points', adjustUserPoints);
router.get('/users/:id/prs', getUserPRHistory);

// ==================== PROJECT MANAGEMENT ====================
router.get('/projects', getAllProjects);
router.post('/projects', createProject);
router.patch('/projects/:id', updateProject);
router.patch('/projects/:id/mentor', assignMentor);
router.patch('/projects/:id/status', toggleProjectStatus);

// ==================== PULL REQUEST MONITORING ====================
router.get('/prs', getAllPRs);
router.patch('/prs/:id/status', updatePRStatus);
router.patch('/prs/:id/points', adjustPRPoints);
router.patch('/prs/:id/note', addPRNote);

// ==================== LEADERBOARD & POINTS ====================
router.get('/leaderboard', getLeaderboard);
router.post('/points/recalculate', recalculatePoints);

// ==================== BADGES & CERTIFICATES ====================
router.get('/badges', getAllBadges);
router.post('/badges/assign', assignBadge);

// ==================== CONTACT MESSAGES ====================
router.get('/contacts', getAllContacts);
router.get('/contacts/stats', getContactStats);
router.patch('/contacts/:id/status', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

// ==================== EXPORTS & REPORTS ====================
router.get('/export/users', exportUsers);
router.get('/export/prs', exportPRs);
router.get('/export/leaderboard', exportLeaderboard);

export default router;
