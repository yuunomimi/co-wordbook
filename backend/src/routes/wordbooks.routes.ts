import { Router } from 'express';
import { getWordbooks, createWordbook, updateWordbook, deleteWordbook } from '../controllers/wordbooks.controller';

const router = Router();

// GET /api/wordbooks
router.get('/', getWordbooks);
// POST /api/wordbooks
router.post('/', createWordbook);
// PATCH /api/wordbooks/:id
router.patch('/:id', updateWordbook);
// DELETE /api/wordbooks/:id
router.delete('/:id', deleteWordbook);
export default router;