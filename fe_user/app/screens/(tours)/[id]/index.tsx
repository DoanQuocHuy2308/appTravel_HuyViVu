import { View, ScrollView } from "react-native";
import Back from "@/components/back";
import { Notebook, Backpack, Flag } from "lucide-react-native";
import React, { useState, useMemo } from "react";

// Import data
import { tourData } from "@/data/tourData";

// Import các component con
import TourHeader from "@/app/screens/(tours)/[id]/components/tourHeader";
import TourInformation from "@/app/screens/(tours)/[id]/components/tourInformation";
import TourTabs, { Tab } from "@/app/screens/(tours)/[id]/components/tabs";
import BookingFooter from "@/app/screens/(tours)/[id]/components/bookingFooter";
import OverviewTab from "@/app/screens/(tours)/[id]/components/tabs/Overview";
import ItineraryTab from "@/app/screens/(tours)/[id]/components/tabs/Itinerary";
import NotesTab from "@/app/screens/(tours)/[id]/components/tabs/Notes";
import { router } from "expo-router";

export default function index() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs: (Tab & { content: React.ReactNode })[] = useMemo(() => [
        { id: 0, name: "Tổng quan", icon: Notebook, content: <OverviewTab data={tourData} /> },
        { id: 1, name: "Lịch trình", icon: Backpack, content: <ItineraryTab data={tourData.itinerary} /> },
        { id: 2, name: "Lưu ý", icon: Flag, content: <NotesTab data={tourData.notes} /> },
    ], []);

    return (
        <View className="flex-1 bg-gray-50">
            <View className="absolute top-7 z-20 ">
                <Back />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TourHeader images={tourData.images} />

                <TourInformation
                    title={tourData.title}
                    location={tourData.location}
                    duration={tourData.duration}
                    rating={tourData.rating}
                    reviews={tourData.reviews}
                />

                <TourTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabPress={setActiveTab}
                />

                <View className="px-5 py-6 min-h-screen">
                    {tabs[activeTab].content}
                </View>
            </ScrollView>

            <BookingFooter
                price={tourData.price}
                isWishlisted
                onPressWishlist={() => {}}
                onPressBooking={() => router.push('/screens/(booking)')}
            />
        </View>
    );
};
