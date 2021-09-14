import axios from 'axios';
import { URL } from '../constants';

export const fetchChats = () => axios.get(`${URL}/chat/getChats`, { withCredentials: true });
export const createChat = (newChat) => axios.post(`${URL}/chat/createChat`, newChat, { withCredentials: true });
