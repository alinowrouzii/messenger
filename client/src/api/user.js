import axios from 'axios';
import { URL } from '../constants';

export const login = (userPass) => axios.post(`${URL}/user/login`, userPass);
export const logout = () => axios.get(`${URL}/user/logout`);
export const signup = (newUser) => axios.post(`${URL}/user/signup`, newUser);
export const fetchMe = () => axios.get(`${URL}/user`);
export const fetchUserData = (userId) => axios.get(`${URL}/user/getUser/${userId}`);
