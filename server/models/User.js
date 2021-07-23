import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true,
    },
    // password: String,
    // profilePic:
    chats: {//holds chats_Id
        type: [mongoose.Types.ObjectId],
        ref: 'Chat',
        select:false
    },
    friends: {//holds users_Id
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        select:false
    },
    salt: {
        type: String,
        required:true,
        select: false
    }, 
    hash: {
        type: String,
        required:true,
        select: false
    }
}, { timestamps: true });

// userSchema.plugin(passportLocalMongoose, { usernameField: 'userName' });
// userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;