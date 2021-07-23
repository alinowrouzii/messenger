import express from 'express';
import { login, logout, signup } from '../controllers/authController.js'

const router = express.Router();

router.post('/login', login, console.log);
router.get('/logout', logout);
router.post('/signup', signup);

export default router;
