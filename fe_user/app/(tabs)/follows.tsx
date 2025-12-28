import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useFavorite from "@/hooks/useFavorite";
import { API_URL } from "@/types/url";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";

export default function FollowsScreen() {
  const { favorites, isLoading, error, refetch, removeFavoriteByFavoriteId } = useFavorite();
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => favorites ?? [], [favorites]);

  const getImageUri = (raw?: string) => {
    if (!raw) return PLACEHOLDER_IMAGE;
    if (raw.startsWith('http')) return raw;
    if (!API_URL) return PLACEHOLDER_IMAGE;
    return `${API_URL}${raw}`;
  };

  const formatCurrency = (value?: string | number) => {
    if (value === undefined || value === null || value === "") return "";
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    return n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderTour = ({ item }: { item: any }) => {
    const images: string[] = Array.isArray(item?.images) && item.images.length > 0 ? item.images : [PLACEHOLDER_IMAGE];
    const rating = Number(item?.rating ?? 4.5).toFixed(1);
    const duration = item?.duration_days ?? "";
    const locationText = item?.city || item?.start_location || "";
    const price = formatCurrency(item?.price);
    const oldPrice = formatCurrency(item?.oldPrice);
    return (
      <Pressable className="mb-6 mx-4 rounded-3xl overflow-hidden shadow-lg bg-white active:opacity-90">
        <View style={{ width: width - 32, height: 220 }} className="relative">
          <Swiper
            loop
            autoplay
            autoplayTimeout={3.5}
            showsPagination
            dot={<View style={{ backgroundColor: 'rgba(255,255,255,0.5)', width: 6, height: 6, borderRadius: 6, margin: 3 }} />}
            activeDot={<View style={{ backgroundColor: '#fff', width: 8, height: 8, borderRadius: 8, margin: 3 }} />}
            paginationStyle={{ bottom: 10 }}
          >
            {images.map((image: string, index: number) => (
              <View key={`${image}-${index}`} style={{ width: width - 32, height: 220 }}>
                <Image
                  source={{ uri: getImageUri(image) }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
          />

          <View className="absolute top-3 right-3 flex-row items-center">
            <TouchableOpacity
              className="mr-2 bg-white/90 rounded-full p-2"
              onPress={async () => {
                if (item?.id_favorite) {
                  await removeFavoriteByFavoriteId(item.id_favorite);
                }
              }}
            >
              <Ionicons name="heart" size={18} color="#ef4444" />
            </TouchableOpacity>
            <View className="bg-white/90 px-3 py-1 rounded-full flex-row items-center">
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text className="ml-1 text-[#111827] text-xs font-semibold">{rating}</Text>
            </View>
          </View>

          <View className="absolute top-3 left-3 bg-[#00523f] px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold" numberOfLines={1}>
              {duration || "Linh hoạt"}
            </Text>
          </View>

          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16 }}>
            <Text className="text-white text-xl font-extrabold" numberOfLines={1}>{item?.name}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={16} color="white" />
              <Text className="text-gray-200 ml-1" numberOfLines={1}>{locationText}</Text>
            </View>
          </View>
        </View>
        <View className="px-5 pb-4 pt-3">
          <View className="flex-row items-end justify-between">
            <View className="flex-row items-baseline">
              {price ? (
                <Text className="text-[#00523f] text-lg font-extrabold">{price}</Text>
              ) : null}
              {oldPrice ? (
                <Text className="text-gray-400 text-sm line-through ml-2">{oldPrice}</Text>
              ) : null}
            </View>
            <View className="bg-gray-100 rounded-full px-3 py-1">
              <Text className="text-gray-700 text-xs font-medium">Yêu thích</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f7f6eef0]">
      <View className="px-5 pt-5 pb-3">
        <Text className="text-2xl font-extrabold text-[#00523f] text-center">❤️ Favorite Tours</Text>
        <Text className="text-center text-gray-500 mt-1">{data.length} tour yêu thích</Text>
      </View>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00523f" />
          <Text className="text-gray-500 mt-3">Đang tải danh sách yêu thích...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => `${item?.id_favorite ?? item?.id}`}
          renderItem={renderTour}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="items-center mt-16 px-6">
              <Ionicons name="heart-outline" size={48} color="#94a3b8" />
              <Text className="text-center text-gray-500 mt-3">
                Bạn chưa có tour yêu thích nào
              </Text>
              {error ? (
                <Text className="text-center text-red-500 mt-2" numberOfLines={2}>
                  {error}
                </Text>
              ) : null}
              <TouchableOpacity
                className="mt-5 bg-[#00523f] px-4 py-2 rounded-2xl"
                onPress={onRefresh}
              >
                <Text className="text-white font-semibold">Tải lại</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}
