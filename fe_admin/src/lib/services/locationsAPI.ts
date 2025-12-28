import axios from "axios";
import { API_URL } from "../types/url";
import { Location } from "../types";

export const locationsAPI = {
    getAllLocations: async (): Promise<Location[]> => {
        const response = await axios.get(`${API_URL}/location/getAllLocations`);
        return response.data;
    },
    getLocationsById: async (id: number): Promise<Location> => {
        const response = await axios.get(`${API_URL}/location/getLocationsById?id=${id}`);
        return response.data;
    },
    createLocations: async (formData: FormData): Promise<Location> => {
        try {
            const response = await axios.post(`${API_URL}/location/createLocations`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error.message);
            throw error;
        }
    },
    updateLocations: async (id: number, formData: FormData): Promise<Location> => {
        try {
            const response = await axios.put(`${API_URL}/location/updateLocations?id=${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });
            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error.message);
            throw error;
        }
    },
    deleteLocations: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/location/deleteLocations?id=${id}`);
    }
}