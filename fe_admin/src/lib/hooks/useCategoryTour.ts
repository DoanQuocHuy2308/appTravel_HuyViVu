import { useEffect, useState } from "react";
import { categoryTourAPI } from "../services/categoryTourAPI";
import { TourType } from "../types";
export const useCategoryTour = () => {
    const [tourTypes, setTourTypes] = useState<TourType[]>([]);
    const [tourType, setTourType] = useState<TourType | null>(null);
    const [loading, setLoading] = useState(true);
    const getAllTourTypes = async () => {
        try {
            setLoading(true);
            const response = await categoryTourAPI.getAllTourType();
            setTourTypes(response);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tour types:", error);
            setTourTypes([]);
            setLoading(false);
        }
    }
    const getTourTypeById = async (id: number) => {
        try {
            setLoading(true);
            const response = await categoryTourAPI.getTourTypeById(id);
            setTourType(response);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tour type:", error);
            setTourType(null);
            setLoading(false);
        }
    }
    const createTourType = async (tourType: Omit<TourType, 'id'>) => {
        try {
            setLoading(true);
            const response = await categoryTourAPI.createTourType(tourType);
            setTourType(response);
            setLoading(false);
        } catch (error) {
            console.error("Error creating tour type:", error);
            setTourType(null);
            setLoading(false);
        }
    }
    const updateTourType = async (id: number, tourType: Omit<TourType, 'id'>) => {
        try {
            setLoading(true);
            const response = await categoryTourAPI.updateTourType(id, tourType);
            setTourType(response);
            setLoading(false);
        } catch (error) {
            console.error("Error updating tour type:", error);
            setTourType(null);
            setLoading(false);
        }
    }
    const deleteTourType = async (id: number) => {
        try {
            setLoading(true);
            const response = await categoryTourAPI.deleteTourType(id);
            setTourType(null);
            setLoading(false);
        } catch (error) {
            console.error("Error deleting tour type:", error);
            setTourType(null);
            setLoading(false);
        }
    }
    useEffect(() => {
        getAllTourTypes();
    }, []);
    return { tourTypes, tourType, loading, getAllTourTypes, createTourType, updateTourType, deleteTourType };
}