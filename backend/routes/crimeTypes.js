import express from 'express';
import { getCrimeTypes } from '../controllers/crimeTypeController.js';

const router = express.Router();

router.get('/crime-types', getCrimeTypes);

export default router;
