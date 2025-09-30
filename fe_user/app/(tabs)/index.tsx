import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import Navbar from "@/components/navbar";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import {
    Package,
    Hotel,
    Plane,
    Gift,
    Globe,
    Percent,
    Sun,
    Star,
    Ticket,
    LucideIcon,
    MapPin,
    Hash,
    CalendarDays,
    Clock,
    Users,
    Car,
    Clock1,
    Circle
} from "lucide-react-native";
import { FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import placeData from "@/data/places.json"
import exploreData from "@/data/explores.json"
import dealData from "@/data/deals.json"
import regionsData from "@/data/regions.json"
import toursData from "@/data/tours.json"
import destinations from "@/data/destinations.json"
import { User } from "@/types";
const { width } = Dimensions.get("window");
const bannerHeight = 250;

type Opinion = {
    icon: LucideIcon;
    title: string;
    color?: string;
    link: any;
};
const opinions: Opinion[] = [
    { icon: Package, title: "Tour Trọn Gói", link: "/screens/(filterTour)" },
    { icon: Hotel, title: "Khách Sạn", link: "" },
    { icon: Plane, title: "Vé Máy Bay", link: "" },
    { icon: Gift, title: "Combo", link: "" },
    { icon: Globe, title: "Dịch Vụ Khác", link: "" },

    { icon: Percent, title: "Khuyến Mại", color: "#f87171", link: "" },
    { icon: Sun, title: "Thu Khởi Sắc", color: "#f59e0b", link: "" },
    { icon: Star, title: "Ưu Đãi Online Thu", color: "#3b82f6", link: "" },
    { icon: Ticket, title: "Vouchers", color: "#0ea5e9", link: "/screens/(vouchers)" },
];

export default function Home() {
    const router = useRouter();
    const [filter, setFilter] = useState("all");
    const filteredTours =
        filter === "all" ? toursData : toursData.filter((tour) => tour.type === filter);
    const [selectedRegion, setSelectedRegion] = useState("Miền Bắc");
    const filtered = destinations.filter((d) => d.region === selectedRegion);
    // const [user, setUser] = useState<User | null>(null);
    // const getUser = async () => {
    //     const userDataString = await AsyncStorage.getItem("user");
    //     const userData = userDataString ? JSON.parse(userDataString) : null;
    //     if(userData) setUser(userData.user);
    //     else {
    //         router.replace("/screens/(intro)");
    //     }
    // }
    // useEffect(() => {
    //     getUser();
    // })

    return (
        <SafeAreaView className="flex-1 mb-20 bg-[#f7f6eef0]">
            <View className="absolute top-0 left-0 w-full h-[300px] bg-[#00a156] rounded-b-[60px] z-0" />
            <View className="z-0 w-full">
                <View className="absolute top-16 w-full h-[300px] bg-[#08703f] rounded-[70px] z-10" />
                < View className="absolute top-5 w-1/3 h-[150px] right-5 bg-[#63974d] rounded-r-[60px] rounded-l-[90px] z-20" />
                < View className="absolute top-28 w-1/3 h-[150px] left-10 bg-[#63974d] rounded-[60px] z-20" />
                < View className="absolute top-[200px] w-1/3 h-[150px] right-24 bg-[#63974d] rounded-r-[60px] rounded-l-[100px] z-20" />
            </View>
            <ScrollView className="flex-1">
                <View className="px-5 ">
                    <Navbar />
                </View>
                <View className="px-5">
                    <View className="mt-4">
                        <Text className="text-lg text-white font-light mb-1">Xin chào: Doãn Huy</Text>
                        {/* {user ? (
                            <Text className="text-lg text-white font-light mb-1">Xin chào: {user?.name}</Text>
                        ):
                        (
                            <Text className="text-lg text-white font-light mb-1">Bạn hãy đăng nhập để có trải nghiệm tốt nhất !</Text>
                        )} */}
                        <Text className="text-3xl text-white font-extrabold leading-9">
                            WHERE DO YOU {"\n"}WANT TO GO?
                        </Text>
                    </View>
                    <View className="bg-white z-30 mb-5 rounded-3xl p-4 mt-6 flex-wrap flex-row justify-between shadow">
                        {opinions.map((item, index) => {
                            const Icon = item.icon;
                            const bgColor = item.color ? item.color : "#08703f";

                            return (
                                <TouchableOpacity
                                    key={index}
                                    className="w-[20%] items-center mb-4"
                                    activeOpacity={0.8}
                                    onPress={() => router.push(item.link)}
                                >
                                    <View
                                        className="w-14 h-14 rounded-2xl items-center justify-center mb-2 shadow"
                                        style={{ backgroundColor: bgColor }}
                                    >
                                        <Icon size={28} color="white" />
                                    </View>
                                    <Text className="text-xs text-center">{item.title}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <View className="bg-white rounded-2xl">
                    <View className="mt-5 h-[300px] shadow shadow-gray-400">
                        <Swiper
                            autoplay
                            autoplayTimeout={3.5}
                            loop
                            showsPagination
                            dot={<View className="w-2 h-2 mx-1 rounded-full bg-gray-300" />}
                            activeDot={<View className="w-3 h-3 mx-1 rounded-full bg-green-800" />}
                        >
                            {placeData.map((banner) => (
                                <View
                                    key={banner.id}
                                    className="flex items-center justify-center"
                                >
                                    <Image
                                        source={{ uri: banner.image }}
                                        style={{
                                            width: width - 20,
                                            height: bannerHeight,
                                            borderRadius: 20,
                                        }}
                                        resizeMode="cover"
                                    />
                                </View>
                            ))}
                        </Swiper>
                    </View>
                    <View className="px-5">
                        <Text className="text-2xl font-bold text-[#08703f] mb-3">
                            Khám Phá Sản Phẩm Huy Vi Vu
                        </Text>
                        <View className="mt-5 h-[300px]">
                            <Swiper
                                autoplay
                                autoplayTimeout={3.5}
                                loop
                                showsPagination
                                dot={<View className="w-2 h-2 mx-1 rounded-full bg-gray-300" />}
                                activeDot={<View className="w-3 h-3 mx-1 rounded-full bg-green-800" />}
                            >
                                {exploreData.map((item) => (
                                    <View
                                        key={item.id}
                                        className="flex items-center justify-center"
                                    >
                                        <Image
                                            source={{ uri: item.img }}
                                            style={{
                                                width: width - 40,
                                                height: bannerHeight,
                                                borderRadius: 20,
                                            }}
                                            resizeMode="cover"
                                        />
                                        <View className="absolute bottom-0 left-0 w-full h-24 rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent" />
                                        <Text className="absolute bottom-6 left-4 right-4 text-lg font-bold text-white bg-black/20 text-center rounded-2xl p-2 drop-shadow-md">
                                            {item.title}
                                        </Text>
                                    </View>
                                ))}
                            </Swiper>
                        </View>
                    </View>
                    <View className="mt-5 px-5 py-5 bg-[#f0fdf4] rounded-t-3xl">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-2xl font-extrabold text-[#08703f]">
                                Ưu Đãi Giờ Chót
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/screens/(tours)")}>
                                <Icon name="arrow-right" size={24} color="#08703f" />
                            </TouchableOpacity>
                        </View>

                        <View className="h-[450px]">
                            <Swiper
                                autoplay
                                autoplayTimeout={4}
                                loop
                                showsPagination={false}
                            >
                                {dealData.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => router.push("/screens/(tours)")}
                                        className="mx-2 bg-white rounded-3xl shadow-lg overflow-hidden"
                                        style={{ width: width - 40, height: 450 }}
                                        activeOpacity={0.8}
                                    >
                                        <View className="relative">
                                            <Image
                                                source={{ uri: item.image }}
                                                className="w-full h-56"
                                                resizeMode="cover"
                                            />
                                            <View className="absolute flex-row items-center justify-center gap-2 bottom-3 left-3 bg-blue-50 px-3 py-1 rounded-full shadow-md">
                                                <Clock1 size={18} color="#08703f" />
                                                <Text className="text-sm font-semibold text-[#08703f]">Giờ chót</Text>
                                            </View>
                                            <View className="absolute bottom-3 right-3 bg-red-600/90 px-3 py-1 rounded-full shadow-md">
                                                <Text className="text-white font-bold">{item.countdown}</Text>
                                            </View>
                                        </View>
                                        <View className="p-4">
                                            <Text className="font-bold text-lg mb-3 text-[#08703f]">
                                                {item.title}
                                            </Text>
                                            <View className="flex-row items-center mb-1">
                                                <MapPin size={18} color="#08703f" />
                                                <Text className="text-sm text-gray-700 ml-2">
                                                    Khởi hành: <Text className="text-blue-600">{item.departure}</Text>
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center mb-1">
                                                <Hash size={18} color="#08703f" />
                                                <Text className="text-sm text-gray-700 ml-2">Mã tour: {item.code}</Text>
                                            </View>
                                            <View className="flex-row items-center mb-1">
                                                <CalendarDays size={18} color="#08703f" />
                                                <Text className="text-sm text-gray-700 ml-2">
                                                    Ngày khởi hành: {item.date}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center mb-1">
                                                <Clock size={18} color="#08703f" />
                                                <Text className="text-sm text-gray-700 ml-2">{item.duration}</Text>
                                            </View>
                                            <View className="flex-row items-center mb-1">
                                                <Users size={18} color="#08703f" />
                                                <Text className="text-sm text-gray-700 ml-2">
                                                    Số chỗ còn nhận:{" "}
                                                    <Text className="font-bold text-red-600">{item.slots}</Text>
                                                </Text>
                                            </View>

                                            <View className="flex-row items-center mt-2">
                                                <Text className="text-sm text-gray-400 line-through mr-2">
                                                    {item.oldPrice}
                                                </Text>
                                                <Text className="text-xl font-extrabold text-red-600">
                                                    {item.newPrice}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </Swiper>
                        </View>
                    </View>
                    <View className="px-5 py-6 bg-white rounded-t-3xl">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-2xl font-extrabold text-[#08703f]">
                                Combo Giá Tốt
                            </Text>
                            <TouchableOpacity>
                                <Icon name="arrow-right" size={24} color="#08703f" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row mt-4 justify-center items-center gap-3">
                            <TouchableOpacity
                                onPress={() => setFilter("all")}
                                className={`px-6 py-3 rounded-full border-2 shadow-sm
        ${filter === "all" ? "bg-[#08703f]" : "bg-white"} 
        border-[#08703f]`}
                            >
                                <Text
                                    className={`font-semibold ${filter === "all" ? "text-white" : "text-[#08703f]"
                                        }`}
                                >
                                    Tất cả
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setFilter("plane")}
                                className={`px-6 py-3 rounded-full border-2 flex-row items-center shadow-sm
        ${filter === "plane" ? "bg-[#08703f]" : "bg-white"} 
        border-[#08703f]`}
                            >
                                <Plane size={18} color={filter === "plane" ? "white" : "#08703f"} />
                                <Hotel
                                    size={18}
                                    color={filter === "plane" ? "white" : "#08703f"}
                                    style={{ marginLeft: 4 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setFilter("car")}
                                className={`px-6 py-3 rounded-full border-2 flex-row items-center shadow-sm
        ${filter === "car" ? "bg-[#08703f]" : "bg-white"} 
        border-[#08703f]`}
                            >
                                <Car size={18} color={filter === "car" ? "white" : "#08703f"} />
                                <Hotel
                                    size={18}
                                    color={filter === "car" ? "white" : "#08703f"}
                                    style={{ marginLeft: 4 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View className="mt-5 h-[470px] shadow shadow-gray-400">
                            <Swiper
                                autoplay={true}
                                loop={true}
                                autoplayTimeout={4}
                                showsPagination={true}
                                dot={<View className="w-2 h-2 mx-1 rounded-full bg-gray-300" />}
                                activeDot={<View className="w-3 h-3 mx-1 rounded-full bg-green-800" />}
                            >
                                {filteredTours.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        className="bg-white rounded-2xl mr-4 overflow-hidden"
                                        style={{ width: width - 40 }}
                                        onPress={() => router.push(`/screens/(tours)`)}
                                    >
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{ width: "100%", height: bannerHeight }}
                                            resizeMode="cover"
                                        />

                                        <View className="p-4">
                                            <View className="flex-row items-center mb-2">
                                                <Text className="mr-2 font-bold text-xl text-gray-700">
                                                    {item.location_start}
                                                </Text>
                                                <Circle size={12} color="#E53935" fill="#E53935" />
                                                <View className="flex-1 mx-1 border-t border-dashed border-gray-400" />
                                                <Circle size={12} color="#08703f" fill="#08703f" />
                                                <Text className="ml-2 font-bold text-xl text-gray-700">
                                                    {item.location_end}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center mb-2">
                                                <CalendarDays size={18} color="#08703f" />
                                                <Text className="ml-2 text-gray-700">{item.date}</Text>
                                            </View>
                                            <View className="flex-row items-center mb-2">
                                                <Hotel size={18} color="#08703f" />
                                                <Text className="ml-2 text-gray-700">{item.hotel}</Text>
                                            </View>
                                            <View className="flex-row items-center mb-2">
                                                <Plane size={18} color="#08703f" />
                                                <Text className="ml-2 text-gray-700">{item.type.toLocaleUpperCase()}</Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <Text className="text-red-600 font-bold text-lg mt-1">
                                                    {item.price.toLocaleString()}
                                                </Text>
                                                <Text className="text-lg mt-1"> / Người</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </Swiper>
                        </View>
                    </View>
                    <View className="px-5 py-5 mb-5 bg-white">
                        <Text className="text-2xl font-extrabold text-[#08703f] mb-3">
                            Điểm đến yêu thích
                        </Text>
                        <FlatList
                            data={regionsData}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`px-4 py-2 rounded-full border-2 flex-row items-center shadow-sm
        ${selectedRegion === item.name ? "bg-[#08703f]" : "bg-white"} 
        border-[#08703f]`}
                                    onPress={() => setSelectedRegion(item.name)}
                                >
                                    <Text
                                        className={`text-lg font-bold ${selectedRegion === item.name ? "text-white" : "text-[#08703f]"
                                            }`}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />


                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={filtered}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => router.push(`/screens/(tours)`)}
                                    className="mr-4 border border-gray-200 rounded-2xl mt-6 overflow-hidden">
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{
                                            width: width * 0.5,
                                            height: width * 0.4,
                                            borderRadius: 16,
                                        }}
                                    />
                                    <View
                                        className="absolute bottom-3 left-3 right-3 rounded-md px-2 py-1 items-center justify-center"
                                        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                                    >
                                        <Text className="text-white font-bold">{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
