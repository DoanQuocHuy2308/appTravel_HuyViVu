import { useEffect, useState } from "react";
import { TourNote } from "../types";
import { noteAPI } from "../services/noteAPI";
export const useNote = () => {
    const [notes, setNotes] = useState<TourNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState<TourNote | null>(null);
    const getAllTourNotes = async () => {
        const response = await noteAPI.getAllTourNotes();
        setNotes(response);
        setLoading(false);
    }
    const getTourNotesById = async (id: number) => {
        const response = await noteAPI.getTourNotesById(id);
        setNote(response);
        setLoading(false);
    }
    const getTourNotesByTourId = async (tour_id: number) => {
        try {
            setLoading(true);
            const response = await noteAPI.getTourNotesByTourId(tour_id);
            setNotes(response || []);
            return response || [];
        } catch (error: any) {
            console.error('Error fetching tour notes by tour ID:', error);
            // If no notes found (404), return empty array instead of throwing error
            if (error.response?.status === 404) {
                setNotes([]);
                return [];
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }
    const createTourNotes = async (note: TourNote) => {
        const response = await noteAPI.createTourNotes(note);
        setNote(response);
        setLoading(false);
    }
    const updateTourNotes = async (id: number, note: TourNote) => {
        const response = await noteAPI.updateTourNotes(id, note);
        setNote(response);
        setLoading(false);
    }
    const deleteTourNotes = async (id: number) => {
        await noteAPI.deleteTourNotes(id);
        setLoading(false);
    }   
    useEffect(() => {
        getAllTourNotes();
    }, []);
    return { notes, note, loading, getAllTourNotes, getTourNotesById, getTourNotesByTourId, createTourNotes, updateTourNotes, deleteTourNotes };
}