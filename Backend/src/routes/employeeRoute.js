import express from 'express';
import {
    getEmployees,
    deleteEmployee,
    createEmployee,
    updateEmployee,

} from '../controllers/employeeController.js';
import { authenticateToken } from "../middlewares/auth.middleware.js";

import { upload } from "../config/multerConfig.js";

const EmployeeRoute = express.Router();
//EmployeeRoute.use(authenticateToken);

EmployeeRoute.get('/', getEmployees);
EmployeeRoute.post('/', upload.none(), createEmployee);
EmployeeRoute.put('/:id', upload.none(), updateEmployee);
EmployeeRoute.delete('/:id', deleteEmployee);

export default EmployeeRoute;