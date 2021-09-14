
import express from 'express';
import { createChat, getChats } from '../controllers/chatController.js'
import { userIsLoggedIn } from '../controllers/authController.js';

const router = express.Router();

router.get('/getChats', userIsLoggedIn, getChats);

router.post('/createChat', userIsLoggedIn, createChat);

export default router;