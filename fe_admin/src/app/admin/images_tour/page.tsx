"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { TabView, TabPanel } from 'primereact/tabview';
import SearchBar from '@/components/search';
import { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'primereact/tooltip';
import Dropdown from '@/components/dropdown';
import { Dropdown as PrimeDropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useImageTours } from '@/lib/hooks/useImageTours';
import { useTours } from '@/lib/hooks/useTour';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import Add from '@/components/add';
import { ImageTour } from '@/lib/types';
import { API_URL } from '@/lib/types/url';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

export default function Page() {
    const { imageTours, loading, getAllImageTours, createImageTour, updateImageTour, deleteImageTour, createMultipleImageTour } = useImageTours();
    const { tours, loading: toursLoading } = useTours();

    // State management
    const [search, setSearch] = useState('');
    const [selectedTour, setSelectedTour] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<ImageTour[]>([]);
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [editingImage, setEditingImage] = useState<ImageTour | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [isMultipleUpload, setIsMultipleUpload] = useState(false);
    const [showDeleteByTourDialog, setShowDeleteByTourDialog] = useState(false);
    const [selectedTourForDelete, setSelectedTourForDelete] = useState<string | null>(null);

    // Advanced search states
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [searchField, setSearchField] = useState('all');
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    // Form state
    const [imageForm, setImageForm] = useState<Partial<ImageTour>>({
        tour_id: null,
        image: null
    });

    // Use real tours data from API
    const availableTours = tours || [];

    const toast = useRef<Toast>(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) {
                    searchInput.focus();
                }
            }
            if (e.key === 'Escape') {
                clearAllFilters();
            }
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                setAdvancedSearch(!advancedSearch);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [advancedSearch]);

    // --- Statistics ---
    const totalImages = imageTours?.length || 0;
    const imagesByTour = availableTours.map(tour => ({
        ...tour,
        count: imageTours?.filter((img: ImageTour) => img.tour_id === tour.id).length || 0
    }));
    const totalSize = 0; // Calculate total file size if needed

    // --- Filter data ---
    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
        if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim())) {
            setSearchHistory(prev => [searchTerm.trim(), ...prev.slice(0, 4)]);
        }
    };

    const handleAdvancedSearch = () => {
        setAdvancedSearch(!advancedSearch);
    };

    const clearAllFilters = () => {
        setSearch('');
        setSelectedTour(null);
        setSelectedSort(null);
        setSearchField('all');
        setDateRange(null);
    };

    let filteredImages = imageTours?.filter((imageTour: ImageTour) => {
        const searchTerm = search.toLowerCase().trim();

        let matchesSearch = !searchTerm;
        if (searchTerm) {
            if (searchField === 'all') {
                matchesSearch = (
                    imageTour.tour_id?.toString().includes(searchTerm) ||
                    (availableTours.find(t => t.id === imageTour.tour_id)?.name?.toLowerCase().includes(searchTerm) ?? false)
                );
            } else if (searchField === 'tour_id') {
                matchesSearch = imageTour.tour_id?.toString().includes(searchTerm) || false;
            } else if (searchField === 'tour_name') {
                matchesSearch = (availableTours.find(t => t.id === imageTour.tour_id)?.name?.toLowerCase().includes(searchTerm)) ?? false;
            }
        }

        const matchesTour = !selectedTour || imageTour.tour_id?.toString() === selectedTour;

        let matchesDateRange = true;
        if (dateRange && dateRange.length === 2 && imageTour.created_at) {
            try {
                const imageDate = new Date(imageTour.created_at);
                if (!isNaN(imageDate.getTime())) {
                    matchesDateRange = imageDate >= dateRange[0] && imageDate <= dateRange[1];
                }
            } catch (error) {
                matchesDateRange = true; // Nếu có lỗi, hiển thị tất cả
            }
        }

        return matchesSearch && matchesTour && matchesDateRange;
    }) || [];

    // --- Sort data ---
    if (selectedSort) {
        filteredImages = [...filteredImages].sort((a, b) => {
            switch (selectedSort) {
                case 'tourAsc':
                    const tourA = availableTours.find(t => t.id === a.tour_id)?.name || '';
                    const tourB = availableTours.find(t => t.id === b.tour_id)?.name || '';
                    return tourA.localeCompare(tourB);
                case 'tourDesc':
                    const tourA2 = availableTours.find(t => t.id === a.tour_id)?.name || '';
                    const tourB2 = availableTours.find(t => t.id === b.tour_id)?.name || '';
                    return tourB2.localeCompare(tourA2);
                case 'dateDesc':
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    return dateB - dateA;
                case 'dateAsc':
                    const dateA2 = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB2 = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateA2 - dateB2;
                default:
                    return 0;
            }
        });
    }

    // --- CRUD Operations ---
    const handleSaveImage = async () => {
        if (!imageForm.tour_id) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng chọn tour',
                life: 3000
            });
            return;
        }

        if (!uploadedImage && !editingImage) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng chọn hình ảnh',
                life: 3000
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('tour_id', imageForm.tour_id.toString());

            if (uploadedImage) {
                formData.append('image', uploadedImage as any);
            }

            if (editingImage) {
                await updateImageTour(editingImage.id, formData as any);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật hình ảnh thành công',
                    life: 3000
                });
            } else {
                await createImageTour(formData as any);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thêm hình ảnh thành công',
                    life: 3000
                });
            }

            await getAllImageTours();
            resetForm();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message || 'Có lỗi xảy ra',
                life: 3000
            });
        }
    };

    const handleEditImage = (imageTour: ImageTour) => {
        console.log('Editing image:', imageTour);
        console.log('Image URL will be:', `${API_URL}/${imageTour.image}`);
        setEditingImage(imageTour);
        setImageForm({
            tour_id: imageTour.tour_id,
            image: imageTour.image
        });
        setUploadedImage(null);
        setIsOpenImage(true);
    };

    const handleDeleteImage = async (imageTour: ImageTour) => {
        try {
            await deleteImageTour(imageTour.id);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Xóa hình ảnh thành công',
                life: 3000
            });
            await getAllImageTours();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message || 'Có lỗi xảy ra',
                life: 3000
            });
        }
    };

    const handleBulkDelete = async () => {
        if (selectedImages.length === 0) return;

        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa ${selectedImages.length} hình ảnh đã chọn?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    for (const image of selectedImages) {
                        await deleteImageTour(image.id);
                    }
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Đã xóa ${selectedImages.length} hình ảnh`,
                        life: 3000
                    });
                    setSelectedImages([]);
                    await getAllImageTours();
                } catch (error: any) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: error.message || 'Có lỗi xảy ra',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleDeleteByTour = async () => {
        if (!selectedTourForDelete) return;

        try {
            // Lấy tất cả ảnh của tour được chọn
            const imagesToDelete = imageTours.filter(img => img.tour_id === parseInt(selectedTourForDelete));

            if (imagesToDelete.length === 0) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: 'Không có ảnh nào để xóa cho tour này',
                    life: 3000
                });
                return;
            }

            // Xóa từng ảnh
            for (const image of imagesToDelete) {
                await deleteImageTour(image.id);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: `Đã xóa ${imagesToDelete.length} hình ảnh của tour`,
                life: 3000
            });

            setShowDeleteByTourDialog(false);
            setSelectedTourForDelete(null);
            await getAllImageTours();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message || 'Có lỗi xảy ra khi xóa ảnh theo tour',
                life: 3000
            });
        }
    };

    const onMultipleImageUpload = (event: any) => {
        const files = Array.from(event.files) as File[];
        setUploadedImages(files);
    };

    const handleSaveMultipleImages = async () => {
        if (!imageForm.tour_id || uploadedImages.length === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Vui lòng chọn tour và ít nhất một ảnh',
                life: 3000
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('tour_id', imageForm.tour_id.toString());

            uploadedImages.forEach((file, index) => {
                formData.append('images', file);
            });

            await createMultipleImageTour(formData as any);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: `Đã thêm ${uploadedImages.length} hình ảnh thành công`,
                life: 3000
            });

            await getAllImageTours();
            resetForm();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message || 'Có lỗi xảy ra',
                life: 3000
            });
        }
    };

    const resetForm = () => {
        setImageForm({
            tour_id: null,
            image: null
        });
        setEditingImage(null);
        setUploadedImage(null);
        setUploadedImages([]);
        setIsMultipleUpload(false);
        setIsOpenImage(false);
    };

    const onImageUpload = (event: any) => {
        const file = event.files[0];
        if (file) {
            setUploadedImage(file);
        }
    };

    // --- Templates ---
    const imageTemplate = (imageTour: ImageTour) => (
        <div key={imageTour.id} className="flex items-center gap-3 p-2">
            <div className="relative">
                <Image
                    src={imageTour.image ? `${API_URL}${imageTour.image}` : '/placeholder-image.png'}
                    alt="Tour Image"
                    width="60"
                    height="60"
                    className="rounded-lg object-cover border border-gray-200"
                    preview
                />
                <div className="absolute -top-1 -right-1">
                    <Badge value={imageTour.id} severity="info" />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                    Hình ảnh #{imageTour.id}
                </div>
                <div className="text-xs text-gray-500">
                    {imageTour.image ? 'Có hình ảnh' : 'Không có hình ảnh'}
                </div>
            </div>
        </div>
    );

    const tourTemplate = (imageTour: ImageTour) => (
        <div key={imageTour.id} className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
                <i className="pi pi-map text-blue-600 text-xs"></i>
            </div>
            <div>
                <div className="text-sm font-medium text-gray-900">
                    {availableTours.find(t => t.id === imageTour.tour_id)?.name || `Tour #${imageTour.tour_id}`}
                </div>
                <div className="text-xs text-gray-500">
                    ID: {imageTour.tour_id}
                </div>
            </div>
        </div>
    );

    const dateTemplate = (imageTour: ImageTour) => {
        const formatDate = (dateString: string | null | undefined) => {
            if (!dateString) return 'N/A';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return 'N/A';
                return date.toLocaleDateString('vi-VN');
            } catch (error) {
                return 'N/A';
            }
        };

        const formatTime = (dateString: string | null | undefined) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return '';
                return date.toLocaleTimeString('vi-VN');
            } catch (error) {
                return '';
            }
        };

        return (
            <div key={imageTour.id} className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                    <i className="pi pi-calendar text-green-600 text-xs"></i>
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {formatDate(imageTour.created_at)}
                    </div>
                    <div className="text-xs text-gray-500">
                        {formatTime(imageTour.created_at)}
                    </div>
                </div>
            </div>
        );
    };

    const actionTemplate = (imageTour: ImageTour) => (
        <div key={imageTour.id} className="flex items-center gap-2">
            <Tooltip target=".edit-btn" content="Chỉnh sửa" position="top" />
            <Button
                icon="pi pi-pencil"
                size="small"
                outlined
                className="edit-btn text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 hover:scale-105"
                onClick={() => handleEditImage(imageTour)}
            />
            <Tooltip target=".delete-btn" content="Xóa" position="top" />
            <Button
                icon="pi pi-trash"
                size="small"
                outlined
                className="delete-btn text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 hover:scale-105"
                onClick={() => {
                    confirmDialog({
                        message: 'Bạn có chắc chắn muốn xóa hình ảnh này?',
                        header: 'Xác nhận xóa',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => handleDeleteImage(imageTour)
                    });
                }}
            />
        </div>
    );

    const headerTemplate = (
        <div className="flex items-center justify-between  bg-gradient-to-r from-teal-50 to-teal-100 border-b border-teal-200">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                    <i className="pi pi-images text-teal-600 text-lg"></i>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-teal-800">Quản lý Hình ảnh Tour</h3>
                    <p className="text-sm text-teal-600">Quản lý hình ảnh cho các tour du lịch</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    icon="pi pi-images"
                    label="Upload nhiều ảnh"
                    severity="info"
                    outlined
                    size="small"
                    onClick={() => {
                        setIsMultipleUpload(true);
                        setIsOpenImage(true);
                    }}
                    className="hover:scale-105 transition-all duration-200"
                />
                {selectedImages.length > 0 && (
                    <Button
                        icon="pi pi-trash"
                        label={`Xóa ${selectedImages.length} mục`}
                        severity="danger"
                        outlined
                        size="small"
                        onClick={handleBulkDelete}
                        className="hover:scale-105 transition-all duration-200"
                    />
                )}
                <Button
                    icon="pi pi-trash"
                    label="Xóa theo tour"
                    severity="danger"
                    outlined
                    size="small"
                    onClick={() => setShowDeleteByTourDialog(true)}
                    className="hover:scale-105 transition-all duration-200"
                />
                {(search || selectedTour || selectedSort || dateRange) && (
                    <Button
                        icon="pi pi-filter-slash"
                        label="Xóa bộ lọc"
                        outlined
                        size="small"
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 hover:scale-105"
                        onClick={clearAllFilters}
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full h-full py-6 admin-page-container">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="w-full px-4 space-y-6">
                {/* Header */}
                <Title title="Quản lý Hình ảnh Tour" note="Quản lý hình ảnh cho các tour du lịch" />

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Tổng hình ảnh</p>
                                <p className="text-2xl font-bold">{totalImages}</p>
                            </div>
                            <div className="p-3 bg-blue-400 rounded-lg">
                                <i className="pi pi-images text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Tổng tour</p>
                                <p className="text-2xl font-bold">{availableTours.length}</p>
                            </div>
                            <div className="p-3 bg-green-400 rounded-lg">
                                <i className="pi pi-map text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Tour có hình ảnh</p>
                                <p className="text-2xl font-bold">{imagesByTour.filter(t => t.count > 0).length}</p>
                            </div>
                            <div className="p-3 bg-purple-400 rounded-lg">
                                <i className="pi pi-check-circle text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Tour chưa có hình</p>
                                <p className="text-2xl font-bold">{imagesByTour.filter(t => t.count === 0).length}</p>
                            </div>
                            <div className="p-3 bg-orange-400 rounded-lg">
                                <i className="pi pi-exclamation-triangle text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm border border-[#0f766e] overflow-hidden">
                    {headerTemplate}

                    {/* Content */}
                    <div className="p-4">
                        {/* Search Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <i className="pi pi-search text-blue-600 text-sm"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        icon={advancedSearch ? "pi pi-angle-up" : "pi pi-angle-down"}
                                        label={advancedSearch ? "Tìm kiếm cơ bản" : "Tìm kiếm nâng cao"}
                                        outlined
                                        size="small"
                                        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
                                        onClick={handleAdvancedSearch}
                                    />
                                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                        ⌘⇧F
                                    </div>
                                </div>
                            </div>

                            {/* Basic Search */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <SearchBar
                                        onSearch={handleSearch}
                                        placeholder="Tìm kiếm theo tour, ID..."
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-white px-1 rounded">
                                        ⌘K
                                    </div>
                                </div>

                                {/* Search Field Selector */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <i className="pi pi-filter text-gray-500 text-xs"></i>
                                        <span className="text-xs text-gray-600">Tìm trong:</span>
                                    </div>
                                    <Dropdown
                                        options={[
                                            { label: 'Tất cả trường', value: 'all' },
                                            { label: 'ID Tour', value: 'tour_id' },
                                            { label: 'Tên Tour', value: 'tour_name' }
                                        ]}
                                        onChange={setSearchField}
                                        placeholder="Chọn trường tìm kiếm"
                                        defaultValue={searchField}
                                    />
                                </div>

                                {/* Search History */}
                                {searchHistory.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <i className="pi pi-history text-gray-500 text-xs"></i>
                                            <span className="text-xs text-gray-600">Tìm kiếm gần đây:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {searchHistory.map((term, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSearch(term)}
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors duration-200"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Advanced Search */}
                            {advancedSearch && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 space-y-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="pi pi-cog text-blue-600 text-sm"></i>
                                        <span className="text-sm font-semibold text-blue-800">Tìm kiếm nâng cao</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Date Range Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-600">Khoảng thời gian tạo:</label>
                                            <Calendar
                                                value={dateRange}
                                                onChange={(e) => setDateRange(e.value as Date[])}
                                                selectionMode="range"
                                                readOnlyInput
                                                placeholder="Chọn khoảng thời gian"
                                                className="w-full"
                                                showIcon
                                            />
                                        </div>

                                        {/* Tour Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-600">Lọc theo Tour:</label>
                                            <Dropdown
                                                options={[
                                                    { label: 'Tất cả tour', value: null },
                                                    ...availableTours.map(tour => ({
                                                        label: tour.name,
                                                        value: tour.id.toString()
                                                    }))
                                                ]}
                                                onChange={setSelectedTour}
                                                placeholder={toursLoading ? "Đang tải..." : "Chọn tour"}
                                                defaultValue={selectedTour}
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Filter Buttons */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-600">Bộ lọc nhanh:</label>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                label="Hình ảnh mới (7 ngày)"
                                                size="small"
                                                outlined
                                                className="text-green-600 border-green-300 hover:bg-green-50"
                                                onClick={() => {
                                                    const today = new Date();
                                                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                                    setDateRange([weekAgo, today]);
                                                }}
                                            />
                                            <Button
                                                label="Tour có nhiều hình ảnh"
                                                size="small"
                                                outlined
                                                className="text-purple-600 border-purple-300 hover:bg-purple-50"
                                                onClick={() => {
                                                    const tourWithMostImages = imagesByTour.reduce((prev, current) =>
                                                        (prev.count > current.count) ? prev : current
                                                    );
                                                    setSelectedTour(tourWithMostImages.id.toString());
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Keyboard Shortcuts Help */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <i className="pi pi-keyboard text-gray-500 text-sm"></i>
                                <span className="text-xs font-semibold text-gray-600">Phím tắt:</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">⌘K</kbd>
                                    <span>Focus tìm kiếm</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">⌘⇧F</kbd>
                                    <span>Toggle tìm kiếm nâng cao</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd>
                                    <span>Xóa tất cả bộ lọc</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(search || selectedTour || selectedSort || dateRange) && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <i className="pi pi-info-circle text-blue-600 text-sm"></i>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-800">Bộ lọc đang áp dụng:</span>
                                    </div>
                                    <Button
                                        icon="pi pi-times"
                                        label="Xóa tất cả"
                                        outlined
                                        size="small"
                                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                                        onClick={clearAllFilters}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {search && (
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-search text-xs"></i>
                                            <span>Tìm kiếm: "{search}" ({searchField === 'all' ? 'Tất cả trường' :
                                                searchField === 'tour_id' ? 'ID Tour' : 'Tên Tour'})</span>
                                            <button
                                                onClick={() => setSearch('')}
                                                className="ml-1 hover:text-blue-600 hover:bg-blue-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedTour && (
                                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-map text-xs"></i>
                                            <span>Tour: {availableTours.find(t => t.id.toString() === selectedTour)?.name}</span>
                                            <button
                                                onClick={() => setSelectedTour(null)}
                                                className="ml-1 hover:text-green-600 hover:bg-green-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {dateRange && dateRange.length === 2 && (
                                        <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-calendar text-xs"></i>
                                            <span>Thời gian: {dateRange[0].toLocaleDateString('vi-VN')} - {dateRange[1].toLocaleDateString('vi-VN')}</span>
                                            <button
                                                onClick={() => setDateRange(null)}
                                                className="ml-1 hover:text-purple-600 hover:bg-purple-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedSort && (
                                        <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-sort text-xs"></i>
                                            <span>Sắp xếp: {
                                                selectedSort === 'tourAsc' ? 'Tour A-Z' :
                                                    selectedSort === 'tourDesc' ? 'Tour Z-A' :
                                                        selectedSort === 'dateDesc' ? 'Ngày tạo mới nhất' :
                                                            selectedSort === 'dateAsc' ? 'Ngày tạo cũ nhất' : selectedSort
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

                                {/* Filter Summary */}
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                    <div className="flex items-center justify-between text-xs text-blue-700">
                                        <span>Kết quả: <strong>{filteredImages.length}</strong> hình ảnh</span>
                                        <span>Tổng: <strong>{imageTours?.length || 0}</strong> hình ảnh</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {/* Tour Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-green-100 rounded-lg">
                                        <i className="pi pi-map text-green-600 text-sm"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Lọc theo Tour</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={[
                                            { label: 'Tất cả tour', value: null },
                                            ...availableTours.map(tour => ({
                                                label: tour.name,
                                                value: tour.id.toString()
                                            }))
                                        ]}
                                        onChange={setSelectedTour}
                                        placeholder={toursLoading ? "Đang tải..." : "Chọn tour"}
                                        defaultValue={selectedTour}
                                    />
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-100 rounded-lg">
                                        <i className="pi pi-sort text-amber-600 text-sm"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Sắp xếp</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={[
                                            { label: 'Tour A-Z', value: 'tourAsc' },
                                            { label: 'Tour Z-A', value: 'tourDesc' },
                                            { label: 'Ngày tạo mới nhất', value: 'dateDesc' },
                                            { label: 'Ngày tạo cũ nhất', value: 'dateAsc' }
                                        ]}
                                        onChange={setSelectedSort}
                                        placeholder="Chọn cách sắp xếp"
                                        defaultValue={selectedSort}
                                    />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-100 rounded-lg">
                                        <i className="pi pi-chart-bar text-purple-600 text-sm"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Thống kê nhanh</label>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                                    <div className="text-xs text-purple-700 mb-1">Hình ảnh hiển thị:</div>
                                    <div className="text-base font-bold text-purple-800">{filteredImages.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[#0f766e] overflow-hidden">
                    <DataTable
                        value={filteredImages}
                        paginator
                        rows={8}
                        rowsPerPageOptions={[5, 8, 15, 25]}
                        stripedRows
                        showGridlines
                        className="text-sm"
                        tableStyle={{ minWidth: '100%' }}
                        emptyMessage={
                            <div className="text-center py-8">
                                <i className="pi pi-images text-3xl text-gray-400 mb-3"></i>
                                <h3 className="text-base font-semibold text-gray-600 mb-2">Không tìm thấy hình ảnh nào</h3>
                                <p className="text-sm text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                            </div>
                        }
                        paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                        currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} hình ảnh"
                        header={headerTemplate}
                        selection={selectedImages}
                        onSelectionChange={(e: any) => setSelectedImages(e.value)}
                        selectionMode="multiple"
                        dataKey="id"
                        loading={loading}
                        sortField="created_at"
                        sortOrder={-1}
                        removableSort
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        <Column
                            field="image"
                            header="Hình ảnh"
                            body={imageTemplate}
                            style={{ width: '30%' }}
                        />
                        <Column
                            field="tour_id"
                            header="Tour"
                            body={tourTemplate}
                            sortable
                            style={{ width: '25%' }}
                        />
                        <Column
                            field="created_at"
                            header="Ngày tạo"
                            body={dateTemplate}
                            sortable
                            style={{ width: '20%' }}
                        />
                        <Column
                            header="Thao tác"
                            body={actionTemplate}
                            style={{ textAlign: 'center', width: '15%' }}
                            frozen
                            alignFrozen="right"
                        />
                    </DataTable>
                </div>

                {/* Image Form Dialog */}
                <Dialog
                    visible={isOpenImage}
                    header={
                        <div className="flex items-center gap-2">
                            <i className="pi pi-images text-teal-600"></i>
                            <span className="text-teal-800 font-semibold">
                                {editingImage ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh mới'}
                            </span>
                        </div>
                    }
                    onHide={resetForm}
                    style={{ width: '500px' }}
                    className="p-fluid"
                >
                    <div className="space-y-4">
                        {/* Tour Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <i className="pi pi-map-marker text-gray-600"></i>
                                Tour *
                            </label>
                            <Dropdown
                                options={availableTours.map(tour => ({
                                    label: tour.name,
                                    value: tour.id
                                }))}
                                onChange={(tourId) => setImageForm({ ...imageForm, tour_id: tourId })}
                                placeholder={toursLoading ? "Đang tải..." : "Chọn tour"}
                                defaultValue={imageForm.tour_id}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <i className="pi pi-image text-gray-600"></i>
                                {isMultipleUpload ? 'Hình ảnh (có thể chọn nhiều)' : 'Hình ảnh'} *
                            </label>
                            {isMultipleUpload ? (
                                <FileUpload
                                    mode="basic"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    maxFileSize={10000000}
                                    onUpload={onMultipleImageUpload}
                                    onSelect={onMultipleImageUpload}
                                    chooseLabel="Chọn nhiều hình ảnh"
                                    className="w-full"
                                />
                            ) : (
                                <FileUpload
                                    mode="basic"
                                    name="image"
                                    accept="image/*"
                                    maxFileSize={10000000}
                                    onUpload={onImageUpload}
                                    onSelect={onImageUpload}
                                    chooseLabel="Chọn hình ảnh"
                                    className="w-full"
                                />
                            )}

                            {/* Current Image Preview */}
                            {editingImage && editingImage.image && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="text-xs text-gray-600 mb-2">Hình ảnh hiện tại:</div>
                                    <Image
                                        src={`${API_URL}${editingImage.image}`}
                                        alt="Current Image"
                                        width="200"
                                        height="150"
                                        className="rounded-lg object-cover border border-gray-200"
                                        preview
                                    />
                                    <div className="text-xs text-gray-500 mt-2">
                                        Chọn ảnh mới để thay thế ảnh này
                                    </div>
                                </div>
                            )}

                            {/* New Image Preview */}
                            {uploadedImage && !isMultipleUpload && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-xs text-blue-600 mb-2">Hình ảnh mới:</div>
                                    <Image
                                        src={URL.createObjectURL(uploadedImage as any)}
                                        alt="New Image"
                                        width="200"
                                        height="150"
                                        className="rounded-lg object-cover border border-blue-200"
                                        preview
                                    />
                                </div>
                            )}

                            {isMultipleUpload && uploadedImages.length > 0 && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-xs text-blue-600 mb-2">Hình ảnh đã chọn ({uploadedImages.length} ảnh):</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {uploadedImages.map((file, index) => (
                                            <Image
                                                key={index}
                                                src={URL.createObjectURL(file)}
                                                alt={`Image ${index + 1}`}
                                                width="100"
                                                height="80"
                                                className="rounded-lg object-cover border border-blue-200"
                                                preview
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <Button
                            label="Hủy"
                            icon="pi pi-times"
                            outlined
                            onClick={resetForm}
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                        />
                        {isMultipleUpload ? (
                            <Button
                                label="Thêm nhiều ảnh"
                                icon="pi pi-images"
                                onClick={handleSaveMultipleImages}
                                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                            />
                        ) : (
                            <Button
                                label={editingImage ? 'Cập nhật' : 'Thêm mới'}
                                icon={editingImage ? 'pi pi-check' : 'pi pi-plus'}
                                onClick={handleSaveImage}
                                className="bg-teal-600 hover:bg-teal-700 border-teal-600 hover:border-teal-700"
                            />
                        )}
                    </div>
                </Dialog>

                {/* Add Button */}
                <Add
                    onClick={() => setIsOpenImage(true)}
                />
            </div>

            {/* Delete by Tour Dialog */}
            <Dialog
                header="Xóa ảnh theo tour"
                visible={showDeleteByTourDialog}
                style={{ width: '450px' }}
                onHide={() => {
                    setShowDeleteByTourDialog(false);
                    setSelectedTourForDelete(null);
                }}
            >
                <div className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn tour cần xóa ảnh:
                        </label>
                        <PrimeDropdown
                            value={selectedTourForDelete}
                            onChange={(e) => setSelectedTourForDelete(e.value)}
                            options={tours.map(tour => ({
                                label: tour.name,
                                value: tour.id.toString()
                            }))}
                            placeholder="Chọn tour"
                            className="w-full"
                            optionLabel="label"
                            showClear
                        />
                    </div>

                    {selectedTourForDelete && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center mb-2">
                                <i className="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                                <span className="text-yellow-800 font-medium">Cảnh báo</span>
                            </div>
                            <p className="text-yellow-700 text-sm">
                                Bạn sắp xóa tất cả ảnh của tour "{tours.find(t => t.id.toString() === selectedTourForDelete)?.name}".
                                Hành động này không thể hoàn tác!
                            </p>
                            <p className="text-yellow-700 text-sm mt-1">
                                Số ảnh sẽ bị xóa: {imageTours.filter(img => img.tour_id === parseInt(selectedTourForDelete)).length}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            label="Hủy"
                            severity="secondary"
                            outlined
                            onClick={() => {
                                setShowDeleteByTourDialog(false);
                                setSelectedTourForDelete(null);
                            }}
                        />
                        <Button
                            label="Xóa tất cả ảnh"
                            severity="danger"
                            onClick={handleDeleteByTour}
                            disabled={!selectedTourForDelete}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}