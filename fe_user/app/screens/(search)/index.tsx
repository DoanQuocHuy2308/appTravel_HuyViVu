import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "@/components/back";
import { Search, MapPinned, CalendarDays, Hotel, Circle, Key, DeleteIcon, Filter, Star, Clock, Users, ArrowRight } from "lucide-react-native";
import React, { useState, useMemo, useEffect } from "react";
import { useTours } from "@/hooks/useTour";
import { newTour } from "@/types";
import { router } from "expo-router";
import { API_URL } from "@/types/url";

// Component TourCard tái sử dụng (hỗ trợ 2 biến thể: carousel | grid)
const TourCard = ({ tour, onPress, variant = 'carousel' }: { tour: newTour; onPress: () => void; variant?: 'carousel' | 'grid' }) => {
    return (
        <TouchableOpacity
            className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${variant === 'carousel' ? 'mr-4' : ''}`}
            style={{
                width: variant === 'carousel' ? 280 : '100%',
                elevation: 4,
                marginBottom: 10,
            }}
            onPress={onPress}
        >
            {/* Badge loại tour */}
            {tour.name_type ? (
                <View
                    className="absolute z-10 top-2 left-2 bg-[#08703f] px-2 py-1 rounded-full"
                    style={{ opacity: 0.95 }}
                >
                    <Text className="text-white text-xs font-medium">{tour.name_type}</Text>
                </View>
            ) : null}
            <Image
                source={{ 
                    uri: `${API_URL}${tour.images?.[0]}` || 'https://via.placeholder.com/300x200?text=No+Image' 
                }}
                style={{
                    width: "100%",
                    height: variant === 'carousel' ? 160 : 140,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                }}
                resizeMode="cover"
            />

            <View className="p-4">
                <Text
                    className={`font-bold text-[#08703f] ${variant === 'carousel' ? 'text-base' : 'text-sm'} mb-2`}
                    numberOfLines={2}
                >
                    {tour.name}
                </Text>

                <View className="flex-row items-center mb-2">
                    <MapPinned size={14} color="#08703f" />
                    <Text className="mx-1 text-sm text-gray-700">
                        {tour.start_location || 'N/A'}
                    </Text>
                    <Circle size={10} color="#E53935" fill="#E53935" />
                    <View className="flex-1 mx-1 border-t border-dashed border-gray-400" />
                    <Circle size={10} color="#08703f" fill="#08703f" />
                    <Text className="ml-1 text-sm text-gray-700">
                        {tour.end_location || 'N/A'}
                    </Text>
                </View>

                <View className="flex-row items-center mb-1">
                    <Clock size={14} color="#08703f" />
                    <Text className="ml-2 text-gray-600 text-sm">
                        {tour.duration_days || 'N/A'}
                    </Text>
                </View>

                <View className="flex-row items-center mb-1">
                    <Users size={14} color="#08703f" />
                    <Text className="ml-2 text-gray-600 text-sm">
                        Tối đa {tour.max_customers || 'N/A'} người
                    </Text>
                </View>

                {tour.rating && (
                    <View className="flex-row items-center mb-2">
                        <Star size={14} color="#FFD700" fill="#FFD700" />
                        <Text className="ml-1 text-sm text-gray-600">
                            {tour.rating} ({tour.review_count || 0} đánh giá)
                        </Text>
                    </View>
                )}

                <View className="mt-2 flex-row items-center justify-between">
                    {tour.oldPrice && (
                        <Text
                            className="text-gray-400 text-sm"
                            style={{ textDecorationLine: "line-through" }}
                        >
                            {Number(tour.oldPrice).toLocaleString()} đ
                        </Text>
                    )}
                    <Text className={`text-red-600 font-bold ${variant === 'carousel' ? 'text-lg' : 'text-base'}`}>
                        {Number(tour.price).toLocaleString()} đ
                    </Text>
                </View>

                {/* CTA */}
                <TouchableOpacity
                    className="mt-3 bg-[#08703f] rounded-full items-center justify-center"
                    style={{ height: 36 }}
                    onPress={onPress}
                    activeOpacity={0.9}
                >
                    <Text className="text-white text-sm font-medium">Xem chi tiết</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};
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
    // debounce key
    const [debouncedKey, setDebouncedKey] = useState<string>("");
    const [refreshing, setRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    
    const { tours, toursByTime, loading } = useTours();

    useEffect(() => {
        const t = setTimeout(() => setDebouncedKey(key), 350);
        return () => clearTimeout(t);
    }, [key]);

    // Tìm kiếm và lọc tours
    const filteredTours = useMemo(() => {
        const q = debouncedKey.trim().toLowerCase();
        let filtered = tours.filter(tour => 
            q.length === 0 ||
            tour.name.toLowerCase().includes(q) ||
            tour.start_location?.toLowerCase().includes(q) ||
            tour.end_location?.toLowerCase().includes(q) ||
            tour.description?.toLowerCase().includes(q)
        );

        // Sắp xếp
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^\d]/g, '')) : (a.price || 0);
                    bValue = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^\d]/g, '')) : (b.price || 0);
                    break;
                case 'rating':
                    aValue = parseFloat(a.rating || '0');
                    bValue = parseFloat(b.rating || '0');
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [tours, debouncedKey, sortBy, sortOrder]);

    const onRefresh = async () => {
        setRefreshing(true);
        // Refresh logic sẽ được handle bởi useTours hook
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleTourPress = (tourId: number) => {
        router.push(`/screens/(tours)/${tourId}` as any);
    };

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
                    {key.length > 0 && (
                        <TouchableOpacity
                            className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center mr-2"
                            onPress={() => setKey("")}
                        >
                            <DeleteIcon size={16} color={"#666"} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    className="w-10 h-10 bg-[#08703f] rounded-full items-center justify-center ml-2"
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Filter size={20} color={"#fff"} />
                </TouchableOpacity>
            </View>
            {/* Filter Panel */}
            {showFilters && (
                <View className="bg-white border-b border-gray-200 px-4 py-3">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-semibold text-gray-800">Bộ lọc</Text>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <Text className="text-[#08703f] font-medium">Đóng</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className="flex-row items-center justify-between">
                        <Text className="text-base text-gray-700">Sắp xếp theo:</Text>
                        <View className="flex-row space-x-2">
                            {(['name', 'price', 'rating'] as const).map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    className={`px-3 py-1 rounded-full ${
                                        sortBy === option ? 'bg-[#08703f]' : 'bg-gray-200'
                                    }`}
                                    onPress={() => setSortBy(option)}
                                >
                                    <Text className={`text-sm ${
                                        sortBy === option ? 'text-white' : 'text-gray-700'
                                    }`}>
                                        {option === 'name' ? 'Tên' : option === 'price' ? 'Giá' : 'Đánh giá'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between mt-3">
                        <Text className="text-base text-gray-700">Thứ tự:</Text>
                        <TouchableOpacity
                            className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full"
                            onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            <ArrowRight 
                                size={16} 
                                color="#666" 
                                style={{ 
                                    transform: [{ rotate: sortOrder === 'desc' ? '180deg' : '0deg' }] 
                                }} 
                            />
                            <Text className="text-sm text-gray-700 ml-1">
                                {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <ScrollView 
                className="px-4 flex-1 bg-gray-50 mt-2 py-5"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {key.length === 0 && (
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
                )}

                {debouncedKey.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            Kết quả tìm kiếm cho "{debouncedKey}" ({filteredTours.length} tour)
                        </Text>
                    </View>
                )}

                {loading && (
                    <>
                        <View className="flex-row flex-wrap -mx-2 px-2">
                            {[...Array(6)].map((_, idx) => (
                                <View key={idx} className="w-1/2 px-2 mb-4">
                                    <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ elevation: 3 }}>
                                        <View className="bg-gray-200" style={{ width: '100%', height: 140 }} />
                                        <View className="p-4">
                                            <View className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                            <View className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                                            <View className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
                                            <View className="h-6 bg-gray-200 rounded w-full" />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* Tours List */}
                {!loading && (
                    <>
                        {key.length === 0 && (
                            <>
                                <Text className="text-2xl font-bold text-[#08703f] mb-3">
                                    Tour Nổi Bật
                                </Text>
                                <FlatList
                                    data={toursByTime.slice(0, 5)}
                                    keyExtractor={(item) => item.id.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 4 }}
                                    renderItem={({ item }) => (
                                        <TourCard 
                                            tour={item} 
                                            onPress={() => handleTourPress(item.id)} 
                                        />
                                    )}
                                />
                            </>
                        )}

                        {debouncedKey.length > 0 && (
                            <View className="mb-4">
                                {filteredTours.length > 0 ? (
                                    <FlatList
                                        data={filteredTours}
                                        keyExtractor={(item) => item.id.toString()}
                                        numColumns={2}
                                        columnWrapperStyle={{ columnGap: 12 }}
                                        contentContainerStyle={{ paddingHorizontal: 4, rowGap: 12 }}
                                        renderItem={({ item }) => (
                                            <View style={{ flex: 1 }}>
                                                <TourCard 
                                                    tour={item}
                                                    variant="grid"
                                                    onPress={() => handleTourPress(item.id)} 
                                                />
                                            </View>
                                        )}
                                    />
                                ) : (
                                    <View className="flex-1 items-center justify-center py-20">
                                        <Search size={48} color="#ccc" />
                                        <Text className="text-lg text-gray-700 mt-4 text-center font-semibold">
                                            Không tìm thấy tour nào
                                        </Text>
                                        <Text className="text-sm text-gray-500 mt-2 text-center">
                                            Thử tìm kiếm với từ khóa khác
                                        </Text>
                                        <View className="mt-4 flex-row flex-wrap justify-center gap-2">
                                            {keySearch.slice(0,6).map((item) => (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200"
                                                    onPress={() => setKey(item.keyword)}
                                                >
                                                    <Text className="text-sm text-gray-700">{item.keyword}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {key.length === 0 && (
                            <>
                                <Text className="text-2xl font-bold text-[#08703f] mb-3 mt-6">
                                    Tất Cả Tour
                                </Text>
                                <FlatList
                                    data={tours.slice(0, 10)}
                                    keyExtractor={(item) => item.id.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 4 }}
                                    renderItem={({ item }) => (
                                        <TourCard 
                                            tour={item} 
                                            onPress={() => handleTourPress(item.id)} 
                                        />
                                    )}
                                />
                            </>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
