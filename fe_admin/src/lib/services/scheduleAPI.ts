import axios from "axios";
import { API_URL } from "../types/url";
import { TourSchedule } from "../types";

export const scheduleAPI = {
    getAllTour_Schedule: async (): Promise<TourSchedule[]> => {
        const response = await axios.get(`${API_URL}/schedule/getAllTour_Schedule`);
        return response.data;
    },
    getTour_ScheduleById: async (id: number): Promise<TourSchedule> => {
        const response = await axios.get(`${API_URL}/schedule/getTour_ScheduleById?id=${id}`);
        return response.data;
    },
    getTour_ScheduleByIdTour: async (tour_id: number): Promise<TourSchedule[]> => {
        const response = await axios.get(`${API_URL}/schedule/getTour_ScheduleByIdTour?id=${tour_id}`);
        return response.data;
    },
    createTour_Schedule: async (tour_schedule: TourSchedule): Promise<TourSchedule> => {
        const response = await axios.post(`${API_URL}/schedule/createTour_Schedule`, tour_schedule);
        return response.data;
    },
    updateTour_Schedule: async (id: number, tour_schedule: TourSchedule): Promise<TourSchedule> => {
        const response = await axios.put(`${API_URL}/schedule/updateTour_Schedule?id=${id}`, tour_schedule);
        return response.data;
    },
    deleteTour_Schedule: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/schedule/deleteTour_Schedule?id=${id}`);
    },
}