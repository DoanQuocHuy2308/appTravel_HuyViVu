import axios from "axios";
import { API_URL } from "../types/url";
import { ImageTour } from "../types";

export const imageTourAPI = {
    getAllImageTour: async () => {
        const response = await axios.get(`${API_URL}/image_tour/getAllImage_Tour`);
        return response.data;
    },      
    getImageTourById: async (id: number) => {
        const response = await axios.get(`${API_URL}/image_tour/getImage_TourById?id=${id}`);
        return response.data;
    },  
    getImageTourByIdTour: async (tour_id: number) => {
        const response = await axios.get(`${API_URL}/image_tour/getImage_TourByIdTour?tour_id=${tour_id}`);
        return response.data;
    },
    createImageTour: async (formData: FormData) => {
        const response = await axios.post(`${API_URL}/image_tour/createImage_Tour`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    updateImageTour: async (id: number, formData: FormData) => {
        const response = await axios.put(`${API_URL}/image_tour/updateImage_Tour?id=${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deleteImageTour: async (id: number) => {
        const response = await axios.delete(`${API_URL}/image_tour/deleteImage_Tour?id=${id}`);
        return response.data;
    },
    createMultipleImageTour: async (formData: FormData) => {
        const response = await axios.post(`${API_URL}/image_tour/createMultipleImage_Tour`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}