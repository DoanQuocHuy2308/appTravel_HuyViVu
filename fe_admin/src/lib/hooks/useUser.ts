"use client";

import { User } from '../types';
import { useEffect, useState } from 'react';

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await localStorage.getItem("user");
        const userData = userDataString ? JSON.parse(userDataString) : null;
        setUser(userData?.user ?? null);
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  return { user, loading };
}
