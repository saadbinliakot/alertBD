import express from "express";
import { getReports, approveReport, rejectReport } from "../controllers/adminController.js";

const router = express.Router();

router.get("/admin/reports", getReports); 
router.put("/reports/:id/approve", approveReport);
router.put("/reports/:id/reject", rejectReport);

export default router;
