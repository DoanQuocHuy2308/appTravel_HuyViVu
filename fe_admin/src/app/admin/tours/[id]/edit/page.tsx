"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCategoryTour } from '@/lib/hooks/useCategoryTour';
import useLocations from '@/lib/hooks/useLocations';
import { tourAPI } from '@/lib/services/tourAPI';
import { newTour } from '@/lib/types';
// import { convertFileToBase64 } from '@/lib/utils/file';

export default function EditTourPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useRef<Toast>(null);
    
    const tourId = params.id as string;
    
    // Hooks for data
    const { tourTypes, loading: tourTypesLoading } = useCategoryTour();
    const { locations, loading: locationsLoading } = useLocations();
    
    // State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tourData, setTourData] = useState<any>(null);
    
    const [formData, setFormData] = useState<Partial<newTour>>({
        name: '',
        tour_type_id: undefined,
        start_location_id: undefined,
        end_location_id: undefined,
        location_id: undefined,
        description: '',
        locations: '',
        max_customers: 0,
        duration_days: '0',
        start_date: undefined,
        end_date: undefined,
        guide_id: undefined,
        ideal_time: '',
        transportation: '',
        suitable_for: '',
        point: 0
    });
    
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Transform data for dropdowns
    const tourTypeOptions = tourTypes?.map((type: any) => ({
        label: type.name,
        value: type.id
    })) || [];

    const locationOptions = locations?.map((location: any) => ({
        label: location.name,
        value: location.id
    })) || [];

    // Fallback data when API is not available
    const fallbackTourTypes = [
        { label: 'Du lịch trong nước', value: 1 },
        { label: 'Du lịch nước ngoài', value: 2 },
        { label: 'Du lịch khám phá', value: 3 },
        { label: 'Du lịch nghỉ dưỡng', value: 4 }
    ];

    const fallbackLocations = [
        { label: 'Hà Nội', value: 1 },
        { label: 'TP. Hồ Chí Minh', value: 2 },
        { label: 'Đà Nẵng', value: 3 },
        { label: 'Hạ Long', value: 4 },
        { label: 'Huế', value: 5 },
        { label: 'Hội An', value: 6 }
    ];

    const transportations = [
        { label: 'Máy bay', value: 'Máy bay' },
        { label: 'Xe khách', value: 'Xe khách' },
        { label: 'Tàu hỏa', value: 'Tàu hỏa' },
        { label: 'Ô tô riêng', value: 'Ô tô riêng' },
        { label: 'Tàu thủy', value: 'Tàu thủy' }
    ];

    const suitableForOptions = [
        { label: 'Gia đình', value: 'Gia đình' },
        { label: 'Cặp đôi', value: 'Cặp đôi' },
        { label: 'Nhóm bạn', value: 'Nhóm bạn' },
        { label: 'Du lịch một mình', value: 'Du lịch một mình' },
        { label: 'Doanh nghiệp', value: 'Doanh nghiệp' }
    ];

    const guides = [
        { label: 'Nguyễn Văn A', value: 1 },
        { label: 'Trần Thị B', value: 2 },
        { label: 'Lê Văn C', value: 3 }
    ];

    // Load tour data
    useEffect(() => {
        const loadTourData = async () => {
            try {
                setLoading(true);
                const tour = await tourAPI.getToursById(parseInt(tourId));
                setTourData(tour);
                
                // Populate form data
                setFormData({
                    name: tour.name || '',
                    tour_type_id: tour.tour_type_id,
                    start_location_id: tour.start_location_id,
                    end_location_id: tour.end_location_id,
                    location_id: tour.location_id,
                    description: tour.description || '',
                    locations: tour.locations || '',
                    max_customers: tour.max_customers || 0,
                    duration_days: tour.duration_days?.toString() || '0',
                    start_date: tour.start_date ? tour.start_date : undefined,
                    end_date: tour.end_date ? tour.end_date : undefined,
                    guide_id: tour.guide_id,
                    ideal_time: tour.ideal_time || '',
                    transportation: tour.transportation || '',
                    suitable_for: tour.suitable_for || '',
                    point: tour.point || 0
                });
                
                // Load existing images if any
                if (tour.images && tour.images.length > 0) {
                    // Filter out null values and handle both string paths and objects
                    const validImages = tour.images
                        .filter((img: any) => img !== null && img !== undefined)
                        .map((img: any) => {
                            // If img is a string (direct path), use it directly
                            // If img is an object with image_url property, use that
                            return typeof img === 'string' ? img : (img?.image_url || img?.image || '');
                        })
                        .filter((imgPath: string) => imgPath.trim() !== '');
                    
                    setImagePreviews(validImages);
                }
            } catch (error) {
                console.error('Error loading tour data:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể tải dữ liệu tour'
                });
            } finally {
                setLoading(false);
            }
        };

        if (tourId) {
            loadTourData();
        }
    }, [tourId]);

    const handleInputChange = (field: keyof Partial<newTour>, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLocationChange = (field: 'start_location_id' | 'end_location_id' | 'location_id', provinceId: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: provinceId
        }));
    };

    const handleImageSelect = (event: any) => {
        const files = Array.from(event.files) as File[];
        setSelectedImages(prev => [...prev, ...files]);
        
        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const requiredFields = [
            'name', 'tour_type_id', 'start_location_id', 'end_location_id', 
            'location_id', 'description', 'locations', 'max_customers', 
            'duration_days', 'start_date', 'end_date', 'guide_id', 'ideal_time', 
            'transportation', 'suitable_for', 'point'
        ];

        for (const field of requiredFields) {
            if (!formData[field as keyof Partial<newTour>]) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: `Vui lòng nhập ${field}`
                });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name || '');
            formDataToSend.append('tour_type_id', formData.tour_type_id?.toString() || '');
            formDataToSend.append('start_location_id', formData.start_location_id?.toString() || '');
            formDataToSend.append('end_location_id', formData.end_location_id?.toString() || '');
            formDataToSend.append('location_id', formData.location_id?.toString() || '');
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('locations', formData.locations || '');
            formDataToSend.append('max_customers', formData.max_customers?.toString() || '');
            formDataToSend.append('duration_days', formData.duration_days || '');
            formDataToSend.append('start_date', formData.start_date ? (typeof formData.start_date === 'string' ? formData.start_date : new Date(formData.start_date).toISOString().split('T')[0]) : '');
            formDataToSend.append('end_date', formData.end_date ? (typeof formData.end_date === 'string' ? formData.end_date : new Date(formData.end_date).toISOString().split('T')[0]) : '');
            formDataToSend.append('guide_id', formData.guide_id?.toString() || '');
            formDataToSend.append('ideal_time', formData.ideal_time || '');
            formDataToSend.append('transportation', formData.transportation || '');
            formDataToSend.append('suitable_for', formData.suitable_for || '');
            formDataToSend.append('point', formData.point?.toString() || '');

            // Add new images
            selectedImages.forEach(file => {
                formDataToSend.append('images', file);
            });

            await tourAPI.updateTour(parseInt(tourId), formDataToSend);
            
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Cập nhật tour thành công'
            });
            
            setTimeout(() => {
                router.push('/admin/tours');
            }, 1500);
            
        } catch (error) {
            console.error('Error updating tour:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể cập nhật tour'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/tours');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Toast ref={toast} />
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa Tour</h1>
                    <p className="text-gray-600 mt-2">Cập nhật thông tin tour</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        label="Hủy"
                        icon="pi pi-times"
                        severity="secondary"
                        outlined
                        onClick={handleCancel}
                    />
                    <Button
                        label="Cập nhật"
                        icon="pi pi-check"
                        onClick={handleSubmit}
                        loading={saving}
                        disabled={saving}
                    />
                </div>
            </div>

            <Card className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-700">Thông tin cơ bản</h3>
                        
                        <div className="field">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên tour *
                            </label>
                            <InputText
                                id="name"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full"
                                placeholder="Nhập tên tour"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="tour_type_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Loại tour *
                            </label>
                            <Dropdown
                                id="tour_type_id"
                                value={formData.tour_type_id}
                                options={tourTypeOptions.length > 0 ? tourTypeOptions : fallbackTourTypes}
                                onChange={(e) => handleInputChange('tour_type_id', e.value)}
                                className="w-full"
                                placeholder="Chọn loại tour"
                                loading={tourTypesLoading}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả *
                            </label>
                            <InputTextarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full"
                                rows={4}
                                placeholder="Nhập mô tả tour"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="locations" className="block text-sm font-medium text-gray-700 mb-2">
                                Các địa điểm tham quan *
                            </label>
                            <InputTextarea
                                id="locations"
                                value={formData.locations || ''}
                                onChange={(e) => handleInputChange('locations', e.target.value)}
                                className="w-full"
                                rows={3}
                                placeholder="Nhập các địa điểm tham quan"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="ideal_time" className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian lý tưởng *
                            </label>
                            <InputText
                                id="ideal_time"
                                value={formData.ideal_time || ''}
                                onChange={(e) => handleInputChange('ideal_time', e.target.value)}
                                className="w-full"
                                placeholder="Ví dụ: Mùa xuân, tháng 3-5"
                            />
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-700">Chi tiết tour</h3>
                        
                        <div className="field">
                            <label htmlFor="start_location_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Điểm khởi hành *
                            </label>
                            <Dropdown
                                id="start_location_id"
                                value={formData.start_location_id}
                                options={locationOptions.length > 0 ? locationOptions : fallbackLocations}
                                onChange={(e) => handleLocationChange('start_location_id', e.value)}
                                className="w-full"
                                placeholder="Chọn điểm khởi hành"
                                loading={locationsLoading}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="end_location_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Điểm kết thúc *
                            </label>
                            <Dropdown
                                id="end_location_id"
                                value={formData.end_location_id}
                                options={locationOptions.length > 0 ? locationOptions : fallbackLocations}
                                onChange={(e) => handleLocationChange('end_location_id', e.value)}
                                className="w-full"
                                placeholder="Chọn điểm kết thúc"
                                loading={locationsLoading}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Địa điểm chính *
                            </label>
                            <Dropdown
                                id="location_id"
                                value={formData.location_id}
                                options={locationOptions.length > 0 ? locationOptions : fallbackLocations}
                                onChange={(e) => handleLocationChange('location_id', e.value)}
                                className="w-full"
                                placeholder="Chọn địa điểm chính"
                                loading={locationsLoading}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="guide_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Hướng dẫn viên *
                            </label>
                            <Dropdown
                                id="guide_id"
                                value={formData.guide_id}
                                options={guides}
                                onChange={(e) => handleInputChange('guide_id', e.value)}
                                className="w-full"
                                placeholder="Chọn hướng dẫn viên"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="field">
                                <label htmlFor="max_customers" className="block text-sm font-medium text-gray-700 mb-2">
                                    Số khách tối đa *
                                </label>
                                <InputNumber
                                    id="max_customers"
                                    value={formData.max_customers}
                                    onValueChange={(e) => handleInputChange('max_customers', e.value)}
                                    className="w-full"
                                    min={1}
                                    max={100}
                                    placeholder="Nhập số khách"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-2">
                                    Số ngày *
                                </label>
                                <InputNumber
                                    id="duration_days"
                                    value={parseInt(formData.duration_days || '0')}
                                    onValueChange={(e) => handleInputChange('duration_days', e.value?.toString() || '0')}
                                    className="w-full"
                                    min={1}
                                    max={30}
                                    placeholder="Nhập số ngày"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="field">
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày khởi hành *
                                </label>
                                <Calendar
                                    id="start_date"
                                    value={formData.start_date ? new Date(formData.start_date) : null}
                                    onChange={(e) => handleInputChange('start_date', e.value)}
                                    className="w-full"
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                    placeholder="Chọn ngày khởi hành"
                                    minDate={new Date()}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày kết thúc *
                                </label>
                                <Calendar
                                    id="end_date"
                                    value={formData.end_date ? new Date(formData.end_date) : null}
                                    onChange={(e) => handleInputChange('end_date', e.value)}
                                    className="w-full"
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                    placeholder="Chọn ngày kết thúc"
                                    minDate={formData.start_date ? new Date(formData.start_date) : new Date()}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="transportation" className="block text-sm font-medium text-gray-700 mb-2">
                                Phương tiện di chuyển *
                            </label>
                            <Dropdown
                                id="transportation"
                                value={formData.transportation}
                                options={transportations}
                                onChange={(e) => handleInputChange('transportation', e.value)}
                                className="w-full"
                                placeholder="Chọn phương tiện"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="suitable_for" className="block text-sm font-medium text-gray-700 mb-2">
                                Phù hợp với *
                            </label>
                            <Dropdown
                                id="suitable_for"
                                value={formData.suitable_for}
                                options={suitableForOptions}
                                onChange={(e) => handleInputChange('suitable_for', e.value)}
                                className="w-full"
                                placeholder="Chọn đối tượng phù hợp"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="point" className="block text-sm font-medium text-gray-700 mb-2">
                                Điểm tích lũy *
                            </label>
                            <InputNumber
                                id="point"
                                value={formData.point}
                                onValueChange={(e) => handleInputChange('point', e.value)}
                                className="w-full"
                                min={0}
                                max={1000}
                                placeholder="Nhập điểm tích lũy"
                            />
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Hình ảnh tour</h3>
                    
                    <div className="mb-4">
                        <FileUpload
                            mode="basic"
                            name="images[]"
                            accept="image/*"
                            maxFileSize={10000000}
                            multiple
                            customUpload={true}
                            uploadHandler={handleImageSelect}
                            chooseLabel="Chọn hình ảnh"
                            className="w-full"
                        />
                    </div>

                    {/* Image Preview */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        rounded
                                        severity="danger"
                                        size="small"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
