import { useEffect, useState } from "react";
import { regionAPI } from "../services/regionAPI";
import { Region } from "../types";

export default function useRegion() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [region, setRegion] = useState<Region | null>(null);
    const [loading, setLoading] = useState(true);
    const getAllRegions = async () => {
        try {
            const response = await regionAPI.getAllRegions();
            setRegions(response);
            setLoading(false);
        } catch (error) {
            console.error("Loi khi lay region:", error);
        }
    }
    const getRegionById = async (id: number) => {
        try {
            const response = await regionAPI.getRegionsById(id);
            setRegion(response);
            setLoading(false);
        } catch (error) {
            console.error("Loi khi lay region by id :", error);
        }
    }
    const createRegion = async (region: Region) => {
        try {
            const response = await regionAPI.createRegions(region);
            setRegions([...regions, response]);
            setLoading(false);
        } catch (error) {
            console.error("Loi khi tao region:", error);
        }
    }
    const updateRegion = async (id: number, region: Region) => {
        try {
            const response = await regionAPI.updateRegions(id, region);
            setRegions(regions.map(r => r.id === id ? response : r));
            setLoading(false);
        } catch (error) {
            console.error("Loi khi cap nhat region:", error);
        }
    }
    const deleteRegion = async (id: number) => {
        try {
            await regionAPI.deleteRegions(id);
            setRegions(regions.filter(r => r.id !== id));
            setLoading(false);
        } catch (error) {
            console.error("Loi khi xoa region:", error);
        }
    }   
    useEffect(() => {
        getAllRegions();
    }, []);
    return { regions, region, loading, getAllRegions, getRegionById, createRegion, updateRegion, deleteRegion };        
};
