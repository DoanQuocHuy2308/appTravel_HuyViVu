import { User } from '@/types';
import { API_URL } from '../types/url';
// import api from './axiosConfig';
import axios from 'axios';

export const accAPI = {
    login: async(email: string, password: string): Promise<User> => {
       const response = await axios.post(`${API_URL}acc/login`, { email, password });
       return response.data;
   },
   register: async(name: string, email: string, password: string, phone: string, address: string): Promise<User | null> => {
        try {
            const response = await axios.post(`${API_URL}acc/register`, { name, email, password, phone, address });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            return null;
        }
    }
}