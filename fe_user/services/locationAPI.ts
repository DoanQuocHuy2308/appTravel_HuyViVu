import { Location } from '../types';
import { API_URL } from '../types/url';
import axios from 'axios';

export const LocationAPI = {
    getAllLocation: async (): Promise<Location[]> => {
        const res = await axios.get(`${API_URL}/location/getAllLocations`);
        return res.data;
    },
};