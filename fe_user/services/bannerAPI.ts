import { Banner } from './../types/index';
import { API_URL } from "../types/url";
import axios from "axios";

export const bannerAPI = {
    getAllBanner: async (): Promise<Banner[]> => {
        const response = await axios.get(`${API_URL}/banner/getAllBanners`);
        return response.data;
    },
}