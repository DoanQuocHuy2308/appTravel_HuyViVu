import axios from "axios";
import { API_URL } from "../types/url";
import { TourNote } from "../types";
export const noteAPI = {
    getAllTourNotes: async (): Promise<TourNote[]> => {
        const response = await axios.get(`${API_URL}/notes/getAllTour_Notes`);
        return response.data;
    },
    getTourNotesById: async (id: number): Promise<TourNote> => {
        const response = await axios.get(`${API_URL}/notes/getTour_NotesById?id=${id}`);
        return response.data;
    },
    getTourNotesByTourId: async (tour_id: number): Promise<TourNote[]> => {
        const response = await axios.get(`${API_URL}/notes/getTour_NotesByIdTour?id=${tour_id}`);
        return response.data;
    },
    createTourNotes: async (note: TourNote): Promise<TourNote> => {
        const response = await axios.post(`${API_URL}/notes/createTour_Notes`, note);
        return response.data;
    },
    updateTourNotes: async (id: number, note: TourNote): Promise<TourNote> => {
        const response = await axios.put(`${API_URL}/notes/updateTour_Notes?id=${id}`, note);
        return response.data;
    },
    deleteTourNotes: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/notes/deleteTour_Notes?id=${id}`);
    },
}