import { Router } from 'express';
import * as realController from '../controllers/wordbooks.controller';
import * as mockController from '../controllers/wordbooks.mock.controller';
import wordsRoutes from './words.routes';

const isMock = process.env.USE_MOCK === 'true' || false; // デフォルトはfalseに設定
const controller = isMock ? mockController : realController;
const { getWordbooks, createWordbook, getWordbook, updateWordbook, deleteWordbook } = controller;

const router = Router(); // 親ルートのパラメータを子ルートでも使用できるようにする

// GET /api/wordbooks
router.get('/', getWordbooks);
// POST /api/wordbooks
router.post('/', createWordbook);
// GET /api/wordbooks/:wbid
router.get('/:wbid', getWordbook);
// PATCH /api/wordbooks/:wbid
router.patch('/:wbid', updateWordbook);
// DELETE /api/wordbooks/:wbid
router.delete('/:wbid', deleteWordbook);

router.use('/:wbid/words', wordsRoutes);
export default router;