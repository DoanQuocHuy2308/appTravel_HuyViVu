import { API_URL } from "../types/url";
import axios from "axios";
import { User } from "../types";

export const accAPI = {
    login: async (email: string, password: string): Promise<User | null> => {
        try {
            const response = await axios.post(`${API_URL}/acc/login`, { email, password });
            return response.data.user;
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response) {
                // Xử lý lỗi role không được phép
                if (error.response.status === 403) {
                    throw new Error(error.response.data?.message || 'Bạn không có quyền truy cập vào hệ thống quản trị');
                }
                // Xử lý các lỗi khác
                throw new Error(error.response.data?.message || 'Đăng nhập thất bại');
            } else {
                throw new Error('Lỗi kết nối server');
            }
        }
    },
    register: async (name: string, email: string, password: string, phone: string, address: string): Promise<User | null> => {
        try {
            const response = await axios.post(`${API_URL}/acc/register`, { name, email, password, phone, address });
            if (response.data && response.data.token) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Register error:', error);
            return null;
        }
    },
}