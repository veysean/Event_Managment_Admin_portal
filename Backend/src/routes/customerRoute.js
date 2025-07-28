import express from 'express';
import {
    getCustomers,
    updateCustomer,
    deleteCustomer,

} from '../controllers/customerController.js';
import { authenticateToken } from "../middlewares/auth.middleware.js";

import { upload } from "../config/multerConfig.js";

const CustomerRoute = express.Router();
CustomerRoute.use(authenticateToken);

CustomerRoute.get('/', getCustomers);
CustomerRoute.put('/:id', upload.none(), updateCustomer);
CustomerRoute.delete('/:id', deleteCustomer);

export default CustomerRoute;