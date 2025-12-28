import { useEffect, useState } from "react";
import { TourSchedule } from "../types";
import { scheduleAPI } from "../services/scheduleAPI";
import { useLocalSearchParams } from "expo-router";
export default function useSchedule() {
    const [schedule, setSchedule] = useState<TourSchedule[]>([]);
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const getScheduleByIdTour = async () => {
        const response = await scheduleAPI.getScheduleByIdTour(Number(id));
        setSchedule(response);
        setLoading(false);
    }
    useEffect(() => {
        getScheduleByIdTour();
    }, [id]);
    return { schedule, loading };
};
