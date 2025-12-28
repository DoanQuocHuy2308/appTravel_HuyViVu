"use client";

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import { useBookings } from '@/lib/hooks/useBookings';
import useUsers from '@/lib/hooks/useUsers';
import { useTours } from '@/lib/hooks/useTour';
import { Chart } from 'primereact/chart';
import { exportBookingsToExcel } from '@/lib/utils/excelExport';
import { StatsOverview } from '@/components/baocao/StatsOverview';
import { TopPerformers } from '@/components/baocao/TopPerformers';
import { ReportSummary } from '@/components/baocao/ReportSummary';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import '@/styles/baocao.css';


export default function BaoCaoPage() {
    const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
    const { bookings, loading: bookingsLoading, fetchBookingsByDateRange, fetchAllBookings } = useBookings();
    const { users, loading: usersLoading } = useUsers();
    const { tours, loading: toursLoading } = useTours();

    const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
    const [reportType, setReportType] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
    const [filteredStats, setFilteredStats] = useState(stats);

    const reportTypes = [
        { label: 'Tổng quan', value: 'overview' },
        { label: 'Doanh thu', value: 'revenue' },
        { label: 'Đặt tour', value: 'bookings' },
        { label: 'Khách hàng', value: 'customers' },
        { label: 'Tours', value: 'tours' }
    ];

    const statusOptions = [
        { label: 'Tất cả trạng thái', value: 'all' },
        { label: 'Chờ xác nhận', value: 'pending' },
        { label: 'Đã xác nhận', value: 'confirmed' },
        { label: 'Đã hủy', value: 'canceled' }
    ];

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

    const handleRefresh = async () => {
        setLoading(true);
        await Promise.all([
            refetchStats(),
            fetchAllBookings()
        ]);
        setLastUpdated(new Date());
        setLoading(false);
    };

    // Load bookings data when component mounts
    useEffect(() => {
        console.log('Bookings data:', bookings);
        console.log('Bookings loading:', bookingsLoading);
        if (!bookings || bookings.length === 0) {
            console.log('Fetching bookings data...');
            fetchAllBookings();
        }
    }, [bookings, fetchAllBookings]);

    // Force load bookings on mount
    useEffect(() => {
        console.log('Component mounted, loading bookings...');
        fetchAllBookings();
    }, []);

    // Handle sample data loading
    const handleLoadSampleData = () => {
        console.log('Loading sample data...');
        // In a real app, you might want to create sample data in your database
        // For now, we'll just refresh the real data
        fetchAllBookings();
    };

    // Filter data based on selected criteria
    const applyFilters = () => {
        let filtered = [...bookings];

        // Filter by date range
        if (selectedDateRange && selectedDateRange.length === 2) {
            const startDate = selectedDateRange[0];
            const endDate = selectedDateRange[1];
            filtered = filtered.filter(booking => {
                if (!booking.booking_date) return false;
                const bookingDate = new Date(booking.booking_date);
                return bookingDate >= startDate && bookingDate <= endDate;
            });
        }

        // Filter by status
        const statusFilter = document.getElementById('statusFilter') as HTMLSelectElement;
        if (statusFilter && statusFilter.value !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter.value);
        }

        // Filter by tour type
        const tourTypeFilter = document.getElementById('tourTypeFilter') as HTMLSelectElement;
        if (tourTypeFilter && tourTypeFilter.value !== 'all') {
            filtered = filtered.filter(booking => 
                booking.tour_name && booking.tour_name.toLowerCase().includes(tourTypeFilter.value.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
        updateFilteredStats(filtered);
    };

    // Update filtered stats
    const updateFilteredStats = (filteredBookings: any[]) => {
        const filteredStatsData = {
            ...stats,
            totalBookings: filteredBookings.length,
            pendingBookings: filteredBookings.filter(b => b.status === 'pending').length,
            confirmedBookings: filteredBookings.filter(b => b.status === 'confirmed').length,
            canceledBookings: filteredBookings.filter(b => b.status === 'canceled').length,
            totalRevenue: filteredBookings.reduce((sum, booking) => {
                const price = typeof booking.total_price === 'string' ? parseFloat(booking.total_price) : (booking.total_price || 0);
                return sum + (isNaN(price) ? 0 : price);
            }, 0)
        };
        setFilteredStats(filteredStatsData);
    };

    // Reset filters
    const resetFilters = () => {
        setSelectedDateRange([]);
        setReportType('overview');
        setFilteredBookings([]);
        setFilteredStats(stats);
        // Reset dropdown values
        const statusFilter = document.getElementById('statusFilter') as HTMLSelectElement;
        const tourTypeFilter = document.getElementById('tourTypeFilter') as HTMLSelectElement;
        if (statusFilter) statusFilter.value = 'all';
        if (tourTypeFilter) tourTypeFilter.value = 'all';
    };

    const handleExport = async (type: 'excel' | 'pdf') => {
        try {
            setLoading(true);
            if (type === 'excel') {
                await exportBookingsToExcel(bookings, {
                    filename: `bao_cao_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`,
                    sheetName: 'Báo cáo'
                });
            }
            // TODO: Implement PDF export
        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Revenue Chart Data
    const revenueChartData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: stats.monthlyRevenue,
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Số đặt tour',
                data: stats.monthlyBookings,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#374151'
                }
            }
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                ticks: {
                    color: '#6b7280',
                    callback: function(value: any) {
                        return formatPrice(value);
                    }
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: '#6b7280'
                }
            },
            x: {
                ticks: {
                    color: '#6b7280'
                }
            }
        }
    };

    // Tours Distribution Chart
    const toursDistributionData = {
        labels: Object.keys(stats.toursByType),
        datasets: [
            {
                data: Object.values(stats.toursByType),
                backgroundColor: [
                    '#059669',
                    '#10b981',
                    '#34d399',
                    '#6ee7b7',
                    '#a7f3d0',
                    '#d1fae5'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }
        ]
    };

    const toursDistributionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#374151',
                    usePointStyle: true,
                    padding: 20
                }
            }
        }
    };

    const statusBodyTemplate = (rowData: any) => {
        const getStatusSeverity = (status: string) => {
            switch (status) {
                case 'confirmed': return 'success';
                case 'pending': return 'warning';
                case 'canceled': return 'danger';
                default: return 'info';
            }
        };

        const getStatusLabel = (status: string) => {
            switch (status) {
                case 'confirmed': return 'Đã xác nhận';
                case 'pending': return 'Chờ xác nhận';
                case 'canceled': return 'Đã hủy';
                default: return status;
            }
        };

        return <Badge value={getStatusLabel(rowData.status)} severity={getStatusSeverity(rowData.status)} />;
    };

    const priceBodyTemplate = (rowData: any) => {
        return formatPrice(rowData.total_price);
    };

    const dateBodyTemplate = (rowData: any) => {
        return new Date(rowData.booking_date).toLocaleDateString('vi-VN');
    };

    if (statsLoading && stats.totalTours === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-beige-50 flex items-center justify-center">
                <div className="text-center">
                    <ProgressSpinner />
                    <p className="mt-4 text-green-700">Đang tải dữ liệu báo cáo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-beige">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-green-100 header-green">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg">
                                    <i className="pi pi-chart-bar text-white text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Báo cáo thống kê</h1>
                                    <p className="text-white">Phân tích và báo cáo chi tiết hệ thống</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right text-sm text-white">
                                <p>Cập nhật lần cuối:</p>
                                <p className="font-medium text-dark-enhanced">{lastUpdated.toLocaleTimeString('vi-VN')}</p>
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
                {statsError && (
                    <div className="mb-6">
                        <Message severity="error" text={statsError} className="w-full" />
                    </div>
                )}
                {/* Filters */}
                <Card className="mb-6 card-beige">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-green-600 text-lg">🔍</span>
                            </div>
                            <h3 className="text-lg font-semibold text-dark-enhanced">Bộ lọc báo cáo</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-enhanced mb-2">
                                    Loại báo cáo
                                </label>
                                <Dropdown
                                    value={reportType}
                                    onChange={(e) => setReportType(e.value)}
                                    options={reportTypes}
                                    placeholder="Chọn loại báo cáo"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-enhanced mb-2">
                                    Khoảng thời gian
                                </label>
                                <Calendar
                                    value={selectedDateRange}
                                    onChange={(e) => setSelectedDateRange(e.value as Date[])}
                                    selectionMode="range"
                                    readOnlyInput
                                    placeholder="Chọn khoảng thời gian"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-enhanced mb-2">
                                    Trạng thái
                                </label>
                                <select 
                                    id="statusFilter"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    defaultValue="all"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-enhanced mb-2">
                                    Loại tour
                                </label>
                                <select 
                                    id="tourTypeFilter"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    defaultValue="all"
                                >
                                    <option value="all">Tất cả tour</option>
                                    <option value="đà nẵng">Đà Nẵng</option>
                                    <option value="hội an">Hội An</option>
                                    <option value="sapa">Sapa</option>
                                    <option value="phú quốc">Phú Quốc</option>
                                    <option value="nha trang">Nha Trang</option>
                                    <option value="hạ long">Hạ Long</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                label="Áp dụng bộ lọc"
                                icon="pi pi-filter"
                                size="small"
                                onClick={applyFilters}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                            />
                            <Button
                                label="Đặt lại"
                                icon="pi pi-refresh"
                                size="small"
                                outlined
                                onClick={resetFilters}
                                className="text-gray-600 border-gray-300 hover:bg-gray-50"
                            />
                            <div className="ml-auto flex gap-2">
                                <Button
                                    label="Xuất Excel"
                                    icon="pi pi-file-excel"
                                    size="small"
                                    outlined
                                    onClick={() => handleExport('excel')}
                                    loading={loading}
                                    className="text-green-600 border-green-300 hover:bg-green-50"
                                />
                                <Button
                                    label="Xuất PDF"
                                    icon="pi pi-file-pdf"
                                    size="small"
                                    outlined
                                    onClick={() => handleExport('pdf')}
                                    loading={loading}
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                />
                            </div>
                        </div>

                        {/* Filter Results Summary */}
                        {(filteredBookings.length > 0 || selectedDateRange.length > 0) && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600">📊</span>
                                    <span className="text-sm font-medium text-blue-800">
                                        Kết quả lọc: {filteredBookings.length} đặt tour
                                    </span>
                                    {selectedDateRange.length === 2 && (
                                        <span className="text-xs text-blue-600">
                                            ({selectedDateRange[0].toLocaleDateString('vi-VN')} - {selectedDateRange[1].toLocaleDateString('vi-VN')})
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Report Summary */}
                <ReportSummary stats={stats} lastUpdated={lastUpdated} />

                {/* Stats Overview */}
                <StatsOverview stats={filteredBookings.length > 0 ? filteredStats : stats} loading={statsLoading} />

                {/* Top Performers */}
                <TopPerformers 
                    bookings={filteredBookings.length > 0 ? filteredBookings : bookings} 
                    users={users} 
                    tours={tours} 
                    loading={bookingsLoading || usersLoading || toursLoading} 
                />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="chart-container">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-dark-enhanced mb-4">
                                Doanh thu theo tháng
                            </h3>
                            <div className="h-80">
                                <Chart type="line" data={revenueChartData} options={revenueChartOptions} />
                            </div>
                        </div>
                    </Card>

                    <Card className="chart-container">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-dark-enhanced mb-4">
                                Phân bố tours theo loại
                            </h3>
                            <div className="h-80">
                                <Chart type="doughnut" data={toursDistributionData} options={toursDistributionOptions} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Booking Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="card-beige hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-dark-enhanced">Chờ xác nhận</p>
                                    <p className="text-2xl font-bold text-amber-600">{stats.pendingBookings}</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-lg">
                                    <i className="pi pi-clock text-amber-600 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="card-beige hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-dark-enhanced">Đã xác nhận</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <i className="pi pi-check text-green-600 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="card-beige hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-dark-enhanced">Đã hủy</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.canceledBookings}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <i className="pi pi-times text-red-600 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Detailed Reports */}
                <Card className="card-beige">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-dark-enhanced mb-4">
                            Chi tiết đặt tour gần đây ({filteredBookings.length > 0 ? filteredBookings.length : bookings?.length || 0} đặt tour)
                            {filteredBookings.length > 0 && (
                                <span className="ml-2 text-sm text-blue-600 font-normal">(đã lọc)</span>
                            )}
                        </h3>
                        {bookingsLoading ? (
                            <div className="text-center py-8">
                                <i className="pi pi-spin pi-spinner text-2xl text-green-600"></i>
                                <p className="mt-2 text-green-600">Đang tải dữ liệu...</p>
                            </div>
                        ) : (!bookings || bookings.length === 0) && filteredBookings.length === 0 ? (
                            <div className="text-center py-8">
                                <i className="pi pi-database text-4xl text-gray-400 mb-4"></i>
                                <p className="text-gray-500 text-lg mb-2">Không có dữ liệu đặt tour</p>
                                <p className="text-gray-400 text-sm mb-6">Có thể dữ liệu chưa được tải hoặc chưa có booking nào</p>
                                <Button
                                    label="Làm mới dữ liệu"
                                    icon="pi pi-refresh"
                                    size="small"
                                    outlined
                                    onClick={handleLoadSampleData}
                                    className="text-green-600 border-green-300 hover:bg-green-50"
                                />
                            </div>
                        ) : (
                            <DataTable
                                value={filteredBookings.length > 0 ? filteredBookings : bookings}
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5, 10, 25]}
                                loading={bookingsLoading}
                                className="p-datatable-sm"
                                emptyMessage="Không có dữ liệu đặt tour"
                            >
                            <Column field="booking_id" header="ID" sortable style={{ width: '80px' }} />
                            <Column field="user_name" header="Khách hàng" sortable />
                            <Column field="tour_name" header="Tour" sortable />
                            <Column field="adults" header="Người lớn" sortable style={{ width: '100px' }} />
                            <Column field="children" header="Trẻ em" sortable style={{ width: '100px' }} />
                            <Column 
                                field="total_price" 
                                header="Tổng tiền" 
                                body={priceBodyTemplate}
                                sortable 
                                style={{ width: '120px' }} 
                            />
                            <Column 
                                field="booking_date" 
                                header="Ngày đặt" 
                                body={dateBodyTemplate}
                                sortable 
                                style={{ width: '120px' }} 
                            />
                            <Column 
                                field="status" 
                                header="Trạng thái" 
                                body={statusBodyTemplate}
                                sortable 
                                style={{ width: '120px' }} 
                            />
                            </DataTable>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
