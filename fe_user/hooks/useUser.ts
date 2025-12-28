import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { userAPI } from '../services/userAPI';
export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const getUser = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem('user');
    setUser(user ? JSON.parse(user).user : null);
    setLoading(false);
  }
  const update =  async (user: User) => {
    setLoading(true);
    try {
      const response = await userAPI.updateUser(user.id, user);
      setUser(response);
      // Update AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify({ user: response }));
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  const deleteUser = async (id: number) => {
    setLoading(true);
    try {
      await userAPI.deleteUser(id);
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }
  const changePassword = async (id: number, currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      const response = await userAPI.changePassword(id, currentPassword, newPassword);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getUser();
  }, []);
  return { user, update, deleteUser, changePassword, loading };
}