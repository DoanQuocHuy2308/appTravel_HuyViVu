"use client";

import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';

interface ReportSummaryProps {
    stats: {
        totalTours: number;
        totalUsers: number;
        totalBookings: number;
        totalRevenue: number;
        pendingBookings: number;
        confirmedBookings: number;
        canceledBookings: number;
        averageRating: number;
        userGrowth: number;
        bookingGrowth: number;
        revenueGrowth: number;
    };
    lastUpdated: Date;
}

export const ReportSummary = ({ stats, lastUpdated }: ReportSummaryProps) => {
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

    const getPerformanceLevel = (growth: number) => {
        if (growth > 20) return { level: 'Xuất sắc', color: 'success' };
        if (growth > 10) return { level: 'Tốt', color: 'success' };
        if (growth > 0) return { level: 'Khá', color: 'info' };
        if (growth > -10) return { level: 'Trung bình', color: 'warning' };
        return { level: 'Cần cải thiện', color: 'danger' };
    };

    const revenuePerformance = getPerformanceLevel(stats.revenueGrowth);
    const bookingPerformance = getPerformanceLevel(stats.bookingGrowth);
    const userPerformance = getPerformanceLevel(stats.userGrowth);

    const conversionRate = stats.totalUsers > 0 ? ((stats.totalBookings / stats.totalUsers) * 100).toFixed(1) : '0';
    const averageBookingValue = stats.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings) : 0;

    return (
        <Card className="card-beige mb-6">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <i className="pi pi-file-text text-green-600 text-lg"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-dark-enhanced">Tóm tắt báo cáo</h3>
                        <p className="text-sm text-green-medium">
                            Cập nhật lần cuối: {lastUpdated.toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Performance Overview */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-dark-enhanced flex items-center gap-2">
                            <i className="pi pi-chart-line text-green-600"></i>
                            Hiệu suất kinh doanh
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">Doanh thu</span>
                                <Tag 
                                    value={revenuePerformance.level} 
                                    severity={revenuePerformance.color as any}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">Đặt tour</span>
                                <Tag 
                                    value={bookingPerformance.level} 
                                    severity={bookingPerformance.color as any}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">Khách hàng</span>
                                <Tag 
                                    value={userPerformance.level} 
                                    severity={userPerformance.color as any}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-dark-enhanced flex items-center gap-2">
                            <i className="pi pi-calculator text-green-600"></i>
                            Chỉ số quan trọng
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-medium">Tỷ lệ chuyển đổi</span>
                                <span className="font-medium text-dark-enhanced">{conversionRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-medium">Giá trị đặt tour TB</span>
                                <span className="font-medium text-dark-enhanced">{formatPrice(averageBookingValue)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-medium">Đánh giá trung bình</span>
                                <div className="flex items-center gap-1">
                                    <i className="pi pi-star-fill text-yellow-500"></i>
                                    <span className="font-medium text-dark-enhanced">{stats.averageRating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Growth Analysis */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-dark-enhanced flex items-center gap-2">
                            <i className="pi pi-trending-up text-green-600"></i>
                            Phân tích tăng trưởng
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">Doanh thu</span>
                                <span className={`font-medium ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {formatGrowth(stats.revenueGrowth)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">Đặt tour</span>
                                <span className={`font-medium ${stats.bookingGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {formatGrowth(stats.bookingGrowth)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">Khách hàng</span>
                                <span className={`font-medium ${stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {formatGrowth(stats.userGrowth)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Insights */}
                <div className="mt-6">
                    <h4 className="font-semibold text-dark-enhanced mb-3 flex items-center gap-2">
                        <i className="pi pi-lightbulb text-green-600"></i>
                        Insights & Khuyến nghị
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start gap-3">
                                <i className="pi pi-check-circle text-green-600 mt-1"></i>
                                <div>
                                    <p className="text-sm font-medium text-green-800">Điểm mạnh</p>
                                    <p className="text-xs text-green-600 mt-1">
                                        {stats.confirmedBookings > stats.pendingBookings 
                                            ? `Tỷ lệ xác nhận cao (${((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(1)}%)`
                                            : `Có ${stats.totalTours} tours đang hoạt động`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-3">
                                <i className="pi pi-exclamation-triangle text-amber-600 mt-1"></i>
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Cần chú ý</p>
                                    <p className="text-xs text-amber-600 mt-1">
                                        {stats.pendingBookings > stats.confirmedBookings 
                                            ? `${stats.pendingBookings} đặt tour đang chờ xử lý`
                                            : `Tỷ lệ hủy tour: ${((stats.canceledBookings / stats.totalBookings) * 100).toFixed(1)}%`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
