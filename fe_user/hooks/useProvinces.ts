import { useEffect, useState } from "react";
import { getProvinces, getDistricts, getWards, Province, District, Ward } from "@/services/locationService";

export const useProvinces = () => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProvinces = async () => {
            setLoading(true);
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách tỉnh/thành:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                setLoading(true);
                try {
                    const data = await getDistricts(selectedProvince);
                    setDistricts(data);
                    setWards([]);
                    setSelectedDistrict(null);
                } catch (error) {
                    console.error("Lỗi khi tải danh sách quận/huyện:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince]);
    
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                setLoading(true);
                try {
                    const data = await getWards(selectedDistrict);
                    setWards(data);
                } catch (error) {
                    console.error("Lỗi khi tải danh sách phường/xã:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchWards();
        }
    }, [selectedDistrict]);

    return {
        provinces,
        districts,
        wards,
        selectedProvince,
        setSelectedProvince,
        selectedDistrict,
        setSelectedDistrict,
        loading,
    };
};
