import { useEffect, useState } from "react";
import { imageTourAPI } from "../services/image_tour";
import { ImageTour } from "../types";

export const useImageTours = () => {
    const [imageTours, setImageTours] = useState<ImageTour[]>([]);
    const [loading, setLoading] = useState(true);
    
    const getAllImageTours = async () => {
        try {
            setLoading(true);
            const response = await imageTourAPI.getAllImageTour();
            setImageTours(response);
        } catch (error) {
            console.error('Error fetching image tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageTourById = async (id: number) => {
        try {
            setLoading(true);
            const response = await imageTourAPI.getImageTourById(id);
            return response;
        } catch (error) {
            console.error('Error fetching image tour by ID:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getImageTourByIdTour = async (tour_id: number) => {
        try {
            setLoading(true);
            const response = await imageTourAPI.getImageTourByIdTour(tour_id);
            setImageTours(response || []);
            return response || [];
        } catch (error: any) {
            console.error('Error fetching image tours by tour ID:', error);
            // If no images found (404), return empty array instead of throwing error
            if (error.response?.status === 404) {
                setImageTours([]);
                return [];
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createImageTour = async (formData: FormData) => {
        try {
            setLoading(true);
            const response = await imageTourAPI.createImageTour(formData as any);
            await getAllImageTours(); // Refresh the list
            return response;
        } catch (error) {
            console.error('Error creating image tour:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateImageTour = async (id: number, formData: FormData) => {
        try {
            setLoading(true);
            const response = await imageTourAPI.updateImageTour(id, formData as any);
            await getAllImageTours(); // Refresh the list
            return response;
        } catch (error) {
            console.error('Error updating image tour:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteImageTour = async (id: number) => {
        try {
            setLoading(true);
            const response = await imageTourAPI.deleteImageTour(id);
            await getAllImageTours(); // Refresh the list
            return response;
        } catch (error) {
            console.error('Error deleting image tour:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createMultipleImageTour = async (formData: FormData) => {
        try {
            setLoading(true);
            const response = await imageTourAPI.createMultipleImageTour(formData as any);
            await getAllImageTours(); // Refresh the list
            return response;
        } catch (error) {
            console.error('Error creating multiple image tours:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
        
    useEffect(() => {
        getAllImageTours();
    }, []);

    return { 
        imageTours, 
        loading, 
        getAllImageTours, 
        getImageTourById,
        getImageTourByIdTour, 
        createImageTour, 
        updateImageTour, 
        deleteImageTour,
        createMultipleImageTour
    };
};