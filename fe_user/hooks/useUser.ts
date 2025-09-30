import { User } from '../types';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("user");
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
  }, []);

  return { user, loading }; 
}
