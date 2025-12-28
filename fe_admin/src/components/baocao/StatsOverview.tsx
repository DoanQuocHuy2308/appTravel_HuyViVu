"use client";

import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import 'primeicons/primeicons.css';

interface StatsOverviewProps {
    stats: {
        totalTours: number;
        totalUsers: number;
        totalBookings: number;
        totalRevenue: number;
        pendingBookings: number;
        confirmedBookings: number;
        canceledBookings: number;
        userGrowth: number;
        bookingGrowth: number;
        revenueGrowth: number;
    };
    loading?: boolean;
}

export const StatsOverview = ({ stats, loading = false }: StatsOverviewProps) => {
    const formatPrice = (price: number) => {
        if (isNaN(price) || price === null || price === undefined) {
            return '0 ₫';
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(price);
    };

    const formatGrowth = (growth: number) => {
        const sign = growth >= 0 ? '+' : '';
        return `${sign}${growth.toFixed(1)}%`;
    };

    const getGrowthSeverity = (growth: number) => {
        if (growth > 0) return 'success';
        if (growth < 0) return 'danger';
        return 'info';
    };

    // Tính phần trăm cho progress bars
    const totalBookingsForProgress = stats.totalBookings || 1;
    const pendingPercentage = (stats.pendingBookings / totalBookingsForProgress) * 100;
    const confirmedPercentage = (stats.confirmedBookings / totalBookingsForProgress) * 100;
    const canceledPercentage = (stats.canceledBookings / totalBookingsForProgress) * 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Tổng Tours */}
            <Card className="stats-card-green text-white shadow-lg border-0 fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm border border-white border-opacity-30">
                                <span className="text-2xl text-white">🗺️</span>
                            </div>
                            <Tag 
                                value={formatGrowth(stats.bookingGrowth)} 
                                severity={getGrowthSeverity(stats.bookingGrowth)}
                                className="text-xs font-semibold shadow-sm"
                            />
                        </div>
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-1 opacity-90">Tổng Tours</p>
                            <p className="text-4xl font-bold mb-2 tracking-tight">{stats.totalTours}</p>
                            <div className="flex items-center gap-1">
                                <span className="text-xs">{stats.bookingGrowth >= 0 ? '📈' : '📉'}</span>
                                <p className="text-green-200 text-xs font-medium">
                                    {stats.bookingGrowth >= 0 ? 'Tăng trưởng' : 'Giảm'} so với tháng trước
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Khách hàng */}
            <Card className="stats-card-blue text-white shadow-lg border-0 fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm border border-white border-opacity-30">
                                <span className="text-2xl text-white">👥</span>
                            </div>
                            <Tag 
                                value={formatGrowth(stats.userGrowth)} 
                                severity={getGrowthSeverity(stats.userGrowth)}
                                className="text-xs font-semibold shadow-sm"
                            />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1 opacity-90">Khách hàng</p>
                            <p className="text-4xl font-bold mb-2 tracking-tight">{stats.totalUsers}</p>
                            <div className="flex items-center gap-1">
                                <span className="text-xs">{stats.userGrowth >= 0 ? '📈' : '📉'}</span>
                                <p className="text-blue-200 text-xs font-medium">
                                    {stats.userGrowth >= 0 ? 'Tăng trưởng' : 'Giảm'} so với tháng trước
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Doanh thu */}
            <Card className="stats-card-amber text-white shadow-lg border-0 fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm border border-white border-opacity-30">
                                <span className="text-2xl text-white">💰</span>
                            </div>
                            <Tag 
                                value={formatGrowth(stats.revenueGrowth)} 
                                severity={getGrowthSeverity(stats.revenueGrowth)}
                                className="text-xs font-semibold shadow-sm"
                            />
                        </div>
                        <div>
                            <p className="text-amber-100 text-sm font-medium mb-1 opacity-90">Doanh thu</p>
                            <p className="text-3xl font-bold mb-2 tracking-tight">{formatPrice(stats.totalRevenue)}</p>
                            <div className="flex items-center gap-1">
                                <span className="text-xs">{stats.revenueGrowth >= 0 ? '📈' : '📉'}</span>
                                <p className="text-amber-200 text-xs font-medium">
                                    {stats.revenueGrowth >= 0 ? 'Tăng trưởng' : 'Giảm'} so với tháng trước
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Đặt tour */}
            <Card className="stats-card-purple text-white shadow-lg border-0 fade-in-up hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm border border-white border-opacity-30">
                                <span className="text-2xl text-white">📅</span>
                            </div>
                            <Tag 
                                value={formatGrowth(stats.bookingGrowth)} 
                                severity={getGrowthSeverity(stats.bookingGrowth)}
                                className="text-xs font-semibold shadow-sm"
                            />
                        </div>
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1 opacity-90">Đặt tour</p>
                            <p className="text-4xl font-bold mb-2 tracking-tight">{stats.totalBookings}</p>
                            <div className="flex items-center gap-1">
                                <span className="text-xs">{stats.bookingGrowth >= 0 ? '📈' : '📉'}</span>
                                <p className="text-purple-200 text-xs font-medium">
                                    {stats.bookingGrowth >= 0 ? 'Tăng trưởng' : 'Giảm'} so với tháng trước
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Booking Status Progress */}
            <div className="md:col-span-2 lg:col-span-4">
                <Card className="card-beige hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                                <span className="text-white text-lg">📊</span>
                            </div>
                            <h3 className="text-lg font-semibold text-dark-enhanced">
                                Phân bố trạng thái đặt tour
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Chờ xác nhận */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-amber-500 rounded-lg">
                                        <span className="text-white text-sm">⏰</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-amber-800">Chờ xác nhận</p>
                                        <p className="text-2xl font-bold text-amber-900">{stats.pendingBookings}</p>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-amber-700">Tỷ lệ</span>
                                        <span className="text-xs font-semibold text-amber-800">{pendingPercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-amber-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${pendingPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Đã xác nhận */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <span className="text-white text-sm">✅</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Đã xác nhận</p>
                                        <p className="text-2xl font-bold text-green-900">{stats.confirmedBookings}</p>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-green-700">Tỷ lệ</span>
                                        <span className="text-xs font-semibold text-green-800">{confirmedPercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-green-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${confirmedPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Đã hủy */}
                            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-red-500 rounded-lg">
                                        <span className="text-white text-sm">❌</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-red-800">Đã hủy</p>
                                        <p className="text-2xl font-bold text-red-900">{stats.canceledBookings}</p>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-red-700">Tỷ lệ</span>
                                        <span className="text-xs font-semibold text-red-800">{canceledPercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-red-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${canceledPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">ℹ️</span>
                                    <span className="text-sm font-medium text-gray-700">Tổng quan</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                        <span className="text-gray-600">Chờ xác nhận</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-600">Đã xác nhận</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-600">Đã hủy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
