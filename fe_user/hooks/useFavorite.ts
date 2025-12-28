import { useCallback, useEffect, useState } from "react";
import { newTourFavorite } from "@/types";
import useUser from "./useUser";
import { favoriteAPI } from "@/services/favoriteAPI";

interface UseFavoriteResult {
  favorites: newTourFavorite[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addFavorite: (tourId: number) => Promise<void>;
  removeFavoriteByFavoriteId: (favoriteId: number) => Promise<void>;
  isTourFavorited: (tourId?: number | null) => boolean;
}

export default function useFavorite(): UseFavoriteResult {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<newTourFavorite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      setFavorites([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await favoriteAPI.getAllFavorite(user.id);
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? "Không thể tải danh sách yêu thích");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    error,
    refetch: fetchFavorites,
    addFavorite: async (tourId: number) => {
      if (!user?.id || !tourId) return;
      await favoriteAPI.addFavorite(user.id, tourId);
      await fetchFavorites();
    },
    removeFavoriteByFavoriteId: async (favoriteId: number) => {
      if (!favoriteId) return;
      await favoriteAPI.deleteFavoriteById(favoriteId);
      await fetchFavorites();
    },
    isTourFavorited: (tourId?: number | null) => {
      if (!tourId) return false;
      return favorites.some((f) => f.id === tourId);
    },
  };
}
