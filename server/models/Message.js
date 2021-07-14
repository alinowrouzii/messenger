import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: String,//holds user_Id
    chat: String//holds chat_ID

}, { timestamps: true });

var Message = mongoose.model('Message', messageSchema);

export default Message;