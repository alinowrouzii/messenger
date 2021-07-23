
import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js'
import { userIsLoggedIn } from './../controllers/authController.js';

const router = express.Router();

router.post('/sendMessage', userIsLoggedIn, sendMessage);

router.get('/getMessages/:chatId', userIsLoggedIn, getMessages);

export default router;