import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createBadge,
  getAllBadges,
  awardBadge,
  getUserBadges,
  toggleBadgeVisibility
} from '../controllers/badgeController';

const router = Router();

// Create badge (admin only)
router.post('/', authenticate, authorize('doctor'), createBadge);

// Get all badges
router.get('/', getAllBadges);

// Award badge to user
router.post('/award', authenticate, authorize('doctor'), awardBadge);

// Get user badges
router.get('/user/:userId', getUserBadges);

// Toggle badge visibility
router.patch('/:userBadgeId/visibility', authenticate, toggleBadgeVisibility);

export default router;
