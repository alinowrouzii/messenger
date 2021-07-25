import express from 'express';
import { userIsLoggedIn } from '../controllers/authController.js';
import { getUserData, getUsersData, getMe } from '../controllers/userController.js';

const router = express.Router();

router.get('/getUser/:userId', userIsLoggedIn, getUserData);
router.get('/getUsers', userIsLoggedIn, getUsersData);
router.get('/', userIsLoggedIn, getMe);

export default router;