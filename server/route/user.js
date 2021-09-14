import express from 'express';
import { userIsLoggedIn } from '../controllers/authController.js';
import { getUserData, getUsersData, getMe, getProfilePhoto, setProfilePhoto } from '../controllers/userController.js';

const router = express.Router();

router.get('/getUser/:userId', userIsLoggedIn, getUserData);
router.get('/getUsers', userIsLoggedIn, getUsersData);
router.get('/', userIsLoggedIn, getMe);
router.get('/getProfilePhoto/:userId', userIsLoggedIn, getProfilePhoto);
router.post('/setProfilePhoto', userIsLoggedIn, setProfilePhoto);

export default router;