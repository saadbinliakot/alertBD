import express from 'express';
import { submitReport, listReports } from '../controllers/reportsController.js';

const router = express.Router();

router.post('/reports', submitReport);
router.get("/reports", listReports);
// router.get("/reports", getReports);
// router.put("/reports/:id/approve", approveReport);

export default router;
