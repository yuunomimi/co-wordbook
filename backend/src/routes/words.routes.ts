import { Router } from 'express';
import * as realController from '../controllers/words.controller';
import * as mockController from '../controllers/words.mock.controller';

const isMock = process.env.USE_MOCK === 'true' || false; // デフォルトはfalseに設定
const controller = isMock ? mockController : realController;
const { getWords, createWord, getWord, updateWord, deleteWord } = controller;

const router = Router({ mergeParams: true });

// GET /api/wordbooks/:wbid/words
router.get('/', getWords);
// POST /api/wordbooks/:wbid/words
router.post('/', createWord);
// GET /api/wordbooks/:wbid/words/:wid
router.get('/:wid', getWord);
// PATCH /api/wordbooks/:wbid/words/:wid
router.patch('/:wid', updateWord);
// DELETE /api/wordbooks/:wbid/words/:wid
router.delete('/:wid', deleteWord);
export default router;