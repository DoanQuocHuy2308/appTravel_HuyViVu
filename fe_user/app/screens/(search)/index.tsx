import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "@/components/back";
import { Search, MapPinned, CalendarDays, Hotel, Circle, Key, DeleteIcon } from "lucide-react-native";
import React, { useState, useMemo } from "react";

const hotTours = [
    {
        id: "1",
        title: "Hà Nội – Hạ Long 3N2Đ",
        image:
            "https://bizweb.dktcdn.net/100/230/316/files/ha-long-2.jpg?v=1507441090691",
        location_start: "Hà Nội",
        location_end: "Hạ Long",
        date: "20/09/2025",
        hotel: "Vinpearl Resort",
        old_price: "4.990.000₫",
        price: "3.990.000₫",
    },
    {
        id: "2",
        title: "TP.HCM – Phú Quốc 4N3Đ",
        image:
            "https://pttravel.vn/wp-content/uploads/2023/12/langbiang-tour-da-lat-va-sai-gon-5-ngay-4-dem.jpg",
        location_start: "TP.HCM",
        location_end: "Phú Quốc",
        date: "05/10/2025",
        hotel: "Novotel Phú Quốc",
        old_price: "6.990.000₫",
        price: "5.490.000₫",
    },
    {
        id: "3",
        title: "Đà Nẵng – Huế – Hội An 5N4Đ",
        image:
            "https://vietsensetravel.com/view/at_tour-da-nang--hoi-an--hue-4-ngay_3fdcd1cc937f97275792e79c305b8dc0.jpg",
        location_start: "Đà Nẵng",
        location_end: "Huế – Hội An",
        date: "15/10/2025",
        hotel: "Alba Spa Hotel",
        old_price: "6.990.000₫",
        price: "4.290.000₫",
    },
    {
        id: "4",
        title: "Sài Gòn – Đà Lạt 3N2Đ",
        image:
            "https://cdn.vietnammoi.vn/171464242508312576/2020/6/30/khach-san-da-lat-4-sao-5-sao-7-15935335723001674396939.jpg",
        location_start: "Sài Gòn",
        location_end: "Đà Lạt",
        date: "28/09/2025",
        hotel: "Dalat Palace Hotel",
        old_price: "3.990.000₫",
        price: "2.990.000₫",
    },
];
const newTours = [
    {
        id: "1",
        title: "Hà Nội – Sapa 3N2Đ",
        image:
            "https://statics.vinpearl.com/du-lich-sapa-3-ngay-2-dem-1_1667206785.jpg",
        location_start: "Hà Nội",
        location_end: "Sapa",
        date: "10/11/2025",
        hotel: "Victoria Sapa Resort",
        old_price: "3.990.000₫",
        price: "3.190.000₫",
    },
    {
        id: "2",
        title: "TP.HCM – Nha Trang 4N3Đ",
        image:
            "https://statics.vinpearl.com/nha-trang-4n3d_1688614374.jpg",
        location_start: "TP.HCM",
        location_end: "Nha Trang",
        date: "15/11/2025",
        hotel: "Vinpearl Nha Trang",
        old_price: "5.990.000₫",
        price: "4.990.000₫",
    },
    {
        id: "3",
        title: "Đà Nẵng – Quảng Bình – Phong Nha 5N4Đ",
        image:
            "https://static.vinwonders.com/2023/04/du-lich-quang-binh.jpg",
        location_start: "Đà Nẵng",
        location_end: "Quảng Bình",
        date: "25/11/2025",
        hotel: "Sun Spa Resort Quảng Bình",
        old_price: "6.490.000₫",
        price: "5.490.000₫",
    },
    {
        id: "4",
        title: "Sài Gòn – Côn Đảo 3N2Đ",
        image:
            "https://ik.imagekit.io/tvlk/blog/2023/08/du-lich-con-dao-1.jpg",
        location_start: "Sài Gòn",
        location_end: "Côn Đảo",
        date: "02/12/2025",
        hotel: "Six Senses Côn Đảo",
        old_price: "7.490.000₫",
        price: "6.490.000₫",
    },
];
const keySearch = [
    { id: "1", keyword: "Tour Đà Nẵng" },
    { id: "2", keyword: "Tour Sapa" },
    { id: "3", keyword: "Tour Phú Quốc" },
    { id: "4", keyword: "Tour Nha Trang" },
    { id: "5", keyword: "Tour Hạ Long" },
    { id: "6", keyword: "Tour Côn Đảo" },
    { id: "7", keyword: "Tour Đà Lạt" },
    { id: "8", keyword: "Tour Bangkok" },
    { id: "9", keyword: "Tour Singapore" },
    { id: "10", keyword: "Tour Maldives" },
    { id: "11", keyword: "Tour giá rẻ" },
    { id: "12", keyword: "Tour nghỉ dưỡng 5 sao" },
    { id: "13", keyword: "Tour cuối tuần" },
    { id: "14", keyword: "Tour trăng mật" },
    { id: "15", keyword: "Tour đi bằng máy bay" },
    { id: "16", keyword: "Tour đi xe ô tô" },
    { id: "17", keyword: "Tour tự túc" },
    { id: "18", keyword: "Tour trong nước" },
    { id: "19", keyword: "Tour quốc tế" },
    { id: "20", keyword: "Combo khách sạn + vé máy bay" },
];

