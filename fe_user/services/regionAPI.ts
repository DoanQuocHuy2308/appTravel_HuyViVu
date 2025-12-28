import {Region} from "../types"
import {API_URL} from "../types/url";
import axios from "axios";

export const regionAPI = {
    getAllRegion: async (): Promise<Region[]> => {
        const response = await axios.get(`${API_URL}/region/getAllRegions`);
        return response.data;
    }
}