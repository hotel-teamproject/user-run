import express from 'express';
import {
    getCurrentUser,
    login,
    refreshToken,
    register
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getCurrentUser);

export default router;