
import { authenticateToken } from "../middlewares/auth.middleware.js";
import express from 'express';
import {
    getAllVenues,
    createVenue,
    updateVenue,
    deleteVenue
} from '../controllers/venueController.js';

const VenueRouter = express.Router();
VenueRouter.use(authenticateToken);

VenueRouter.get('/', getAllVenues);
VenueRouter.post('/', createVenue);
VenueRouter.put('/:id', updateVenue);
VenueRouter.delete('/:id', deleteVenue);

export default VenueRouter;
