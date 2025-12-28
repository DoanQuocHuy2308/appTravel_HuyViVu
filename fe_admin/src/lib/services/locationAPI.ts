import axios from "axios";

export const locationAPI = {
    getProvinces: async () => {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/`);
        return response;
    },
    getDistricts: async (province_code: string) => {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${province_code}?depth=2`);
        return response;
    },
    getWards: async (district_code: string) => {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${district_code}?depth=2`);
        return response;
    },
};
