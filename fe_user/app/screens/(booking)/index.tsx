import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, Phone, Users, Minus, Plus, MapPin, FileText, Tag, Gift, ChevronDown, ChevronUp } from 'lucide-react-native';
import PaymentMethodSelector, { PaymentMethod } from '@/components/payment/PaymentMethodSelector';
import { useRouter } from 'expo-router';
import Header from '@/components/header';
import { useBookings } from '@/hooks/useBookings';
import useTicketPrices from '@/hooks/useTicketPrices';
import { useTours } from '@/hooks/useTour';
import useUser from '@/hooks/useUser';
import usePromotionsUser from '@/hooks/usePromotionsUser';
import { usePromotions } from '@/hooks/usePromotions';
import { ToastContext } from '@/contexts/ToastContext';
import { useContext } from 'react';

export default function BookingScreen() {
    const router = useRouter();
    const { showToast } = useContext(ToastContext);
    
    // Debug params
    const { createBooking, loading: bookingLoading } = useBookings();
    const { ticketPrices, loading: ticketLoading } = useTicketPrices();
    const { tour, loading: tourLoading } = useTours();
    const { user } = useUser();
    const { promotionsUser, loading: promotionsLoading } = usePromotionsUser();
    const { promotions, loading: allPromotionsLoading } = usePromotions();
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
    const [isPromotionModalVisible, setIsPromotionModalVisible] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        if (user) {
            setFullName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
        }
    }, [user]);

    useEffect(() => {
        const newTotalPrice = calculateTotalPrice();
        setTotalPrice(newTotalPrice as number);
    }, [tour, ticketPrices, adults, children, infants, selectedPromotion]);

    const handlePassengerChange = (type: string, amount: number) => {
        const currentTotal = adults + children + infants;
        
        // Kiểm tra nếu tăng số khách sẽ vượt quá giới hạn
        if (amount > 0 && tour?.max_customers && (currentTotal + amount) > tour.max_customers) {
            showToast('info', `Tour chỉ còn ${tour.max_customers - currentTotal} chỗ trống`);
            return;
        }

        switch (type) {
            case 'adults':
                setAdults(prev => Math.max(0, prev + amount));
                break;
            case 'children':
                setChildren(prev => Math.max(0, prev + amount));
                break;
            case 'infants':  
                setInfants(prev => Math.max(0, prev + amount));
                break;
        }
    };

    const handleConfirmBooking = async () => {
        if (!agreedToTerms) {
            showToast('error', 'Vui lòng đồng ý với điều khoản sử dụng dịch vụ');
            return;
        }

        if (!fullName || !phone || !email || !address) {
            showToast('error', 'Vui lòng nhập đầy đủ thông tin liên hệ');
            return;
        }

        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            showToast('error', 'Số điện thoại phải có 10 chữ số');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('error', 'Email không hợp lệ');
            return;
        }

        if (!user || !user.id) {
            showToast('error', 'Vui lòng đăng nhập để đặt tour');
            return;
        }

        if (!tour) {
            showToast('error', 'Không tìm thấy thông tin tour');
            return;
        }

        if (adults === 0 && children === 0 && infants === 0) {
            showToast('error', 'Vui lòng chọn ít nhất 1 khách');
            return;
        }

        // Kiểm tra số chỗ còn lại
        const totalGuests = adults + children + infants;
        if (tour.max_customers && totalGuests > tour.max_customers) {
            showToast('error', `Tour chỉ còn ${tour.max_customers} chỗ trống. Vui lòng giảm số lượng khách`);
            return;
        }

        if (!selectedPaymentMethod) {
            showToast('error', 'Vui lòng chọn phương thức thanh toán');
            return;
        }

        Alert.alert(
            "Xác nhận Đặt Tour",
            "Bạn có chắc chắn muốn tiến hành thanh toán và đặt tour này không?",
            [
                { text: "Hủy bỏ", style: "cancel" },
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        try {
                            const formatDate = (date: string | undefined) => {
                                if (!date) return '';
                                return date.split('T')[0];
                            };
                            
                            const getStartDate = () => {
                                if (tour?.start_date) return formatDate(tour.start_date);
                                return new Date().toISOString().split('T')[0];
                            };
                            
                            const getEndDate = () => {
                                if (tour?.end_date) return formatDate(tour.end_date);
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                return tomorrow.toISOString().split('T')[0];
                            };
                            
                            const startDate = getStartDate();
                            const endDate = getEndDate();
                            
                            const bookingData = {
                                user_id: user?.id,
                                tour_id: tour.id,
                                adults: adults,
                                children: children,
                                infants: infants,
                                start_date: startDate,
                                end_date: endDate,
                                notes: notes || '',
                                promotion_id: selectedPromotion?.code || null 
                            };

                            const booking = await createBooking(bookingData);
                            if (booking) {
                                showToast('success', 'Đặt tour thành công');
                                
                                // Xử lý theo phương thức thanh toán
                                if (selectedPaymentMethod === 'direct') {
                                    // Thanh toán trực tiếp - chuyển đến trang thành công
                                    router.push({
                                        pathname: '/screens/(payment)',
                                        params: {
                                            tourTitle: tour.name,
                                            guestCount: getTotalGuests().toString(),
                                            totalPrice: totalPrice.toString(),
                                            bookingId: booking.id?.toString() || `VIVU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                                            adults: adults.toString(),
                                            children: children.toString(),
                                            infants: infants.toString(),
                                            paymentMethod: 'direct'
                                        }
                                    });
                                } else {
                                    // Các phương thức thanh toán khác - chuyển đến trang thanh toán
                                    router.push({
                                        pathname: '/screens/(payment)',
                                        params: {
                                            tourTitle: tour.name,
                                            guestCount: getTotalGuests().toString(),
                                            totalPrice: totalPrice.toString(),
                                            bookingId: booking.id?.toString() || `VIVU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                                            adults: adults.toString(),
                                            children: children.toString(),
                                            infants: infants.toString(),
                                            paymentMethod: selectedPaymentMethod
                                        }
                                    });
                                }
                            } else {
                                showToast('error', 'Đặt tour thất bại');
                            }
                        } catch (error) {
                            console.error('Booking error:', error);
                            showToast('error', 'Có lỗi xảy ra khi đặt tour');
                        } 
                    }
                }
            ]
        );
    };

    const calculateTotalPrice = () => {
        if (!tour) return 0;
        
        let totalPrice = 0;
        
        if (ticketPrices.length > 0) {
            const tourTicketPrices = ticketPrices.filter((tp: any) => tp.tour_id === tour.id);
            if (tourTicketPrices.length > 0) {
                const adultPrice = tourTicketPrices.find((tp: any) => tp.customer_type === 'adult')?.price || 0;
                const childPrice = tourTicketPrices.find((tp: any) => tp.customer_type === 'child')?.price || 0;
                const infantPrice = tourTicketPrices.find((tp: any) => tp.customer_type === 'infant')?.price || 0;

                const totalGuestPrice = (adults * adultPrice) + (children * childPrice) + (infants * infantPrice);
                totalPrice = Number(totalGuestPrice);
            }
        }
        
        const tourPrice = tour.price || 0;
        
        if (selectedPromotion && totalPrice > 0) {
            
            if (selectedPromotion.status === 'active') {
                const discountAmount = totalPrice * (selectedPromotion.discount / 100);
                totalPrice = totalPrice - discountAmount;
            } else {
                totalPrice = totalPrice - selectedPromotion.discount;
            }
            
        }
        return Math.max(0, totalPrice);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getTicketPrice = (customerType: string) => {
        if (!tour || ticketPrices.length === 0) return 0;
        const tourTicketPrices = ticketPrices.filter((tp: any) => tp.tour_id === tour.id);
        return tourTicketPrices.find((tp: any) => tp.customer_type === customerType)?.price || 0;
    };

    const getTotalGuests = () => {
        return adults + children + infants;
    };

    const handleRemovePromotion = () => {
        setSelectedPromotion(null);
        showToast('info', 'Đã xóa mã giảm giá');
    };

  // Helpers for voucher expiration
  const isVoucherExpired = (endDate?: string) => {
    if (!endDate) return true;
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return end.getTime() < Date.now();
  };


    if (tourLoading || ticketLoading || allPromotionsLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <Header title="Đặt tour" />
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg text-gray-600">Đang tải thông tin...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!tour) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <Header title="Đặt tour" />
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg text-gray-600">Không tìm thấy thông tin tour</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Header title="Đặt tour" />
            <ScrollView className="flex-1">
                {/* Thông tin tour */}
                {tour && (
                    <View className="mx-4 mt-4 mb-2 bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <Text className="text-lg font-bold text-blue-800 mb-2">Thông tin tour</Text>
                        <Text className="text-base font-semibold text-gray-800 mb-1">{tour.name}</Text>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-gray-600">Mã tour: #{tour.id}</Text>
                            {tour.max_customers && (
                                <View className="flex-row items-center">
                                    <Users size={16} color="#08703f" />
                                    <Text className="text-sm text-gray-600 ml-1">
                                        Còn {tour.max_customers} chỗ
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <View className="px-4 py-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">THÔNG TIN LIÊN LẠC</Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">Họ và tên*</Text>
                            <TextInput
                                value={fullName}
                                onChangeText={setFullName}
                                className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                                placeholder="Nhập họ và tên"
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">Số điện thoại*</Text>
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                                placeholder="Số điện thoại"
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                            <Text className="text-xs text-gray-500 mt-1">{phone.length}/10</Text>
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">Email*</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                                placeholder="Email"
                                keyboardType="email-address"
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">Địa chỉ</Text>
                            <TextInput
                                value={address}
                                onChangeText={setAddress}
                                className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                                placeholder="Nhập địa chỉ"
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">Ghi chú</Text>
                            <TextInput
                                value={notes}
                                onChangeText={setNotes}
                                className="border border-gray-300 rounded-lg px-3 py-3 bg-white h-20"
                                placeholder="Ghi chú những yêu cầu đặc biệt"
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </View>

                <View className="px-4 py-6 bg-gray-50">
                    <Text className="text-lg font-bold text-gray-800 mb-4">HÀNH KHÁCH</Text>

                    <View className="bg-white rounded-lg p-4 space-y-4">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-base font-semibold text-gray-800">Người lớn</Text>
                                <View className="flex-row items-center mt-1">
                                    <Text className="text-sm text-gray-600">Từ 12 tuổi trở lên</Text>
                                    <View className="w-4 h-4 bg-gray-400 rounded-full items-center justify-center ml-2">
                                        <Text className="text-xs text-white font-bold">i</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => handlePassengerChange('adults', -1)}
                                    className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                                >
                                    <Minus size={16} color="#374151" />
                                </TouchableOpacity>
                                <Text className="text-lg font-bold mx-4 w-8 text-center">{adults}</Text>
                                <TouchableOpacity
                                    onPress={() => handlePassengerChange('adults', 1)}
                                    className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                                >
                                    <Plus size={16} color="#374151" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-base font-semibold text-gray-800">Trẻ em</Text>
                                <View className="flex-row items-center mt-1">
                                    <Text className="text-sm text-gray-600">Từ 5 - 11 tuổi</Text>
                                    <View className="w-4 h-4 bg-gray-400 rounded-full items-center justify-center ml-2">
                                        <Text className="text-xs text-white font-bold">i</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => handlePassengerChange('children', -1)}
                                    className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                                >
                                    <Minus size={16} color="#374151" />
                                </TouchableOpacity>
                                <Text className="text-lg font-bold mx-4 w-8 text-center">{children}</Text>
                                <TouchableOpacity
                                    onPress={() => handlePassengerChange('children', 1)}
                                    className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                                >
                                    <Plus size={16} color="#374151" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-base font-semibold text-gray-800">Em bé</Text>
                                <View className="flex-row items-center mt-1">
                                    <Text className="text-sm text-gray-600">Dưới 4 tuổi</Text>
                                    <View className="w-4 h-4 bg-gray-400 rounded-full items-center justify-center ml-2">
                                        <Text className="text-xs text-white font-bold">i</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => handlePassengerChange('infants', -1)}
                                    className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                                >
                                    <Minus size={16} color="#374151" />
                                </TouchableOpacity>
                                <Text className="text-lg font-bold mx-4 w-8 text-center">{infants}</Text>
                                <TouchableOpacity
                                    onPress={() => handlePassengerChange('infants', 1)}
                                    className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                                >
                                    <Plus size={16} color="#374151" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Cảnh báo số chỗ */}
                    {tour?.max_customers && (adults + children + infants) > tour.max_customers && (
                        <View className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <View className="flex-row items-center">
                                <View className="w-6 h-6 bg-red-100 rounded-full items-center justify-center mr-2">
                                    <Text className="text-red-600 text-xs font-bold">!</Text>
                                </View>
                                <Text className="text-red-700 text-sm font-semibold flex-1">
                                    Tour chỉ còn {tour.max_customers} chỗ trống. Vui lòng giảm số lượng khách.
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Payment Method Selection */}
                <PaymentMethodSelector
                    selectedMethod={selectedPaymentMethod}
                    onSelectMethod={setSelectedPaymentMethod}
                    totalPrice={totalPrice}
                />

                <View className="px-4 py-6">
                    <Text className="text-sm font-bold text-gray-800 mb-4">ĐỂ ĐĂNG KÝ ONLINE, QUÝ KHÁCH VUI LÒNG XEM CÁC THÔNG TIN SAU:</Text>

                    <View className="bg-gray-100 rounded-lg p-4 mb-4 h-52">
                        <ScrollView
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                            style={{ flex: 1 }}
                        >
                            <Text className="text-sm font-bold text-gray-800 mb-2">ĐIỀU KHOẢN THỎA THUẬN SỬ DỤNG DỊCH VỤ DU LỊCH NỘI ĐỊA</Text>
                            <Text className="text-xs text-gray-700 leading-5">
                                Để đăng ký online, quý khách vui lòng xem các thông tin sau. Việc quý khách tiếp tục sử dụng website
                                của chúng tôi có nghĩa là quý khách đồng ý với những thay đổi này. Nội dung bao gồm 2 phần:
                                Phần I: Điều kiện bán vé các chương trình du lịch nội địa{'\n\n'}

                                1. Điều kiện chung:{'\n'}
                                - Khách hàng phải cung cấp thông tin chính xác và đầy đủ{'\n'}
                                - Thanh toán phải được thực hiện đúng hạn{'\n'}
                                - Tuân thủ các quy định về an toàn và vệ sinh{'\n\n'}

                                2. Điều kiện hủy tour:{'\n'}
                                - Hủy trước 7 ngày: hoàn 100% tiền{'\n'}
                                - Hủy trước 3 ngày: hoàn 50% tiền{'\n'}
                                - Hủy trong vòng 24h: không hoàn tiền{'\n\n'}

                                3. Trách nhiệm của công ty:{'\n'}
                                - Đảm bảo chất lượng dịch vụ{'\n'}
                                - Bảo hiểm du lịch cho khách hàng{'\n'}
                                - Hỗ trợ 24/7 trong suốt chuyến đi{'\n\n'}

                                4. Trách nhiệm của khách hàng:{'\n'}
                                - Mang theo giấy tờ tùy thân{'\n'}
                                - Tuân thủ hướng dẫn của hướng dẫn viên{'\n'}
                                - Không mang theo các vật dụng cấm{'\n\n'}

                                5. Điều khoản bảo mật:{'\n'}
                                - Thông tin cá nhân được bảo mật tuyệt đối{'\n'}
                                - Không chia sẻ thông tin với bên thứ ba{'\n'}
                                - Tuân thủ Luật Bảo vệ dữ liệu cá nhân
                            </Text>
                        </ScrollView>
                    </View>

                    <View className="flex-row items-start">
                        <TouchableOpacity
                            onPress={() => setAgreedToTerms(!agreedToTerms)}
                            className="w-6 h-6 border-2 border-gray-400 rounded mr-3 items-center justify-center"
                            activeOpacity={0.7}
                        >
                            {agreedToTerms && (
                                <View className="w-4 h-4 bg-green-500 rounded items-center justify-center">
                                    <Text className="text-white text-xs font-bold">✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setAgreedToTerms(!agreedToTerms)}
                            className="flex-1"
                            activeOpacity={0.7}
                        >
                            <Text className="text-sm text-gray-700">
                                Tôi đồng ý với{' '}
                                <Text className="text-blue-600">Chính sách bảo vệ dữ liệu cá nhân</Text>
                                {' '}và{' '}
                                <Text className="text-blue-600">các điều khoản trên</Text>
                                .
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <View className="bg-white border-t border-gray-200">
                <TouchableOpacity
                    onPress={() => setIsSummaryExpanded(!isSummaryExpanded)}
                    className="bg-[#08703f] px-4 py-3 flex-row items-center justify-between rounded-t-lg"
                >
                    <Text className="text-white font-bold">Tóm tắt đơn hàng</Text>
                    {isSummaryExpanded ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="white" />}
                </TouchableOpacity>

                {isSummaryExpanded && (
                    <View className="px-4 py-4 bg-white">
                        <View className="mb-4">
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center">
                                    <Users size={16} color="#374151" />
                                    <Text className="text-sm font-bold text-gray-800 ml-2">KHÁCH HÀNG + PHỤ THU</Text>
                                </View>
                                <Text className="text-sm font-bold text-gray-800">
                                    {formatCurrency(totalPrice)}
                                </Text>
                            </View>

                            <View className="ml-6 space-y-1">
                                {tour?.price && Number(tour.price) > 0 && (
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm text-gray-600">Tiền tour</Text>
                                        <Text className="text-sm text-gray-800">{formatCurrency(Number(tour.price))}</Text>
                                    </View>
                                )}
                                
                                {ticketPrices.length > 0 && (
                                    <View key="ticket-prices">
                                        {adults > 0 && getTicketPrice('adult') > 0 && (
                                            <View key="adults" className="flex-row justify-between">
                                                <Text className="text-sm text-gray-600">Người lớn</Text>
                                                <Text className="text-sm text-gray-800">{adults} x {formatCurrency(getTicketPrice('adult'))}</Text>
                                            </View>
                                        )}
                                        {children > 0 && getTicketPrice('child') > 0 && (
                                            <View key="children" className="flex-row justify-between">
                                                <Text className="text-sm text-gray-600">Trẻ em</Text>
                                                <Text className="text-sm text-gray-800">{children} x {formatCurrency(getTicketPrice('child'))}</Text>
                                            </View>
                                        )}
                                        {infants > 0 && getTicketPrice('infant') > 0 && (
                                            <View key="infants" className="flex-row justify-between">
                                                <Text className="text-sm text-gray-600">Em bé</Text>
                                                <Text className="text-sm text-gray-800">{infants} x {formatCurrency(getTicketPrice('infant'))}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                                
                                {ticketPrices.length === 0 && getTotalGuests() > 0 && (
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm text-gray-600">Số khách</Text>
                                        <Text className="text-sm text-gray-800">{getTotalGuests()} người</Text>
                                    </View>
                                )}
                            </View>

                            <View className="border-t border-gray-200 my-2" />

                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center">
                                    <Gift size={16} color="#374151" />
                                    <Text className="text-sm font-bold text-gray-800 ml-2">KHUYẾN MÃI</Text>
                                </View>
                            </View>

                            <View className="ml-6 space-y-1">
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-gray-600">Ưu đãi giờ chót (Còn 4 chỗ)</Text>
                                </View>
                                {adults > 0 && (
                                    <View key="adults-promotion" className="flex-row justify-between">
                                        <Text className="text-sm text-gray-600">- Người lớn</Text>
                                        <Text className="text-sm text-gray-800">{adults}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <Tag size={16} color="#6B7280" />
                                <Text className="text-sm text-gray-600 ml-2">Mã giảm giá</Text>
                            </View>
                            <TouchableOpacity 
                                className="flex-row items-center"
                                onPress={() => setIsPromotionModalVisible(true)}
                            >
                                <Text className="text-sm text-blue-600 mr-1">
                                    {selectedPromotion ? selectedPromotion.promotion_code : 'Chọn mã giảm giá'}
                                </Text>
                                <Plus size={16} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>

                        {selectedPromotion && (
                            <View className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <Gift size={16} color="#10B981" />
                                        <Text className="text-green-800 font-semibold ml-2">
                                            {selectedPromotion.promotion_code}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-green-600 font-bold mr-2">
                                            {selectedPromotion.discount_type === 'percentage' 
                                                ? `${selectedPromotion.description}` 
                                                : `${selectedPromotion.description}`
                                            }
                                        </Text>
                                        <TouchableOpacity onPress={handleRemovePromotion}>
                                            <Text className="text-red-500 text-sm">Xóa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                <View className="flex-row items-center justify-between px-4 py-2">
                    <Text className="text-lg font-bold text-gray-800">Tổng tiền:</Text>
                    <Text className="text-xl font-bold text-red-600">{formatCurrency(totalPrice)}</Text>
                </View>
                <TouchableOpacity
                    onPress={handleConfirmBooking}
                    disabled={bookingLoading}
                    className={`mx-4 mb-4 py-4 rounded-lg ${bookingLoading ? 'bg-gray-400' : 'bg-red-600'}`}
                >
                    <Text className="text-white text-center text-lg font-bold">
                        {bookingLoading ? 'Đang xử lý...' : 'Đặt ngay'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isPromotionModalVisible}
                onRequestClose={() => setIsPromotionModalVisible(false)}
            >
                <View className="flex-1 bg-black/50">
                    <View className="bg-white rounded-t-3xl mt-auto p-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800">Chọn mã giảm giá</Text>
                            <TouchableOpacity onPress={() => setIsPromotionModalVisible(false)}>
                                <Text className="text-blue-600 text-sm">Đóng</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView className="max-h-[400px]">
                            {promotionsLoading ? (
                                <Text className="text-gray-600 text-center">Đang tải mã giảm giá...</Text>
                            ) : promotionsUser.length === 0 ? (
                                <Text className="text-gray-600 text-center">Không có mã giảm giá nào</Text>
                            ) : (
                                promotionsUser.map((promotion: any , index: any) => (
                                    <TouchableOpacity
                                        key={promotion.id || `promotion-${index}`}
                                        onPress={() => {
                                            if (isVoucherExpired(promotion.end_date)) return; // disable if expired
                                            setSelectedPromotion(promotion);
                                            setIsPromotionModalVisible(false);
                                        }}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3"
                                    >
                                        <View className="flex-row justify-between items-center">
                                            <View>
                                                <Text className="text-base font-semibold text-gray-800">
                                                    {promotion.promotion_code}
                                                </Text>
                                                <Text className="text-sm text-gray-600">
                                                    {promotion.description || 'Giảm giá đặc biệt'}
                                                </Text>
                                                <Text className={`${isVoucherExpired(promotion.end_date) ? 'text-gray-500' : 'text-green-600'} text-sm font-bold`}>
                                                    {`Giảm ${Number(promotion.discount).toFixed(0)}%`}
                                                </Text>
                                            </View>
                                            {isVoucherExpired(promotion.end_date) ? (
                                                <View className="bg-gray-300 rounded-full px-4 py-2">
                                                    <Text className="text-white text-sm font-semibold">Hết hạn</Text>
                                                </View>
                                            ) : (
                                                <View className={`rounded-full px-4 py-2 ${selectedPromotion?.id === promotion.id ? 'bg-green-600' : 'bg-blue-600'}`}>
                                                    <Text className="text-white text-sm font-semibold">
                                                        {selectedPromotion?.id === promotion.id ? 'Đã chọn' : 'Áp dụng'}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}