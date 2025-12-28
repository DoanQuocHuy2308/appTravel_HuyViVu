import { Banner } from "@/types";
import { useEffect, useState } from "react";
import {bannerAPI} from "../services/bannerAPI";

export default function useBanner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const getAllBanner = async () => {
        try{
            const response = await bannerAPI.getAllBanner();
            setBanners(response);
            setLoading(false);
        }catch (error){
            console.error("Lỗi khi lấy banner:", error);
        }
    }
    useEffect(() => {
        getAllBanner();
    }, []);
    return {banners, loading};
};
