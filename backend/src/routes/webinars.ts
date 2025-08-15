import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createWebinar,
  getWebinars,
  getWebinarById,
  registerForWebinar,
  unregisterFromWebinar,
  updateWebinar,
  markAttendance,
  submitFeedback,
  getUserWebinars,
  generateMeetingLink
} from '../controllers/webinarController';

const router = Router();

// Create webinar
router.post('/', authenticate, authorize('doctor'), createWebinar);

// Get all webinars
router.get('/', getWebinars);

// Get user's webinars
router.get('/my', authenticate, getUserWebinars);

// Get webinar by ID
router.get('/:id', getWebinarById);

// Register for webinar
router.post('/:id/register', authenticate, registerForWebinar);

// Unregister from webinar
router.delete('/:id/register', authenticate, unregisterFromWebinar);

// Update webinar
router.put('/:id', authenticate, authorize('doctor'), updateWebinar);

// Mark attendance
router.patch('/:id/attendance', authenticate, authorize('doctor'), markAttendance);

// Submit feedback
router.post('/:id/feedback', authenticate, submitFeedback);

// Generate meeting link
router.post('/:id/meeting-link', authenticate, authorize('doctor'), generateMeetingLink);

export default router;
