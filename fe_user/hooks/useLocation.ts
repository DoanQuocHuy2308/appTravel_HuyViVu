import {Location} from "../types"
import {useEffect, useState} from "react";
import {LocationAPI} from "../services/locationAPI";

export default function useLocation() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const getAllLocation = async () => {
        try {
            const response = await LocationAPI.getAllLocation();
            setLocations(response);
            setLoading(false);
        } catch (error) {
            console.error("Loi khi lay location:", error);
        }
    }
    useEffect(() => {
        getAllLocation();
    },[])
    return {locations, loading};
};
