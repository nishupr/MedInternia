import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile,
  getInternScorecard,
  getLeaderboard,
  verifyDoctor
} from '../controllers/userController';

const router = Router();

// Get user profile
router.get('/:userId/profile', getUserProfile);

// Update user profile
router.put('/:userId/profile', authenticate, updateUserProfile);

// Get intern scorecard
router.get('/:userId/scorecard', getInternScorecard);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

// Verify doctor (admin/verified doctor only)
router.patch('/:userId/verify', authenticate, authorize('doctor'), verifyDoctor);

export default router;
