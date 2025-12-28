"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import SearchBar from '@/components/search';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { useBookings } from '@/lib/hooks/useBookings';
import { useTours } from '@/lib/hooks/useTour';
import { BookingDetail, newBooking } from '@/lib/types';
import { exportBookingsToExcel, exportBookingStatsToExcel } from '@/lib/utils/excelExport';
import { BookingDetailModal } from '@/components/bookings/BookingDetailModal';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

export default function BookingsPage() {
    // Hooks
    const { 
        bookings, 
        loading, 
        error, 
        fetchAllBookings, 
        updateBooking, 
        deleteBooking,
        sendBookingEmail,
        filterBookingsByStatus,
        searchBookings,
        sortBookings,
        clearError
    } = useBookings();
    
    const { tours } = useTours();
    
    // States
    const [search, setSearch] = useState('');
    const [selectedTour, setSelectedTour] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [selectedBookings, setSelectedBookings] = useState<BookingDetail[]>([]);
    
    // Dialog states
    const [isOpenBooking, setIsOpenBooking] = useState(false);
    const [editingBooking, setEditingBooking] = useState<BookingDetail | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBookingDetail, setSelectedBookingDetail] = useState<BookingDetail | null>(null);
    const [bookingForm, setBookingForm] = useState({
        adults: 0,
        children: 0,
        infants: 0,
        notes: '',
        status: 'pending' as 'pending' | 'confirmed' | 'canceled',
        start_date: null as Date | null,
        end_date: null as Date | null
    });
    
    const toast = useRef<Toast>(null);

    // Load data on mount
    useEffect(() => {
        fetchAllBookings();
    }, []);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
    }, []);

    // Filter and search logic
    let filteredBookings = bookings?.filter((booking: BookingDetail) => {
        const searchTerm = search?.trim().toLowerCase() || '';
        
        const matchesSearch = !searchTerm || 
            booking.user_name?.toLowerCase().includes(searchTerm) ||
            booking.user_email?.toLowerCase().includes(searchTerm) ||
            booking.tour_name?.toLowerCase().includes(searchTerm) ||
            booking.notes?.toLowerCase().includes(searchTerm);
        
        const matchesTour = !selectedTour || booking.tour_id === selectedTour;
        const matchesStatus = !selectedStatus || booking.status === selectedStatus;

        return matchesSearch && matchesTour && matchesStatus;
    }) || [];

    // Tính tổng doanh thu
    const totalRevenue = filteredBookings.reduce((sum, booking) => {
        const price = booking.total_price ? Number(booking.total_price) : 0;
        return sum + (isNaN(price) ? 0 : price);
    }, 0);
    const confirmedRevenue = filteredBookings
        .filter(booking => booking.status === 'confirmed')
        .reduce((sum, booking) => {
            const price = booking.total_price ? Number(booking.total_price) : 0;
            return sum + (isNaN(price) ? 0 : price);
        }, 0);

    // Sort logic
    if (selectedSort === 'nameAsc') {
        filteredBookings.sort((a: BookingDetail, b: BookingDetail) => (a.user_name || '').localeCompare(b.user_name || ''));
    }
    if (selectedSort === 'nameDesc') {
        filteredBookings.sort((a: BookingDetail, b: BookingDetail) => (b.user_name || '').localeCompare(a.user_name || ''));
    }
    if (selectedSort === 'dateAsc') {
        filteredBookings.sort((a: BookingDetail, b: BookingDetail) => new Date(a.booking_date || '').getTime() - new Date(b.booking_date || '').getTime());
    }
    if (selectedSort === 'dateDesc') {
        filteredBookings.sort((a: BookingDetail, b: BookingDetail) => new Date(b.booking_date || '').getTime() - new Date(a.booking_date || '').getTime());
    }

    // Handlers
    const handleDeleteBooking = (booking: BookingDetail) => {
        if (booking.status === 'confirmed') {
            toast.current?.show({
                severity: 'warn',
                summary: 'Không thể xóa',
                detail: `Không thể xóa đơn hàng "${booking.user_name}" vì đã được xác nhận. Hãy hủy đơn hàng trước khi xóa.`,
                life: 5000
            });
            return;
        }

        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa đơn hàng của "${booking.user_name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    await deleteBooking(booking.booking_id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Đơn hàng của "${booking.user_name}" đã được xóa`,
                        life: 3000
                    });
                    fetchAllBookings();
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể xóa đơn hàng',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleUpdateBooking = async () => {
        if (!editingBooking) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không tìm thấy đơn hàng để cập nhật',
                life: 3000
            });
            return;
        }

        // Validation
        if (bookingForm.adults < 0 || bookingForm.children < 0 || bookingForm.infants < 0) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Số lượng khách không được âm',
                life: 3000
            });
            return;
        }

        if (bookingForm.adults === 0 && bookingForm.children === 0 && bookingForm.infants === 0) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Phải có ít nhất 1 khách',
                life: 3000
            });
            return;
        }

        try {
            const updateData: Partial<newBooking> = {
                id: editingBooking.booking_id,
                adults: bookingForm.adults,
                children: bookingForm.children,
                infants: bookingForm.infants,
                notes: bookingForm.notes || '',
                status: bookingForm.status
            };

            await updateBooking(updateData);
            
            // Gửi email thông báo cập nhật nếu trạng thái thay đổi
            if (editingBooking.status !== bookingForm.status) {
                const updatedBooking = { ...editingBooking, status: bookingForm.status };
                await sendBookingEmail(updatedBooking, 'booking_update');
            }
            
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đơn hàng đã được cập nhật và email thông báo đã được gửi',
                life: 3000
            });
            fetchAllBookings();
            setIsOpenBooking(false);
            setEditingBooking(null);
        } catch (error: any) {
            console.error('Update booking error:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.response?.data?.message || error.message || 'Không thể cập nhật đơn hàng',
                life: 5000
            });
        }
    };

    const handleEditBooking = (booking: BookingDetail) => {
        setEditingBooking(booking);
        setBookingForm({
            adults: booking.adults,
            children: booking.children,
            infants: booking.infants,
            notes: booking.notes || '',
            status: booking.status,
            start_date: booking.start_date ? new Date(booking.start_date) : null,
            end_date: booking.end_date ? new Date(booking.end_date) : null
        });
        setIsOpenBooking(true);
    };

    const handleViewBookingDetail = (booking: BookingDetail) => {
        setSelectedBookingDetail(booking);
        setIsDetailModalOpen(true);
    };

    const handleSendEmail = async (rowData: BookingDetail) => {
        try {
            await sendBookingEmail(rowData, 'booking_confirmation');
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: `Email xác nhận đã được gửi đến ${rowData.user_email}`,
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Có lỗi xảy ra khi gửi email',
                life: 3000
            });
        }
    };

    const handleExportExcel = () => {
        try {
            const fileName = exportBookingsToExcel(filteredBookings, {
                filename: 'danh-sach-don-hang',
                sheetName: 'Đơn hàng'
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: `Đã xuất file Excel: ${fileName}`,
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể xuất file Excel',
                life: 3000
            });
        }
    };

    const handleExportStats = () => {
        try {
            const fileName = exportBookingStatsToExcel(filteredBookings);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: `Đã xuất báo cáo thống kê: ${fileName}`,
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể xuất báo cáo thống kê',
                life: 3000
            });
        }
    };

    // Templates
    const userTemplate = (rowData: BookingDetail) => (
        <div className="flex flex-col p-2">
            <div className="flex items-center gap-2 mb-1">
                <i className="pi pi-user text-blue-500 text-xs"></i>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.user_name}</span>
            </div>
            <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full inline-block w-fit">{rowData.user_email}</span>
        </div>
    );

    const tourTemplate = (rowData: BookingDetail) => (
        <div className="flex flex-col p-2">
            <div className="flex items-center gap-2 mb-1">
                <i className="pi pi-map-marker text-green-500 text-xs"></i>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.tour_name}</span>
            </div>
            <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full inline-block w-fit">ID: #{rowData.tour_id}</span>
        </div>
    );

    const guestsTemplate = (rowData: BookingDetail) => (
        <div className="flex flex-col p-2">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border-l-4 border-purple-400">
                <div className="flex items-center gap-2 mb-1">
                    <i className="pi pi-users text-purple-600 text-xs"></i>
                    <span className="text-sm font-semibold text-gray-900">Tổng: {rowData.adults + rowData.children + rowData.infants}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                    <div>Người lớn: {rowData.adults}</div>
                    <div>Trẻ em: {rowData.children}</div>
                    <div>Em bé: {rowData.infants}</div>
                </div>
            </div>
        </div>
    );

    const statusTemplate = (rowData: BookingDetail) => {
        const statusConfig = {
            pending: { color: 'orange', icon: 'pi-clock', label: 'Chờ xử lý' },
            confirmed: { color: 'green', icon: 'pi-check', label: 'Đã xác nhận' },
            canceled: { color: 'red', icon: 'pi-times', label: 'Đã hủy' }
        };
        
        const config = statusConfig[rowData.status];
        
        return (
            <div className="flex justify-center">
                <Chip
                    label={config.label}
                    className={`bg-${config.color}-100 text-${config.color}-800 border-${config.color}-300`}
                    icon={`pi ${config.icon}`}
                />
            </div>
        );
    };

    const priceTemplate = (rowData: BookingDetail) => (
        <div className="flex flex-col p-2">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border-l-4 border-green-400">
                <div className="flex items-center gap-2 mb-1">
                    <i className="pi pi-dollar text-green-600 text-xs"></i>
                    <span className="text-sm font-semibold text-gray-900">
                        {rowData.total_price ? Number(rowData.total_price).toLocaleString('vi-VN') + ' VNĐ' : 'Chưa tính'}
                    </span>
                </div>
                {rowData.ticket_prices && (
                    <div className="text-xs text-gray-600 space-y-1">
                        <div>Người lớn: {Number(rowData.ticket_prices.adult_price)?.toLocaleString('vi-VN')} VNĐ</div>
                        <div>Trẻ em: {Number(rowData.ticket_prices.child_price)?.toLocaleString('vi-VN')} VNĐ</div>
                        <div>Em bé: {Number(rowData.ticket_prices.infant_price)?.toLocaleString('vi-VN')} VNĐ</div>
                    </div>
                )}
            </div>
        </div>
    );

    const dateTemplate = (rowData: BookingDetail) => (
        <div className="flex flex-col p-2">
            <div className="bg-blue-50 rounded-lg p-2 border-l-4 border-blue-400">
                <div className="flex items-center gap-1 mb-1">
                    <i className="pi pi-calendar text-blue-600 text-xs"></i>
                    <span className="text-sm font-semibold text-gray-900">
                        {rowData.booking_date ? new Date(rowData.booking_date).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    {rowData.booking_date ? new Date(rowData.booking_date).toLocaleTimeString('vi-VN') : 'N/A'}
                </span>
            </div>
        </div>
    );

    const actionTemplate = (rowData: BookingDetail) => (
        <div className="flex justify-center gap-2">
            <Tooltip target=".view-booking-btn" content="Xem chi tiết" position="top" />
            <Tooltip target=".edit-booking-btn" content="Chỉnh sửa" position="top" />
            <Tooltip target=".delete-booking-btn" content={rowData.status === 'confirmed' ? 'Không thể xóa đơn hàng đã xác nhận' : 'Xóa đơn hàng'} position="top" />
            <Tooltip target=".email-booking-btn" content="Gửi email" position="top" />

            <Button
                icon="pi pi-eye"
                rounded
                outlined
                size="small"
                className="view-booking-btn border-green-500 !text-green-600 hover:!bg-green-500 hover:!text-white transition-all duration-200"
                onClick={() => handleViewBookingDetail(rowData)}
            />
            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                size="small"
                className="edit-booking-btn border-amber-500 !text-amber-600 hover:!bg-amber-500 hover:!text-white transition-all duration-200"
                onClick={() => handleEditBooking(rowData)}
            />
            <Button
                icon="pi pi-envelope"
                rounded
                outlined
                size="small"
                className="email-booking-btn border-blue-500 !text-blue-600 hover:!bg-blue-500 hover:!text-white transition-all duration-200"
                onClick={() => handleSendEmail(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                size="small"
                disabled={rowData.status === 'confirmed'}
                className={`delete-booking-btn border-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-200 ${
                    rowData.status === 'confirmed' 
                        ? '!text-gray-400 !border-gray-400 cursor-not-allowed opacity-50' 
                        : '!text-red-600'
                }`}
                onClick={() => handleDeleteBooking(rowData)}
            />
        </div>
    );

    const headerTemplate = (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <i className="pi pi-shopping-cart text-blue-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Danh sách Đơn hàng</h3>
                        <p className="text-sm text-gray-600">Quản lý đơn hàng tour trong hệ thống</p>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <i className="pi pi-money-bill text-green-600 text-sm"></i>
                                <span className="text-sm font-semibold text-gray-700">
                                    Tổng doanh thu: <span className="text-green-600">{totalRevenue.toLocaleString('vi-VN')} VNĐ</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="pi pi-check-circle text-emerald-600 text-sm"></i>
                                <span className="text-sm font-semibold text-gray-700">
                                    Đã xác nhận: <span className="text-emerald-600">{confirmedRevenue.toLocaleString('vi-VN')} VNĐ</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <Badge
                        value={filteredBookings.length}
                        severity="info"
                        className="text-lg px-3 py-1"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        icon="pi pi-file-excel"
                        label="Xuất Excel"
                        outlined
                        size="small"
                        onClick={handleExportExcel}
                        className="hover:scale-105 transition-all duration-200 text-green-600 border-green-300 hover:bg-green-50"
                    />
                    <Button
                        icon="pi pi-chart-bar"
                        label="Báo cáo"
                        outlined
                        size="small"
                        onClick={handleExportStats}
                        className="hover:scale-105 transition-all duration-200 text-blue-600 border-blue-300 hover:bg-blue-50"
                    />
                    {selectedBookings.length > 0 && (
                        <Button
                            icon="pi pi-trash"
                            label={`Xóa (${selectedBookings.length})`}
                            outlined
                            severity="danger"
                            className="hover:scale-105 transition-all duration-200"
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="min-h-screen bg-white">
                <Toast ref={toast} />
                <ConfirmDialog />
                
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-[#0f766e]">
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl shadow-lg">
                                        <i className="pi pi-shopping-cart text-white text-2xl"></i>
                                    </div>
                                    <Title title="Quản lý Đơn hàng" note="Quản lý đơn hàng tour trong hệ thống Huy Vi Vu" />
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden lg:flex items-center gap-6">
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                                        <div className="text-sm text-gray-500">Tổng đơn hàng</div>
                                    </div>
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-2xl font-bold text-green-600">{filterBookingsByStatus('confirmed').length}</div>
                                        <div className="text-sm text-gray-500">Đã xác nhận</div>
                                    </div>
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-2xl font-bold text-orange-600">{filterBookingsByStatus('pending').length}</div>
                                        <div className="text-sm text-gray-500">Chờ xử lý</div>
                                    </div>
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-lg font-bold text-purple-600">
                                            {totalRevenue.toLocaleString('vi-VN')} VNĐ
                                        </div>
                                        <div className="text-sm text-gray-500">Tổng doanh thu</div>
                                    </div>
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-lg font-bold text-emerald-600">
                                            {confirmedRevenue.toLocaleString('vi-VN')} VNĐ
                                        </div>
                                        <div className="text-sm text-gray-500">Đã xác nhận</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl my-6 shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <i className="pi pi-filter text-blue-600 text-lg"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Bộ lọc và Tìm kiếm</h3>
                                    <p className="text-sm text-gray-600">Tìm kiếm và lọc theo tiêu chí</p>
                                </div>
                            </div>
                            {(search || selectedTour || selectedStatus || selectedSort) && (
                                <Button
                                    icon="pi pi-filter-slash"
                                    label="Xóa bộ lọc"
                                    outlined
                                    size="small"
                                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                                    onClick={() => {
                                        setSearch('');
                                        setSelectedTour(null);
                                        setSelectedStatus(null);
                                        setSelectedSort(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Search Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <i className="pi pi-search text-blue-600"></i>
                                <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
                            </div>
                            <div className="relative">
                                <SearchBar
                                    onSearch={handleSearch}
                                    placeholder="Tìm kiếm theo tên khách hàng, email, tour..."
                                />
                            </div>
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Tour Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-map text-green-600"></i>
                                    <label className="text-sm font-semibold text-gray-700">Lọc theo Tour</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={tours?.map((tour) => ({
                                            label: `${tour.name} (ID: ${tour.id})`,
                                            value: tour.id
                                        })) || []}
                                        value={selectedTour}
                                        onChange={(e) => setSelectedTour(e.value)}
                                        placeholder="Chọn tour để lọc"
                                        className="w-full"
                                        showClear
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-flag text-purple-600"></i>
                                    <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={[
                                            { label: 'Chờ xử lý', value: 'pending' },
                                            { label: 'Đã xác nhận', value: 'confirmed' },
                                            { label: 'Đã hủy', value: 'canceled' }
                                        ]}
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.value)}
                                        placeholder="Chọn trạng thái"
                                        className="w-full"
                                        showClear
                                    />
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-sort text-purple-600"></i>
                                    <label className="text-sm font-semibold text-gray-700">Sắp xếp</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={[
                                            { label: 'Tên A-Z', value: 'nameAsc' },
                                            { label: 'Tên Z-A', value: 'nameDesc' },
                                            { label: 'Ngày đặt mới nhất', value: 'dateDesc' },
                                            { label: 'Ngày đặt cũ nhất', value: 'dateAsc' }
                                        ]}
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.value)}
                                        placeholder="Chọn cách sắp xếp"
                                        className="w-full"
                                        showClear
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-cog text-gray-600"></i>
                                    <label className="text-sm font-semibold text-gray-700">Thao tác</label>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        icon="pi pi-refresh"
                                        label="Làm mới"
                                        outlined
                                        size="small"
                                        onClick={() => fetchAllBookings()}
                                        className="hover:scale-105 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(search || selectedTour || selectedStatus || selectedSort) && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <i className="pi pi-info-circle text-blue-600"></i>
                                    <span className="text-sm font-semibold text-blue-800">Bộ lọc đang áp dụng:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {search && (
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            <i className="pi pi-search text-xs"></i>
                                            <span>Tìm kiếm: "{search}"</span>
                                            <button
                                                onClick={() => setSearch('')}
                                                className="ml-1 hover:text-blue-600"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedTour && (
                                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                            <i className="pi pi-map text-xs"></i>
                                            <span>Tour: {tours?.find(t => t.id === selectedTour)?.name}</span>
                                            <button
                                                onClick={() => setSelectedTour(null)}
                                                className="ml-1 hover:text-green-600"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedStatus && (
                                        <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                            <i className="pi pi-flag text-xs"></i>
                                            <span>Trạng thái: {
                                                selectedStatus === 'pending' ? 'Chờ xử lý' :
                                                selectedStatus === 'confirmed' ? 'Đã xác nhận' :
                                                selectedStatus === 'canceled' ? 'Đã hủy' : selectedStatus
                                            }</span>
                                            <button
                                                onClick={() => setSelectedStatus(null)}
                                                className="ml-1 hover:text-purple-600"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedSort && (
                                        <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                            <i className="pi pi-sort text-xs"></i>
                                            <span>Sắp xếp: {
                                                selectedSort === 'nameAsc' ? 'Tên A-Z' :
                                                selectedSort === 'nameDesc' ? 'Tên Z-A' :
                                                selectedSort === 'dateDesc' ? 'Ngày đặt mới nhất' :
                                                selectedSort === 'dateAsc' ? 'Ngày đặt cũ nhất' : selectedSort
                                            }</span>
                                            <button
                                                onClick={() => setSelectedSort(null)}
                                                className="ml-1 hover:text-purple-600"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-[#0f766e] overflow-hidden">
                    <DataTable
                        value={filteredBookings}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        stripedRows
                        showGridlines
                        className="text-sm"
                        tableStyle={{ minWidth: '100%' }}
                        dataKey="booking_id"
                        emptyMessage={
                            loading ? (
                                <div className="text-center py-12">
                                    <i className="pi pi-spinner pi-spin text-4xl text-blue-500 mb-4"></i>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Đang tải dữ liệu...</h3>
                                    <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <i className="pi pi-shopping-cart text-4xl text-gray-400 mb-4"></i>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        {bookings.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng nào'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {bookings.length === 0 
                                            ? 'Chưa có đơn hàng nào trong hệ thống' 
                                            : 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                        }
                                    </p>
                                </div>
                            )
                        }
                        paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                        currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} đơn hàng"
                        header={headerTemplate}
                        selection={selectedBookings}
                        onSelectionChange={(e: any) => setSelectedBookings(e.value)}
                        selectionMode="multiple"
                        loading={loading}
                        sortField="booking_date"
                        sortOrder={-1}
                        removableSort
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        <Column
                            field="user_name"
                            header="Khách hàng"
                            body={userTemplate}
                            sortable
                            style={{ width: '20%' }}
                        />
                        <Column
                            field="tour_name"
                            header="Tour"
                            body={tourTemplate}
                            sortable
                            style={{ width: '20%' }}
                        />
                        <Column
                            field="adults"
                            header="Số khách"
                            body={guestsTemplate}
                            sortable
                            style={{ width: '15%' }}
                        />
                        <Column
                            field="status"
                            header="Trạng thái"
                            body={statusTemplate}
                            sortable
                            style={{ width: '10%' }}
                        />
                        <Column
                            field="total_price"
                            header="Giá"
                            body={priceTemplate}
                            sortable
                            style={{ width: '15%' }}
                        />
                        <Column
                            field="booking_date"
                            header="Ngày đặt"
                            body={dateTemplate}
                            sortable
                            style={{ width: '10%' }}
                        />
                        <Column
                            header="Thao tác"
                            body={actionTemplate}
                            style={{ textAlign: 'center', width: '10%' }}
                            frozen
                            alignFrozen="right"
                        />
                    </DataTable>
                </div>

                {/* Edit Booking Dialog */}
                <Dialog
                    visible={isOpenBooking}
                    header="Chỉnh sửa Đơn hàng"
                    modal
                    className="w-11/12 max-w-4xl"
                    onHide={() => {
                        setIsOpenBooking(false);
                        setEditingBooking(null);
                        setBookingForm({
                            adults: 0,
                            children: 0,
                            infants: 0,
                            notes: '',
                            status: 'pending',
                            start_date: null,
                            end_date: null
                        });
                    }}
                >
                    <div className="p-6">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số người lớn *
                                    </label>
                                    <InputNumber
                                        value={bookingForm.adults}
                                        onValueChange={(e) => setBookingForm({ ...bookingForm, adults: e.value || 0 })}
                                        placeholder="Nhập số người lớn"
                                        className="w-full"
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số trẻ em
                                    </label>
                                    <InputNumber
                                        value={bookingForm.children}
                                        onValueChange={(e) => setBookingForm({ ...bookingForm, children: e.value || 0 })}
                                        placeholder="Nhập số trẻ em"
                                        className="w-full"
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số em bé
                                    </label>
                                    <InputNumber
                                        value={bookingForm.infants}
                                        onValueChange={(e) => setBookingForm({ ...bookingForm, infants: e.value || 0 })}
                                        placeholder="Nhập số em bé"
                                        className="w-full"
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trạng thái *
                                    </label>
                                    <Dropdown
                                        options={[
                                            { label: 'Chờ xử lý', value: 'pending' },
                                            { label: 'Đã xác nhận', value: 'confirmed' },
                                            { label: 'Đã hủy', value: 'canceled' }
                                        ]}
                                        value={bookingForm.status}
                                        onChange={(e) => setBookingForm({ ...bookingForm, status: e.value })}
                                        placeholder="Chọn trạng thái"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày bắt đầu
                                    </label>
                                    <Calendar
                                        value={bookingForm.start_date}
                                        onChange={(e) => setBookingForm({ ...bookingForm, start_date: e.value as Date })}
                                        placeholder="Chọn ngày bắt đầu"
                                        className="w-full"
                                        showIcon
                                        disabled={true}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày kết thúc
                                    </label>
                                    <Calendar
                                        value={bookingForm.end_date}
                                        onChange={(e) => setBookingForm({ ...bookingForm, end_date: e.value as Date })}
                                        placeholder="Chọn ngày kết thúc"
                                        className="w-full"
                                        showIcon
                                        disabled={true}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú
                                    </label>
                                    <InputTextarea
                                        value={bookingForm.notes}
                                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                                        placeholder="Nhập ghi chú cho đơn hàng"
                                        className="w-full"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                type="button"
                                label="Hủy"
                                outlined
                                onClick={() => {
                                    setIsOpenBooking(false);
                                    setEditingBooking(null);
                                    setBookingForm({
                                        adults: 0,
                                        children: 0,
                                        infants: 0,
                                        notes: '',
                                        status: 'pending',
                                        start_date: null,
                                        end_date: null
                                    });
                                }}
                            />
                            <Button
                                type="button"
                                label="Cập nhật"
                                onClick={handleUpdateBooking}
                                className="bg-blue-800 hover:bg-blue-900"
                            />
                        </div>
                    </div>
                </Dialog>

                {/* Booking Detail Modal */}
                <BookingDetailModal
                    visible={isDetailModalOpen}
                    onHide={() => {
                        setIsDetailModalOpen(false);
                        setSelectedBookingDetail(null);
                    }}
                    booking={selectedBookingDetail}
                    onEdit={handleEditBooking}
                    onSendEmail={handleSendEmail}
                    onDelete={handleDeleteBooking}
                />
            </div>
        </>
    );
}
