import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Types.ObjectId,//holds user_Id
        ref: 'User'
    },
    chat: {
        type: mongoose.Types.ObjectId,//holds chat_ID
        ref: 'Chat'
    }

}, { timestamps: true });

var Message = mongoose.model('Message', messageSchema);

export default Message;