export default function SearchScreen() {
    const [key, setKey] = useState<string>("");
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center px-4">
                <ButtonBack />
                <View
                    className="flex-row items-center flex-1 bg-gray-100 rounded-full px-4 ml-3 border border-gray-200"
                    style={{ height: 45 }}
                >
                    <Search size={20} color={"#555"} />
                    <TextInput
                        placeholder="Tìm kiếm tour, địa điểm..."
                        placeholderTextColor="#888"
                        className="flex-1 ml-2 text-base text-gray-700"
                        value={key}
                        onChangeText={(text: string) => setKey(text)}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        className="w-10 h-10 bg-[#08703f] rounded-full items-center justify-center"
                        onPress={() => setKey("")}
                    >
                        <DeleteIcon size={20} color={"#fff"} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView className="px-4 flex-1 bg-gray-50 mt-2 py-5">
                <View className="mb-6 px-4">
                    <Text className="text-2xl font-bold text-[#08703f]">
                        Xu Hướng Tìm Kiếm Nổi Bật
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <Key size={18} color={"#08703f"} />
                        <Text className="text-base text-gray-600 ml-2">
                            Từ Khóa Tìm Kiếm
                        </Text>
                    </View>
                    <ScrollView
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        style={{
                            maxHeight: 150,
                        }}
                        contentContainerStyle={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 12,
                        }}
                    >
                        {keySearch.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                className="flex-row items-center bg-gray-100 border border-[#08703f]/30 py-2 px-3 rounded-full"
                                activeOpacity={0.7}
                                style={{
                                    elevation: 1,
                                }}
                                onPress={() => setKey(item.keyword)}
                            >
                                <Key size={16} color={"#08703f"} />
                                <Text className="text-sm text-[#08703f] ml-2 font-medium">
                                    {item.keyword}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>


                <Text className="text-2xl font-bold text-[#08703f] mb-3">
                    Tour Hot Nhất
                </Text>
                <FlatList
                    data={hotTours}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 4 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden mr-4"
                            style={{
                                width: 250,
                                elevation: 4,
                                marginBottom: 10,
                            }}
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: "100%",
                                    height: 150,
                                    borderTopLeftRadius: 16,
                                    borderTopRightRadius: 16,
                                }}
                                resizeMode="cover"
                            />

                            <View className="p-3">
                                <Text
                                    className="font-extrabold text-[#08703f] text-base mb-2"
                                    numberOfLines={2}
                                >
                                    {item.title}
                                </Text>

                                <View className="flex-row items-center mb-2">
                                    <MapPinned size={14} color="#08703f" />
                                    <Text className="mx-1 text-sm text-gray-700">
                                        {item.location_start}
                                    </Text>
                                    <Circle size={10} color="#E53935" fill="#E53935" />
                                    <View className="flex-1 mx-1 border-t border-dashed border-gray-400" />
                                    <Circle size={10} color="#08703f" fill="#08703f" />
                                    <Text className="ml-1 text-sm text-gray-700">
                                        {item.location_end}
                                    </Text>
                                </View>

                                <View className="flex-row items-center mb-1">
                                    <CalendarDays size={14} color="#08703f" />
                                    <Text className="ml-2 text-gray-600 text-sm">{item.date}</Text>
                                </View>

                                <View className="flex-row items-center mb-1">
                                    <Hotel size={14} color="#08703f" />
                                    <Text className="ml-2 text-gray-600 text-sm">{item.hotel}</Text>
                                </View>

                                <View className="mt-2 flex-row items-center justify-center gap-3">
                                    <Text
                                        className="text-gray-400 text-lg"
                                        style={{ textDecorationLine: "line-through" }}
                                    >
                                        {item.old_price}
                                    </Text>
                                    <Text className="text-red-600 font-bold text-lg">
                                        {item.price}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <Text className="text-2xl font-bold text-[#08703f] mb-3">
                    Tour Hot Nhất
                </Text>
                <FlatList
                    data={newTours}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 4 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden mr-4"
                            style={{
                                width: 250,
                                elevation: 4,
                                marginBottom: 10,
                            }}
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: "100%",
                                    height: 150,
                                    borderTopLeftRadius: 16,
                                    borderTopRightRadius: 16,
                                }}
                                resizeMode="cover"
                            />
                            <View className="p-3">
                                <Text
                                    className="font-extrabold text-[#08703f] text-base mb-1"
                                    numberOfLines={2}
                                >
                                    {item.title}
                                </Text>

                                <View className="flex-row items-center mb-1">
                                    <MapPinned size={14} color="#08703f" />
                                    <Text className="mx-2 text-gray-700 text-sm">
                                        {item.location_start}
                                    </Text>
                                    <Circle size={10} color="#E53935" fill="#E53935" />
                                    <View className="flex-1 mx-1 border-t border-dashed border-gray-400" />
                                    <Circle size={10} color="#08703f" fill="#08703f" />
                                    <Text className="ml-2 text-gray-700 text-sm">
                                        {item.location_end}
                                    </Text>
                                </View>

                                <View className="flex-row items-center mb-1">
                                    <CalendarDays size={14} color="#08703f" />
                                    <Text className="ml-2 text-gray-600 text-sm">{item.date}</Text>
                                </View>

                                <View className="flex-row items-center mb-1">
                                    <Hotel size={14} color="#08703f" />
                                    <Text className="ml-2 text-gray-600 text-sm">{item.hotel}</Text>
                                </View>

                                <View className="mt-2 flex-row items-center justify-center gap-3">
                                    <Text
                                        className="text-gray-400 text-lg"
                                        style={{ textDecorationLine: "line-through" }}
                                    >
                                        {item.old_price}
                                    </Text>
                                    <Text className="text-red-600 font-bold text-lg">
                                        {item.price}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
