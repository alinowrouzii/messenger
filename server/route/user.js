import express from 'express';
import { userIsLoggedIn } from '../controllers/authController.js';
import { getUserData, getMe } from '../controllers/userController.js';

const router = express.Router();

router.get('/getUser/:userId', userIsLoggedIn, getUserData);
router.get('/', userIsLoggedIn, getMe);

export default router;