"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import SearchBar from '@/components/search';
import { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import useTicketPrices from '@/lib/hooks/useTicketPrices';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import Add from '@/components/add';
import { TourTicketPrice } from '@/lib/types';
import { API_URL } from '@/lib/types/url';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

export default function Page() {
    const { 
        ticketPrices, 
        tours, 
        loading, 
        getAllTicketPrices, 
        createTicketPrice, 
        updateTicketPrice, 
        deleteTicketPrice 
    } = useTicketPrices();

    // State management
    const [search, setSearch] = useState('');
    const [selectedTour, setSelectedTour] = useState<string | null>(null);
    const [selectedCustomerType, setSelectedCustomerType] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [selectedTicketPrices, setSelectedTicketPrices] = useState<TourTicketPrice[]>([]);
    const [isOpenTicketPrice, setIsOpenTicketPrice] = useState(false);
    const [editingTicketPrice, setEditingTicketPrice] = useState<TourTicketPrice | null>(null);
    
    // Advanced search states
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [searchField, setSearchField] = useState('all');
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    
    // Form state
    const [ticketPriceForm, setTicketPriceForm] = useState<Omit<TourTicketPrice, "id">>({
        tour_id: undefined,
        customer_type: 'adult',
        start_date: undefined,
        end_date: undefined,
        old_price: 0,
        price: 0
    });

    const toast = useRef<Toast>(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) {
                    searchInput.focus();
                }
            }
            // Escape to clear all filters
            if (e.key === 'Escape') {
                clearAllFilters();
            }
            // Ctrl/Cmd + Shift + F for advanced search toggle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                setAdvancedSearch(!advancedSearch);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [advancedSearch]);

    // Load data on component mount
    useEffect(() => {
        getAllTicketPrices();
    }, []);

    // Clear all filters
    const clearAllFilters = () => {
        setSearch('');
        setSelectedTour(null);
        setSelectedCustomerType(null);
        setSelectedSort(null);
        setDateRange(null);
        setPriceRange(null);
        setSearchField('all');
        setAdvancedSearch(false);
    };

    // Search functionality
    const handleSearch = (value: string) => {
        setSearch(value);
        if (value.trim() && !searchHistory.includes(value.trim())) {
            setSearchHistory(prev => [value.trim(), ...prev.slice(0, 4)]);
        }
    };

    // Filter data
    const filteredTicketPrices = ticketPrices?.filter((ticketPrice) => {
        const searchTerm = search?.toLowerCase() || '';
        const tour = tours?.find(t => t.id === ticketPrice.tour_id);
        const tourName = tour?.name?.toLowerCase() || '';
        
        const matchesSearch = !searchTerm || 
            tourName.includes(searchTerm) ||
            ticketPrice.customer_type?.toLowerCase().includes(searchTerm) ||
            ticketPrice.price?.toString().includes(search) ||
            (ticketPrice.start_date && ticketPrice.start_date.includes(search)) ||
            (ticketPrice.end_date && ticketPrice.end_date.includes(search));
        
        const matchesTour = !selectedTour || ticketPrice.tour_id?.toString() === selectedTour;
        const matchesCustomerType = !selectedCustomerType || ticketPrice.customer_type === selectedCustomerType;
        
        // Date range filter
        let matchesDateRange = true;
        if (dateRange && dateRange[0] && dateRange[1]) {
            const startDate = new Date(dateRange[0]);
            const endDate = new Date(dateRange[1]);
            const ticketStartDate = ticketPrice.start_date ? new Date(ticketPrice.start_date) : null;
            const ticketEndDate = ticketPrice.end_date ? new Date(ticketPrice.end_date) : null;
            
            matchesDateRange = !ticketStartDate || !ticketEndDate || 
                (ticketStartDate >= startDate && ticketEndDate <= endDate);
        }
        
        // Price range filter
        let matchesPriceRange = true;
        if (priceRange && priceRange[0] !== null && priceRange[1] !== null) {
            const price = ticketPrice.price || 0;
            matchesPriceRange = price >= priceRange[0] && price <= priceRange[1];
        }
        
        return matchesSearch && matchesTour && matchesCustomerType && matchesDateRange && matchesPriceRange;
    }) || [];

    // Sort data
    const sortedTicketPrices = [...filteredTicketPrices].sort((a, b) => {
        if (!selectedSort) return 0;
        
        switch (selectedSort) {
            case 'priceAsc':
                return (a.price || 0) - (b.price || 0);
            case 'priceDesc':
                return (b.price || 0) - (a.price || 0);
            case 'typeAsc':
                return (a.customer_type || '').localeCompare(b.customer_type || '');
            case 'typeDesc':
                return (b.customer_type || '').localeCompare(a.customer_type || '');
            case 'dateAsc':
                return new Date(a.start_date || '').getTime() - new Date(b.start_date || '').getTime();
            case 'dateDesc':
                return new Date(b.start_date || '').getTime() - new Date(a.start_date || '').getTime();
            default:
                return 0;
        }
    });

    // Statistics
    const totalTicketPrices = ticketPrices?.length || 0;
    const adultPrices = ticketPrices?.filter(tp => tp.customer_type === 'adult').length || 0;
    const childPrices = ticketPrices?.filter(tp => tp.customer_type === 'child').length || 0;
    const infantPrices = ticketPrices?.filter(tp => tp.customer_type === 'infant').length || 0;
    const activePrices = ticketPrices?.filter(tp => {
        const today = new Date();
        const startDate = tp.start_date ? new Date(tp.start_date) : null;
        const endDate = tp.end_date ? new Date(tp.end_date) : null;
        return startDate && endDate && today >= startDate && today <= endDate;
    }).length || 0;

    // Event handlers
    const handleEditTicketPrice = (ticketPrice: TourTicketPrice) => {
        setEditingTicketPrice(ticketPrice);
        setTicketPriceForm({
            tour_id: ticketPrice.tour_id,
            customer_type: ticketPrice.customer_type,
            start_date: ticketPrice.start_date || undefined,
            end_date: ticketPrice.end_date || undefined,
            old_price: ticketPrice.old_price || 0,
            price: ticketPrice.price || 0
        });
        setIsOpenTicketPrice(true);
    };

    const handleDeleteTicketPrice = (ticketPrice: TourTicketPrice) => {
        const tourName = tours?.find(t => t.id === ticketPrice.tour_id)?.name || 'N/A';
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa giá vé "${ticketPrice.customer_type}" của tour "${tourName}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    if (ticketPrice.id) {
                        await deleteTicketPrice(ticketPrice.id);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Giá vé đã được xóa',
                            life: 3000
                        });
                    }
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể xóa giá vé',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleSaveTicketPrice = async () => {
        // Validation
        if (!ticketPriceForm.tour_id || !ticketPriceForm.customer_type || !ticketPriceForm.price || ticketPriceForm.price <= 0) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng nhập đầy đủ thông tin và giá phải lớn hơn 0',
                life: 3000
            });
            return;
        }

        // Validate customer_type
        const validCustomerTypes = ['adult', 'child', 'infant'];
        if (!validCustomerTypes.includes(ticketPriceForm.customer_type)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Loại khách hàng không hợp lệ',
                life: 3000
            });
            return;
        }

        // Validate tour_id exists
        const tourExists = tours.find(tour => tour.id === ticketPriceForm.tour_id);
        if (!tourExists) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Tour không tồn tại',
                life: 3000
            });
            return;
        }

        // Validate price is positive number
        if (ticketPriceForm.price <= 0 || isNaN(ticketPriceForm.price)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Giá phải là số dương',
                life: 3000
            });
            return;
        }

        // Validate old_price if provided
        if (ticketPriceForm.old_price && (ticketPriceForm.old_price < 0 || isNaN(ticketPriceForm.old_price))) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Giá cũ phải là số không âm',
                life: 3000
            });
            return;
        }

        // Validate date format
        if (ticketPriceForm.start_date && ticketPriceForm.end_date) {
            const startDate = new Date(ticketPriceForm.start_date);
            const endDate = new Date(ticketPriceForm.end_date);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Định dạng ngày không hợp lệ',
                    life: 3000
                });
                return;
            }
        }

        // Validate date range
        if (ticketPriceForm.start_date && ticketPriceForm.end_date) {
            const startDate = new Date(ticketPriceForm.start_date);
            const endDate = new Date(ticketPriceForm.end_date);
            if (startDate >= endDate) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
                    life: 3000
                });
                return;
            }
        }

        try {
            const formData = {
                tour_id: Number(ticketPriceForm.tour_id),
                customer_type: ticketPriceForm.customer_type,
                start_date: ticketPriceForm.start_date ? new Date(ticketPriceForm.start_date).toISOString().split('T')[0] : null,
                end_date: ticketPriceForm.end_date ? new Date(ticketPriceForm.end_date).toISOString().split('T')[0] : null,
                old_price: Number(ticketPriceForm.old_price) || 0,
                price: Number(ticketPriceForm.price) || 0
            };

            // Final validation
            if (!formData.tour_id || !formData.customer_type || !formData.price) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Dữ liệu form không hợp lệ',
                    life: 3000
                });
                return;
            }

            // Validate form data types
            if (isNaN(formData.tour_id) || isNaN(formData.price) || isNaN(formData.old_price)) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Dữ liệu số không hợp lệ',
                    life: 3000
                });
                return;
            }

            // Validate price is positive
            if (formData.price <= 0) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Giá phải lớn hơn 0',
                    life: 3000
                });
                return;
            }

            // Validate old_price is not negative
            if (formData.old_price < 0) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Giá cũ không được âm',
                    life: 3000
                });
                return;
            }

            // Validate customer_type
            const validCustomerTypes = ['adult', 'child', 'infant'];
            if (!validCustomerTypes.includes(formData.customer_type)) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Loại khách hàng không hợp lệ',
                    life: 3000
                });
                return;
            }

            console.log('Form submission data:', formData);
            console.log('Editing ticket price:', editingTicketPrice);

            if (editingTicketPrice && editingTicketPrice.id) {
                console.log('Updating ticket price with ID:', editingTicketPrice.id);
                await updateTicketPrice(editingTicketPrice.id, formData as Omit<TourTicketPrice, "id">);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Giá vé đã được cập nhật',
                    life: 3000
                });
            } else {
                await createTicketPrice(formData as Omit<TourTicketPrice, "id">);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Giá vé đã được thêm',
                    life: 3000
                });
            }
            resetForm();
            setIsOpenTicketPrice(false);
            setEditingTicketPrice(null);
            getAllTicketPrices();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 
                                (error as any)?.response?.data?.message || 
                                'Có lỗi xảy ra khi lưu giá vé';
            toast.current?.show({       
                severity: 'error',
                summary: 'Lỗi',
                detail: `Không thể lưu giá vé: ${errorMessage}`,
                life: 5000
            });
        }
    };

    const resetForm = () => {
        setTicketPriceForm({
            tour_id: undefined,
            customer_type: 'adult',
            start_date: undefined,
            end_date: undefined,
            old_price: 0,
            price: 0
        });
        setEditingTicketPrice(null);
        setIsOpenTicketPrice(false);
    };

    // Templates
    const tourNameTemplate = (rowData: TourTicketPrice) => {
        const tour = tours?.find(t => t.id === rowData.tour_id);
        return (
            <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="pi pi-map-marker text-blue-600 text-sm"></i>
                    </div>
                <div>
                    <div className="font-semibold text-gray-800">{tour?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">ID: #{rowData.tour_id}</div>
                </div>
            </div>
        );
    };

    const customerTypeTemplate = (rowData: TourTicketPrice) => {
        const typeConfig = {
            adult: { 
                label: 'Người lớn', 
                color: 'blue', 
                icon: 'pi-user',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                borderColor: 'border-blue-200'
            },
            child: { 
                label: 'Trẻ em', 
                color: 'green', 
                icon: 'pi-user-plus',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                borderColor: 'border-green-200'
            },
            infant: { 
                label: 'Trẻ sơ sinh', 
                color: 'purple', 
                icon: 'pi-heart',
                bgColor: 'bg-purple-100',
                textColor: 'text-purple-800',
                borderColor: 'border-purple-200'
            }
        };
        
        const config = typeConfig[rowData.customer_type as keyof typeof typeConfig] || typeConfig.adult;

        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.textColor} ${config.borderColor} border font-medium shadow-sm`}>
                <i className={`${config.icon} text-sm`}></i>
                <span className="text-sm font-semibold">{config.label}</span>
            </div>
        );
    };

    const priceTemplate = (rowData: TourTicketPrice) => (
        <div className="text-right">
            <div className="font-bold text-emerald-600">
                            {rowData.price ? new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(rowData.price) : 'N/A'}
                    </div>
                    {rowData.old_price && rowData.old_price > 0 && (
                <div className="text-xs text-gray-500 line-through">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(rowData.old_price)}
                        </div>
                    )}
                </div>
    );

    const dateTemplate = (rowData: TourTicketPrice) => (
        <div className="text-sm">
            {rowData.start_date && (
                <div className="flex items-center gap-1 mb-1">
                    <i className="pi pi-calendar-plus text-blue-600 text-xs"></i>
                    <span>{new Date(rowData.start_date).toLocaleDateString('vi-VN')}</span>
            </div>
            )}
            {rowData.end_date && (
                <div className="flex items-center gap-1">
                    <i className="pi pi-calendar-times text-blue-600 text-xs"></i>
                    <span>{new Date(rowData.end_date).toLocaleDateString('vi-VN')}</span>
                </div>
            )}
        </div>
    );

    const actionTemplate = (rowData: TourTicketPrice) => (
        <div className="flex gap-2">
            <Tooltip target=".edit-btn" content="Chỉnh sửa" position="top" />
            <Tooltip target=".delete-btn" content="Xóa" position="top" />

            <Button
                icon="pi pi-pencil"
                size="small"
                outlined
                className="edit-btn border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                onClick={() => handleEditTicketPrice(rowData)}
            />
                        <Button
                            icon="pi pi-trash"
                size="small"
                            outlined
                className="delete-btn border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                onClick={() => handleDeleteTicketPrice(rowData)}
            />
        </div>
    );

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Toast ref={toast} />
                <ConfirmDialog />
                
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-[#0f766e]">
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        <i className="pi pi-ticket text-white text-2xl"></i>
                                    </div>
                                    <Title 
                                        title="Quản lý Giá vé" 
                                        note="Quản lý giá vé theo loại khách hàng và thời gian áp dụng trong hệ thống Huy Vi Vu" 
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex items-center gap-4">
                                    <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 shadow-sm border border-emerald-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-ticket text-emerald-600"></i>
                                            <div className="text-2xl font-bold text-emerald-600">{totalTicketPrices}</div>
                                        </div>
                                        <div className="text-sm text-emerald-700 font-medium">Tổng giá vé</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-user text-blue-600"></i>
                                            <div className="text-2xl font-bold text-blue-600">{adultPrices}</div>
                                        </div>
                                        <div className="text-sm text-blue-700 font-medium">Người lớn</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-user-plus text-green-600"></i>
                                            <div className="text-2xl font-bold text-green-600">{childPrices}</div>
                                        </div>
                                        <div className="text-sm text-green-700 font-medium">Trẻ em</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm border border-purple-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-heart text-purple-600"></i>
                                            <div className="text-2xl font-bold text-purple-600">{infantPrices}</div>
                                        </div>
                                        <div className="text-sm text-purple-700 font-medium">Trẻ sơ sinh</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 shadow-sm border border-amber-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-check-circle text-amber-600"></i>
                                            <div className="text-2xl font-bold text-amber-600">{activePrices}</div>
                                        </div>
                                        <div className="text-sm text-amber-700 font-medium">Đang áp dụng</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-2xl my-6 mx-4 shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-100 rounded-lg shadow-sm">
                                    <i className="pi pi-filter text-emerald-600 text-lg"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Bộ lọc và Tìm kiếm</h3>
                                    <p className="text-sm text-gray-600">Tìm kiếm và lọc giá vé theo tiêu chí</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    icon="pi pi-sliders-h"
                                    label="Tìm kiếm nâng cao"
                                    outlined
                                    size="small"
                                    className={advancedSearch ? "bg-emerald-100 text-emerald-700 border-emerald-300" : ""}
                                    onClick={() => setAdvancedSearch(!advancedSearch)}
                                />
                                {(search || selectedTour || selectedCustomerType || selectedSort || dateRange || priceRange) && (
                                <Button
                                    icon="pi pi-filter-slash"
                                    label="Xóa bộ lọc"
                                    outlined
                                    size="small"
                                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                                        onClick={clearAllFilters}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Basic Search */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <i className="pi pi-search text-emerald-600"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
                            </div>
                            <div className="relative">
                                <SearchBar
                                    onSearch={handleSearch}
                                    placeholder="Tìm kiếm theo tên tour, loại khách hàng, giá, ngày... (Ctrl+K để focus)"
                                />
                            </div>
                            
                            {/* Search History */}
                            {searchHistory.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="text-xs text-gray-500">Tìm kiếm gần đây:</span>
                                    {searchHistory.map((term, index) => (
                                        <Chip
                                            key={index}
                                            label={term}
                                            className="text-xs cursor-pointer hover:bg-emerald-100"
                                            onClick={() => setSearch(term)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-map text-blue-600"></i>
                                    Tour
                                </label>
                                    <Dropdown
                                    options={tours?.map(t => ({
                                            label: `${t.name} (ID: ${t.id})`,
                                        value: t.id?.toString()
                                        })) || []}
                                        value={selectedTour}
                                        onChange={(e) => setSelectedTour(e.value)}
                                    placeholder="Chọn tour"
                                        className="w-full"
                                        showClear
                                    />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <i className="pi pi-users text-purple-600"></i>
                                    Loại khách hàng
                                </label>
                                        <Dropdown
                                            options={[
                                                { 
                                                    label: 'Người lớn', 
                                                    value: 'adult',
                                                    template: <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span>Người lớn</span></div>
                                                },
                                                { 
                                                    label: 'Trẻ em', 
                                                    value: 'child',
                                                    template: <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Trẻ em</span></div>
                                                },
                                                { 
                                                    label: 'Trẻ sơ sinh', 
                                                    value: 'infant',
                                                    template: <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span>Trẻ sơ sinh</span></div>
                                                }
                                            ]}
                                            value={selectedCustomerType}
                                            onChange={(e) => setSelectedCustomerType(e.value)}
                                            placeholder="Chọn loại khách hàng"
                                            className="w-full"
                                            showClear
                                            optionLabel="label"
                                        />
                                    </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-sort text-amber-600"></i>
                                    Sắp xếp
                                </label>
                                    <Dropdown
                                    options={[
                                            { label: 'Giá thấp đến cao', value: 'priceAsc' },
                                            { label: 'Giá cao đến thấp', value: 'priceDesc' },
                                            { label: 'Loại A-Z', value: 'typeAsc' },
                                        { label: 'Loại Z-A', value: 'typeDesc' },
                                            { label: 'Ngày sớm nhất', value: 'dateAsc' },
                                            { label: 'Ngày muộn nhất', value: 'dateDesc' }
                                        ]}
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.value)}
                                        placeholder="Chọn cách sắp xếp"
                                        className="w-full"
                                        showClear
                                    />
                                </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i className="pi pi-calendar text-green-600"></i>
                                    Khoảng thời gian
                                </label>
                                <Calendar
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.value as Date[])}
                                    selectionMode="range"
                                    placeholder="Chọn khoảng thời gian"
                                    className="w-full"
                                    showIcon
                                />
                            </div>
                        </div>

                        {/* Advanced Search */}
                        {advancedSearch && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                                <h4 className="text-sm font-semibold text-gray-700 mb-4">Tìm kiếm nâng cao</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700">Khoảng giá (VND)</label>
                                        <div className="flex gap-2">
                                            <InputNumber
                                                value={priceRange?.[0] || null}
                                                onValueChange={(e) => setPriceRange([e.value || 0, priceRange?.[1] || 0])}
                                                placeholder="Từ"
                                                className="flex-1"
                                                mode="currency"
                                                currency="VND"
                                                locale="vi-VN"
                                            />
                                            <InputNumber
                                                value={priceRange?.[1] || null}
                                                onValueChange={(e) => setPriceRange([priceRange?.[0] || 0, e.value || 0])}
                                                placeholder="Đến"
                                                className="flex-1"
                                                mode="currency"
                                                currency="VND"
                                                locale="vi-VN"
                                            />
                                    </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Active Filters */}
                        {(search || selectedTour || selectedCustomerType || selectedSort || dateRange || priceRange) && (
                            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <i className="pi pi-info-circle text-emerald-600"></i>
                                    <span className="text-sm font-semibold text-emerald-800">Bộ lọc đang áp dụng:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {search && (
                                        <Chip
                                            label={`Tìm kiếm: "${search}"`}
                                            className="bg-emerald-100 text-emerald-800"
                                            removable
                                            onRemove={() => { setSearch(''); return true; }}
                                        />
                                    )}
                                    {selectedTour && (
                                        <Chip
                                            label={`Tour: ${tours?.find(t => t.id?.toString() === selectedTour)?.name}`}
                                            className="bg-blue-100 text-blue-800"
                                            removable
                                            onRemove={() => { setSelectedTour(null); return true; }}
                                        />
                                    )}
                                    {selectedCustomerType && (
                                        <Chip
                                            label={`Loại: ${selectedCustomerType === 'adult' ? 'Người lớn' : selectedCustomerType === 'child' ? 'Trẻ em' : 'Trẻ sơ sinh'}`}
                                            className={
                                                selectedCustomerType === 'adult' ? 'bg-blue-100 text-blue-800' :
                                                selectedCustomerType === 'child' ? 'bg-green-100 text-green-800' :
                                                'bg-purple-100 text-purple-800'
                                            }
                                            removable
                                            onRemove={() => { setSelectedCustomerType(null); return true; }}
                                        />
                                    )}
                                    {selectedSort && (
                                        <Chip
                                            label={`Sắp xếp: ${selectedSort}`}
                                            className="bg-amber-100 text-amber-800"
                                            removable
                                            onRemove={() => { setSelectedSort(null); return true; }}
                                        />
                                    )}
                                    {dateRange && dateRange[0] && dateRange[1] && (
                                        <Chip
                                            label={`Thời gian: ${dateRange[0].toLocaleDateString('vi-VN')} - ${dateRange[1].toLocaleDateString('vi-VN')}`}
                                            className="bg-green-100 text-green-800"
                                            removable
                                            onRemove={() => { setDateRange(null); return true; }}
                                        />
                                    )}
                                    {priceRange && (priceRange[0] || priceRange[1]) && (
                                        <Chip
                                            label={`Giá: ${priceRange[0]?.toLocaleString('vi-VN') || '0'} - ${priceRange[1]?.toLocaleString('vi-VN') || '∞'} VND`}
                                            className="bg-orange-100 text-orange-800"
                                            removable
                                            onRemove={() => { setPriceRange(null); return true; }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-[#0f766e] mx-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 rounded-lg shadow-sm">
                                    <i className="pi pi-table text-emerald-600 text-lg"></i>
                            </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Danh sách Giá vé</h3>
                                    <p className="text-sm text-gray-600">Quản lý giá vé theo loại khách hàng và thời gian</p>
                                </div>
                                <Badge value={sortedTicketPrices.length} severity="success" className="text-lg px-3 py-1" />
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedTicketPrices.length > 0 && (
                                    <Button
                                        icon="pi pi-trash"
                                        label={`Xóa (${selectedTicketPrices.length})`}
                                        outlined
                                        severity="danger"
                                        className="hover:scale-105 transition-all duration-200"
                                    />
                                )}
                                    <Add
                                        label="Thêm Giá vé"
                                        onClick={() => {
                                        resetForm();
                                            setIsOpenTicketPrice(true);
                                        }}
                                    />
                            </div>
                        </div>
                                </div>

                                <DataTable
                        value={sortedTicketPrices}
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    stripedRows
                                    showGridlines
                                    className="text-sm"
                                    tableStyle={{ minWidth: '100%' }}
                                    dataKey="id"
                                    emptyMessage={
                            loading ? (
                                            <div className="text-center py-12">
                                    <i className="pi pi-spinner pi-spin text-4xl text-emerald-500 mb-4"></i>
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Đang tải dữ liệu...</h3>
                                                <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <i className="pi pi-ticket text-4xl text-gray-400 mb-4"></i>
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                    {ticketPrices.length === 0 ? 'Chưa có giá vé nào' : 'Không tìm thấy giá vé nào'}
                                                </h3>
                                                <p className="text-gray-500">
                                                    {ticketPrices.length === 0 
                                                        ? 'Hãy thêm giá vé đầu tiên vào hệ thống' 
                                                        : 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                                    }
                                                </p>
                                            </div>
                                        )
                                    }
                                    paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                                    currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} giá vé"
                                    selection={selectedTicketPrices}
                        onSelectionChange={(e) => setSelectedTicketPrices(e.value)}
                                    selectionMode="multiple"
                        loading={loading}
                                    sortField="created_at"
                                    sortOrder={-1}
                                    removableSort
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                    <Column
                                        field="tour_id"
                                        header="Tour"
                                        body={tourNameTemplate}
                                        sortable
                            style={{ width: '25%' }}
                                    />
                                    <Column
                                        field="customer_type"
                                        header="Loại khách hàng"
                                        body={customerTypeTemplate}
                                        sortable
                            style={{ width: '15%' }}
                                    />
                                    <Column
                            field="start_date"
                            header="Thời gian áp dụng"
                            body={dateTemplate}
                                        sortable
                                        style={{ width: '20%' }}
                                    />
                                    <Column
                                        field="price"
                                        header="Giá"
                            body={priceTemplate}
                                        sortable
                            style={{ width: '15%' }}
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

                {/* Dialog Form */}
                <Dialog
                    visible={isOpenTicketPrice}
                    header={
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <i className="pi pi-ticket text-emerald-600 text-lg"></i>
                            </div>
                            <span className="text-lg font-semibold text-gray-800">
                                {editingTicketPrice ? "Chỉnh sửa Giá vé" : "Thêm Giá vé Mới"}
                            </span>
                        </div>
                    }
                    modal
                    className="w-11/12 max-w-4xl"
                    onHide={resetForm}
                >
                    <div className="p-6">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-map text-blue-600"></i>
                                        Tour *
                                    </label>
                                        <Dropdown
                                        options={tours?.map(t => ({
                                                label: `${t.name} (ID: ${t.id})`,
                                                value: t.id
                                            })) || []}
                                            value={ticketPriceForm.tour_id}
                                            onChange={(e) => setTicketPriceForm({ ...ticketPriceForm, tour_id: e.value })}
                                        placeholder="Chọn tour"
                                            className="w-full"
                                            showClear
                                        />
                                    </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-users text-purple-600"></i>
                                        Loại khách hàng *
                                    </label>
                                        <Dropdown
                                            options={[
                                                { 
                                                    label: 'Người lớn', 
                                                    value: 'adult',
                                                    template: <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span>Người lớn</span></div>
                                                },
                                                { 
                                                    label: 'Trẻ em', 
                                                    value: 'child',
                                                    template: <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Trẻ em</span></div>
                                                },
                                                { 
                                                    label: 'Trẻ sơ sinh', 
                                                    value: 'infant',
                                                    template: <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span>Trẻ sơ sinh</span></div>
                                                }
                                            ]}
                                            value={ticketPriceForm.customer_type}
                                            onChange={(e) => setTicketPriceForm({ ...ticketPriceForm, customer_type: e.value })}
                                            placeholder="Chọn loại khách hàng"
                                            className="w-full"
                                            optionLabel="label"
                                        />
                                    </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-calendar-plus text-blue-600"></i>
                                        Ngày bắt đầu
                                    </label>
                                        <Calendar
                                        value={ticketPriceForm.start_date ? new Date(ticketPriceForm.start_date) : null}
                                        onChange={(e) => {
                                            if (e.value) {
                                                const date = new Date(e.value);
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const day = String(date.getDate()).padStart(2, '0');
                                                setTicketPriceForm({ ...ticketPriceForm, start_date: `${year}-${month}-${day}` });
                                            } else {
                                                setTicketPriceForm({ ...ticketPriceForm, start_date: undefined });
                                            }
                                        }}
                                            placeholder="Chọn ngày bắt đầu"
                                            className="w-full"
                                            showIcon
                                        />
                                    </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-calendar-times text-blue-600"></i>
                                        Ngày kết thúc
                                    </label>
                                        <Calendar
                                        value={ticketPriceForm.end_date ? new Date(ticketPriceForm.end_date) : null}
                                        onChange={(e) => {
                                            if (e.value) {
                                                const date = new Date(e.value);
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const day = String(date.getDate()).padStart(2, '0');
                                                setTicketPriceForm({ ...ticketPriceForm, end_date: `${year}-${month}-${day}` });
                                            } else {
                                                setTicketPriceForm({ ...ticketPriceForm, end_date: undefined });
                                            }
                                        }}
                                            placeholder="Chọn ngày kết thúc"
                                            className="w-full"
                                            showIcon
                                        />
                                    </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-clock text-gray-600"></i>
                                        Giá cũ (VND)
                                    </label>
                                        <InputNumber
                                        value={ticketPriceForm.old_price}
                                        onValueChange={(e) => setTicketPriceForm({ ...ticketPriceForm, old_price: e.value || 0 })}
                                            placeholder="Nhập giá cũ"
                                            className="w-full"
                                            mode="currency"
                                            currency="VND"
                                            locale="vi-VN"
                                            min={0}
                                        />
                                    </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-money-bill text-emerald-600"></i>
                                        Giá (VND) *
                                    </label>
                                        <InputNumber
                                        value={ticketPriceForm.price}
                                        onValueChange={(e) => setTicketPriceForm({ ...ticketPriceForm, price: e.value || 0 })}
                                        placeholder="Nhập giá vé"
                                            className="w-full"
                                            mode="currency"
                                            currency="VND"
                                            locale="vi-VN"
                                            min={0}
                                        />
                                </div>
                            </div>
                        </form>

                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                label="Hủy"
                                outlined
                                className="px-6 py-2 hover:scale-105 transition-all duration-200"
                                onClick={resetForm}
                            />
                            <Button
                                type="button"
                                label={editingTicketPrice ? "Cập nhật" : "Thêm"}
                                onClick={handleSaveTicketPrice}
                                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 hover:scale-105 transition-all duration-200 shadow-sm"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
}
