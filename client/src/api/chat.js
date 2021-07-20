import axios from 'axios';
import { URL } from '../constants';

export const fetchChats = () => axios.get(`${URL}/chat/getChats`);
export const createChat = (newChat) => axios.post(`${URL}/chat/createChat`, newChat);
