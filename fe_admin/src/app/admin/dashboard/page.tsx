"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { useState, useEffect } from 'react';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ToursDistributionChart } from '@/components/dashboard/ToursDistributionChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import '@/styles/dashboard.css';

export default function Page() {
    const { stats, loading, error, refetch } = useDashboardStats();
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const handleRefresh = async () => {
        await refetch();
        setLastUpdated(new Date());
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price: number) => {
        // Xử lý trường hợp price là NaN hoặc không hợp lệ
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

    const statsCards = [
        {
            title: 'Tổng Tours',
            value: stats.totalTours,
            icon: 'pi pi-map',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            change: formatGrowth(stats.bookingGrowth),
            changeType: (stats.bookingGrowth >= 0 ? 'positive' : 'negative') as 'positive' | 'negative'
        },
        {
            title: 'Người dùng',
            value: stats.totalUsers,
            icon: 'pi pi-users',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            change: formatGrowth(stats.userGrowth),
            changeType: (stats.userGrowth >= 0 ? 'positive' : 'negative') as 'positive' | 'negative'
        },
        {
            title: 'Doanh thu',
            value: formatPrice(stats.totalRevenue),
            icon: 'pi pi-dollar',
            color: 'text-amber-600',
            bgColor: 'bg-amber-100',
            change: formatGrowth(stats.revenueGrowth),
            changeType: (stats.revenueGrowth >= 0 ? 'positive' : 'negative') as 'positive' | 'negative'
        },
        {
            title: 'Đánh giá TB',
            value: stats.averageRating.toFixed(1),
            icon: 'pi pi-star',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            change: stats.averageRating > 4.5 ? 'Xuất sắc' : stats.averageRating > 4.0 ? 'Tốt' : 'Khá',
            changeType: 'neutral' as const
        }
    ];

    if (loading && stats.totalTours === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ProgressSpinner />
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gray-50 admin-page-container">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                                    <i className="pi pi-chart-line text-white text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                                    <p className="text-gray-600">Tổng quan hệ thống quản lý Huy Vi Vu</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right text-sm text-gray-500">
                                <p>Cập nhật lần cuối:</p>
                                <p className="font-medium">{lastUpdated.toLocaleTimeString('vi-VN')}</p>
                            </div>
                            <Button
                                icon="pi pi-refresh"
                                label="Làm mới"
                                size="small"
                                outlined
                                onClick={handleRefresh}
                                loading={loading}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6">
                        <Message severity="error" text={error} className="w-full" />
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, index) => (
                        <StatsCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            bgColor={stat.bgColor}
                            change={stat.change}
                            changeType={stat.changeType}
                            loading={loading}
                        />
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <RevenueChart
                        monthlyRevenue={stats.monthlyRevenue}
                        monthlyBookings={stats.monthlyBookings}
                        loading={loading}
                    />
                    <ToursDistributionChart
                        toursByType={stats.toursByType}
                        loading={loading}
                    />
                </div>

                {/* Booking Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                                <p className="text-2xl font-bold text-amber-600">{stats.pendingBookings}</p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-lg">
                                <i className="pi pi-clock text-amber-600 text-xl"></i>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                                <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <i className="pi pi-check text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đã hủy</p>
                                <p className="text-2xl font-bold text-red-600">{stats.canceledBookings}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <i className="pi pi-times text-red-600 text-xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <QuickActions />
                </div>

                {/* Recent Activity */}
                <div className="mb-8">
                    <RecentActivity
                        recentBookings={stats.recentBookings}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}
