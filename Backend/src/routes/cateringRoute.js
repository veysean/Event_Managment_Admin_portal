import { authenticateToken } from "../middlewares/auth.middleware.js";
import express from 'express';
import {
    getCaterings,
    createCatering,
    updateCatering,
    deleteCatering
} from '../controllers/cateringController.js';

const CateringRouter = express.Router();
CateringRouter.use(authenticateToken);

CateringRouter.get('/', getCaterings);
CateringRouter.post('/', createCatering);
CateringRouter.put('/:id', updateCatering);
CateringRouter.delete('/:id', deleteCatering);

export default CateringRouter;
