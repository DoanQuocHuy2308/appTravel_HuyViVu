import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert,
    Modal,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import useUser from "@/hooks/useUser";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "@/components/header";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useProvinces } from "@/hooks/useProvinces";
import { API_URL } from "@/types/url";
import { User } from "@/types";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
    const router = useRouter();
    const { provinces, districts, wards, selectedProvince, setSelectedProvince, selectedDistrict, setSelectedDistrict } = useProvinces();
    const [openProvince, setOpenProvince] = useState(false);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [openWard, setOpenWard] = useState(false);

    const [province, setProvince] = useState<number | null>(null);
    const [district, setDistrict] = useState<number | null>(null);
    const [ward, setWard] = useState<number | null>(null);
    const [country, setCountry] = useState<string>("Việt Nam");
    const [address, setAddress] = useState<string>("");
    const [saving, setSaving] = useState(false);
    
    const { user, update, deleteUser, changePassword, loading } = useUser();
    const [profile, setProfile] = useState<User | null>(null);

    // Password change modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Account deletion modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const [showDatePicker, setShowDatePicker] = useState(false);
    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setProfile((prev) => prev ? { ...prev, birthday: selectedDate.toISOString() } : null);
        }
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return "Chưa cập nhật";
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString("vi-VN");
    };

    const requestPermissions = async () => {
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus !== "granted") {
            alert("Bạn cần cấp quyền truy cập thư viện ảnh.");
            return false;
        }

        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== "granted") {
            alert("Bạn cần cấp quyền sử dụng camera.");
            return false;
        }

        return true;
    };

    const pickImageFromLibrary = async () => {
        const ok = await requestPermissions();
        if (!ok) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setProfile((prev) => ({ ...prev!, image: result.assets[0].uri }));
        }
    };

    const takePhoto = async () => {
        const ok = await requestPermissions();
        if (!ok) return;

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setProfile((prev) => ({ ...prev!, image: result.assets[0].uri }));
        }
    };

    const chooseImageOption = () => {
        Alert.alert(
            "Chọn ảnh",
            "Bạn muốn sử dụng ảnh từ đâu?",
            [
                { text: "Chụp ảnh", onPress: takePhoto },
                { text: "Thư viện", onPress: pickImageFromLibrary },
                { text: "Hủy", style: "cancel" },
            ],
            { cancelable: true }
        );
    };

    const handleSaveProfile = async () => {
        if (!profile) return;
        
        // Validation nếu có nhập mật khẩu mới
        if (newPassword && newPassword.trim() !== '') {
            if (newPassword !== confirmPassword) {
                Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp");
                return;
            }
            if (newPassword.length < 6) {
                Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
                return;
            }
        }
        
        setSaving(true);
        try {
            // Chuẩn bị dữ liệu cập nhật - CHỈ gửi các trường cần thiết
            const updateData: any = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                birthday: profile.birthday,
                address: profile.address,
                image: profile.image,
                role: profile.role,
                points: profile.points
            };

            // CHỈ thêm password nếu thực sự có nhập mật khẩu mới
            if (newPassword && newPassword.trim() !== '') {
                updateData.password = newPassword;
                console.log('Có thay đổi mật khẩu mới:', newPassword);
            } else {
                // KHÔNG gửi trường password nếu không có mật khẩu mới
                console.log('Không thay đổi mật khẩu - giữ nguyên mật khẩu cũ');
            }
            
            console.log('Data gửi lên server:', updateData);
            
            const updatedUser = await update(updateData);
            
            // Debug: Log dữ liệu trước khi cập nhật
            console.log('Updated user from server:', updatedUser);
            
            // Cập nhật state với dữ liệu mới từ server
            setProfile(updatedUser);
            setAddress(updatedUser.address || "");
            
            // Clear password fields
            setNewPassword("");
            setConfirmPassword("");
            setCurrentPassword("");
            
            Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật!");
        } catch (error) {
            console.error("Error saving profile:", error);
            Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword || !currentPassword) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        try {
            await changePassword(user!.id, currentPassword, newPassword);
            Alert.alert("Thành công", "Mật khẩu đã được thay đổi!");
            setShowPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể thay đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.");
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "XÓA TÀI KHOẢN") {
            Alert.alert("Lỗi", "Vui lòng nhập chính xác 'XÓA TÀI KHOẢN' để xác nhận");
            return;
        }

        Alert.alert(
            "Xác nhận xóa tài khoản",
            "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa tài khoản",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteUser(user!.id);
                            Alert.alert("Thành công", "Tài khoản đã được xóa");
                            router.replace("/screens/(intro)");
                        } catch (error) {
                            Alert.alert("Lỗi", "Không thể xóa tài khoản. Vui lòng thử lại.");
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        if (user) {
            setProfile({ ...user });
            setAddress(user.address || "");
        }
    }, [user]);

    useEffect(() => {
        if (province) setSelectedProvince(province);
    }, [province, setSelectedProvince]);

    useEffect(() => {
        if (district) setSelectedDistrict(district);
    }, [district, setSelectedDistrict]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView className="flex-1 bg-gray-50">
                <Header title="Trang cá nhân" />
                
                {/* Hero Section with Gradient */}
                <LinearGradient
                    colors={['#318b89', '#2d7a78']}
                    className="h-32"
                >
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-white text-xl font-bold">Hồ sơ cá nhân</Text>
                        <Text className="text-white/80 text-sm mt-1">Quản lý thông tin của bạn</Text>
                    </View>
                </LinearGradient>

                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    className="flex-1 -mt-8"
                >
                    {/* Profile Header Card */}
                    <View className="bg-white mx-4 rounded-3xl p-6 shadow-lg border border-gray-100">
                        <View className="items-center">
                            <TouchableOpacity onPress={chooseImageOption} className="relative">
                                <View className="relative">
                                    <Image
                                        source={
                                            profile?.image
                                                ? { uri: typeof profile.image === 'string' && profile.image.startsWith("http") ? profile.image : API_URL + profile.image }
                                                : user?.image
                                                ? { uri: typeof user.image === 'string' && user.image.startsWith("http") ? user.image : API_URL + user.image }
                                                : require("@/assets/images/iconHuyViVu.png")
                                        }
                                        className="w-28 h-28 rounded-full border-4 border-[#318b89]"
                                    />
                                    <View className="absolute -bottom-1 -right-1 bg-[#318b89] rounded-full p-3 shadow-lg">
                                        <Ionicons name="camera" size={20} color="white" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <Text className="mt-4 text-2xl font-bold text-gray-900">
                                {profile?.name || user?.name}
                            </Text>
                            <Text className="text-gray-500 text-sm">{profile?.email || user?.email}</Text>
                            <View className="flex-row items-center mt-2 bg-green-50 px-4 py-2 rounded-full">
                                <Ionicons name="star" size={16} color="#10b981" />
                                <Text className="text-green-700 font-semibold ml-1">
                                    {profile?.points || 0} điểm tích lũy
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Personal Information Card */}
                    <View className="bg-white mx-4 mt-6 rounded-3xl p-6 shadow-lg border border-gray-100">
                        <View className="flex-row items-center mb-6">
                            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                <Ionicons name="person" size={20} color="#3b82f6" />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">Thông tin cá nhân</Text>
                        </View>
                        
                        <View className="space-y-5">
                            <View>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Họ và tên</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                    <Ionicons name="person-outline" size={20} color="#6b7280" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-gray-800"
                                        value={profile?.name || ""}
                                        onChangeText={(text) => setProfile((prev) => prev ? { ...prev, name: text } : null)}
                                        placeholder="Nhập họ và tên"
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                    <Ionicons name="mail-outline" size={20} color="#6b7280" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-gray-800"
                                        value={profile?.email || ""}
                                        onChangeText={(text) => setProfile((prev) => prev ? { ...prev, email: text } : null)}
                                        keyboardType="email-address"
                                        placeholder="Nhập email"
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Số điện thoại</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                    <Ionicons name="call-outline" size={20} color="#6b7280" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-gray-800"
                                        keyboardType="phone-pad"
                                        value={profile?.phone || ""}
                                        onChangeText={(text) => setProfile((prev) => prev ? { ...prev, phone: text } : null)}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Ngày sinh</Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200"
                                >
                                    <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                                    <Text className="ml-3 text-base text-gray-800">{formatDate(profile?.birthday)}</Text>
                                </TouchableOpacity>
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={profile?.birthday ? (typeof profile.birthday === 'string' ? new Date(profile.birthday) : profile.birthday) : new Date()}
                                    mode="date"
                                    display="spinner"
                                    maximumDate={new Date()}
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>
                    </View>

                    {/* Address Information Card */}
                    <View className="bg-white mx-4 mt-6 rounded-3xl p-6 shadow-lg border border-gray-100">
                        <View className="flex-row items-center mb-6">
                            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                                <Ionicons name="location" size={20} color="#10b981" />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">Địa chỉ</Text>
                        </View>
                        
                        <View className="space-y-5">
                            <View className="flex-row justify-between gap-3">
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Quốc gia</Text>
                                    <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
                                        <Ionicons name="flag-outline" size={20} color="#6b7280" />
                                        <TextInput
                                            className="flex-1 ml-3 text-base text-gray-800"
                                            value={country}
                                            editable={false}
                                        />
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Tỉnh/Thành phố</Text>
                                    <DropDownPicker
                                        open={openProvince}
                                        value={province}
                                        items={provinces.map((p) => ({ label: p.name, value: p.code }))}
                                        setOpen={setOpenProvince}
                                        setValue={setProvince}
                                        placeholder="Chọn tỉnh/thành phố"
                                        listMode="MODAL"
                                        style={{
                                            borderColor: "#d1d5db",
                                            borderRadius: 16,
                                        }}
                                        dropDownContainerStyle={{
                                            borderColor: "#d1d5db",
                                            borderRadius: 16,
                                        }}
                                        textStyle={{
                                            fontSize: 16,
                                            color: "#374151",
                                        }}
                                    />
                                </View>
                            </View>

                            <View className="flex-row justify-between gap-3">
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Quận/Huyện</Text>
                                    <DropDownPicker
                                        open={openDistrict}
                                        value={district}
                                        items={districts.map((d) => ({ label: d.name, value: d.code }))}
                                        setOpen={setOpenDistrict}
                                        setValue={setDistrict}
                                        placeholder="Chọn quận/huyện"
                                        listMode="MODAL"
                                        disabled={!province}
                                        style={{
                                            borderColor: "#d1d5db",
                                            borderRadius: 16,
                                        }}
                                        dropDownContainerStyle={{
                                            borderColor: "#d1d5db",
                                            borderRadius: 16,
                                        }}
                                        textStyle={{
                                            fontSize: 16,
                                            color: "#374151",
                                        }}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Xã/Phường</Text>
                                    <DropDownPicker
                                        open={openWard}
                                        value={ward}
                                        items={wards.map((w) => ({ label: w.name, value: w.code }))}
                                        setOpen={setOpenWard}
                                        setValue={setWard}
                                        placeholder="Chọn xã/phường"
                                        listMode="MODAL"
                                        disabled={!district}
                                        style={{
                                            borderColor: "#d1d5db",
                                            borderRadius: 16,
                                        }}
                                        dropDownContainerStyle={{
                                            borderColor: "#d1d5db",
                                            borderRadius: 16,
                                        }}
                                        textStyle={{
                                            fontSize: 16,
                                            color: "#374151",
                                        }}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Địa chỉ chi tiết</Text>
                                <View className="flex-row items-start bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                    <Ionicons name="home-outline" size={20} color="#6b7280" className="mt-1" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-gray-800"
                                        value={address}
                                        onChangeText={(text) => {
                                            setAddress(text);
                                            setProfile((prev) => prev ? { ...prev, address: text } : null);
                                        }}
                                        placeholder="Nhập địa chỉ chi tiết"
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới (để trống nếu không muốn thay đổi)</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                    <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-gray-800"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                </View>
                            </View>

                            {newPassword && newPassword.trim() !== '' && (
                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</Text>
                                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                        <Ionicons name="checkmark-circle-outline" size={20} color="#6b7280" />
                                        <TextInput
                                            className="flex-1 ml-3 text-base text-gray-800"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Security & Account Actions */}
                    <View className="bg-white mx-4 mt-6 rounded-3xl p-6 shadow-lg border border-gray-100">
                        <View className="flex-row items-center mb-6">
                            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                                <Ionicons name="shield-checkmark" size={20} color="#f59e0b" />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">Bảo mật & Tài khoản</Text>
                        </View>
                        
                        <View className="space-y-4">
                            <TouchableOpacity 
                                className="flex-row items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-200"
                                onPress={() => setShowPasswordModal(true)}
                            >
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                        <Ionicons name="key" size={20} color="#3b82f6" />
                                    </View>
                                    <View>
                                        <Text className="text-base font-semibold text-gray-800">Đổi mật khẩu</Text>
                                        <Text className="text-sm text-gray-500">Cập nhật mật khẩu bảo mật</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                className="flex-row items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-200"
                                onPress={() => setShowDeleteModal(true)}
                            >
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                                        <Ionicons name="trash" size={20} color="#ef4444" />
                                    </View>
                                    <View>
                                        <Text className="text-base font-semibold text-gray-800">Xóa tài khoản</Text>
                                        <Text className="text-sm text-gray-500">Xóa vĩnh viễn tài khoản</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity 
                        className={`mx-4 mt-8 py-4 rounded-2xl items-center shadow-lg ${saving ? 'bg-gray-400' : 'bg-[#318b89]'}`}
                        onPress={handleSaveProfile}
                        disabled={saving}
                    >
                        <View className="flex-row items-center">
                            {saving ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Ionicons name="save" size={20} color="white" />
                            )}
                            <Text className="text-white font-bold text-lg ml-2">
                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                {/* Password Change Modal */}
                <Modal
                    visible={showPasswordModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowPasswordModal(false)}
                >
                    <View className="flex-1 bg-black/50 justify-end">
                        <View className="bg-white rounded-t-3xl p-6">
                            <View className="flex-row justify-between items-center mb-6">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                        <Ionicons name="key" size={20} color="#3b82f6" />
                                    </View>
                                    <Text className="text-xl font-bold text-gray-800">Đổi mật khẩu</Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                                    <Ionicons name="close" size={24} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            <View className="space-y-4">
                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</Text>
                                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                        <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                                        <TextInput
                                            className="flex-1 ml-3 text-base text-gray-800"
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            secureTextEntry
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</Text>
                                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                        <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                                        <TextInput
                                            className="flex-1 ml-3 text-base text-gray-800"
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            secureTextEntry
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</Text>
                                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                        <Ionicons name="checkmark-circle-outline" size={20} color="#6b7280" />
                                        <TextInput
                                            className="flex-1 ml-3 text-base text-gray-800"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row space-x-3 mt-6">
                                <TouchableOpacity 
                                    className="flex-1 py-4 bg-gray-200 rounded-2xl"
                                    onPress={() => setShowPasswordModal(false)}
                                >
                                    <Text className="text-center font-semibold text-gray-700">Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className="flex-1 py-4 bg-[#318b89] rounded-2xl"
                                    onPress={handleChangePassword}
                                >
                                    <Text className="text-center font-semibold text-white">Đổi mật khẩu</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Delete Account Modal */}
                <Modal
                    visible={showDeleteModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowDeleteModal(false)}
                >
                    <View className="flex-1 bg-black/50 justify-end">
                        <View className="bg-white rounded-t-3xl p-6">
                            <View className="flex-row justify-between items-center mb-6">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                                        <Ionicons name="trash" size={20} color="#ef4444" />
                                    </View>
                                    <Text className="text-xl font-bold text-red-600">Xóa tài khoản</Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                                    <Ionicons name="close" size={24} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="warning" size={20} color="#ef4444" />
                                    <Text className="text-red-800 font-semibold ml-2">Cảnh báo</Text>
                                </View>
                                <Text className="text-red-700 text-sm">
                                    Việc xóa tài khoản sẽ không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị mất vĩnh viễn.
                                </Text>
                            </View>

                            <View>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                    Nhập "XÓA TÀI KHOẢN" để xác nhận
                                </Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                                    <Ionicons name="alert-circle-outline" size={20} color="#6b7280" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-gray-800"
                                        value={deleteConfirmText}
                                        onChangeText={setDeleteConfirmText}
                                        placeholder="XÓA TÀI KHOẢN"
                                    />
                                </View>
                            </View>

                            <View className="flex-row space-x-3 mt-6">
                                <TouchableOpacity 
                                    className="flex-1 py-4 bg-gray-200 rounded-2xl"
                                    onPress={() => setShowDeleteModal(false)}
                                >
                                    <Text className="text-center font-semibold text-gray-700">Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className="flex-1 py-4 bg-red-600 rounded-2xl"
                                    onPress={handleDeleteAccount}
                                >
                                    <Text className="text-center font-semibold text-white">Xóa tài khoản</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}