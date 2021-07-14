import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // password: String,
    // profilePic:
    chats: [String],//holds chats_Id
    friends: [String]//holds users_Id
});

// userSchema.plugin(passportLocalMongoose, { usernameField: 'userName' });
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;