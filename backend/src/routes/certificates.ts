import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  getDoctorIssuedCertificates,
  revokeCertificate,
  exportCertificateData
} from '../controllers/certificateController';

const router = Router();

// Generate certificate
router.post('/generate', authenticate, authorize('doctor'), generateCertificate);

// Get certificates for user
router.get('/user/:userId', getUserCertificates);

// Get certificate by certificate ID
router.get('/:certificateId', getCertificateById);

// Verify certificate
router.post('/verify', verifyCertificate);

// Get certificates issued by doctor
router.get('/doctor/issued', authenticate, authorize('doctor'), getDoctorIssuedCertificates);

// Revoke certificate
router.patch('/:certificateId/revoke', authenticate, authorize('doctor'), revokeCertificate);

// Export certificate data
router.get('/:certificateId/export', exportCertificateData);

export default router;
