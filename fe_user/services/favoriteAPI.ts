import axios  from 'axios';
import {API_URL} from "../types/url"
import {newTourFavorite} from "../types"

export const favoriteAPI = {
    getAllFavorite: async (id: number): Promise<newTourFavorite[]> =>{
        try {
            const response = await axios.get(`${API_URL}/favorite_tours/getAllFavorite_Tours?id=${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }
    },
    addFavorite: async (user_id: number, tour_id: number): Promise<{ message: string; favorite_toursId?: number }> => {
        try {
            const response = await axios.post(`${API_URL}/favorite_tours/createFavorite_Tours`, { user_id, tour_id });
            return response.data;
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    },
    deleteFavoriteById: async (id: number): Promise<{ message: string }> => {
        try {
            const response = await axios.delete(`${API_URL}/favorite_tours/deleteFavorite_Tours?id=${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting favorite:', error);
            throw error;
        }
    }
    
};
