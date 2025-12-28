import { newTour } from "../types/index";
import { API_URL } from "../types/url";
import axios from "axios";

export const tourAPI = {
    getAllTours: async (): Promise<newTour[]> => {
        try {
            const response = await axios.get(`${API_URL}/tour/getAllTours`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error); 
            throw error;
        }
    },
    getToursById: async (id: number): Promise<newTour> => {
        try {
            const response = await axios.get(`${API_URL}/tour/getToursById?id=${id}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getAllTourByTime: async (): Promise<newTour[]> => {
        try {
            const response = await axios.get(`${API_URL}/tour/getAllTourByTime`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    createTour: async (tour: newTour | FormData): Promise<newTour> => {
        try {
            const config = tour instanceof FormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            } : {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            const response = await axios.post(`${API_URL}/tour/createTours`, tour, config);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },  
    updateTour: async (id: number, tour: newTour | FormData): Promise<newTour> => {
        try {
            const config = tour instanceof FormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            } : {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            const response = await axios.put(`${API_URL}/tour/updateTours?id=${id}`, tour, config);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    deleteTour: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/tour/deleteTours?id=${id}`);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}