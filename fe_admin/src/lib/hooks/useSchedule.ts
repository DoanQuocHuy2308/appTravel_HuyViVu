import { useEffect, useState } from "react";
import { TourSchedule } from "../types";
import { scheduleAPI } from "../services/scheduleAPI";

export const useSchedule = () => {
    const [schedules, setSchedules] = useState<TourSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scheduleById, setScheduleById] = useState<TourSchedule | null>(null);
    const [scheduleByIdTour, setScheduleByIdTour] = useState<TourSchedule[]>([]);

    const getAllSchedule = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await scheduleAPI.getAllTour_Schedule();
            setSchedules(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách lịch trình');
        } finally {
            setLoading(false);
        }
    }

    const getScheduleById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await scheduleAPI.getTour_ScheduleById(id);
            setScheduleById(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải lịch trình');
        } finally {
            setLoading(false);
        }
    }

    const getScheduleByIdTour = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await scheduleAPI.getTour_ScheduleByIdTour(id);
            setScheduleByIdTour(response || []);
            return response || [];
        } catch (err: any) {
            console.error('Error fetching schedules by tour ID:', err);
            // If no schedules found (404), return empty array instead of throwing error
            if (err.response?.status === 404) {
                setScheduleByIdTour([]);
                return [];
            }
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải lịch trình tour');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const createSchedule = async (schedule: TourSchedule) => {
        try {
            setLoading(true);
            setError(null);
            const response = await scheduleAPI.createTour_Schedule(schedule);
            setSchedules(prev => [...prev, response]);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo lịch trình');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const updateSchedule = async (id: number, schedule: TourSchedule) => {
        try {
            setLoading(true);
            setError(null);
            const response = await scheduleAPI.updateTour_Schedule(id, schedule);
            setSchedules(prev => prev.map(s => s.id === id ? response : s));
            setScheduleById(response);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật lịch trình');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const deleteSchedule = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await scheduleAPI.deleteTour_Schedule(id);
            setSchedules(prev => prev.filter(s => s.id !== id));
            if (scheduleById?.id === id) {
                setScheduleById(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa lịch trình');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllSchedule();
    }, []);

    return { 
        schedules, 
        loading, 
        error,
        scheduleById,
        scheduleByIdTour,
        getAllSchedule,
        getScheduleById,
        getScheduleByIdTour,
        createSchedule,
        updateSchedule,
        deleteSchedule
    };
}