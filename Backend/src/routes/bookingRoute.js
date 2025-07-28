import express from 'express';
import { 
    getEvents,
    deleteEvent,
    updateEvent,

} from '../controllers/bookingController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { upload } from "../config/multerConfig.js";
const EventRouter = express.Router();    
//EventRouter.use(authenticateToken);

EventRouter.get('/', getEvents);
EventRouter.delete('/:id', deleteEvent);
EventRouter.put('/:id', upload.none(), updateEvent);

export default EventRouter;
