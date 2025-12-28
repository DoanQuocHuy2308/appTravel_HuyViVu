import { useEffect, useState } from "react";
import { userAPI } from "../services/userAPI";
import { User } from "../types";

export default function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const getAllUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAllUsers();
            setUsers(response);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            setLoading(false);
        }
    }

    const getUserById = async (id: number) => {
        try {
            setLoading(true);
            const response = await userAPI.getUserById(id);
            setUser(response);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            setLoading(false);
        }
    }

    const createUser = async (userData: FormData) => {
        try {
            setLoading(true);
            const response = await userAPI.createUser(userData);
            setUsers(prev => [...prev, response]);
            setLoading(false);
            return response;
        } catch (error) {
            console.error("Lỗi khi tạo người dùng:", error);
            setLoading(false);
            throw error;
        }
    }

    const updateUser = async (id: number, userData: FormData) => {
        try {
            setLoading(true);
            const response = await userAPI.updateUser(id, userData);
            setUsers(prev => prev.map(u => u.id === id ? response : u));
            setLoading(false);
            return response;
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            setLoading(false);
            throw error;
        }
    }

    const deleteUser = async (id: number) => {
        try {
            setLoading(true);
            await userAPI.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            setLoading(false);
            throw error;
        }
    }

    const updateUserPoints = async (id: number, points: number) => {
        try {
            setLoading(true);
            const response = await userAPI.updateUserPoints(id, points);
            setUsers(prev => prev.map(u => u.id === id ? response : u));
            setLoading(false);
            return response;
        } catch (error) {
            console.error("Lỗi khi cập nhật điểm người dùng:", error);
            setLoading(false);
            throw error;
        }
    }

    const updateUserRole = async (id: number, role: string) => {
        try {
            setLoading(true);
            const response = await userAPI.updateUserRole(id, role);
            setUsers(prev => prev.map(u => u.id === id ? response : u));
            setLoading(false);
            return response;
        } catch (error) {
            console.error("Lỗi khi cập nhật vai trò người dùng:", error);
            setLoading(false);
            throw error;
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    return { 
        users, 
        user, 
        loading, 
        getAllUsers, 
        getUserById, 
        createUser, 
        updateUser, 
        deleteUser,
        updateUserPoints,
        updateUserRole
    };
}
