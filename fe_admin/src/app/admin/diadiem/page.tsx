"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { TabView, TabPanel } from 'primereact/tabview';
import SearchBar from '@/components/search';
import { useState, useRef } from 'react';
import { Tooltip } from 'primereact/tooltip';
import Dropdown from '@/components/dropdown';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import useRegion from '@/lib/hooks/useRegion';
import useLocations from '@/lib/hooks/useLocations';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import Add from '@/components/add';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { Image } from 'primereact/image';
import { Region, Location, LocationForm } from '@/lib/types';
import { API_URL } from '@/lib/types/url';

export default function Page() {
    const [activeTab, setActiveTab] = useState(0);

    // Reset filters when switching tabs
    const handleTabChange = (e: any) => {
        setActiveTab(e.index);
        // Reset region filter when switching to regions tab
        if (e.index === 0) {
            setSelectedRegion(null);
        }
    };
    const { regions, region, loading: loadingRegion, getAllRegions, getRegionById, createRegion, updateRegion, deleteRegion } = useRegion();
    const { locations, location, loading: loadingLocations, getAllLocations, getLocationsById, createLocations, updateLocations, deleteLocations } = useLocations();
    const [search, setSearch] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isOpenRegion, setIsOpenRegion] = useState(false);
    const [isOpenLocation, setIsOpenLocation] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
    // const [loading, setLoading] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    const toast = useRef<Toast>(null);

    // Form states cho vùng miền
    const [regionForm, setRegionForm] = useState({
        name: '',
        description: ''
    });

    // Form states cho địa điểm
    const [locationForm, setLocationForm] = useState<LocationForm>({
        name: '',
        description: '',
        city: '',
        country: '',
        image: null,
        region_id: null
    });

    // --- Statistics ---
    const totalRegions = regions?.length || 0;
    const totalLocations = locations?.length || 0;
    const locationsByRegion = regions?.map(region => ({
        ...region,
        locationCount: locations?.filter(loc => loc.region_id === region.id).length || 0
    })) || [];

    // --- Lọc dữ liệu ---
    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
    };

    let filteredRegions = regions?.filter(region => {
        const searchTerm = search.toLowerCase().trim();
        if (!searchTerm) return true;
        
        return (
            region.name?.toLowerCase().includes(searchTerm) ||
            (region.description && region.description.toLowerCase().includes(searchTerm))
        );
    }) || [];

    let filteredLocations = locations?.filter(location => {
        const searchTerm = search.toLowerCase().trim();
        const matchesSearch = !searchTerm || (
            location.name?.toLowerCase().includes(searchTerm) ||
            (location.description && location.description.toLowerCase().includes(searchTerm)) ||
            (location.city && location.city.toLowerCase().includes(searchTerm)) ||
            (location.country && location.country.toLowerCase().includes(searchTerm))
        );
        
        const matchesRegion = !selectedRegion || location.region_id === selectedRegion;
        
        return matchesSearch && matchesRegion;
    }) || [];

    // --- Sắp xếp dữ liệu ---
    if (selectedSort) {
        filteredRegions = [...filteredRegions].sort((a, b) => {
            switch (selectedSort) {
                case 'nameAsc':
                    return (a.name || '').localeCompare(b.name || '');
                case 'nameDesc':
                    return (b.name || '').localeCompare(a.name || '');
                case 'dateAsc':
                    return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
                case 'dateDesc':
                    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
                default:
                    return 0;
            }
        });

        filteredLocations = [...filteredLocations].sort((a, b) => {
            switch (selectedSort) {
                case 'nameAsc':
                    return (a.name || '').localeCompare(b.name || '');
                case 'nameDesc':
                    return (b.name || '').localeCompare(a.name || '');
                case 'dateAsc':
                    return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
                case 'dateDesc':
                    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
                case 'cityAsc':
                    return (a.city || '').localeCompare(b.city || '');
                case 'cityDesc':
                    return (b.city || '').localeCompare(a.city || '');
                default:
                    return 0;
            }
        });
    }

    // --- Utility Functions ---
    const handleDeleteRegion = (region: Region) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa vùng miền "${region.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    await deleteRegion(region.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Vùng miền "${region.name}" đã được xóa`,
                        life: 3000
                    });
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể xóa vùng miền',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleDeleteLocation = (location: Location) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa địa điểm "${location.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    await deleteLocations(location.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Địa điểm "${location.name}" đã được xóa`,
                        life: 3000
                    });
                } catch (error: any) {
                    console.error('Delete location error:', error);
                    const errorMessage = error.response?.data?.message || error.message || 'Không thể xóa địa điểm';
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: errorMessage,
                        life: 5000
                    });
                }
            }
        });
    };

    const handleSaveRegion = async () => {
        if (!regionForm.name.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng nhập tên vùng miền',
                life: 3000
            });
            return;
        }

        try {
            if (editingRegion) {
                await updateRegion(editingRegion.id, {
                    ...editingRegion,
                    ...regionForm
                });
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Vùng miền đã được cập nhật',
                    life: 3000
                });
            } else {
                await createRegion({
                    id: 0, // API sẽ tự tạo ID
                    name: regionForm.name,
                    description: regionForm.description,
                    created_at: new Date().toISOString()
                });
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Vùng miền đã được thêm',
                    life: 3000
                });
            }

            setRegionForm({ name: '', description: '' });
            getAllRegions();
            // setEditingRegion(null);
            setIsOpenRegion(false);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể lưu vùng miền',
                life: 3000
            });
        }
    };

    const handleSaveLocation = async () => {
        // Kiểm tra đầy đủ các field bắt buộc
        if (!locationForm.name.trim() || !locationForm.description.trim() ||
            !locationForm.city.trim() || !locationForm.country.trim() || !locationForm.region_id) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng nhập đầy đủ thông tin bắt buộc',
                life: 3000
            });
            return;
        }

        if (!locationForm.image) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng upload ảnh',
                life: 3000
            });
            return;
        }

        try {
            // Tạo FormData để gửi file upload
            const formData = new FormData();
            formData.append('name', locationForm.name.trim());
            formData.append('description', locationForm.description.trim());
            formData.append('city', locationForm.city.trim());
            formData.append('country', locationForm.country.trim());
            formData.append('region_id', locationForm.region_id.toString());

            if (locationForm.image) {
                formData.append('image', locationForm.image);
            }

            if (editingLocation) {
                await updateLocations(editingLocation.id, formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Địa điểm đã được cập nhật',
                    life: 3000
                });
            } else {
                await createLocations(formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Địa điểm đã được thêm',
                    life: 3000
                });
            }

            setLocationForm({ name: '', description: '', city: '', country: '', image: null, region_id: null });
            setUploadedImage(null);
            getAllLocations();
            // setEditingLocation(null);
            setIsOpenLocation(false);
        } catch (error: any) {
            console.error('Save location error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu địa điểm';
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: errorMessage,
                life: 5000
            });
        }
    };

    const handleEditRegion = (region: Region) => {
        setEditingRegion(region);
        setRegionForm({
            name: region.name,
            description: region.description || ''
        });
        setIsOpenRegion(true);
    };

    const handleEditLocation = (location: Location) => {
        setEditingLocation(location);
        setLocationForm({
            name: location.name,
            description: location.description || '',
            city: location.city || '',
            country: location.country || '',
            image: location.image || '',
            region_id: location.region_id || null
        });
        setUploadedImage(location.image ? `${API_URL}${location.image}` : null);
        setIsOpenLocation(true);
    };

    // File upload handlers
    const handleImageUpload = (event: any) => {
        const file = event.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
            setLocationForm(prev => ({ ...prev, image: file }));
        }
    };

    const handleImageRemove = () => {
        // Revoke object URL để tránh memory leak
        if (uploadedImage && uploadedImage.startsWith('blob:')) {
            URL.revokeObjectURL(uploadedImage);
        }
        setUploadedImage(null);
        setLocationForm(prev => ({ ...prev, image: null }));
    };

    // --- Templates cho Vùng miền ---
    const regionNameTemplate = (rowData: any) => (
        <div className="flex flex-col p-3">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 rounded-lg shadow-sm">
                    <i className="pi pi-globe text-blue-600 text-lg"></i>
                </div>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.name || 'N/A'}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 rounded-full inline-block w-fit border border-blue-200">
                <span className="text-xs text-blue-700 font-medium">ID: #{rowData.id || 'N/A'}</span>
            </div>
        </div>
    );

    const regionDescriptionTemplate = (rowData: any) => (
        <div className="max-w-xs p-3">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-l-4 border-gray-400 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-2">
                    <i className="pi pi-file-text text-gray-600 text-xs mt-1"></i>
                    <span className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{rowData.description || 'Không có mô tả'}</span>
                </div>
            </div>
        </div>
    );

    const regionDateTemplate = (rowData: any) => (
        <div className="flex flex-col p-3">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 border-l-4 border-amber-400 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <i className="pi pi-calendar text-amber-600 text-xs"></i>
                    <span className="text-sm font-medium text-gray-900">
                        {rowData.created_at ? new Date(rowData.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <i className="pi pi-clock text-gray-500 text-xs"></i>
                    <span className="text-xs text-gray-500">
                        {rowData.created_at ? new Date(rowData.created_at).toLocaleTimeString('vi-VN') : 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );

    const regionActionTemplate = (rowData: any) => (
        <div className="flex justify-center gap-3 p-3">
            <Tooltip target=".edit-region-btn" content="Chỉnh sửa" position="top" />
            <Tooltip target=".delete-region-btn" content="Xóa vùng miền" position="top" />

            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                size="small"
                className="edit-region-btn border-amber-500 !text-amber-600 hover:!bg-amber-500 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                onClick={() => handleEditRegion(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                size="small"
                className="delete-region-btn border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                onClick={() => handleDeleteRegion(rowData)}
            />
        </div>
    );

    // --- Templates cho Địa điểm ---
    const locationNameTemplate = (rowData: any) => (
        <div className="flex flex-col p-3">
            <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                    <Image 
                        src={rowData.image ? `${API_URL}${rowData.image}` || `${rowData.image}` : "location.png"} 
                        alt="Image" 
                        width="50" 
                        preview 
                        className="rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-100 rounded-full p-1">
                        <i className="pi pi-map-marker text-emerald-600 text-xs"></i>
                    </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.name || 'N/A'}</span>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-1 rounded-full inline-block w-fit border border-emerald-200">
                <span className="text-xs text-emerald-700 font-medium">ID: #{rowData.id || 'N/A'}</span>
            </div>
        </div>
    );

    const locationDescriptionTemplate = (rowData: any) => (
        <div className="max-w-xs p-3">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-l-4 border-gray-400 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-2">
                    <i className="pi pi-file-text text-gray-600 text-xs mt-1"></i>
                    <span className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{rowData.description || 'Không có mô tả'}</span>
                </div>
            </div>
        </div>
    );

    const locationAddressTemplate = (rowData: any) => (
        <div className="flex flex-col p-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border-l-4 border-blue-400 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <i className="pi pi-map-marker text-blue-600 text-xs"></i>
                    <span className="text-sm font-medium text-gray-900">{rowData.city || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <i className="pi pi-flag text-gray-500 text-xs"></i>
                    <span className="text-xs text-gray-500">{rowData.country || 'N/A'}</span>
                </div>
            </div>
        </div>
    );

    const locationRegionTemplate = (rowData: any) => {
        const region = regions?.find(r => r.id === rowData.region_id);
        return (
            <div className="flex justify-center p-3">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border-l-4 border-green-400 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2">
                        <i className="pi pi-globe text-green-600 text-xs"></i>
                        <Chip
                            label={region?.name || 'Không xác định'}
                            className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const locationDateTemplate = (rowData: any) => (
        <div className="flex flex-col p-3">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 border-l-4 border-amber-400 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <i className="pi pi-calendar text-amber-600 text-xs"></i>
                    <span className="text-sm font-medium text-gray-900">
                        {rowData.created_at ? new Date(rowData.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <i className="pi pi-clock text-gray-500 text-xs"></i>
                    <span className="text-xs text-gray-500">
                        {rowData.created_at ? new Date(rowData.created_at).toLocaleTimeString('vi-VN') : 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );

    const locationActionTemplate = (rowData: any) => (
        <div className="flex justify-center gap-3 p-3">
            <Tooltip target=".edit-location-btn" content="Chỉnh sửa" position="top" />
            <Tooltip target=".delete-location-btn" content="Xóa địa điểm" position="top" />

            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                size="small"
                className="edit-location-btn border-amber-500 !text-amber-600 hover:!bg-amber-500 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                onClick={() => handleEditLocation(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                size="small"
                className="delete-location-btn border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                onClick={() => handleDeleteLocation(rowData)}
            />
        </div>
    );

    // --- Header Templates ---
    const regionHeaderTemplate = () => (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-xl shadow-sm">
                        <i className="pi pi-globe text-blue-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Danh sách Vùng miền</h3>
                        <p className="text-sm text-gray-600">Quản lý các vùng miền trong hệ thống</p>
                    </div>
                    <Badge
                        value={filteredRegions.length}
                        severity="success"
                        className="text-lg px-4 py-2 rounded-full"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {selectedRegions.length > 0 && (
                        <Button
                            icon="pi pi-trash"
                            label={`Xóa (${selectedRegions.length})`}
                            outlined
                            severity="danger"
                            className="hover:scale-105 transition-all duration-200 shadow-sm"
                        />
                    )}
                </div>
            </div>
        </div>
    );

    const locationHeaderTemplate = () => (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-100 rounded-xl shadow-sm">
                        <i className="pi pi-map-marker text-emerald-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Danh sách Địa điểm</h3>
                        <p className="text-sm text-gray-600">Quản lý các địa điểm du lịch</p>
                    </div>
                    <Badge
                        value={filteredLocations.length}
                        severity="success"
                        className="text-lg px-4 py-2 rounded-full"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {selectedLocations.length > 0 && (
                        <Button
                            icon="pi pi-trash"
                            label={`Xóa (${selectedLocations.length})`}
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
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        <i className="pi pi-map text-white text-2xl"></i>
                                    </div>
                                    <Title title="Quản lý Địa điểm" note="Quản lý vùng miền và địa điểm du lịch trong hệ thống Huy Vi Vu" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex items-center gap-4">
                                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-globe text-blue-600"></i>
                                            <div className="text-2xl font-bold text-blue-600">{totalRegions}</div>
                                        </div>
                                        <div className="text-sm text-blue-700 font-medium">Vùng miền</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 shadow-sm border border-emerald-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-map-marker text-emerald-600"></i>
                                            <div className="text-2xl font-bold text-emerald-600">{totalLocations}</div>
                                        </div>
                                        <div className="text-sm text-emerald-700 font-medium">Địa điểm</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm border border-purple-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <i className="pi pi-chart-bar text-purple-600"></i>
                                            <div className="text-2xl font-bold text-purple-600">
                                                {locationsByRegion.reduce((sum, region) => sum + region.locationCount, 0)}
                                            </div>
                                        </div>
                                        <div className="text-sm text-purple-700 font-medium">Tổng địa điểm</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl my-6 shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-lg shadow-sm">
                                    <i className="pi pi-filter text-blue-600 text-lg"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Bộ lọc và Tìm kiếm</h3>
                                    <p className="text-sm text-gray-600">Tìm kiếm và lọc theo tiêu chí</p>
                                </div>
                            </div>
                            {(search || selectedRegion || selectedSort) && (
                                <Button
                                    icon="pi pi-filter-slash"
                                    label="Xóa bộ lọc"
                                    outlined
                                    size="small"
                                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 hover:scale-105"
                                    onClick={() => {
                                        setSearch('');
                                        setSelectedRegion(null);
                                        setSelectedSort(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Search Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <i className="pi pi-search text-blue-600"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
                            </div>
                            <div className="relative">
                                <SearchBar
                                    onSearch={handleSearch}
                                    placeholder="Tìm kiếm theo tên vùng miền, địa điểm, mô tả, thành phố, quốc gia..."
                                />
                            </div>
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Region Filter - Only show for locations tab */}
                            {activeTab === 1 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <i className="pi pi-globe text-green-600"></i>
                                        </div>
                                        <label className="text-sm font-semibold text-gray-700">Lọc theo Vùng miền</label>
                                    </div>
                                    <div className="relative">
                                        <Dropdown
                                            options={regions?.map(r => ({ label: r.name || 'N/A', value: r.id })) || []}
                                            onChange={setSelectedRegion}
                                            placeholder={regions?.length === 0 ? "Không có vùng miền nào" : "Chọn vùng miền"}
                                            defaultValue={null}
                                        />
                                    </div>
                                </div>
                            )}

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
                                            { label: 'Tên Z-A', value: 'nameDesc' },
                                            { label: 'Ngày tạo mới nhất', value: 'dateDesc' },
                                            { label: 'Ngày tạo cũ nhất', value: 'dateAsc' },
                                            ...(activeTab === 1 ? [
                                                { label: 'Thành phố A-Z', value: 'cityAsc' },
                                                { label: 'Thành phố Z-A', value: 'cityDesc' }
                                            ] : [])
                                        ]}
                                        onChange={setSelectedSort}
                                        placeholder="Chọn cách sắp xếp"
                                        defaultValue={null}
                                    />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <i className="pi pi-chart-bar text-purple-600"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Thống kê nhanh</label>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                                    <div className="text-xs text-purple-700 mb-1">
                                        {activeTab === 0 ? 'Vùng miền' : 'Địa điểm'} hiển thị:
                                    </div>
                                    <div className="text-lg font-bold text-purple-800">
                                        {activeTab === 0 ? filteredRegions.length : filteredLocations.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(search || selectedRegion || selectedSort) && (
                            <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <i className="pi pi-info-circle text-blue-600"></i>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-800">Bộ lọc đang áp dụng:</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {search && (
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-search text-xs"></i>
                                            <span>Tìm kiếm: "{search}"</span>
                                            <span className="text-xs text-blue-600">(tên, mô tả, thành phố)</span>
                                            <button
                                                onClick={() => setSearch('')}
                                                className="ml-1 hover:text-blue-600 hover:bg-blue-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedRegion && (
                                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-globe text-xs"></i>
                                            <span>Vùng miền: {regions?.find(r => r.id === selectedRegion)?.name}</span>
                                            <button
                                                onClick={() => setSelectedRegion(null)}
                                                className="ml-1 hover:text-green-600 hover:bg-green-200 rounded-full p-1 transition-all duration-200"
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
                                                selectedSort === 'nameDesc' ? 'Tên Z-A' :
                                                selectedSort === 'dateDesc' ? 'Ngày tạo mới nhất' :
                                                selectedSort === 'dateAsc' ? 'Ngày tạo cũ nhất' :
                                                selectedSort === 'cityAsc' ? 'Thành phố A-Z' :
                                                selectedSort === 'cityDesc' ? 'Thành phố Z-A' : selectedSort
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

            {/* Tab View */}
            <div className="bg-white rounded-xl shadow-sm border border-[#0f766e] overflow-hidden">
                <TabView activeIndex={activeTab} onTabChange={handleTabChange}>
                    <TabPanel header={
                        <div className="flex items-center gap-2">
                            <i className="pi pi-globe"></i>
                            <span>Vùng miền</span>
                            <Badge value={filteredRegions.length} severity="info" />
                        </div>
                    }>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Quản lý Vùng miền</h3>
                                <Add
                                    label="Thêm Vùng miền"
                                    onClick={() => {
                                        setEditingRegion(null);
                                        setRegionForm({ name: '', description: '' });
                                        setIsOpenRegion(true);
                                    }}
                                />
                            </div>

                            <DataTable
                                value={filteredRegions}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                stripedRows
                                showGridlines
                                className="text-sm"
                                tableStyle={{ minWidth: '100%' }}
                                emptyMessage={
                                    <div className="text-center py-12">
                                        <i className="pi pi-globe text-4xl text-gray-400 mb-4"></i>
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy vùng miền nào</h3>
                                        <p className="text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                    </div>
                                }
                                paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                                currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} vùng miền"
                                header={regionHeaderTemplate}
                                selection={selectedRegions}
                                onSelectionChange={(e: any) => setSelectedRegions(e.value)}
                                selectionMode="multiple"
                                dataKey={(rowData) => rowData.id || `region-${rowData.name || 'unknown'}`}
                                loading={loadingRegion}
                                sortField="created_at"
                                sortOrder={-1}
                                removableSort
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                <Column
                                    field="name"
                                    header="Tên vùng miền"
                                    body={regionNameTemplate}
                                    sortable
                                    style={{ width: '25%' }}
                                />
                                <Column
                                    field="description"
                                    header="Mô tả"
                                    body={regionDescriptionTemplate}
                                    style={{ width: '40%' }}
                                />
                                <Column
                                    field="created_at"
                                    header="Ngày tạo"
                                    body={regionDateTemplate}
                                    sortable
                                    style={{ width: '20%' }}
                                />
                                <Column
                                    header="Thao tác"
                                    body={regionActionTemplate}
                                    style={{ textAlign: 'center', width: '15%' }}
                                    frozen
                                    alignFrozen="right"
                                />
                            </DataTable>
                        </div>
                    </TabPanel>

                    {/* Tab Địa điểm */}
                    <TabPanel header={
                        <div className="flex items-center gap-2">
                            <i className="pi pi-map-marker"></i>
                            <span>Địa điểm</span>
                            <Badge value={filteredLocations.length} severity="info" />
                        </div>
                    }>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Quản lý Địa điểm</h3>
                                <Add
                                    label="Thêm Địa điểm"
                                    onClick={() => {
                                        setEditingLocation(null);
                                        setLocationForm({ name: '', description: '', city: '', country: '', image: null, region_id: null });
                                        setUploadedImage(null);
                                        setIsOpenLocation(true);
                                    }}
                                />
                            </div>

                            <DataTable
                                value={filteredLocations}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                stripedRows
                                showGridlines
                                className="text-sm"
                                tableStyle={{ minWidth: '100%' }}
                                emptyMessage={
                                    <div className="text-center py-12">
                                        <i className="pi pi-map-marker text-4xl text-gray-400 mb-4"></i>
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy địa điểm nào</h3>
                                        <p className="text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                    </div>
                                }
                                paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                                currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} địa điểm"
                                header={locationHeaderTemplate}
                                selection={selectedLocations}
                                onSelectionChange={(e: any) => setSelectedLocations(e.value)}
                                selectionMode="multiple"
                                dataKey={(rowData) => rowData.id || `location-${rowData.name || 'unknown'}`}
                                loading={loadingLocations}
                                sortField="created_at"
                                sortOrder={-1}
                                removableSort
                            >
                                <Column
                                    field="name"
                                    header="Địa điểm"
                                    body={locationNameTemplate}
                                    sortable
                                    style={{ width: '25%' }}
                                />
                                <Column
                                    field="description"
                                    header="Mô tả"
                                    body={locationDescriptionTemplate}
                                    style={{ width: '25%' }}
                                />
                                <Column
                                    field="city"
                                    header="Địa chỉ"
                                    body={locationAddressTemplate}
                                    style={{ width: '15%' }}
                                />
                                <Column
                                    field="region_id"
                                    header="Vùng miền"
                                    body={locationRegionTemplate}
                                    style={{ width: '15%' }}
                                />
                                <Column
                                    field="created_at"
                                    header="Ngày tạo"
                                    body={locationDateTemplate}
                                    sortable
                                    style={{ width: '15%' }}
                                />
                                <Column
                                    header="Thao tác"
                                    body={locationActionTemplate}
                                    style={{ textAlign: 'center', width: '10%' }}
                                    frozen
                                    alignFrozen="right"
                                />
                            </DataTable>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
            <Dialog
                visible={isOpenRegion}
                header={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <i className="pi pi-globe text-blue-600 text-lg"></i>
                        </div>
                        <span className="text-lg font-semibold text-gray-800">
                            {editingRegion ? "Chỉnh sửa Vùng miền" : "Thêm Vùng miền Mới"}
                        </span>
                    </div>
                }
                modal
                className="w-11/12 max-w-3xl"
                onHide={() => {
                    setIsOpenRegion(false);
                    setEditingRegion(null);
                    setRegionForm({ name: '', description: '' });
                }}
            >
                <div className="p-8">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i className="pi pi-globe text-blue-600"></i>
                                    Tên vùng miền *
                                </label>
                                <div className="relative">
                                    <InputText
                                        value={regionForm.name}
                                        onChange={(e) => setRegionForm({ ...regionForm, name: e.target.value })}
                                        placeholder="Nhập tên vùng miền"
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
                                        value={regionForm.description}
                                        onChange={(e) => setRegionForm({ ...regionForm, description: e.target.value })}
                                        placeholder="Nhập mô tả vùng miền"
                                        rows={5}
                                        className="w-full"
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
                                setIsOpenRegion(false);
                                setEditingRegion(null);
                                setRegionForm({ name: '', description: '' });
                            }}
                        />
                        <Button
                            type="button"
                            label={editingRegion ? "Cập nhật" : "Thêm"}
                            onClick={handleSaveRegion}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 hover:scale-105 transition-all duration-200 shadow-sm"
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog
                visible={isOpenLocation}
                header={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <i className="pi pi-map-marker text-emerald-600 text-lg"></i>
                        </div>
                        <span className="text-lg font-semibold text-gray-800">
                            {editingLocation ? "Chỉnh sửa Địa điểm" : "Thêm Địa điểm Mới"}
                        </span>
                    </div>
                }
                modal
                className="w-11/12 max-w-4xl"
                onHide={() => {
                    setIsOpenLocation(false);
                    setEditingLocation(null);
                    setLocationForm({ name: '', description: '', city: '', country: '', image: null, region_id: null });
                    setUploadedImage(null);
                }}
            >
                <div className="p-8">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i className="pi pi-map-marker text-emerald-600"></i>
                                    Tên địa điểm *
                                </label>
                                <div className="relative">
                                    <InputText
                                        value={locationForm.name}
                                        onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                                        placeholder="Nhập tên địa điểm"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i className="pi pi-globe text-blue-600"></i>
                                    Vùng miền *
                                </label>
                                <div className="relative">
                                    <Dropdown
                                        options={regions?.map(r => ({ label: r.name || 'N/A', value: r.id })) || []}
                                        onChange={(value) => setLocationForm({ ...locationForm, region_id: value })}
                                        placeholder="Chọn vùng miền"
                                        defaultValue={locationForm.region_id}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i className="pi pi-building text-gray-600"></i>
                                    Thành phố
                                </label>
                                <div className="relative">
                                    <InputText
                                        value={locationForm.city}
                                        onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                                        placeholder="Nhập thành phố"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i className="pi pi-flag text-gray-600"></i>
                                    Quốc gia
                                </label>
                                <div className="relative">
                                    <InputText
                                        value={locationForm.country}
                                        onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                                        placeholder="Nhập quốc gia"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i className="pi pi-image text-purple-600"></i>
                                    Hình ảnh *
                                </label>

                                {/* Image Preview */}
                                {uploadedImage && (
                                    <div className="mb-4">
                                        <div className="relative inline-block">
                                            <img
                                                src={`${uploadedImage}`}
                                                alt="Preview"
                                                className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleImageRemove}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 hover:scale-110"
                                            >
                                                <i className="pi pi-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <FileUpload 
                                    name="image" 
                                    accept="image/*" 
                                    maxFileSize={5000000}
                                    customUpload={true}
                                    uploadHandler={handleImageUpload}
                                    chooseLabel="Chọn ảnh"
                                    className="w-full" 
                                    emptyTemplate={
                                        <div className="text-center py-8 text-gray-500">
                                            <i className="pi pi-upload text-2xl mb-2"></i>
                                            <p className="m-0">Kéo thả ảnh vào đây hoặc click để chọn</p>
                                        </div>
                                    } 
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <i className="pi pi-file-text text-gray-600"></i>
                                    Mô tả *
                                </label>
                                <div className="relative">
                                    <InputTextarea
                                        value={locationForm.description}
                                        onChange={(e) => setLocationForm({ ...locationForm, description: e.target.value })}
                                        placeholder="Nhập mô tả địa điểm"
                                        rows={5}
                                        className="w-full"
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
                                setIsOpenLocation(false);
                                setEditingLocation(null);
                                setLocationForm({ name: '', description: '', city: '', country: '', image: null, region_id: null });
                                setUploadedImage(null);
                            }}
                        />
                        <Button
                            type="button"
                            label={editingLocation ? "Cập nhật" : "Thêm"}
                            onClick={handleSaveLocation}
                            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 hover:scale-105 transition-all duration-200 shadow-sm"
                        />
                    </div>
                </div>
            </Dialog>
            </div>
        </>
    );
};
