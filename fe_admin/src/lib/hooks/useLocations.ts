import { useEffect, useState } from "react";
import { locationsAPI } from "../services/locationsAPI";
import { Location } from "../types";

export default function useLocations() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);
    const getAllLocations = async () => {
        try {
            const response = await locationsAPI.getAllLocations();
            setLocations(response);
            setLoading(false);
        } catch (error) {
            console.error("Loi khi lay location:", error);
        }
    }
    const getLocationsById = async (id: number) => {
        try {
            const response = await locationsAPI.getLocationsById(id);
            setLocation(response);
            setLoading(false);
        } catch (error) {
            console.error("Loi khi lay location by id:", error);
        }
    }
    const createLocations = async (formData: FormData) => {
        try {
            const response = await locationsAPI.createLocations(formData);
            setLocations([...locations, response]);
            setLoading(false);
            return response;
        } catch (error: any) {
            console.error("Loi khi tao location:", error);
            setLoading(false);
            throw error; // Re-throw để component có thể handle
        }
    }
    const updateLocations = async (id: number, formData: FormData) => {
        try {
            const response = await locationsAPI.updateLocations(id, formData);
            setLocations(locations.map(l => l.id === id ? response : l));
            setLoading(false);
        } catch (error) {
            console.error("Loi khi cap nhat location:", error);
        }
    }   
    const deleteLocations = async (id: number) => {
        try {
            await locationsAPI.deleteLocations(id);
            setLocations(locations.filter(l => l.id !== id));
            setLoading(false);
            return true;
        } catch (error: any) {
            console.error("Loi khi xoa location:", error);
            setLoading(false);
            throw error; // Re-throw để component có thể handle
        }
    }
    useEffect(() => {
        getAllLocations();
    }, []);
    return { locations, location, loading, getAllLocations, getLocationsById, createLocations, updateLocations, deleteLocations };
};
