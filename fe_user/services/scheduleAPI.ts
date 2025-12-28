import axios from 'axios';
import { TourSchedule } from '../types';
import { API_URL } from '../types/url';

export const scheduleAPI = {
    getAllSchedule: async (): Promise<TourSchedule[]> => {
        const response = await axios.get(`${API_URL}/schedule/getAllSchedule`);
        return response.data;
    },
    getScheduleById: async (id: number): Promise<TourSchedule> => {
        const response = await axios.get(`${API_URL}/schedule/getScheduleById?id=${id}`);
        return response.data;
    },
    getScheduleByIdTour: async (id: number): Promise<TourSchedule[]> => {
        const response = await axios.get(`${API_URL}/schedule/getTour_ScheduleByIdTour?id=${id}`);
        return response.data;
    },
    createSchedule: async (schedule: TourSchedule): Promise<TourSchedule> => {
        const response = await axios.post(`${API_URL}/schedule/createSchedule`, schedule);
        return response.data;
    },
}
