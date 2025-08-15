import express from 'express';
import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  addComment,
  toggleLike,
  getMyCases,
  addFollowUp,
  getCaseFollowUps,
  generateAISuggestions,
  getCaseAISuggestions
} from '../controllers/caseController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes (with authentication)
router.get('/', authenticate, getCases);
router.get('/:id', authenticate, getCaseById);

// Doctor only routes
router.post('/', authenticate, createCase);
router.get('/my/cases', authenticate, getMyCases);
router.put('/:id', authenticate, updateCase);
router.delete('/:id', authenticate, deleteCase);

// Interactive routes (all authenticated users)
router.post('/:id/comments', authenticate, addComment);
router.post('/:id/like', authenticate, toggleLike);

// Follow-up routes
router.post('/:id/follow-ups', authenticate, addFollowUp);
router.get('/:id/follow-ups', authenticate, getCaseFollowUps);

// AI suggestion routes
router.post('/:id/ai-suggestions', authenticate, generateAISuggestions);
router.get('/:id/ai-suggestions', authenticate, getCaseAISuggestions);

export default router;
