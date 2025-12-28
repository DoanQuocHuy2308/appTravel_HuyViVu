import { API_URL } from "../types/url";
import axios from "axios";
import { User } from "../types";

export const accAPI = {
    login: async (email: string, password: string): Promise<User | null> => {
        try {
            const response = await axios.post(`${API_URL}/acc/login`, { email, password });
            return response.data;
        } catch (error: any) {
            return null;
        }
    },

    register: async (name: string, email: string, password: string, phone: string, address: string): Promise<User | null> => {
        try {
            const response = await axios.post(`${API_URL}/acc/register`, {
                name,
                email,
                password,
                phone,
                address
            });
            if (response.data && response.data.user) {
                return response.data.user;
            }
            return null;
        } catch (error: any) {
            if (error.response) {
                // Xử lý lỗi email trùng lặp
                if (error.response.status === 400 && error.response.data?.message === "Email đã tồn tại!") {
                    throw new Error("Email này đã được sử dụng. Vui lòng chọn email khác.");
                }
                throw new Error(error.response.data?.message || 'Đăng ký thất bại');
            } else {
                throw new Error('Lỗi kết nối server');
            }
        }
    },
}