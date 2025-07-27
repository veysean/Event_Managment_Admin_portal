import express from 'express';
import {
    adminRegister,
    login,

} from '../controllers/loginController.js';


const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', login);

export default router;