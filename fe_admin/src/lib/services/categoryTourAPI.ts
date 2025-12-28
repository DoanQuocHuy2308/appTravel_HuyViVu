import axios from 'axios';
import { API_URL } from '@/lib/types/url';
import { TourType } from '@/lib/types';
export const categoryTourAPI = {
    getAllTourType: async (): Promise<TourType[]> => {
        const response = await axios.get(`${API_URL}/tour_types/getAllTour_Types`);
        return response.data;
    },
    getTourTypeById: async (id: number): Promise<TourType> => {
        const response = await axios.get(`${API_URL}/tour_types/getTour_TypesById?id=${id}`);
        return response.data;
    },
    createTourType: async (tourType: Omit<TourType, 'id'>): Promise<TourType> => {
        const response = await axios.post(`${API_URL}/tour_types/createTour_Types`, tourType);
        return response.data;
    },
    updateTourType: async (id: number, tourType: Omit<TourType, 'id'>): Promise<TourType> => {
        const response = await axios.put(`${API_URL}/tour_types/updateTour_Types?id=${id}`, tourType);
        return response.data;
    },
    deleteTourType: async (id: number): Promise<boolean> => {
        const response = await axios.delete(`${API_URL}/tour_types/deleteTour_Types?id=${id}`);
        return response.data;
    },
}