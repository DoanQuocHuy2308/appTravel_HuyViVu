import { useEffect, useState } from "react";
import { Promotion } from "@/types";
import { vouchersAPI } from "@/services/vouchersAPI";
export const usePromotions = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const getAllPromotions = async () => {
        const response = await vouchersAPI.getAllPromotions();
        setPromotions(response);
        setLoading(false);
    }
    useEffect(() => {
        getAllPromotions();
    }, []);
    return { promotions, loading, getAllPromotions };
}