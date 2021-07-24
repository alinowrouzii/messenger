import axios from 'axios';
import { URL } from '../constants';

export const getMessages = (chatId) => axios.get(`${URL}/message/getMessages/${chatId}`, { withCredentials: true });
export const sendMessage = (newMessage) => axios.post(`${URL}/message/sendMessage`, newMessage, { withCredentials: true });