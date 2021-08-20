import axios from 'axios';
import { URL } from '../constants';

export const getMessages = (chatId) => axios.get(`${URL}/message/getMessages/${chatId}`, { withCredentials: true });

export const sendAudioMessage = ({ kind:msg_type, chat, sender, form }) =>
    axios.post(`${URL}/message/sendMessage`, form, {
        withCredentials: true,
        params: { msg_type, chat, sender },
        headers: { "Content-Type": "multipart/form-data" }
    });

export const sendTextMessage = ({ kind: msg_type, chat, sender, text }) =>
    axios.post(`${URL}/message/sendMessage`, { text, }, {
        withCredentials: true,
        params: { msg_type, chat, sender },
    });