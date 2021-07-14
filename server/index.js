import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
// import bodyParser  from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import userRoute from './route/user.js';
import messageRoute from './route/message.js';
import chatRoute from './route/chat.js';

import User from './models/User.js';

const app = express();

app.use(express.json({ limit: '20mb', extended: true }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))
app.use(cors());

app.use(session({
  //TODO: change this secret .env
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// import LocalStrategy from 'passport-local';
// passport.use(new LocalStrategy.Strategy(User.authenticate()));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const MONGIOSE_URL = process.env.MONGOOSE_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGIOSE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`)))
.catch((error) => console.log(`${error} mongoDB didn't connect!`));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use('/user', userRoute);
app.use('/message', messageRoute);
app.use('/chat', chatRoute);