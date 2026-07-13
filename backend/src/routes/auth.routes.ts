import { Router } from 'express';
import * as realController from '../controllers/auth.controller';
import * as mockController from '../controllers/auth.mock.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const isMock = process.env.USE_MOCK === 'true' || false; // デフォルトはfalseに設定
const controller = isMock ? mockController : realController;
const { login, logout, getMe } = controller;


const router = Router();

// POST /api/login
router.post('/login', login);

// POST /api/logout
router.post('/logout', logout);

// GET /api/me
router.get('/me', verifyToken, getMe);


export default router;