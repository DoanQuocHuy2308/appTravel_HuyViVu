import { useState, useEffect } from "react";
import { getProvinces, getDistricts, getWards, Province, District, Ward } from "@/services/locationService";
export default function useLocation() {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loading, setLoading] = useState(true);
    const getAllProvinces = async () => {
        setLoading(true);
        const response = await getProvinces();
        setProvinces(response);
        setLoading(false);
    }
    const getAllDistricts = async (provinceCode: number) => {
        setLoading(true);
        const response = await getDistricts(provinceCode);
        setDistricts(response);
        setLoading(false);
    }
    const getAllWards = async (districtCode: number) => {
        setLoading(true);
        const response = await getWards(districtCode);
        setWards(response);
        setLoading(false);
    }
    useEffect(() => {
        getAllProvinces();
    }, []);
    return { provinces, districts, wards, loading, getAllProvinces, getAllDistricts, getAllWards };
}