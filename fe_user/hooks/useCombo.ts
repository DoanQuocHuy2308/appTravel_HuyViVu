import { useState, useEffect } from "react";
import { ComboFull } from "../types";
import { comboAPI } from "../services/comboAPI";

export default function useCombo() {
    const [combos, setCombos] = useState<ComboFull[]>([]);
    const [loading, setLoading] = useState(true);
    const getAllCombo = async () => {
        const response = await comboAPI.getAllCombo();
        setCombos(response);
    }
    useEffect(() => {
        getAllCombo();
    }, []);
    return { combos, loading };
};
