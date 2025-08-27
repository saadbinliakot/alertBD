import express from 'express';
import { saveLocation, getLatestLocationByName  } from '../controllers/locationController.js';

const router = express.Router();

router.post('/user/location', saveLocation);
router.get('/user/location/latest', getLatestLocationByName);

export default router;
