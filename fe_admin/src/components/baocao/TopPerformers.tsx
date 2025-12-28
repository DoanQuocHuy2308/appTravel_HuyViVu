"use client";

import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';

interface TopPerformersProps {
    bookings: any[];
    users: any[];
    tours: any[];
    loading?: boolean;
}

export const TopPerformers = ({ bookings, users, tours, loading = false }: TopPerformersProps) => {
    // Tính top tours được đặt nhiều nhất
    const topTours = tours.map(tour => {
        const tourBookings = bookings.filter(booking => booking.tour_id === tour.id);
        const totalRevenue = tourBookings.reduce((sum, booking) => {
            const price = typeof booking.total_price === 'string' ? parseFloat(booking.total_price) : (booking.total_price || 0);
            return sum + (isNaN(price) ? 0 : price);
        }, 0);
        
        return {
            ...tour,
            bookingCount: tourBookings.length,
            totalRevenue: totalRevenue
        };
    }).sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5);

    // Tính top khách hàng đặt nhiều nhất
    const topCustomers = users.map(user => {
        const userBookings = bookings.filter(booking => booking.user_id === user.id);
        const totalSpent = userBookings.reduce((sum, booking) => {
            const price = typeof booking.total_price === 'string' ? parseFloat(booking.total_price) : (booking.total_price || 0);
            return sum + (isNaN(price) ? 0 : price);
        }, 0);
        
        return {
            ...user,
            bookingCount: userBookings.length,
            totalSpent: totalSpent
        };
    }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

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
        const price = rowData.total_price || rowData.totalRevenue || rowData.totalSpent || 0;
        return formatPrice(typeof price === 'number' ? price : parseFloat(price) || 0);
    };

    const rankBodyTemplate = (rowData: any, options: any) => {
        const rank = options.rowIndex + 1;
        let severity: 'success' | 'warning' | 'info' | 'danger' | 'secondary' = 'secondary';
        
        if (rank === 1) severity = 'success';
        else if (rank === 2) severity = 'warning';
        else if (rank === 3) severity = 'info';
        
        return <Tag value={`#${rank}`} severity={severity} />;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Tours */}
            <Card className="card-beige">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <i className="pi pi-trophy text-green-600 text-lg"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-dark-enhanced">
                            Top 5 Tours phổ biến
                        </h3>
                    </div>
                    <DataTable
                        value={topTours}
                        loading={loading}
                        className="p-datatable-sm"
                        emptyMessage="Không có dữ liệu tours"
                    >
                        <Column 
                            header="Hạng" 
                            body={rankBodyTemplate}
                            style={{ width: '60px' }}
                        />
                        <Column 
                            field="name" 
                            header="Tên Tour" 
                            sortable 
                            body={(rowData) => rowData.name || rowData.tour_name || 'N/A'}
                        />
                        <Column 
                            field="bookingCount" 
                            header="Số đặt" 
                            sortable 
                            style={{ width: '80px' }}
                        />
                        <Column 
                            field="totalRevenue" 
                            header="Doanh thu" 
                            body={priceBodyTemplate}
                            sortable 
                            style={{ width: '120px' }}
                        />
                    </DataTable>
                </div>
            </Card>

            {/* Top Customers */}
            <Card className="card-beige">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <i className="pi pi-star text-blue-600 text-lg"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-dark-enhanced">
                            Top 5 Khách hàng VIP
                        </h3>
                    </div>
                    <DataTable
                        value={topCustomers}
                        loading={loading}
                        className="p-datatable-sm"
                        emptyMessage="Không có dữ liệu khách hàng"
                    >
                        <Column 
                            header="Hạng" 
                            body={rankBodyTemplate}
                            style={{ width: '60px' }}
                        />
                        <Column 
                            field="fullname" 
                            header="Khách hàng" 
                            sortable 
                            body={(rowData) => rowData.fullname || rowData.name || rowData.user_name || 'N/A'}
                        />
                        <Column 
                            field="bookingCount" 
                            header="Số đặt" 
                            sortable 
                            style={{ width: '80px' }}
                            body={(rowData) => rowData.bookingCount || 0}
                        />
                        <Column 
                            field="totalSpent" 
                            header="Tổng chi" 
                            body={priceBodyTemplate}
                            sortable 
                            style={{ width: '120px' }}
                        />
                    </DataTable>
                </div>
            </Card>
        </div>
    );
};
