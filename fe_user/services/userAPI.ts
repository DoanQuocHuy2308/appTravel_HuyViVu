import { User } from '@/types';
import { API_URL } from '../types/url';
// import api from './axiosConfig';
import axios from 'axios';
export const userAPI = {
    updateUser: async (id: number, user: User): Promise<User> => {
        const response = await axios.put(`${API_URL}/users/updateUsers?id=${id}`, user);
        return response.data;
    },
    deleteUser: async (id: number): Promise<void> => {
        const response = await axios.delete(`${API_URL}/users/deleteUsers?id=${id}`);
        return response.data;
    },
    getUser: async (): Promise<User> => {
        const response = await axios.get(`${API_URL}/users/getUser`);
        return response.data;
    },
    changePassword: async (id: number, currentPassword: string, newPassword: string): Promise<{ message: string }> => {
        const response = await axios.put(`${API_URL}/users/changePassword`, {
            id,
            currentPassword,
            newPassword
        });
        return response.data;
    }
}