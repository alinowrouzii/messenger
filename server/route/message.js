
import express from 'express';
import { getAudio, getMessages, sendMessage } from '../controllers/messageController.js'
import { userIsLoggedIn } from './../controllers/authController.js';

const router = express.Router();

router.post('/sendMessage', userIsLoggedIn, sendMessage);

router.get('/getMessages/:chatId', userIsLoggedIn, getMessages);

router.get('/getAudio/:chatId/:msgId', userIsLoggedIn, getAudio);

export default router;