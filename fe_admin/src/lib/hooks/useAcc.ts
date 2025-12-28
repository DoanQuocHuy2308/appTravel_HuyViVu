import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { accAPI } from "../services/accAPI";
import { User } from "../types";
import { Toast } from "primereact/toast";

export default function useAcc() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useRef<Toast>(null);
    useEffect(() => {
        if (toast.current) {
            toast.current.show({ severity: 'error', summary: 'Thất bại', detail: 'Đăng ký thất bại', life: 3000 });
        }
    }, [toast.current]);
    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await accAPI.login(email, password);
            if (response) {
                if(response.role === "admin" || response.role === "guide" || response.role === "staff") {
                    setUser(response);
                    localStorage.setItem("user", JSON.stringify(response));
                    router.push("/admin/dashboard");
                    return response;
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Bạn không có quyền truy cập vào hệ thống quản trị', life: 3000 });
                    throw new Error("Bạn không có quyền truy cập vào hệ thống quản trị");

                }
            }
            toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Đăng nhập thất bại', life: 3000 });
            return null;
        } catch (error: any) {
            console.error("Login error:", error);
            toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: error.message || 'Đăng nhập thất bại', life: 3000 });
            throw error;
            
        }
    };

    const register = async (name: string, email: string, password: string, phone: string, address: string) => {
        try {
            setLoading(true);
            await accAPI.register(name, email, password, phone, address);
            toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng ký thành công', life: 3000 });
            router.push("/acc/login");
        } catch (error) {
            console.error("Register error:", error);
            toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Đăng ký thất bại', life: 3000 });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/acc/login");
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return { user, loading, login, register, logout };
};
