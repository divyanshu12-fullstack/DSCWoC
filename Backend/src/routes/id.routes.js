import express from 'express';
import upload from '../middleware/upload.js';
import { generateIdCard } from '../controllers/id.controller.js';

const router = express.Router();

router.post('/generate', upload.single('photo'), generateIdCard);

export default router;
