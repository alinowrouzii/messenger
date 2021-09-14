
import express from 'express';
import { getMedia, getMessages, sendMessage } from '../controllers/messageController.js'
import { userIsLoggedIn } from './../controllers/authController.js';

const router = express.Router();

router.post('/sendMessage', userIsLoggedIn, sendMessage);

router.get('/getMessages/:chatId', userIsLoggedIn, getMessages);

router.get('/getMedia/:chatId/:msgId', userIsLoggedIn, getMedia);

export default router;