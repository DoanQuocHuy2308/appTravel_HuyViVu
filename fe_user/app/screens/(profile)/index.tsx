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
    Alert
} from "react-native";
import useUser from "@/hooks/useUser"
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "@/components/header";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { getProvinces, getDistricts, getWards, Province, District, Ward } from "@/services/locationService";

export default function ProfileScreen() {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [name, setName] = useState("Doãn Quốc Huy");
    const [email, setEmail] = useState("huyvip@example.com");
    const [phone, setPhone] = useState("0901234567");
    const [country, setCountry] = useState("Việt Nam");
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [province, setProvince] = useState<number | null>(null);
    const [district, setDistrict] = useState<number | null>(null);
    const [ward, setWard] = useState<number | null>(null);
    const [address, setAddress] = useState("Quận 1, Phuong 1, Khu phố 1");
    const [openProvince, setOpenProvince] = useState(false);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [openWard, setOpenWard] = useState(false);
    const [dob, setDob] = useState<Date>(new Date(2000, 8, 19));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { user } = useUser();
    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDob(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")
            }/${date.getFullYear()}`;
    };
    useEffect(() => {
        (async () => {
            const data = await getProvinces();
            setProvinces(data);
        })();
    }, []);

    useEffect(() => {
        if (province) {
            (async () => {
                const data = await getDistricts(province);
                setDistricts(data);
                setDistrict(null);
                setWard(null);
                setWards([]);
            })();
        }
    }, [province]);

    useEffect(() => {
        if (district) {
            (async () => {
                const data = await getWards(district);
                setWards(data);
                setWard(null);
            })();
        }
    }, [district]);

    const requestPermissions = async () => {
        const { status: libraryStatus } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus !== "granted") {
            alert("Bạn cần cấp quyền truy cập thư viện ảnh.");
            return false;
        }

        const { status: cameraStatus } =
            await ImagePicker.requestCameraPermissionsAsync();
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
            setAvatar(result.assets[0].uri);
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
            setAvatar(result.assets[0].uri);
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView className="flex-1 bg-white">
                <Header title="Trang cá nhân" />
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="items-center mt-6">
                        <TouchableOpacity onPress={chooseImageOption}>
                            <View className="relative">
                                <Image
                                    source={
                                        avatar
                                            ? { uri: avatar }
                                            : require("@/assets/images/iconHuyViVu.png")
                                    }
                                    className="w-28 h-28 rounded-full border-4 border-[#318b89]"
                                />
                                <View className="absolute bottom-1 right-1 bg-[#318b89] rounded-full p-2">
                                    <Ionicons name="camera-outline" size={18} color="white" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text className="mt-3 text-lg font-semibold text-gray-900">
                            {name}
                        </Text>
                        <Text className="text-sm text-gray-500">{email}</Text>
                    </View>
                    <View className="px-6 mt-6">
                        <Text className="text-sm text-gray-600 mb-1">Họ và tên: </Text>
                        <TextInput
                            className="border border-gray-300 text-base rounded-xl px-3 py-3 mb-4"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text className="text-sm text-gray-600 mb-1">Email</Text>
                        <TextInput
                            className="border border-gray-300 rounded-xl text-base px-3 py-3 mb-4"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text className="text-sm text-gray-600 mb-1">Số điện thoại</Text>
                        <TextInput
                            className="border border-gray-300 rounded-xl text-base px-3 py-3 mb-4"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />

                        <Text className="text-sm text-gray-600 mb-1">Ngày sinh</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="border border-gray-300 rounded-xl px-3 py-3 mb-6"
                        >
                            <Text className="text-base text-gray-800">{formatDate(dob)}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dob}
                                mode="date"
                                display="spinner"
                                maximumDate={new Date()}
                                onChange={onChangeDate}
                            />
                        )}
                        <View className="flex-row justify-between gap-2">
                            <View className="w-[50%]">
                                <Text className="text-sm text-gray-600 mb-1">Quốc Gia</Text>
                                <TextInput
                                    className="border border-gray-300 bg-gray-100 rounded-xl text-base px-3 py-3 mb-4"
                                    keyboardType="phone-pad"
                                    value={country}
                                    onChangeText={setCountry}
                                    readOnly
                                />
                            </View>
                            <View className="w-[50%]">
                                <Text className="text-sm text-gray-600 mb-1">Tỉnh/Thành phố</Text>
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
                                        borderRadius: 12,
                                        marginBottom: 16,
                                    }}
                                    dropDownContainerStyle={{
                                        borderColor: "#d1d5db",
                                        borderRadius: 12,
                                    }}
                                    textStyle={{
                                        fontSize: 14,
                                        color: "#374151",
                                    }}
                                />
                            </View>
                        </View>
                        <View className="flex-row justify-between gap-2">
                            <View className="w-[50%]">
                                <Text className="text-sm text-gray-600 mb-1">Quận/Huyện</Text>
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
                                        borderRadius: 12,
                                        marginBottom: 16,
                                    }}
                                    dropDownContainerStyle={{
                                        borderColor: "#d1d5db",
                                        borderRadius: 12,
                                    }}
                                    textStyle={{
                                        fontSize: 14,
                                        color: "#374151",
                                    }}
                                />
                            </View>

                            <View className="w-[50%]">
                                <Text className="text-sm text-gray-600 mb-1">Xã/Phường</Text>
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
                                        borderRadius: 12,
                                        marginBottom: 24,
                                    }}
                                    dropDownContainerStyle={{
                                        borderColor: "#d1d5db",
                                        borderRadius: 12,
                                    }}
                                    textStyle={{
                                        fontSize: 14,
                                        color: "#374151",
                                    }}
                                />
                            </View>
                        </View>
                        <Text className="text-sm text-gray-600 mb-1">Địa Chỉ:</Text>
                        <TextInput
                            className="border border-gray-300 rounded-xl text-base px-3 py-3 mb-4"
                            value={address}
                            onChangeText={setAddress}
                        />
                        <TouchableOpacity className="bg-[#318b89] py-3 rounded-xl items-center">
                            <Text className="text-white font-semibold text-base">
                                Lưu thay đổi
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
