import { API_URL } from "@/types/url";
import axios from "axios";
import { Promotion } from "@/types";
export const vouchersAPI = {
    getAllPromotions: async (): Promise<Promotion[]> => {
        const response = await axios.get(`${API_URL}/promotion/getAllPromotions`);
        return response.data;
    },
}
