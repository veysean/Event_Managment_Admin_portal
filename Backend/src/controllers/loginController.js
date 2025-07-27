import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new admin user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, username]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created
 */
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({message: 'All fields are requires'});
    }

    try {
        const existingUser = await db.User.findOne({where: {email} });
        if(existingUser) {
            return res.status(400).json({message: 'Email already in use'});
        }

        const user = await db.User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: 'admin'
            },
        });
    }
    catch(err) {
        res.status(500).json({error: err.message });
    }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login as admin
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        // jwt.sign(payload,signature,option)
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Login error', details: err.message });
    }
};

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get list of all users (admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not admin)
 */


// export const adminAuthenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader?.split(' ')[1];

//     if (!token) return res.status(401).json({ error: 'Token missing' });

//     try {
//         const user = jwt.verify(token, process.env.JWT_SECRET);
//         if (user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
//         req.user = user;
//         next();
//     } catch {
//         res.status(403).json({ error: 'Invalid or expired token' });
//     }
// };