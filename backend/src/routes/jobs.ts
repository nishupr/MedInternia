import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createJobOpportunity,
  getJobOpportunities,
  getJobOpportunityById,
  updateJobOpportunity,
  deleteJobOpportunity,
  checkJobEligibility,
  applyToJob,
  getMyJobOpportunities
} from '../controllers/jobController';

const router = Router();

// Create job opportunity
router.post('/', authenticate, authorize('doctor'), createJobOpportunity);

// Get all job opportunities
router.get('/', getJobOpportunities);

// Get my job opportunities
router.get('/my', authenticate, authorize('doctor'), getMyJobOpportunities);

// Get job opportunity by ID
router.get('/:id', getJobOpportunityById);

// Update job opportunity
router.put('/:id', authenticate, authorize('doctor'), updateJobOpportunity);

// Delete job opportunity
router.delete('/:id', authenticate, authorize('doctor'), deleteJobOpportunity);

// Check job eligibility
router.get('/:id/eligibility', authenticate, checkJobEligibility);

// Apply to job
router.post('/:id/apply', authenticate, applyToJob);

export default router;
