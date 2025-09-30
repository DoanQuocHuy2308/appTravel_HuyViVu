import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface Tour {
  id: string;
  title: string;
  location: string;
  days: string;
  rating: number;
  image: string;
  liked: boolean;
}

const initialTours: Tour[] = [
  {
    id: "1",
    title: "Koh Samui",
    location: "Southern Thailand",
    days: "10 Days",
    rating: 4.8,
    image:
      "https://watermark.lovepik.com/photo/20211208/large/lovepik-vertical-shot-vertical-screen-guilin-scenery-picture_501582051.jpg",
    liked: true,
  },
  {
    id: "2",
    title: "Bali",
    location: "Indonesia",
    days: "7 Days",
    rating: 4.9,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC2Ly5l4nSbifMR8wRDH6xIMxk2Zpwwa4KGQ&s",
    liked: true,
  },
  {
    id: "3",
    title: "Ha Long Bay",
    location: "Vietnam",
    days: "5 Days",
    rating: 4.7,
    image:
      "https://image.tinnhanhchungkhoan.vn/w1200/Uploaded/2025/gtnwae/2020_06_05/1/z-1_NTBH.jpg",
    liked: true,
  },
];

export default function FollowsScreen() {
  const [tours, setTours] = useState<Tour[]>(initialTours);

  const toggleLike = (id: string) => {
    setTours((prev) =>
      prev.map((tour) =>
        tour.id === id ? { ...tour, liked: !tour.liked } : tour
      )
    );
  };

  const renderTour = ({ item }: { item: Tour }) => (
    <View className="mb-6 mx-4 rounded-3xl overflow-hidden shadow-lg bg-white">
      <ImageBackground
        source={{ uri: item.image }}
        style={{
          width: width - 32,
          height: 220,
          justifyContent: "flex-end",
        }}
        imageStyle={{ borderRadius: 20 }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={{ flex: 1, justifyContent: "flex-end", borderRadius: 20 }}
        >
          <TouchableOpacity
            onPress={() => toggleLike(item.id)}
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: 30,
              padding: 8,
            }}
          >
            <Ionicons
              name={item.liked ? "heart" : "heart-outline"}
              size={24}
              color={item.liked ? "red" : "black"}
            />
          </TouchableOpacity>

          <View style={{ padding: 16 }}>
            <Text className="text-white text-xl font-bold">
              {item.title}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={16} color="white" />
              <Text className="text-gray-200 ml-1">{item.location}</Text>
            </View>

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-white text-sm">{item.days}</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="gold" />
                <Text className="text-white ml-1">{item.rating}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f7f6eef0]">
      <Text className="text-2xl font-extrabold text-[#00523f] text-center mt-5 mb-4">
        ❤️ Favorite Tours
      </Text>
      <FlatList
        data={tours.filter((t) => t.liked)}
        keyExtractor={(item) => item.id}
        renderItem={renderTour}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            Bạn chưa có tour yêu thích nào
          </Text>
        }
      />
    </SafeAreaView>
  );
}
