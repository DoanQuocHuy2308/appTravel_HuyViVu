"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import { Rating } from 'primereact/rating';
import { ProgressBar } from 'primereact/progressbar';
import { TabView, TabPanel } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';
import { useTours } from '@/lib/hooks/useTour';
import { useImageTours } from '@/lib/hooks/useImageTours';
import { useNote } from '@/lib/hooks/useNote';
import { useSchedule } from '@/lib/hooks/useSchedule';
import { newTour, Review, Booking, TourSchedule, TourNote } from '@/lib/types';
import { API_URL } from '@/lib/types/url';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

// Using newTour interface from types

export default function TourDetailPage() {
    const params = useParams();
    const router = useRouter();
    const tourId = params.id as string;
    
    const { loading, getTourById, updateTour } = useTours();
    const { getImageTourByIdTour, imageTours } = useImageTours();
    const { getTourNotesByTourId } = useNote();
    const { getScheduleByIdTour } = useSchedule();
    
    const [tour, setTour] = useState<newTour | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editForm, setEditForm] = useState<Partial<newTour>>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageDialogVisible, setImageDialogVisible] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [schedules, setSchedules] = useState<TourSchedule[]>([]);
    const [notes, setNotes] = useState<TourNote[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (tourId) {
            fetchTourDetails();
            fetchTourImages();
            loadRelatedData();
        }
    }, [tourId]);

    const loadRelatedData = async () => {
        try {
            // Load schedules and notes using real API calls
            const schedulesResponse = await getScheduleByIdTour(parseInt(tourId));
            const notesResponse = await getTourNotesByTourId(parseInt(tourId));
            
            setSchedules(schedulesResponse);
            setNotes(notesResponse);
            
            // TODO: Implement API calls for reviews and bookings when backend endpoints are available
            // For now, set empty arrays to show empty states
            setReviews([]);
            setBookings([]);
        } catch (error: any) {
            console.error('Error loading related data:', error);
            // Don't show error toast for 404 (no data found)
            if (error.response?.status !== 404) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể tải dữ liệu liên quan',
                    life: 3000
                });
            }
        }
    };

    const fetchTourDetails = async () => {
        try {
            const response = await getTourById(parseInt(tourId));
            setTour(response);
            setEditForm(response);
        } catch (error) {
            console.error('Error fetching tour details:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tải thông tin tour',
                life: 3000
            });
        }
    };

    const fetchTourImages = async () => {
        try {
            await getImageTourByIdTour(parseInt(tourId));
        } catch (error: any) {
            console.error('Error fetching tour images:', error);
            // Don't show error toast for 404 (no images found)
            if (error.response?.status !== 404) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể tải ảnh tour',
                    life: 3000
                });
            }
        }
    };

    const handleEdit = () => {
        router.push(`/admin/tours/${tourId}/edit`);
    };

    const formatPrice = (price: string | number | undefined) => {
        if (!price) return '0 ₫';
        const priceNum = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(priceNum);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDiscountPercentage = () => {
        if (!tour?.oldPrice || !tour?.price) return 0;
        const oldPrice = typeof tour.oldPrice === 'string' ? parseFloat(tour.oldPrice) : tour.oldPrice;
        const newPrice = typeof tour.price === 'string' ? parseFloat(tour.price) : tour.price;
        return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    };


    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'adventure': return 'danger';
            case 'cultural': return 'info';
            case 'relaxation': return 'success';
            case 'family': return 'warning';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-4xl text-teal-600 mb-4"></i>
                    <p className="text-lg text-gray-600">Đang tải thông tin tour...</p>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Tour không tồn tại</h2>
                    <p className="text-gray-600 mb-4">Tour với ID {tourId} không được tìm thấy</p>
                    <Button
                        label="Quay lại danh sách"
                        icon="pi pi-arrow-left"
                        onClick={() => router.push('/admin/tours')}
                        className="bg-teal-600 hover:bg-teal-700"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <Toast ref={toast} />
            
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            icon="pi pi-arrow-left"
                            outlined
                            onClick={() => router.push('/admin/tours')}
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{tour.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Tag value={tour.name_type || 'N/A'} severity={getTypeColor(tour.name_type || '')} />
                                <span className="text-sm text-gray-500">ID: {tour.id}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">Tạo: {tour.created_at ? formatDate(tour.created_at) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button
                            label="Chỉnh sửa"
                            icon="pi pi-pencil"
                            onClick={handleEdit}
                            className="bg-teal-600 hover:bg-teal-700"
                        />
                        <Button
                            label="Xem hình ảnh"
                            icon="pi pi-images"
                            outlined
                            onClick={() => router.push(`/admin/images_tour?tour_id=${tour.id}`)}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                            <TabPanel header="Thông tin chung">
                                <div className="space-y-6">
                                    <Card className="overflow-hidden">
                            <div className="relative">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {tour.images?.filter(img => img && img.trim() !== '').slice(0, 6).map((image: string, index: number) => (
                                        <div
                                            key={index}
                                            className="relative cursor-pointer group"
                                            onClick={() => {
                                                setSelectedImage(image);
                                                setImageDialogVisible(true);
                                            }}
                                        >
                                            <Image
                                                src={`${API_URL}${image}`}
                                                alt={`${tour.name} - Image ${index + 1}`}
                                                width="100%"
                                                height="200"
                                                className="object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                                                preview={false}
                                            />
                                            {index === 5 && tour.images && tour.images.filter(img => img && img.trim() !== '').length > 6 && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                    <span className="text-white font-semibold">
                                                        +{tour.images.filter(img => img && img.trim() !== '').length - 6} ảnh khác
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {(!tour.images || tour.images.filter(img => img && img.trim() !== '').length === 0) && (
                                    <div className="text-center py-12 text-gray-500">
                                        <i className="pi pi-image text-4xl mb-3"></i>
                                        <p>Chưa có hình ảnh nào</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Tour Information */}
                        <Card>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <i className="pi pi-info-circle text-teal-600 text-xl"></i>
                                    <h2 className="text-xl font-semibold text-gray-900">Thông tin tour</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên tour</label>
                                                <InputText
                                                    value={editForm.name || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full"
                                                />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                                <InputTextarea
                                                    value={editForm.description || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    rows={3}
                                                    className="w-full"
                                                />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                                                <InputText
                                                    value={editForm.locations || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, locations: e.target.value })}
                                                    className="w-full"
                                                />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian lý tưởng</label>
                                                <InputText
                                                    value={editForm.ideal_time || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, ideal_time: e.target.value })}
                                                    className="w-full"
                                                />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian tour</label>
                                                <InputText
                                                    value={editForm.duration_days || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, duration_days: e.target.value })}
                                                    className="w-full"
                                                />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khởi hành</label>
                                                <InputText
                                                    value={editForm.start_date ? formatDate(editForm.start_date) : ''}
                                                    className="w-full"
                                                    disabled
                                                />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                                                <InputText
                                                    value={editForm.end_date ? formatDate(editForm.end_date) : ''}
                                                    className="w-full"
                                                    disabled
                                                />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phương tiện</label>
                                            {isEditMode ? (
                                                <InputText
                                                    value={editForm.transportation || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, transportation: e.target.value })}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <p className="text-gray-700">{tour.transportation}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phù hợp với</label>
                                            {isEditMode ? (
                                                <InputText
                                                    value={editForm.suitable_for || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, suitable_for: e.target.value })}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <p className="text-gray-700">{tour.suitable_for}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Số khách tối đa</label>
                                            {isEditMode ? (
                                                <InputNumber
                                                    value={editForm.max_customers || 0}
                                                    onValueChange={(e) => setEditForm({ ...editForm, max_customers: e.value || 0 })}
                                                    min={1}
                                                    max={100}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <p className="text-gray-700">{tour.max_customers} khách</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Location Information */}
                        <Card>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <i className="pi pi-map-marker text-teal-600 text-xl"></i>
                                    <h2 className="text-xl font-semibold text-gray-900">Thông tin địa điểm</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <i className="pi pi-play text-blue-600"></i>
                                            <span className="font-medium text-blue-800">Điểm khởi hành</span>
                                        </div>
                                        <p className="text-blue-700">{tour.start_location}</p>
                                    </div>
                                    
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <i className="pi pi-flag text-green-600"></i>
                                            <span className="font-medium text-green-800">Điểm kết thúc</span>
                                        </div>
                                        <p className="text-green-700">{tour.end_location}</p>
                                    </div>
                                    
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <i className="pi pi-building text-purple-600"></i>
                                            <span className="font-medium text-purple-800">Thành phố</span>
                                        </div>
                                        <p className="text-purple-700">{tour.city}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Guide Information */}
                        <Card>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <i className="pi pi-user text-teal-600 text-xl"></i>
                                    <h2 className="text-xl font-semibold text-gray-900">Thông tin hướng dẫn viên</h2>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                            <i className="pi pi-user text-teal-600 text-xl"></i>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{tour.guide_name}</h3>
                                            <p className="text-gray-600">ID: {tour.guide_id}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <i className="pi pi-globe text-gray-500 text-sm"></i>
                                                <span className="text-sm text-gray-600">{tour.guide_languages}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                                </div>
                            </TabPanel>

                            {/* Reviews Tab */}
                            <TabPanel header="Đánh giá">
                                <div className="space-y-6">
                                    <Card>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <i className="pi pi-star text-yellow-500 text-xl"></i>
                                                <h2 className="text-xl font-semibold text-gray-900">Đánh giá khách hàng</h2>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {reviews.length > 0 ? (
                                                    reviews.map((review: Review) => (
                                                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                            <div className="flex items-start gap-3">
                                                                <Avatar 
                                                                    icon="pi pi-user" 
                                                                    className="bg-teal-100 text-teal-600"
                                                                    size="large"
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Rating value={review.rating} readOnly />
                                                                        <span className="text-sm text-gray-500">
                                                                            {review.created_at ? formatDate(review.created_at) : 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    {review.comment && (
                                                                        <p className="text-gray-700 mb-2">{review.comment}</p>
                                                                    )}
                                                                    {review.image && (
                                                                        <Image
                                                                            src={`${API_URL}${review.image}`}
                                                                            alt="Review image"
                                                                            width="100"
                                                                            height="100"
                                                                            className="rounded-lg object-cover"
                                                                            preview
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <i className="pi pi-star text-4xl mb-3"></i>
                                                        <p>Chưa có đánh giá nào</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </TabPanel>

                            {/* Bookings Tab */}
                            <TabPanel header="Đặt tour">
                                <div className="space-y-6">
                                    <Card>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <i className="pi pi-calendar text-blue-500 text-xl"></i>
                                                <h2 className="text-xl font-semibold text-gray-900">Danh sách đặt tour</h2>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {bookings.length > 0 ? (
                                                    bookings.map((booking: Booking) => (
                                                        <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge 
                                                                        value={booking.status} 
                                                                        severity={
                                                                            booking.status === 'confirmed' ? 'success' :
                                                                            booking.status === 'pending' ? 'warning' : 'danger'
                                                                        }
                                                                    />
                                                                    <span className="text-sm text-gray-500">ID: {booking.id}</span>
                                                                </div>
                                                                <span className="text-sm text-gray-500">
                                                                    {booking.booking_date ? formatDate(booking.booking_date) : 'N/A'}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-gray-600">Người lớn:</span>
                                                                    <p className="font-medium">{booking.adults}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">Trẻ em:</span>
                                                                    <p className="font-medium">{booking.children}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">Em bé:</span>
                                                                    <p className="font-medium">{booking.infants}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">Tổng giá:</span>
                                                                    <p className="font-medium text-teal-600">
                                                                        {booking.total_price ? formatPrice(booking.total_price) : 'N/A'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            {booking.notes && (
                                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                                    <span className="text-sm text-gray-600">Ghi chú:</span>
                                                                    <p className="text-sm text-gray-700 mt-1">{booking.notes}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <i className="pi pi-calendar text-4xl mb-3"></i>
                                                        <p>Chưa có đặt tour nào</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </TabPanel>

                            {/* Schedule Tab */}
                            <TabPanel header="Lịch trình">
                                <div className="space-y-6">
                                    <Card>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <i className="pi pi-list text-green-500 text-xl"></i>
                                                <h2 className="text-xl font-semibold text-gray-900">Lịch trình tour</h2>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {schedules.length > 0 ? (
                                                    schedules.map((schedule: TourSchedule) => (
                                                        <div key={schedule.id} className="border-l-4 border-teal-500 pl-4 py-2">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge value={`Ngày ${schedule.day_number}`} severity="info" />
                                                                <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                                                            </div>
                                                            <p className="text-gray-700">{schedule.description}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <i className="pi pi-list text-4xl mb-3"></i>
                                                        <p>Chưa có lịch trình chi tiết</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </TabPanel>

                            {/* Notes Tab */}
                            <TabPanel header="Ghi chú">
                                <div className="space-y-6">
                                    <Card>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <i className="pi pi-file-edit text-orange-500 text-xl"></i>
                                                <h2 className="text-xl font-semibold text-gray-900">Ghi chú quan trọng</h2>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {notes.length > 0 ? (
                                                    notes.map((note: TourNote) => (
                                                        <div key={note.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                                            <h3 className="font-semibold text-orange-800 mb-2">{note.title}</h3>
                                                            <p className="text-orange-700">{note.note}</p>
                                                            <span className="text-xs text-orange-600 mt-2 block">
                                                                {note.created_at ? formatDate(note.created_at) : 'N/A'}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <i className="pi pi-file-edit text-4xl mb-3"></i>
                                                        <p>Chưa có ghi chú nào</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pricing Card */}
                        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <i className="pi pi-dollar text-white text-xl"></i>
                                    <h2 className="text-xl font-semibold">Giá tour</h2>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-800">Giá gốc:</span>
                                        <span className="line-through text-green-800">{formatPrice(tour.oldPrice)}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-800">Giá hiện tại:</span>
                                        <span className="text-2xl text-red-600 font-bold">{formatPrice(tour.price)}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-800">Tiết kiệm:</span>
                                        <Tag value={`-${getDiscountPercentage()}%`} severity="success" />
                                    </div>
                                </div>
                                
                                <Divider className="border-green-800" />
                                
                                <div className="text-center">
                                    <div className="text-3xl text-red-600 font-bold mb-2">{formatPrice(tour.price)}</div>
                                    <p className="text-green-800 text-sm">Giá cho 1 người</p>
                                </div>
                            </div>
                        </Card>

                        {/* Rating & Reviews */}
                        <Card>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <i className="pi pi-star text-yellow-500 text-xl"></i>
                                    <h2 className="text-xl font-semibold text-gray-900">Đánh giá</h2>
                                </div>
                                
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Rating value={parseFloat(tour.rating || '0')} readOnly />
                                        <span className="text-2xl font-bold text-gray-900">{tour.rating}</span>
                                    </div>
                                    <p className="text-gray-600">{tour.review_count} đánh giá</p>
                                </div>
                                
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 w-6">{star}</span>
                                            <i className="pi pi-star-fill text-yellow-400"></i>
                                            <ProgressBar 
                                                value={star === 5 ? 100 : star === 4 ? 20 : 0} 
                                                style={{ height: '6px' }}
                                                className="flex-1"
                                            />
                                            <span className="text-sm text-gray-600 w-8">
                                                {star === 5 ? tour.review_count : 0}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Tour Statistics */}
                        <Card>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <i className="pi pi-chart-bar text-teal-600 text-xl"></i>
                                    <h2 className="text-xl font-semibold text-gray-900">Thống kê</h2>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Điểm:</span>
                                        <Badge value={tour.point} severity="info" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Hình ảnh:</span>
                                        <Badge value={tour.images?.filter(img => img && img.trim() !== '').length || 0} severity="success" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Loại tour:</span>
                                        <Tag value={tour.name_type || 'N/A'} severity={getTypeColor(tour.name_type || '')} />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Ngày tạo:</span>
                                        <span className="text-sm text-gray-600">{tour.created_at ? formatDate(tour.created_at) : 'N/A'}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Ngày khởi hành:</span>
                                        <span className="text-sm text-gray-600">{tour.start_date ? formatDate(tour.start_date) : 'N/A'}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Ngày kết thúc:</span>
                                        <span className="text-sm text-gray-600">{tour.end_date ? formatDate(tour.end_date) : 'N/A'}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Cập nhật:</span>
                                        <span className="text-sm text-gray-600">{tour.updated_at ? formatDate(tour.updated_at) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <i className="pi pi-cog text-teal-600 text-xl"></i>
                                    <h2 className="text-xl font-semibold text-gray-900">Thao tác nhanh</h2>
                                </div>
                                
                                <div className="space-y-3">
                                    <Button
                                        label="Quản lý hình ảnh"
                                        icon="pi pi-images"
                                        outlined
                                        className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                                        onClick={() => router.push(`/admin/images_tour?tour_id=${tour.id}`)}
                                    />
                                    
                                    <Button
                                        label="Xem đặt tour"
                                        icon="pi pi-calendar"
                                        outlined
                                        className="w-full text-green-600 border-green-300 hover:bg-green-50"
                                        onClick={() => router.push(`/admin/bookings?tour_id=${tour.id}`)}
                                    />
                                    
                                    <Button
                                        label="Sao chép tour"
                                        icon="pi pi-copy"
                                        outlined
                                        className="w-full text-purple-600 border-purple-300 hover:bg-purple-50"
                                    />
                                    
                                    <Button
                                        label="Xuất báo cáo"
                                        icon="pi pi-file-pdf"
                                        outlined
                                        className="w-full text-orange-600 border-orange-300 hover:bg-orange-50"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Image Preview Dialog */}
            <Dialog
                visible={imageDialogVisible}
                onHide={() => setImageDialogVisible(false)}
                style={{ width: '90vw', maxWidth: '800px' }}
                header="Xem hình ảnh"
            >
                {selectedImage && (
                    <Image
                        src={`${API_URL}${selectedImage}`}
                        alt="Tour Image"
                        width="100%"
                        height="auto"
                        className="rounded-lg"
                        preview
                    />
                )}
            </Dialog>
        </div>
    );
}
