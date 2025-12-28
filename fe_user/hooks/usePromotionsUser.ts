import { useEffect, useState, useCallback } from "react";
import { userVoucherAPI } from "../services/userVoucherAPI";
import { UserPromotion, } from "@/types";
import useUser from "@/hooks/useUser";

export default function usePromotionsUser() {
    const [promotionsUser, setPromotionsUser] = useState<UserPromotion[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    
    const getAllPromotionsUser = useCallback(async () => {
        try {
            if (user && user.id) {
                setLoading(true);
                const response = await userVoucherAPI.getAllPromotionsByUserId(user.id);
                setPromotionsUser(response);
            } else {
                setPromotionsUser([]);
            }
        } catch (error) {
            console.error('Error loading promotions:', error);
            setPromotionsUser([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);
    
    const createUserVoucher = async (promotion_id: number) => {
        try {
            if (user && user?.id) {
                const response = await userVoucherAPI.createUserVoucher(user.id, promotion_id, 0);
                if (response) {
                    await getAllPromotionsUser(); 
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error creating voucher:', error);
            return false;
        }
    }

    
    
    useEffect(() => {
        getAllPromotionsUser();
    }, [getAllPromotionsUser]);
    
    return { 
        promotionsUser, 
        loading, 
        createUserVoucher
    };
}
