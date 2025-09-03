import express from 'express';
import { submitReport, listReports } from '../controllers/reportsController.js';

const router = express.Router();

router.post('/reports', submitReport);
router.get("/reports", listReports);

export default router;
