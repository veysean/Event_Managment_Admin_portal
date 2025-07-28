import { authenticateToken } from "../middlewares/auth.middleware.js";
import express from 'express';
import {
    getCaterings,
    createCatering,
    updateCatering,
    deleteCatering
} from '../controllers/cateringController.js';
import { upload } from "../config/multerConfig.js";

const CateringRouter = express.Router();
CateringRouter.use(authenticateToken);

CateringRouter.get('/', getCaterings);
CateringRouter.post('/', upload.single('image'), createCatering);
CateringRouter.put('/:id', upload.single('image'), updateCatering);
CateringRouter.delete('/:id', deleteCatering);

export default CateringRouter;
