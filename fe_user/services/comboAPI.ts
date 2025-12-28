import axios from "axios";
import { API_URL } from "../types/url";
import { ComboFull } from "../types";

export const comboAPI = {
    getAllCombo: async (): Promise<ComboFull[]> => {
        const response = await axios.get(`${API_URL}/combo/getAllCombos`);
        return response.data;
    }
}