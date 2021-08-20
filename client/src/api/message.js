import axios from 'axios';
import { URL } from '../constants';

export const getMessages = (chatId) => axios.get(`${URL}/message/getMessages/${chatId}`, { withCredentials: true });

export const sendAudioMessage = ({ msg_type, chat, sender, form }) =>
    axios.post(`${URL}/message/sendMessage`, form, {
        withCredentials: true,
        params: { msg_type, chat, sender },
        headers: { "Content-Type": "multipart/form-data" }
    });
    
export const sendTextMessage = ({ msg_type, chat, sender, data }) =>
    axios.post(`${URL}/message/sendMessage`, { data, }, {
        withCredentials: true,
        params: { msg_type, chat, sender },
    });