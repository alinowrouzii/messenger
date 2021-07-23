import axios from 'axios';
import { URL } from '../constants';

export const login = (userPass) => axios.post(`${URL}/user/login`, userPass, { withCredentials: true });
export const logout = () => axios.get(`${URL}/user/logout`, { withCredentials: true });
export const signup = (newUser) => axios.post(`${URL}/user/signup`, newUser, { withCredentials: true });
export const fetchMe = () => axios.get(`${URL}/user`, { withCredentials: true });
export const fetchUserData = (userId) => axios.get(`${URL}/user/getUser/${userId}`, { withCredentials: true });