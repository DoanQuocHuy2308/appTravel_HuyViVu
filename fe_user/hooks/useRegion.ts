import { Region } from "../types"
import { useEffect, useState } from "react";
import { regionAPI } from "../services/regionAPI";

export default function useRegion() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const getAllRegion = async () => {
        try {
            const response = await regionAPI.getAllRegion();
            setRegions(response);
            setLoading(false);
        } catch (error) {
            console.error("Loi khi lay region:", error);
        }
    }
    useEffect(() => {
        getAllRegion();
    }, []);
    return { regions, loading };
}