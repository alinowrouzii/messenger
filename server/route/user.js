import express from 'express';
import { getUserData, login, logout, signup, userIsLoggedIn } from '../controllers/userController.js'

const router = express.Router();

router.get('/getUser/:userId', userIsLoggedIn, getUserData);
router.post('/login', login, console.log);
router.get('/logout', logout);
router.post('/signup', signup);

export default router;