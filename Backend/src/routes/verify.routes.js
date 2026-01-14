import express from 'express';
import { verifyAuthKey } from '../controllers/id.controller.js';

const router = express.Router();

router.get('/', verifyAuthKey);

export default router;
