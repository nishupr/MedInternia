import express from 'express';
import { createResearchPaper, getAllResearchPapers, getResearchPaperById } from '../controllers/researchPaperController';
import { authenticate } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

const router = express.Router();


router.post('/', createResearchPaper);
router.get('/', getAllResearchPapers);
router.get('/:id', getResearchPaperById);

// Download endpoint for research paper PDFs (assumes files are stored in backend/uploads)
router.get('/download/:filename', authenticate, (req, res) => {
	const filename = path.basename(req.params.filename);
	if (!filename || filename.includes('..')) {
		return res.status(400).json({ success: false, message: 'Invalid filename' });
	}
	const safePath = path.resolve(__dirname, '../../uploads', filename);
	if (!safePath.startsWith(path.resolve(__dirname, '../../uploads'))) {
		return res.status(403).json({ success: false, message: 'Access denied' });
	}
	if (fs.existsSync(safePath)) {
		res.download(safePath);
	} else {
		res.status(404).json({ success: false, message: 'File not found' });
	}
});

export default router;
