import { useState, useEffect } from 'react';
import { useTours } from './useTour';
import { useBookings } from './useBookings';
import useUsers from './useUsers';

export interface DashboardStats {
  totalTours: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  pendingBookings: number;
  confirmedBookings: number;
  canceledBookings: number;
  recentBookings: any[];
  monthlyRevenue: number[];
  monthlyBookings: number[];
  toursByType: { [key: string]: number };
  userGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTours: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    canceledBookings: 0,
    recentBookings: [],
    monthlyRevenue: [],
    monthlyBookings: [],
    toursByType: {},
    userGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { tours, getAllTours } = useTours();
  const { bookings, fetchAllBookings } = useBookings();
  const { users, getAllUsers } = useUsers();

  const calculateStats = () => {
    try {
      // Debug: Log dữ liệu để kiểm tra
      console.log('Bookings data:', bookings);
      console.log('Tours data:', tours);
      console.log('Users data:', users);

      // Tính tổng số tours
      const totalTours = tours.length;

      // Tính tổng số users
      const totalUsers = users.length;

      // Tính tổng số bookings
      const totalBookings = bookings.length;

      // Tính tổng doanh thu
      const totalRevenue = bookings.reduce((sum, booking) => {
        const price = booking.total_price;
        console.log('Booking price:', price, 'Type:', typeof price);
        // Xử lý các trường hợp price có thể là string, null, undefined, hoặc NaN
        const numericPrice = typeof price === 'string' ? parseFloat(price) : (price || 0);
        const validPrice = isNaN(numericPrice) || numericPrice === null || numericPrice === undefined ? 0 : numericPrice;
        console.log('Numeric price:', numericPrice, 'Valid price:', validPrice);
        return sum + validPrice;
      }, 0);

      console.log('Total revenue calculated:', totalRevenue);

      // Tính đánh giá trung bình (giả sử có rating từ tours)
      const averageRating = tours.length > 0 
        ? tours.reduce((sum, tour) => sum + (tour.point || 0), 0) / tours.length 
        : 0;

      // Tính số bookings theo trạng thái
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
      const canceledBookings = bookings.filter(b => b.status === 'canceled').length;

      // Lấy 5 bookings gần nhất
      const recentBookings = bookings
        .sort((a, b) => new Date(b.booking_date || '').getTime() - new Date(a.booking_date || '').getTime())
        .slice(0, 5);

      // Tính doanh thu theo tháng (6 tháng gần nhất)
      const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        return bookings
          .filter(booking => {
            const bookingDate = new Date(booking.booking_date || '');
            return bookingDate >= monthStart && bookingDate <= monthEnd;
          })
          .reduce((sum, booking) => {
            const price = booking.total_price;
            const numericPrice = typeof price === 'string' ? parseFloat(price) : (price || 0);
            return sum + (isNaN(numericPrice) || numericPrice === null || numericPrice === undefined ? 0 : numericPrice);
          }, 0);
      });

      // Tính số bookings theo tháng
      const monthlyBookings = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        return bookings.filter(booking => {
          const bookingDate = new Date(booking.booking_date || '');
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        }).length;
      });

      // Tính phân bố tours theo loại
      const toursByType = tours.reduce((acc, tour) => {
        const type = tour.name_type || 'Khác';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      // Tính tăng trưởng (so với tháng trước)
      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      
      const currentMonthUsers = users.filter((user: any) => {
        const userDate = new Date(user.created_at || '');
        return userDate.getMonth() === currentMonth;
      }).length;
      
      const lastMonthUsers = users.filter((user: any) => {
        const userDate = new Date(user.created_at || '');
        return userDate.getMonth() === lastMonth;
      }).length;
      
      const userGrowth = lastMonthUsers > 0 ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;

      const currentMonthBookings = monthlyBookings[5] || 0;
      const lastMonthBookings = monthlyBookings[4] || 0;
      const bookingGrowth = lastMonthBookings > 0 ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0;

      const currentMonthRev = monthlyRevenue[5] || 0;
      const lastMonthRev = monthlyRevenue[4] || 0;
      const revenueGrowth = lastMonthRev > 0 ? ((currentMonthRev - lastMonthRev) / lastMonthRev) * 100 : 0;

      setStats({
        totalTours,
        totalUsers,
        totalBookings,
        totalRevenue,
        averageRating,
        pendingBookings,
        confirmedBookings,
        canceledBookings,
        recentBookings,
        monthlyRevenue,
        monthlyBookings,
        toursByType,
        userGrowth,
        bookingGrowth,
        revenueGrowth
      });
    } catch (err) {
      setError('Lỗi khi tính toán thống kê');
      console.error('Error calculating stats:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        getAllTours(),
        fetchAllBookings(),
        getAllUsers()
      ]);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu dashboard');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (tours.length > 0 || bookings.length > 0 || users.length > 0) {
      calculateStats();
    }
  }, [tours, bookings, users]);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
