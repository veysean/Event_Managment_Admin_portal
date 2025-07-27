import express from 'express';
import { getAllEvents} from '../controllers/bookingController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
const EventRouter = express.Router();    
EventRouter.use(authenticateToken);

EventRouter.get('/',getAllEvents);

export default EventRouter;
