"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import SearchBar from '@/components/search';
import { useState, useRef, useCallback } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useCategoryTour } from '@/lib/hooks/useCategoryTour';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import Add from '@/components/add';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { TourType } from '@/lib/types';

export default function Page() {
    const { tourTypes, tourType, loading, createTourType, updateTourType, deleteTourType, getAllTourTypes } = useCategoryTour();
    const [search, setSearch] = useState('');
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [isOpenTourType, setIsOpenTourType] = useState(false);
    const [selectedTourTypes, setSelectedTourTypes] = useState<TourType[]>([]);
    const [editingTourType, setEditingTourType] = useState<TourType | null>(null);
    
    const toast = useRef<Toast>(null);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const [tourTypeForm, setTourTypeForm] = useState<Omit<TourType, 'id'>>({
        name: '',
        description: ''
    });

    const totalTourTypes = tourTypes?.length || 0;

    let filteredTourTypes = tourTypes?.filter(tourType => {
        const searchTerm = search?.trim().toLowerCase() || '';
        const matchesSearch = !searchTerm || 
            (tourType.name && tourType.name.toLowerCase().includes(searchTerm)) ||
            (tourType.description && tourType.description.toLowerCase().includes(searchTerm));
        
        return matchesSearch;
    }) || [];

    if (selectedSort === 'nameAsc') {
        filteredTourTypes.sort((a: TourType, b: TourType) => (a.name || '').localeCompare(b.name || ''));
    }
    if (selectedSort === 'nameDesc') {
        filteredTourTypes.sort((a: TourType, b: TourType) => (b.name || '').localeCompare(a.name || ''));
    }

    const handleDeleteTourType = (tourType: TourType) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa loại tour "${tourType.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    await deleteTourType(tourType.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Loại tour "${tourType.name}" đã được xóa`,
                        life: 3000
                    });
                    getAllTourTypes();
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể xóa loại tour',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleSaveTourType = async () => {
        if (!tourTypeForm.name?.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng nhập tên loại tour',
                life: 3000
            });
            return;
        }

        try {
            if (editingTourType) {
                await updateTourType(editingTourType.id, tourTypeForm);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Loại tour đã được cập nhật',
                    life: 3000
                });
            } else {
                await createTourType(tourTypeForm);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Loại tour đã được thêm',
                    life: 3000
                });
            }
            getAllTourTypes();
            setTourTypeForm({ name: '', description: '' });
            setIsOpenTourType(false);
        } catch (error: any) {
            console.error('Save tour type error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu loại tour';
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: errorMessage,
                life: 5000
            });
        }
    };

    const handleEditTourType = (tourType: TourType) => {
        setEditingTourType(tourType);
        setTourTypeForm({
            name: tourType.name,
            description: tourType.description || ''
        });
        setIsOpenTourType(true);
    };

    const tourTypeNameTemplate = (rowData: any) => (
        <div className="flex flex-col p-3">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-teal-100 rounded-lg shadow-sm">
                    <i className="pi pi-tag text-teal-600 text-lg"></i>
                </div>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.name || 'N/A'}</span>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-3 py-1 rounded-full inline-block w-fit border border-teal-200">
                <span className="text-xs text-teal-700 font-medium">ID: #{rowData.id || 'N/A'}</span>
            </div>
        </div>
    );

    const tourTypeDescriptionTemplate = (rowData: any) => (
        <div className="max-w-xs p-3">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-l-4 border-gray-400 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-2">
                    <i className="pi pi-file-text text-gray-600 text-xs mt-1"></i>
                    <span className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{rowData.description || 'Không có mô tả'}</span>
                </div>
            </div>
        </div>
    );

    const tourTypeActionTemplate = (rowData: any) => (
        <div className="flex justify-center gap-3 p-3">
            <Tooltip target=".edit-tourtype-btn" content="Chỉnh sửa" position="top" />
            <Tooltip target=".delete-tourtype-btn" content="Xóa loại tour" position="top" />

            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                size="small"
                className="edit-tourtype-btn border-amber-500 !text-amber-600 hover:!bg-amber-500 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                onClick={() => handleEditTourType(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                size="small"
                className="delete-tourtype-btn border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                onClick={() => handleDeleteTourType(rowData)}
            />
        </div>
    );

    const tourTypeHeaderTemplate = (
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 border-b border-teal-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-teal-100 rounded-xl shadow-sm">
                        <i className="pi pi-tags text-teal-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Danh sách Loại Tour</h3>
                        <p className="text-sm text-gray-600">Quản lý các loại tour trong hệ thống</p>
                    </div>
                    <Badge
                        value={filteredTourTypes.length}
                        severity="success"
                        className="text-lg px-4 py-2 rounded-full"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {selectedTourTypes.length > 0 && (
                        <Button
                            icon="pi pi-trash"
                            label={`Xóa (${selectedTourTypes.length})`}
                            outlined
                            severity="danger"
                            className="hover:scale-105 transition-all duration-200 shadow-sm"
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
                <div className="bg-white shadow-sm border-b border-[#0f766e]">
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        <i className="pi pi-tags text-white text-2xl"></i>
                                    </div>
                                    <Title title="Quản lý Loại Tour" note="Quản lý các loại tour trong hệ thống Huy Vi Vu" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex items-center gap-4">
                                    <div className="text-center bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 shadow-sm border border-teal-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-tags text-teal-600"></i>
                                            <div className="text-2xl font-bold text-teal-600">{totalTourTypes}</div>
                                        </div>
                                        <div className="text-sm text-teal-700 font-medium">Tổng loại tour</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 shadow-sm border border-emerald-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-check-circle text-emerald-600"></i>
                                            <div className="text-2xl font-bold text-emerald-600">{filteredTourTypes.length}</div>
                                        </div>
                                        <div className="text-sm text-emerald-700 font-medium">Hiển thị</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl my-6 shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 border-b border-teal-200 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-teal-100 rounded-lg shadow-sm">
                                    <i className="pi pi-filter text-teal-600 text-lg"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Bộ lọc và Tìm kiếm</h3>
                                    <p className="text-sm text-gray-600">Tìm kiếm và lọc theo tiêu chí</p>
                                </div>
                            </div>
                            {(search || selectedSort) && (
                                <Button
                                    icon="pi pi-filter-slash"
                                    label="Xóa bộ lọc"
                                    outlined
                                    size="small"
                                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 hover:scale-105"
                                    onClick={() => {
                                        setSearch('');
                                        setSelectedSort(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <i className="pi pi-search text-teal-600"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
                            </div>
                            <div className="relative">
                                <SearchBar
                                    onSearch={handleSearch}
                                    placeholder="Tìm kiếm theo tên loại tour, mô tả..."
                                />
                            </div>
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Sort Filter */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <i className="pi pi-sort text-amber-600"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Sắp xếp</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={[
                                            { label: 'Tên A-Z', value: 'nameAsc' },
                                            { label: 'Tên Z-A', value: 'nameDesc' }
                                        ]}
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.value)}
                                        placeholder="Chọn cách sắp xếp"
                                        className="w-full"
                                        panelClassName="custom-dropdown-panel"
                                        showClear
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(search || selectedSort) && (
                            <div className="mt-8 p-5 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                        <i className="pi pi-info-circle text-teal-600"></i>
                                    </div>
                                    <span className="text-sm font-semibold text-teal-800">Bộ lọc đang áp dụng:</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {search && (
                                        <div className="flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-search text-xs"></i>
                                            <span>Tìm kiếm: "{search}"</span>
                                            <span className="text-xs text-teal-600">(tên, mô tả)</span>
                                            <button
                                                onClick={() => setSearch('')}
                                                className="ml-1 hover:text-teal-600 hover:bg-teal-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedSort && (
                                        <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-sort text-xs"></i>
                                            <span>Sắp xếp: {
                                                selectedSort === 'nameAsc' ? 'Tên A-Z' :
                                                selectedSort === 'nameDesc' ? 'Tên Z-A' : selectedSort
                                            }</span>
                                            <button
                                                onClick={() => setSelectedSort(null)}
                                                className="ml-1 hover:text-amber-600 hover:bg-amber-200 rounded-full p-1 transition-all duration-200"
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
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Quản lý Loại Tour</h3>
                            <div className="flex gap-3">
                                <Button
                                    icon="pi pi-refresh"
                                    label="Làm mới"
                                    outlined
                                    size="small"
                                    onClick={() => getAllTourTypes()}
                                    className="hover:scale-105 transition-all duration-200"
                                />
                                <Add
                                    label="Thêm Loại Tour"
                                    onClick={() => {
                                        setEditingTourType(null);
                                        setTourTypeForm({ name: '', description: '' });
                                        setIsOpenTourType(true);
                                    }}
                                />
                            </div>
                        </div>

                        <DataTable
                            value={filteredTourTypes}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            stripedRows
                            showGridlines
                            className="text-sm"
                            tableStyle={{ minWidth: '100%' }}
                            emptyMessage={
                                loading ? (
                                    <div className="text-center py-12">
                                        <i className="pi pi-spinner pi-spin text-4xl text-green-800 mb-4"></i>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">Đang tải dữ liệu...</h3>
                                        <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <i className="pi pi-tags text-4xl text-green-600 mb-4"></i>
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                                            {tourTypes.length === 0 ? 'Chưa có loại tour nào' : 'Không tìm thấy loại tour nào'}
                                        </h3>
                                        <p className="text-gray-500">
                                            {tourTypes.length === 0 
                                                ? 'Hãy thêm loại tour đầu tiên vào hệ thống' 
                                                : 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                            }
                                        </p>
                                    </div>
                                )
                            }
                            paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                            currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} loại tour"
                            header={tourTypeHeaderTemplate}
                            selection={selectedTourTypes}
                            onSelectionChange={(e: any) => setSelectedTourTypes(e.value)}
                            selectionMode="multiple"
                            dataKey="id"
                            loading={loading}
                            sortField="name"
                            sortOrder={1}
                            removableSort
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                            <Column
                                field="name"
                                header="Loại Tour"
                                body={tourTypeNameTemplate}
                                sortable
                                style={{ width: '30%' }}
                            />
                            <Column
                                field="description"
                                header="Mô tả"
                                body={tourTypeDescriptionTemplate}
                                style={{ width: '50%' }}
                            />
                            <Column
                                header="Thao tác"
                                body={tourTypeActionTemplate}
                                style={{ textAlign: 'center', width: '20%' }}
                                frozen
                                alignFrozen="right"
                            />
                        </DataTable>
                    </div>
                </div>

                <Dialog
                    visible={isOpenTourType}
                    header={
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-100 rounded-lg">
                                <i className="pi pi-tags text-teal-600 text-lg"></i>
                            </div>
                            <span className="text-lg font-semibold text-gray-800">
                                {editingTourType ? "Chỉnh sửa Loại Tour" : "Thêm Loại Tour Mới"}
                            </span>
                        </div>
                    }
                    modal
                    className="w-11/12 max-w-3xl"
                    onHide={() => {
                        setIsOpenTourType(false);
                        setEditingTourType(null);
                        setTourTypeForm({ name: '', description: '' });
                    }}
                >
                    <div className="p-8">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-tag text-teal-600"></i>
                                        Tên loại tour *
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            value={tourTypeForm.name}
                                            onChange={(e) => setTourTypeForm({ ...tourTypeForm, name: e.target.value })}
                                            placeholder="Nhập tên loại tour"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-file-text text-gray-600"></i>
                                        Mô tả
                                    </label>
                                    <div className="relative">
                                        <InputTextarea
                                            value={tourTypeForm.description}
                                            onChange={(e: any) => setTourTypeForm({ ...tourTypeForm, description: e.target.value })}
                                            placeholder="Nhập mô tả loại tour"
                                            className="w-full"
                                            rows={5}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                label="Hủy"
                                outlined
                                className="px-6 py-2 hover:scale-105 transition-all duration-200"
                                onClick={() => {
                                    setIsOpenTourType(false);
                                    setEditingTourType(null);
                                    setTourTypeForm({ name: '', description: '' });
                                }}
                            />
                            <Button
                                type="button"
                                label={editingTourType ? "Cập nhật" : "Thêm"}
                                onClick={handleSaveTourType}
                                className="bg-teal-600 hover:bg-teal-700 px-6 py-2 hover:scale-105 transition-all duration-200 shadow-sm"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
}
