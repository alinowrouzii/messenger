import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server as socket } from 'socket.io';
import userRoute from './route/user.js';
import messageRoute from './route/message.js';
import chatRoute from './route/chat.js';
import authRoute from './route/auth.js';

const app = express();

app.use(express.json({ limit: '20mb', extended: true }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware);

let SESSION_SECRET;
if (process.env.NODE_ENV === "development") {
  SESSION_SECRET = 'some random text';
} else {
  SESSION_SECRET = process.env.SESSION_SECRET;
}
app.use(cookieParser(SESSION_SECRET))
app.use(passport.initialize());
app.use(passport.session());

//configuration of passport.js
import { passportConfig } from './config/passport.js';
passportConfig(passport);

//mongoDB connection and config
import { mongooseConfig } from './config/mongooseConfig.js';
mongooseConfig();

app.use('/user', userRoute);
app.use('/message', messageRoute);
app.use('/chat', chatRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT || 5000;
let server = app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));

const io = new socket(server);


import socketConfig from './socket/index.js';
socketConfig(io, sessionMiddleware, passport);

