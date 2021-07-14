import express from 'express';
import passport from 'passport';
import { getUserData, login, logout, signup, userIsLoggedIn } from '../controllers/userController.js'

const router = express.Router();

router.get('/getUser', userIsLoggedIn, getUserData);
router.post('/login', login, console.log);
// router.post('/login', passport.authenticate('local'), login);
router.get('/logout', logout);
router.post('/signup', signup);

export default router;