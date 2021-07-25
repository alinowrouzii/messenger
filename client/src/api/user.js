import axios from 'axios';
import { URL } from '../constants';

export const fetchMe = () => axios.get(`${URL}/user`, { withCredentials: true });
export const fetchUserData = (userId) => axios.get(`${URL}/user/getUser/${userId}`, { withCredentials: true });
// export const fetchContactUsers = () => axios.get(`${URL}/user/getContactUsers`, { withCredentials: true }); // this route not exist in server route


export const fetchUsers = (fieldName, regex) => axios.get(`${URL}/user/getUsers?${fieldName}=${regex}`, { withCredentials: true });