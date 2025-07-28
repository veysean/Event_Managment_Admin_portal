import express, { Router } from 'express';
import {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
} from '../controllers/roleController.js';
import { authenticateToken } from "../middlewares/auth.middleware.js";

const RoleRouter = express.Router();
RoleRouter.use(authenticateToken);

RoleRouter.get('/', getAllRoles);
RoleRouter.get('/:id', getRoleById);
RoleRouter.post('/', createRole);
RoleRouter.put('/:id', updateRole);
RoleRouter.delete('/:id', deleteRole);

export default RoleRouter;
