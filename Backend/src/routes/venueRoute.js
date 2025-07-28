
import { authenticateToken } from "../middlewares/auth.middleware.js";
import express from 'express';
import {
    getAllVenues,
    createVenue,
    updateVenue,
    deleteVenue
} from '../controllers/venueController.js';
import { upload } from "../config/multerConfig.js";

const VenueRouter = express.Router();
VenueRouter.use(authenticateToken);

VenueRouter.get('/', getAllVenues);
VenueRouter.post('/', upload.single('image'), createVenue);
VenueRouter.put('/:id', upload.single('image'), updateVenue);
VenueRouter.delete('/:id', deleteVenue);

export default VenueRouter;
