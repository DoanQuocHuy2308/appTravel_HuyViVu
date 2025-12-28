import { useEffect, useState } from "react";
import { tourAPI } from "../services/tourAPI";
import { newTour } from "@/types";
import { useLocalSearchParams } from "expo-router";

export const useTours = () => {
  const [tours, setTours] = useState<newTour[]>([]);
  const [tour, setTour] = useState<newTour | null>(null);
  const [toursByTime, setToursByTime] = useState<newTour[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { id, tourId } = useLocalSearchParams();
  const getAllTours = async () => {
    try {
      setLoading(true);
      const response = await tourAPI.getAllTours();
      setTours(response);
    } catch (error) {
      setTours([]);
    } finally {
      setLoading(false);
    }
  };
  const getAllTourByTime = async () => {
    try {
      setLoading(true);
      const response = await tourAPI.getAllTourByTime();
      setToursByTime(response);
    }
    catch (error) {
      setTours([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllTours();
    getAllTourByTime();
  }, []);
  useEffect(() => {
    const getTourById = async () => {
      const tourIdToUse = tourId || id;
      if (!tourIdToUse) return;
      try {
        setLoading(true);
        const response = await tourAPI.getToursById(Number(tourIdToUse));
        setTour(response);
      } catch (error) {
        setTour(null);
      } finally {
        setLoading(false);
      }
    };
    getTourById();
  }, [id, tourId]);
  return { tours, tour, toursByTime, loading };
};
