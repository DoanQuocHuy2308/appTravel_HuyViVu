import React from "react";
import {
    View,
    Text,
    ImageBackground,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
const { height } = Dimensions.get("window");
import Back from "@/components/back";
interface Destination {
    id: string;
    title: string;
    location: string;
    days: string;
    distance: string;
    description: string;
    image: string;
    avatars?: string[];
}

const destinations: Destination[] = [
    {
        id: "1",
        title: "Koh Samui",
        location: "Southern Thailand",
        days: "10 Days",
        distance: "295 km",
        description:
            "Koh Samui is an island off the east coast of Thailand. Geography in the Chumphon Archipelago.",
        image:
            "https://watermark.lovepik.com/photo/20211208/large/lovepik-vertical-shot-vertical-screen-guilin-scenery-picture_501582051.jpg",
        avatars: [
            "https://randomuser.me/api/portraits/men/1.jpg",
            "https://randomuser.me/api/portraits/women/2.jpg",
            "https://randomuser.me/api/portraits/men/3.jpg",
            "https://randomuser.me/api/portraits/women/4.jpg",
        ],
    },
    {
        id: "2",
        title: "Bali",
        location: "Indonesia",
        days: "7 Days",
        distance: "150 km",
        description:
            "Bali is a famous tropical paradise with stunning beaches, rice terraces, and cultural heritage.",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC2Ly5l4nSbifMR8wRDH6xIMxk2Zpwwa4KGQ&s",
        avatars: [
            "https://randomuser.me/api/portraits/men/5.jpg",
            "https://randomuser.me/api/portraits/women/6.jpg",
        ],
    },
    {
        id: "3",
        title: "Ha Long Bay",
        location: "Vietnam",
        days: "5 Days",
        distance: "80 km",
        description:
            "Ha Long Bay features thousands of limestone karsts and isles in various shapes and sizes.",
        image:
            "https://image.tinnhanhchungkhoan.vn/w1200/Uploaded/2025/gtnwae/2020_06_05/1/z-1_NTBH.jpg",
        avatars: [
            "https://randomuser.me/api/portraits/men/7.jpg",
            "https://randomuser.me/api/portraits/women/8.jpg",
            "https://randomuser.me/api/portraits/men/9.jpg",
            "https://randomuser.me/api/portraits/men/10.jpg",
        ],
    },
];

export default function DiscoverScreen() {
    const render = ({ item }: { item: Destination }) => {
        return (
            <Link
                href={`/screens/(tours)`}
                className="flex-1 px-5 py-8"
                style={{ height }}
            >
                <View className="w-full h-[700px] rounded-3xl border border-[#00523f] shadow-lg overflow-hidden bg-white">
                    <ImageBackground
                        source={{ uri: item.image }}
                        className="flex-1 justify-center items-center"
                        resizeMode="cover"
                    >
                        <View className="absolute mx-5 px-6 py-4 rounded-2xl bg-black/40">
                            <Text className="text-white text-2xl font-extrabold tracking-wide text-center">
                                {item.title}
                            </Text>
                            <Text className="text-gray-200 text-sm mt-1 text-center">
                                {item.location}
                            </Text>

                            <View className="flex-row justify-center items-center space-x-6 mt-3">
                                <View className="flex-row items-center">
                                    <Ionicons name="time-outline" size={18} color="white" />
                                    <Text className="text-white ml-2 text-sm">{item.days}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="location-outline" size={18} color="white" />
                                    <Text className="text-white ml-2 text-sm">{item.distance}</Text>
                                </View>
                            </View>
                            <Text
                                className="text-gray-200 mt-3 leading-5 text-center text-[13px]"
                                numberOfLines={2}
                            >
                                {item.description}
                            </Text>
                            <View className="flex-row justify-center mt-4">
                                {item.avatars?.slice(0, 3).map((avatar, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: avatar }}
                                        className="w-9 h-9 rounded-full border-2 border-white -ml-2 shadow-md"
                                    />
                                ))}
                                {item.avatars && item.avatars.length > 3 && (
                                    <View className="w-9 h-9 rounded-full bg-white/30 justify-center items-center -ml-2">
                                        <Text className="text-white text-xs font-semibold">
                                            +{item.avatars.length - 3}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </ImageBackground>
                </View>

            </Link>

        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f7f6eef0]">
            <FlatList
                data={destinations}
                keyExtractor={(item) => item.id}
                renderItem={render}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height}
                decelerationRate="fast"
            />
        </SafeAreaView>
    );
}
