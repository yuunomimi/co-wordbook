import { Router } from 'express';
import * as realController from '../controllers/wordbooks.controller';
import * as mockController from '../controllers/wordbooks.mock.controller';

const isMock = process.env.USE_MOCK === 'true' || false; // デフォルトはfalseに設定
const controller = isMock ? mockController : realController;
const { getWordbooks, createWordbook, getWordbook, updateWordbook, deleteWordbook } = controller;

const router = Router();

// GET /api/wordbooks
router.get('/', getWordbooks);
// POST /api/wordbooks
router.post('/', createWordbook);
// GET /api/wordbooks/:id
router.get('/:id', getWordbook);
// PATCH /api/wordbooks/:id
router.patch('/:id', updateWordbook);
// DELETE /api/wordbooks/:id
router.delete('/:id', deleteWordbook);
export default router;