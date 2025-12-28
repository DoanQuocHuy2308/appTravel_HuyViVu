import axios from 'axios';
import { TourNote } from '../types';
import { API_URL } from '../types/url';

export const tourNoteAPI = {
    getAllTourNotes: async (): Promise<TourNote[]> => {
        const response = await axios.get(`${API_URL}/notes/getAllTourNotes`);
        return response.data;
    },
    getTourNotesById: async (id: number): Promise<TourNote> => {
        const response = await axios.get(`${API_URL}/notes/getTourNotesById?id=${id}`);
        return response.data;
    },
    getTourNotesByIdTour: async (id: number): Promise<TourNote[]> => {
        const response = await axios.get(`${API_URL}/notes/getTour_NotesByIdTour?id=${id}`);
        return response.data;
    },
}