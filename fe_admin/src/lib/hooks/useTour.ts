import { useState, useEffect } from "react";
import { tourAPI } from "../services/tourAPI";
import { newTour } from "../types/index";
import { useSearchParams } from "next/navigation";

export const useTours = () => {
  const [tours, setTours] = useState<newTour[]>([]);
  const [tour, setTour] = useState<newTour | null>(null);
  const [toursByTime, setToursByTime] = useState<newTour[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const  id  = useSearchParams().get("id");
  const getAllTours = async () => {
    try {
      setLoading(true);
      const response = await tourAPI.getAllTours();
      setTours(response);
    } catch (error) {
      console.error("Error fetching tours:", error);
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
      console.error("Error fetching tours by time:", error);
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
      if (!id) return;
      try {
        setLoading(true);
        const response = await tourAPI.getToursById(Number(id));
        setTour(response);
      } catch (error) {
        console.error("Error fetching tour by ID:", error);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };
    getTourById();
  }, [id]);
  const getTourById = async (id: number) => {
    try {
      setLoading(true);
      const response = await tourAPI.getToursById(id);
      setTour(response);
      return response;
    } catch (error) {
      console.error("Error fetching tour by ID:", error);
      setTour(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTour = async (tour: newTour) => {
    try {
      setLoading(true);
      const response = await tourAPI.updateTour(Number(id), tour);
      setTours(prevTours => 
        prevTours.map(t => t.id === tour.id ? response : t)
      );
      // Update current tour if it's the same
      if (tour.id === tour.id) {
        setTour(response);
      }
      return response;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTourById = async (tourId: number, tour: newTour) => {
    try {
      setLoading(true);
      const response = await tourAPI.updateTour(tourId, tour);
      setTours(prevTours => 
        prevTours.map(t => t.id === tourId ? response : t)
      );
      // Update current tour if it's the same
      if (tour?.id === tourId) {
        setTour(response);
      }
      return response;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTour = async (tour: newTour | FormData) => {
    try {
      setLoading(true);
      const response = await tourAPI.createTour(tour);
      setTours(prevTours => [...prevTours, response]);
      return response;
    } catch (error) {
      console.error("Error creating tour:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTour = async (id: number) => {
    try {
      setLoading(true);
      await tourAPI.deleteTour(id);
      // Remove from tours list
      setTours(prevTours => prevTours.filter(t => t.id !== id));
      // Clear current tour if it's the same
      if (tour?.id === id) {
        setTour(null);
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    tours, 
    tour, 
    toursByTime, 
    loading, 
    getAllTours,
    getTourById,
    updateTour,
    updateTourById,
    createTour,
    deleteTour
  };
};
