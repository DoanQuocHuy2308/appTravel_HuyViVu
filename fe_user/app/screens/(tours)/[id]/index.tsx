import { View, ScrollView, Text } from "react-native";
import Back from "@/components/back";
import { Notebook, Backpack, Flag, Star } from "lucide-react-native";
import React, { useState, useMemo } from "react";
import { useTours } from "@/hooks/useTour";
import useSchedule from "@/hooks/useSchedule";
import useNotes from "@/hooks/useNotes";
import useFavorite from "@/hooks/useFavorite";

// Import các component con
import TourHeader from "@/app/screens/(tours)/[id]/components/tourHeader";
import TourInformation from "@/app/screens/(tours)/[id]/components/tourInformation";
import TourTabs, { Tab } from "@/app/screens/(tours)/[id]/components/tabs";
import BookingFooter from "@/app/screens/(tours)/[id]/components/bookingFooter";
import OverviewTab from "@/app/screens/(tours)/[id]/components/tabs/Overview";
import ItineraryTab from "@/app/screens/(tours)/[id]/components/tabs/Itinerary";
import NotesTab from "@/app/screens/(tours)/[id]/components/tabs/Notes";
// import Reviews from "@/app/screens/(tours)/[id]/components/reviews";
import { router } from "expo-router";

export default function TourDetail() {
    const [activeTab, setActiveTab] = useState(0);
    const { schedule} = useSchedule();
    const { notes } = useNotes();
    const { tour, loading } = useTours();
    const { addFavorite, isTourFavorited, favorites, removeFavoriteByFavoriteId } = useFavorite();
    const tabs: (Tab & { content: React.ReactNode })[] = useMemo(() => [
        { id: 0, name: "Tổng quan", icon: Notebook, content: <OverviewTab data={tour} /> },
        { id: 1, name: "Lịch trình", icon: Backpack, content: <ItineraryTab data={schedule} /> },
        { id: 2, name: "Lưu ý", icon: Flag, content: <NotesTab data={notes} /> },
        // { id: 3, name: "Đánh giá", icon: Star, content: <Reviews /> },
    ], [tour]);

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-lg text-gray-600">Loading tour details...</Text>
            </View>
        );
    }

    if (!tour) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-lg text-gray-600">Tour not found</Text>
            </View>
        );
    }
    return (
        <View className="flex-1 bg-gray-50">
            <View className="absolute top-7 z-20 ">
                <Back />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TourHeader images={tour.images || []} />
                <TourInformation tour={tour} />

                <TourTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabPress={setActiveTab}
                />

                <View className="px-3 py-5 min-h-screen">
                    {tabs[activeTab].content}
                </View>
            </ScrollView>

            <BookingFooter
                price={Number(tour?.price) || 0}
                isWishlisted={isTourFavorited(tour?.id)}
                onPressWishlist={async () => {
                    if (!tour?.id) return;
                    const favItem = favorites.find(f => f.id === tour.id);
                    if (favItem?.id_favorite) {
                        await removeFavoriteByFavoriteId(favItem.id_favorite);
                    } else {
                        await addFavorite(tour.id);
                    }
                }}
                onPressBooking={() => router.push({
                    pathname: '/screens/(booking)',
                    params: { tourId: tour?.id }
                })}
            />
        </View>
    );
};
