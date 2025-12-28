import { useEffect, useState } from "react";
import { TourNote } from "../types";
import { tourNoteAPI } from "../services/tourNoteAPI";
import { useLocalSearchParams } from "expo-router";
export default function useNotes() {
    const [notes, setNotes] = useState<TourNote[]>([]);
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const getTourNotesByIdTour = async () => {
        const response = await tourNoteAPI.getTourNotesByIdTour(Number(id));
        setNotes(response);
        setLoading(false);
    }
    useEffect(() => {
        getTourNotesByIdTour();
    }, []);
    return { notes, loading };
}