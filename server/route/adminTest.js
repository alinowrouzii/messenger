import express from 'express';
import { isAdmin } from '../controllers/authController.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { TEXT_MESSAGE_TYPE } from './../models/constants.js';
import { uploadTest } from './../controllers/messageController.js';

const router = express.Router();


router.get('/', isAdmin, (req, res) => {

    User.updateMany({}, {
        role: 'restricted'
    }, { multi: true }, (err, ress) => {
        if (err) {
            console.log(err);
        } else {
            console.log(ress);
            res.status(200).json({ res })
        }
    })
});

router.get('/msg', isAdmin, (req, res) => {

    Message.updateMany({}, {
        $rename: { text: 'data' },
        kind: TEXT_MESSAGE_TYPE

    }, { multi: true }, (err, ress) => {
        if (err) {
            console.log(err);
        } else {
            console.log(ress);
            res.status(200).json({ res })
        }
    })
});

router.get('/test', isAdmin, (req, res) => {

    res.status(200).send('yes');
});

router.post('/upload', uploadTest);




export default router;