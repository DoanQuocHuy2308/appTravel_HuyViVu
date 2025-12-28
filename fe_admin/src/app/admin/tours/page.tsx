"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { useTours } from '@/lib/hooks/useTour';
import SearchBar from '@/components/search';
import { Rating } from 'primereact/rating';
import { useState, useRef } from 'react';
import { Tooltip } from 'primereact/tooltip';
import Dropdown from '@/components/dropdown';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import '@/styles/tours.css';
import Add from '@/components/add';
import {API_URL} from '@/lib/types/url';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import { tourAPI } from '@/lib/services/tourAPI';
// import {Title} from '@/components/title'; 
export default function Page() {
    const { tours, loading: toursLoading, getAllTours } = useTours();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedSort, setSelectedSort] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTours, setSelectedTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({});

    const toast = useRef<Toast>(null);
    const menu = useRef<Menu>(null);

    // --- Dữ liệu lọc ---
    const uniqueTypes = [...new Set(tours.map((t: any) => t.name_type))].map(t => ({ label: t, value: t }));
    const uniqueLocations = [...new Set(tours.map((t: any) => t.locations))].map(l => ({ label: l, value: l }));

    // --- Statistics ---
    const totalTours = tours.length;
    const activeTours = tours.filter((t: any) => new Date(t.start_date) > new Date()).length;
    const totalRevenue = tours.reduce((sum: number, t: any) => sum + (parseFloat(t.price) || 0), 0);
    const averageRating = tours.reduce((sum: number, t: any) => sum + (parseFloat(t.rating) || 0), 0) / tours.length;

    // --- Lọc dữ liệu ---
    let filteredTours = tours.filter(tour =>
        tour.name.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedType || tour.name_type === selectedType) &&
        (!selectedLocation || tour.locations === selectedLocation)
    );

    // --- Sắp xếp dữ liệu ---
    if (selectedSort === 'priceAsc') {
        filteredTours.sort((a, b) => {
            const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price || 0;
            const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price || 0;
            return priceA - priceB;
        });
    }
    if (selectedSort === 'priceDesc') {
        filteredTours.sort((a, b) => {
            const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price || 0;
            const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price || 0;
            return priceB - priceA;
        });
    }
    if (selectedSort === 'rating') {
        filteredTours.sort((a, b) => {
            const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating) : a.rating || 0;
            const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating) : b.rating || 0;
            return ratingB - ratingA;
        });
    }
    if (selectedSort === 'startDateAsc') {
        filteredTours.sort((a, b) => {
            const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
            const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
            return dateA - dateB;
        });
    }
    if (selectedSort === 'startDateDesc') {
        filteredTours.sort((a, b) => {
            const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
            const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
            return dateB - dateA;
        });
    }
    if (selectedSort === 'endDateAsc') {
        filteredTours.sort((a, b) => {
            const endDateA = a.end_date ? new Date(a.end_date).getTime() : (a.start_date ? new Date(a.start_date).getTime() : 0);
            const endDateB = b.end_date ? new Date(b.end_date).getTime() : (b.start_date ? new Date(b.start_date).getTime() : 0);
            return endDateA - endDateB;
        });
    }
    if (selectedSort === 'endDateDesc') {
        filteredTours.sort((a, b) => {
            const endDateA = a.end_date ? new Date(a.end_date).getTime() : (a.start_date ? new Date(a.start_date).getTime() : 0);
            const endDateB = b.end_date ? new Date(b.end_date).getTime() : (b.start_date ? new Date(b.start_date).getTime() : 0);
            return endDateB - endDateA;
        });
    }

    // --- Utility Functions ---
    const handleDelete = (tour: any) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa tour "${tour.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    await tourAPI.deleteTour(tour.id);
                    await getAllTours();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Tour "${tour.name}" đã được xóa`,
                        life: 3000
                    });
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Có lỗi xảy ra khi xóa tour',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleBulkDelete = () => {
        if (selectedTours.length === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn ít nhất một tour để xóa',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa ${selectedTours.length} tour đã chọn?`,
            header: 'Xác nhận xóa nhiều',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    // Xóa từng tour đã chọn
                    for (const tour of selectedTours) {
                        await tourAPI.deleteTour(tour.id);
                    }
                    
                    await getAllTours();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Đã xóa ${selectedTours.length} tour`,
                        life: 3000
                    });
                    
                    setSelectedTours([]);
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Có lỗi xảy ra khi xóa tour',
                        life: 3000
                    });
                }
            }
        });
    };

    const exportData = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Thông báo',
            detail: 'Đang xuất dữ liệu...',
            life: 3000
        });
    };

    const nameTemplate = (rowData: any) => (
        <div key={`name-${rowData.id}`} className="flex flex-col p-2">
            <div className="flex items-center gap-2 mb-1">
                <i className="pi pi-map text-blue-500 text-xs"></i>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.name}</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block w-fit">ID: #{rowData.id || 'N/A'}</span>
        </div>
    );

    const priceTemplate = (rowData: any) => (
        <div key={`price-${rowData.id}`} className="flex flex-col p-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-1">
                    <i className="pi pi-dollar text-xs"></i>
                    <span className="text-xs font-semibold text-wrap">{Number(rowData.price).toLocaleString('vi-VN')} ₫</span>
                </div>
            </div>
            <span className="text-xs text-gray-500 mt-1 text-center">Giá cơ bản</span>
        </div>
    );

    const ratingTemplate = (rowData: any) => (
        <div key={`rating-${rowData.id}`} className="flex flex-col items-center p-2">
            <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400">
                <div className="flex items-center gap-1 mb-1">
                    <i className="pi pi-star text-amber-600 text-xs"></i>
                    <Rating value={Number(rowData.rating)} readOnly cancel={false} stars={5} />
                </div>
                <Badge 
                    value={rowData.rating} 
                    severity={Number(rowData.rating) >= 4 ? 'success' : Number(rowData.rating) >= 3 ? 'warning' : 'danger'}
                    className="text-xs"
                />
            </div>
        </div>
    );

    const statusTemplate = (rowData: any) => {
        const isActive = new Date(rowData.start_date) > new Date();
        return (
            <div key={`status-${rowData.id}`} className="flex justify-center p-2">
                <div className={`px-3 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
                    isActive 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                }`}>
                    <div className="flex items-center gap-1">
                        <i className={`pi ${isActive ? 'pi-check-circle' : 'pi-times-circle'} text-xs`}></i>
                        <span className="text-xs font-semibold">{isActive ? 'Hoạt động' : 'Kết thúc'}</span>
                    </div>
                </div>
            </div>
        );
    };

    const dateTemplate = (rowData: any) => (
        <div key={`date-${rowData.id}`} className="flex flex-col p-2">
            <div className="bg-blue-50 rounded-lg p-2 border-l-4 border-blue-400">
                <div className="flex items-center gap-1 mb-1">
                    <i className="pi pi-calendar text-blue-600 text-xs"></i>
                    <span className="text-sm font-semibold text-gray-900">
                        {new Date(rowData.start_date).toLocaleDateString('vi-VN')}
                    </span>
                </div>
                {rowData.end_date && (
                    <div className="flex items-center gap-1 mb-1">
                        <i className="pi pi-calendar-times text-blue-600 text-xs"></i>
                        <span className="text-xs text-gray-700">
                            Đến: {new Date(rowData.end_date).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                )}
                <span className="text-xs text-gray-500">
                    {rowData.duration_days} ngày
                </span>
            </div>
        </div>
    );

    const imageTemplate = (rowData: any) => (
        <div key={`image-${rowData.id}`} className="flex flex-col p-2">
            <img src={`${API_URL}${rowData.images[0]}`} alt={rowData.name} className="w-full h-20 object-cover rounded-lg" />
        </div>
    );

    const locationTemplate = (rowData: any) => (
        <div key={`location-${rowData.id}`} className="flex flex-col p-2">
            <div className="flex items-center gap-2 mb-1">
                <i className="pi pi-map-marker text-emerald-600 text-xs"></i>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.locations}</span>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full inline-block w-fit">Địa điểm</span>
        </div>
    );

    const typeTemplate = (rowData: any) => (
        <div key={`type-${rowData.id}`} className="flex justify-center p-2">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-1">
                    <i className="pi pi-tag text-xs"></i>
                    <span className="text-xs font-semibold">{rowData.name_type}</span>
                </div>
            </div>
        </div>
    );

    const actionTemplate = (rowData: any) => (
        <div key={`action-${rowData.id}`} className="flex justify-center gap-2">
            <Tooltip target=".view-btn" content="Xem chi tiết" position="top" />
            <Tooltip target=".edit-btn" content="Chỉnh sửa" position="top" />
            <Tooltip target=".delete-btn" content="Xóa tour" position="top" />

            <Button
                icon="pi pi-eye"
                rounded
                outlined
                onClick={() => router.push(`/admin/tours/${rowData.id}`)}
                size="small"
                className="view-btn border-emerald-600 !text-emerald-700 hover:!bg-emerald-600 hover:!text-white transition-all duration-200"
            />
            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                onClick={() => router.push(`/admin/tours/${rowData.id}/edit`)}
                size="small"
                className="edit-btn border-blue-600 !text-blue-700 hover:!bg-blue-600 hover:!text-white transition-all duration-200"
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                size="small"
                className="delete-btn border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-200"
                onClick={() => handleDelete(rowData)}
            />
        </div>
    );

    const headerTemplate = (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                        <i className="pi pi-map text-emerald-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Danh sách Tours</h3>
                        <p className="text-sm text-gray-600">Quản lý tất cả tours trong hệ thống</p>
                    </div>
                    <Badge
                        value={filteredTours.length}
                        severity="success"
                        className="text-lg px-3 py-1"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        icon="pi pi-download"
                        label="Xuất Excel"
                        outlined
                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200"
                        onClick={exportData}
                    />
                    {selectedTours.length > 0 && (
                        <Button
                            icon="pi pi-trash"
                            label={`Xóa (${selectedTours.length})`}
                            outlined
                            severity="danger"
                            className="hover:scale-105 transition-all duration-200"
                            onClick={handleBulkDelete}
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
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-[#0f766e]">
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 bg-gradient-to-br from-[#0f766e] to-[#0d9488] rounded-xl shadow-lg">
                                        <i className="pi pi-map text-white text-2xl"></i>
                                    </div>
                                    <Title title="Quản lý Tour" note="Quản lý, lọc và theo dõi các tour hiện có trong hệ thống Huy Vi Vu" />
                      s          </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden lg:flex items-center gap-6">
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-2xl font-bold text-emerald-600">{totalTours}</div>
                                        <div className="text-sm text-gray-500">Tổng Tours</div>
                                    </div>
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-2xl font-bold text-blue-600">{activeTours}</div>
                                        <div className="text-sm text-gray-500">Đang hoạt động</div>
                                    </div>
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-2xl font-bold text-amber-600">{averageRating.toFixed(1)}</div>
                                        <div className="text-sm text-gray-500">Đánh giá TB</div>
                                    </div>
                                </div>
                                <Add label="Thêm Tour" onClick={() => router.push('/admin/tours/add')} />
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog
                    visible={isOpen}
                    header="Thêm Tour Mới"
                    modal
                    className="w-11/12 max-w-3xl"
                    onHide={() => setIsOpen(false)}
                >
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Form thêm tour</h3>
                    </div>
                </Dialog>
                <div className="bg-white rounded-xl my-6 shadow-sm border border-[#0f766e] p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Bộ lọc và Tìm kiếm</h3>
                        <div className="flex items-center gap-2">
                            {(search || selectedType || selectedLocation || selectedSort) && (
                                <Button
                                    icon="pi pi-filter-slash"
                                    label="Xóa bộ lọc"
                                    outlined
                                    size="small"
                                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                                    onClick={() => {
                                        setSearch('');
                                        setSelectedType(null);
                                        setSelectedLocation(null);
                                        setSelectedSort(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <i className="pi pi-search mr-2"></i>Tìm kiếm
                            </label>
                            <SearchBar
                                onSearch={setSearch}
                                placeholder="Tìm kiếm tour theo tên, địa điểm..."
                            />
                        </div>
                        <div className="grid mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="pi pi-tag mr-2"></i>Loại tour
                                </label>
                                <Dropdown
                                    options={uniqueTypes}
                                    onChange={setSelectedType}
                                    placeholder="Chọn loại tour"
                                    defaultValue={null}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="pi pi-map-marker mr-2"></i>Địa điểm
                                </label>
                                <Dropdown
                                    options={uniqueLocations}
                                    onChange={setSelectedLocation}
                                    placeholder="Chọn địa điểm"
                                    defaultValue={null}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="pi pi-sort mr-2"></i>Sắp xếp
                                </label>
                                <Dropdown
                                    options={[
                                        { label: 'Giá tăng dần', value: 'priceAsc' },
                                        { label: 'Giá giảm dần', value: 'priceDesc' },
                                        { label: 'Đánh giá cao nhất', value: 'rating' },
                                        { label: 'Ngày bắt đầu gần nhất', value: 'startDateAsc' },
                                        { label: 'Ngày bắt đầu xa nhất', value: 'startDateDesc' },
                                        { label: 'Ngày kết thúc gần nhất', value: 'endDateAsc' },
                                        { label: 'Ngày kết thúc xa nhất', value: 'endDateDesc' }
                                    ]}
                                    onChange={setSelectedSort}
                                    placeholder="Chọn cách sắp xếp"
                                    defaultValue={null}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Data Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-[#0f766e] overflow-hidden">
                    <DataTable
                        value={filteredTours}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        stripedRows
                        showGridlines
                        className="text-sm"
                        tableStyle={{ minWidth: '100%' }}
                        emptyMessage={
                            <div className="text-center py-12">
                                <i className="pi pi-search text-4xl text-gray-400 mb-4"></i>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy tour nào</h3>
                                <p className="text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                            </div>
                        }
                        paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                        currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} tours"
                        header={headerTemplate}
                        selection={selectedTours}
                        onSelectionChange={(e: any) => setSelectedTours(e.value)}
                        selectionMode="multiple"
                        dataKey="id"
                        loading={toursLoading}
                        globalFilterFields={['name', 'locations', 'name_type']}
                        globalFilter={globalFilterValue}
                        sortField="start_date"
                        sortOrder={-1}
                        removableSort
                        rowClassName={(data) =>
                            data.start_date && new Date(data.start_date) > new Date()
                                ? 'bg-emerald-50 hover:bg-emerald-100'
                                : 'bg-gray-50 hover:bg-gray-100'
                        }
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        <Column
                            field="name"
                            header="Tour"
                            body={nameTemplate}
                            sortable
                            style={{ width: '20%' }}
                        />
                        <Column
                            field="image"
                            header="Ảnh"
                            body={imageTemplate}
                            sortable
                            style={{ width: '12%' }}
                        />
                        <Column
                            field="name_type"
                            header="Loại"
                            body={typeTemplate}
                            sortable
                            style={{ width: '12%' }}
                        />
                        <Column
                            field="locations"
                            header="Địa điểm"
                            body={locationTemplate}
                            style={{ width: '15%' }}
                        />
                        <Column
                            field="start_date"
                            header="Lịch trình"
                            body={dateTemplate}
                            sortable
                            style={{ width: '15%' }}
                        />
                        <Column
                            field="price"
                            header="Giá"
                            body={priceTemplate}
                            sortable
                            style={{ width: '20%' }}
                        />
                        <Column
                            field="rating"
                            header="Đánh giá"
                            body={ratingTemplate}
                            sortable
                            style={{ width: '10%' }}
                        />
                        <Column
                            field="status"
                            header="Trạng thái"
                            body={statusTemplate}
                            style={{ width: '8%' }}
                        />
                        <Column
                            header="Thao tác"
                            body={actionTemplate}
                            style={{ textAlign: 'center', width: '8%' }}
                            frozen
                            alignFrozen="right"
                        />
                    </DataTable>
                </div>
            </div>
        </>
    );
}
