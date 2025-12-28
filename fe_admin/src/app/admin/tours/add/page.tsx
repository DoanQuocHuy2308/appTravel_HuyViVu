"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { tourAPI } from '@/lib/services/tourAPI';
import { imageTourAPI } from '@/lib/services/image_tour';
import useLocation from '@/lib/hooks/useLocation';
import { useCategoryTour } from '@/lib/hooks/useCategoryTour';
import useLocations from '@/lib/hooks/useLocations';
import { newTour } from '@/lib/types';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

export default function AddTourPage() {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const { provinces, districts, wards, getDistricts, getWards } = useLocation();
    const { tourTypes, loading: tourTypesLoading } = useCategoryTour();
    const { locations, loading: locationsLoading } = useLocations();
    
    const [loading, setLoading] = useState(false);
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

    // Transform tourTypes for dropdown
    const tourTypeOptions = tourTypes.map(type => ({
        label: type.name,
        value: type.id
    }));

    // Transform locations for dropdown
    const locationOptions = locations.map(location => ({
        label: location.name,
        value: location.id
    }));

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

    const handleInputChange = (field: keyof newTour, value: any) => {
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
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const validateForm = () => {
        const requiredFields = [
            'name', 'tour_type_id', 'start_location_id', 'end_location_id', 
            'location_id', 'description', 'locations', 'max_customers', 
            'duration_days', 'start_date', 'end_date', 'guide_id', 'ideal_time', 
            'transportation', 'suitable_for', 'point'
        ];

        for (const field of requiredFields) {
            if (!formData[field as keyof newTour]) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: `Vui lòng điền đầy đủ thông tin ${field}`,
                    life: 3000
                });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Create FormData for tour with images
            const formDataToSend = new FormData();
            
            // Add tour data
            formDataToSend.append('name', formData.name || '');
            formDataToSend.append('tour_type_id', formData.tour_type_id?.toString() || '');
            formDataToSend.append('start_location_id', formData.start_location_id?.toString() || '');
            formDataToSend.append('end_location_id', formData.end_location_id?.toString() || '');
            formDataToSend.append('location_id', formData.location_id?.toString() || '');
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('locations', formData.locations || '');
            formDataToSend.append('max_customers', formData.max_customers?.toString() || '');
            formDataToSend.append('duration_days', formData.duration_days || '');
            formDataToSend.append('start_date', formData.start_date ? new Date(formData.start_date).toISOString().split('T')[0] : '');
            formDataToSend.append('end_date', formData.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : '');
            formDataToSend.append('guide_id', formData.guide_id?.toString() || '');
            formDataToSend.append('ideal_time', formData.ideal_time || '');
            formDataToSend.append('transportation', formData.transportation || '');
            formDataToSend.append('suitable_for', formData.suitable_for || '');
            formDataToSend.append('point', formData.point?.toString() || '');
            
            // Add images if any
            selectedImages.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const response = await tourAPI.createTour(formDataToSend);
            
            if (response && (response as any).toursId) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Tạo tour thành công',
                    life: 3000
                });

                // Redirect to tour detail page
                router.push(`/admin/tours/${(response as any).toursId}`);
            }
        } catch (error: any) {
            console.error('Error creating tour:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tạo tour. Vui lòng thử lại.',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/tours');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Toast ref={toast} />
            
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Thêm Tour Mới</h1>
                <Button
                    icon="pi pi-arrow-left"
                    label="Quay lại"
                    outlined
                    onClick={handleCancel}
                />
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
                                options={tourTypeOptions}
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
                                Địa điểm tham quan *
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="field">
                                <label htmlFor="max_customers" className="block text-sm font-medium text-gray-700 mb-2">
                                    Số khách tối đa *
                                </label>
                                <InputNumber
                                    id="max_customers"
                                    value={formData.max_customers}
                                    onValueChange={(e) => handleInputChange('max_customers', e.value || 0)}
                                    className="w-full"
                                    min={1}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-2">
                                    Số ngày *
                                </label>
                                <InputNumber
                                    id="duration_days"
                                    value={parseInt(formData.duration_days || '0')}
                                    onValueChange={(e) => handleInputChange('duration_days', (e.value || 0).toString())}
                                    className="w-full"
                                    min={1}
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
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Additional Info */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-700">Thông tin bổ sung</h3>
                        
                        <div className="field">
                            <label htmlFor="start_location_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Điểm khởi hành *
                            </label>
                            <Dropdown
                                id="start_location_id"
                                value={formData.start_location_id}
                                options={locationOptions}
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
                                options={locationOptions}
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
                                options={locationOptions}
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

                        <div className="field">
                            <label htmlFor="transportation" className="block text-sm font-medium text-gray-700 mb-2">
                                Phương tiện di chuyển *
                            </label>
                            <Dropdown
                                id="transportation"
                                value={formData.transportation || ''}
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
                                value={formData.suitable_for || ''}
                                options={suitableForOptions}
                                onChange={(e) => handleInputChange('suitable_for', e.value)}
                                className="w-full"
                                placeholder="Chọn đối tượng phù hợp"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="field">
                                <label htmlFor="point" className="block text-sm font-medium text-gray-700 mb-2">
                                    Điểm đánh giá *
                                </label>
                                <InputNumber
                                    id="point"
                                    value={formData.point}
                                    onValueChange={(e) => handleInputChange('point', e.value || 0)}
                                    className="w-full"
                                    min={0}
                                    max={10}
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
                                    placeholder="VD: Tháng 1-3"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <Divider />

                {/* Image Upload Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-700">Hình ảnh tour</h3>
                    
                    <div className="field">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn ảnh tour (Tối đa 10 ảnh)
                        </label>
                        <FileUpload
                            mode="basic"
                            name="images[]"
                            accept="image/*"
                            multiple
                            maxFileSize={5000000}
                            customUpload={true}
                            uploadHandler={handleImageSelect}
                            chooseLabel="Chọn ảnh"
                            className="w-full"
                        />
                        <small className="text-gray-500">
                            Hỗ trợ định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB/ảnh
                        </small>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-700">Ảnh đã chọn:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border"
                                        />
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-danger p-button-sm absolute -top-2 -right-2"
                                            onClick={() => removeImage(index)}
                                            size="small"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Divider />

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <Button
                        label="Hủy"
                        icon="pi pi-times"
                        outlined
                        onClick={handleCancel}
                    />
                    <Button
                        label="Tạo tour"
                        icon="pi pi-check"
                        onClick={handleSubmit}
                        disabled={loading}
                    />
                </div>
            </Card>
        </div>
    );
}
