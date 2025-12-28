import { newTour } from "@/types";
import { API_URL } from "../types/url";
import axios from "axios";

export const tourAPI = {
    getAllTours: async (): Promise<newTour[]> => {
        try {
            const response = await axios.get(`${API_URL}/tour/getAllTours`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getToursById: async (id: number): Promise<newTour> => {
        try {
            const response = await axios.get(`${API_URL}/tour/getToursById?id=${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllTourByTime: async (): Promise<newTour[]> => {
        try {
            const response = await axios.get(`${API_URL}/tour/getAllTourByTime`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}