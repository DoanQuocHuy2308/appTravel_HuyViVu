import { accAPI } from "../services/accAPI";

export default function useAcc() {
    const login = async (email: string, password: string) => {
        const response = await accAPI.login(email, password);
        return response;
    };
    const register = async (name: string, email: string, password: string, phone: string, address: string) => {
        const response = await accAPI.register(name, email, password, phone, address);
        return response;
    };
    return { login, register };
};
