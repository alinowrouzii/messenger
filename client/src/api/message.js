import axios from 'axios';
import { URL } from '../constants';

export const getMessages = (chatId) => axios.get(`${URL}/message/${chatId}`);
export const sendMessage = (newMessage) => axios.post(`${URL}/message/sendMessage`, newMessage);
