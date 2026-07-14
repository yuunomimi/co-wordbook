import { Router } from 'express';
import { getCollaborators, addCollaborator, removeCollaborator } from '../controllers/collaborators.controller';

const router = Router({ mergeParams: true });

// GET /api/wordbooks/:wbid/users
router.get('/', getCollaborators);

// POST /api/wordbooks/:wbid/users
router.post('/', addCollaborator);

// DELETE /api/wordbooks/:wbid/users/:uid
router.delete('/:uid', removeCollaborator);

export default router;