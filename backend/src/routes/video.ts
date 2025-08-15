import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Simple signaling endpoint for video conferencing (stub)
router.post('/signal', authenticate, (req, res) => {
  // In production, implement WebRTC signaling logic here
  res.json({ success: true, message: 'Signal sent/received.' });
});

export default router;
