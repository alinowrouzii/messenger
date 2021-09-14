import axios from 'axios';
import { URL } from '../constants';

export const login = (userPass) => axios.post(`${URL}/auth/login`, userPass, { withCredentials: true });
export const logout = () => axios.get(`${URL}/auth/logout`, { withCredentials: true });
export const signup = (newUser) => axios.post(`${URL}/auth/signup`, newUser, { withCredentials: true });
