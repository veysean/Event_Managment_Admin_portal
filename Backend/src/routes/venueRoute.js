import venueController from "../controllers/venueController.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import express from 'express';

const router = express.Router();
router.use(authenticateToken);

router.get('/', venueController.getAllVenues);
router.post('/', venueController.createVenue);
router.put('/:id', venueController.updateVenue);
router.delete('/:id', venueController.deleteVenue);

export default router;
