import { API_URL } from "@/types/url";
import axios from "axios";
import { UserPromotion } from "@/types";
export const userVoucherAPI = {
    getAllPromotionsByUserId: async (user_id: number): Promise<UserPromotion[]> => {
        const response = await axios.get(`${API_URL}/user_promotions/getAllPromotionByUserID?id=${user_id}`);
        return response.data;
    },
    createUserVoucher: async (user_id: number, promotion_id: number, used: number): Promise<UserPromotion> => {
        const requestData = { user_id, promotion_id, used: used ? 1 : 0 };
        const response = await axios.post(`${API_URL}/user_promotions/createUser_Promotions`, requestData);
        return response.data;
    }
}