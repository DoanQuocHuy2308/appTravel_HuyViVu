import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {accAPI} from '@/services/accAPI';
import { ToastContext } from '@/contexts/ToastContext';
import { useContext } from 'react';
import useLocation from '@/hooks/location';
import { API_URL } from '@/types/url';

const { width } = Dimensions.get('window');

export default function Register() {
  const router = useRouter();
  const { showToast } = useContext(ToastContext);
  const { provinces, districts, wards, loading, getAllDistricts, getAllWards } = useLocation();
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '', 
    address: '',
    province: '',
    district: '',
    ward: '',
    detailAddress: ''
  });
  
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [emailError, setEmailError] = useState<string>('');
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);

  const handleProvinceSelect = async (province: any) => {
    console.log('Selected province:', province);
    setSelectedProvince(province);
    setForm(prev => ({ ...prev, province: province.name, district: '', ward: '' }));
    setShowProvinceModal(false);
    setSelectedDistrict(null);
    setSelectedWard(null);
    await getAllDistricts(province.code);
  };

  const handleDistrictSelect = async (district: any) => {
    console.log('Selected district:', district);
    setSelectedDistrict(district);
    setForm(prev => ({ ...prev, district: district.name, ward: '' }));
    setShowDistrictModal(false);
    setSelectedWard(null);
    await getAllWards(district.code);
  };

  const handleWardSelect = (ward: any) => {
    console.log('Selected ward:', ward);
    setSelectedWard(ward);
    setForm(prev => ({ ...prev, ward: ward.name }));
    setShowWardModal(false);
  };

  // Hàm kiểm tra email trùng lặp
  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailError('');
      return;
    }
    
    setIsCheckingEmail(true);
    try {
      const response = await fetch(`${API_URL}acc/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setEmailError('');
      } else {
        setEmailError(data.message || 'Email đã được sử dụng');
      }
    } catch (error) {
      console.log('Lỗi kiểm tra email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Debounce function để tránh gọi API quá nhiều lần
  const debouncedCheckEmail = (() => {
    let timeoutId: NodeJS.Timeout;
    return (email: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        checkEmailExists(email);
      }, 500);
    };
  })();

  const handleRegister = async () => {
    console.log('Form state:', form);
    if (!form.name || !form.email || !form.password || !form.phone || !form.province || !form.district || !form.ward || !form.detailAddress) {
      showToast('error', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast('error', 'Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    
    // Kiểm tra email trùng lặp
    if (emailError) {
      showToast('error', emailError);
      return;
    }
    
    // Kiểm tra nếu đang kiểm tra email
    if (isCheckingEmail) {
      showToast('error', 'Vui lòng đợi kiểm tra email...');
      return;
    }
    
    try {
      const fullAddress = `${form.detailAddress}, ${form.ward}, ${form.district}, ${form.province}`;
      const user = await accAPI.register(form.name, form.email, form.password, form.phone, fullAddress);
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        showToast('success', 'Đăng ký thành công!');
        router.replace('/(tabs)');
      } else {
        showToast('error', 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error: any) {
      // Hiển thị thông báo lỗi cụ thể từ backend
      showToast('error', error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const renderLocationModal = (title: string, data: any[], onSelect: (item: any) => void, visible: boolean, onClose: () => void) => (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[70%]">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-[#1B5E20]">{title}</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
              <Icon name="times" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.code.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 border-b border-gray-100"
                onPress={() => onSelect(item)}
              >
                <Text className="text-[#1B5E20] text-base">{item.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8F9FA' }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-2">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
              onPress={() => router.back()}
            >
              <Icon name="arrow-left" size={20} color="#1B5E20" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-[#1B5E20]">Đăng ký</Text>
            <View className="w-10" />
          </View>

          {/* Logo */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-white items-center justify-center shadow-lg mb-4">
              <Image
                source={require('@/assets/images/iconHuyViVu.png')}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
            <Text className="text-2xl font-bold text-[#1B5E20] mb-2">Tạo tài khoản</Text>
            <Text className="text-center text-gray-600 text-sm px-8">
              Khám phá thế giới với chúng tôi
            </Text>
          </View>

          {/* Form */}
          <View className="mx-4 bg-white rounded-2xl p-6 shadow-sm">
            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-[#1B5E20] font-medium mb-2">Họ và tên *</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3">
                <Icon name="user" size={18} color="#1B5E20" />
                <TextInput
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  className="ml-3 flex-1 text-[#1B5E20] text-base"
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-[#1B5E20] font-medium mb-2">Email *</Text>
              <View className={`flex-row items-center border rounded-xl bg-gray-50 px-4 py-3 ${
                emailError ? 'border-red-500' : 'border-gray-300'
              }`}>
                <Icon name="envelope" size={18} color={emailError ? "#EF4444" : "#1B5E20"} />
                <TextInput
                  value={form.email}
                  onChangeText={(text) => {
                    setForm({ ...form, email: text });
                    debouncedCheckEmail(text);
                  }}
                  className="ml-3 flex-1 text-[#1B5E20] text-base"
                  placeholder="Nhập email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isCheckingEmail && (
                  <Icon name="spinner" size={16} color="#1B5E20" />
                )}
              </View>
              {emailError && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{emailError}</Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-[#1B5E20] font-medium mb-2">Mật khẩu *</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3">
                <Icon name="lock" size={18} color="#1B5E20" />
                <TextInput
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  className="ml-3 flex-1 text-[#1B5E20] text-base"
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="text-[#1B5E20] font-medium mb-2">Số điện thoại *</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3">
                <Icon name="phone" size={18} color="#1B5E20" />
                <TextInput
                  value={form.phone}
                  onChangeText={(text) => setForm({ ...form, phone: text })}
                  className="ml-3 flex-1 text-[#1B5E20] text-base"
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Province */}
            <View className="mb-4">
              <Text className="text-[#1B5E20] font-medium mb-2">Tỉnh/Thành phố *</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3"
                onPress={() => setShowProvinceModal(true)}
              >
                <Icon name="map-marker" size={18} color="#1B5E20" />
                <Text 
                  style={{
                    marginLeft: 12,
                    flex: 1,
                    fontSize: 16,
                    color: form.province ? '#1B5E20' : '#9CA3AF'
                  }}
                >
                  {form.province || 'Chọn tỉnh/thành phố'}
                </Text>
                <Icon name="chevron-down" size={16} color="#1B5E20" />
              </TouchableOpacity>
            </View>

            {/* District */}
            <View className="mb-4">
              <Text className="text-[#1B5E20] font-medium mb-2">Quận/Huyện *</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3"
                onPress={() => selectedProvince ? setShowDistrictModal(true) : null}
                disabled={!selectedProvince}
              >
                <Icon name="map-marker" size={18} color={selectedProvince ? "#1B5E20" : "#9CA3AF"} />
                <Text 
                  style={{
                    marginLeft: 12,
                    flex: 1,
                    fontSize: 16,
                    color: form.district ? '#1B5E20' : '#9CA3AF'
                  }}
                >
                  {form.district || 'Chọn quận/huyện'}
                </Text>
                <Icon name="chevron-down" size={16} color={selectedProvince ? "#1B5E20" : "#9CA3AF"} />
              </TouchableOpacity>
            </View>

            {/* Ward */}
            <View className="mb-4">
              <Text className="text-[#1B5E20] font-medium mb-2">Phường/Xã *</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3"
                onPress={() => selectedDistrict ? setShowWardModal(true) : null}
                disabled={!selectedDistrict}
              >
                <Icon name="map-marker" size={18} color={selectedDistrict ? "#1B5E20" : "#9CA3AF"} />
                <Text 
                  style={{
                    marginLeft: 12,
                    flex: 1,
                    fontSize: 16,
                    color: form.ward ? '#1B5E20' : '#9CA3AF'
                  }}
                >
                  {form.ward || 'Chọn phường/xã'}
                </Text>
                <Icon name="chevron-down" size={16} color={selectedDistrict ? "#1B5E20" : "#9CA3AF"} />
              </TouchableOpacity>
            </View>

            {/* Detail Address */}
            <View className="mb-6">
              <Text className="text-[#1B5E20] font-medium mb-2">Địa chỉ chi tiết *</Text>
              <View className="flex-row items-start border border-gray-300 rounded-xl bg-gray-50 px-4 py-3">
                <Icon name="home" size={18} color="#1B5E20" style={{ marginTop: 2 }} />
                <TextInput
                  value={form.detailAddress}
                  onChangeText={(text) => setForm({ ...form, detailAddress: text })}
                  className="ml-3 flex-1 text-[#1B5E20] text-base"
                  placeholder="Số nhà, tên đường..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className="bg-[#1B5E20] py-4 rounded-xl items-center mb-4 shadow-sm"
              onPress={handleRegister}
            >
              <Text className="text-white text-lg font-semibold">Đăng ký</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600">Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.replace('/screens/(acc)/login')}>
                <Text className="text-[#1B5E20] font-semibold">Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Location Modals */}
        {renderLocationModal(
          'Chọn tỉnh/thành phố',
          provinces,
          handleProvinceSelect,
          showProvinceModal,
          () => setShowProvinceModal(false)
        )}
        
        {renderLocationModal(
          'Chọn quận/huyện',
          districts,
          handleDistrictSelect,
          showDistrictModal,
          () => setShowDistrictModal(false)
        )}
        
        {renderLocationModal(
          'Chọn phường/xã',
          wards,
          handleWardSelect,
          showWardModal,
          () => setShowWardModal(false)
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
