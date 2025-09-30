import { User } from '@/types';
import { API_URL } from '../types/url';
// import api from './axiosConfig';
import axios from 'axios';

export const userAPI = {
   login: async(email: string, password: string): Promise<User> => {
       const response = await axios.post(`${API_URL}users/login`, { email, password });
       return response.data;
   },
    getAllUsers: async(): Promise<User[]> => {
        const response = await axios.get(`${API_URL}users/getAllUsers`);
        return response.data;
    },
    register: async(name: string, email: string, password: string, phone: string): Promise<User | null> => {
        try {
            const response = await axios.post(`${API_URL}users/register`, { name, email, password, phone });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            return null;
        }
    }
}
