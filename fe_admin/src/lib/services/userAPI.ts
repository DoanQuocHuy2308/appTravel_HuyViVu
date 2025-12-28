import axios from "axios";
import { API_URL } from "../types/url";
import { User } from "../types";

export const userAPI = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await axios.get(`${API_URL}/users/getAllUsers`);
        return response.data;
    },
    getUserById: async (id: number): Promise<User> => {
        const response = await axios.get(`${API_URL}/users/getUsersById?id=${id}`);
        return response.data;
    },
    createUser: async (userData: FormData): Promise<User> => {
        const response = await axios.post(`${API_URL}/users/createUsers`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    updateUser: async (id: number, userData: FormData): Promise<User> => {
        const response = await axios.put(`${API_URL}/users/updateUsers?id=${id}`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    deleteUser: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/users/deleteUsers?id=${id}`);
    },
    updateUserPoints: async (id: number, points: number): Promise<User> => {
        const response = await axios.put(`${API_URL}/users/updateUserPoints?id=${id}`, { points });
        return response.data;
    },
    updateUserRole: async (id: number, role: string): Promise<User> => {
        const response = await axios.put(`${API_URL}/users/updateUserRole?id=${id}`, { role });
        return response.data;
    }
};
