import { Router } from 'express';
import { login, logout, signin } from '../controllers/auth.controller';

const router = Router();

// POST /api/signin
router.post('/signin', signin);

// POST /api/login
router.post('/login', login);

// POST /api/logout
router.post('/logout', logout);


export default router;