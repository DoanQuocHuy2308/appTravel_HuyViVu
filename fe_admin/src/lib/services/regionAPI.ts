import axios from "axios";
import { API_URL } from "../types/url";
import { Region } from "../types";

export const regionAPI = {
    getAllRegions: async (): Promise<Region[]> => {
        const response = await axios.get(`${API_URL}/region/getAllRegions`);
        return response.data;
    },
    getRegionsById: async (id: number): Promise<Region> => {
        const response = await axios.get(`${API_URL}/region/getRegionsById?id=${id}`);
        return response.data;
    },
    createRegions: async (region: Region): Promise<Region> => {
        const response = await axios.post(`${API_URL}/region/createRegions`, region);
        return response.data;
    },
    updateRegions: async (id: number, region: Region): Promise<Region> => {
        const response = await axios.put(`${API_URL}/region/updateRegions?id=${id}`, region);
        return response.data;
    },
    deleteRegions: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/region/deleteRegions?id=${id}`);
    }
}