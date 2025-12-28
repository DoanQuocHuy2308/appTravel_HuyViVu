import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
    CalendarDays, MapPin, Users, Clock, IdCard,
    ChefHat, Languages, UserRound, Landmark, Info, Home
} from 'lucide-react-native';
import { Tour } from '@/types';

interface OverviewTabProps {
    data: Tour | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
    if (!data) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-lg text-gray-400">Đang tải chi tiết tour...</Text>
            </View>
        );
    }

    const startDate = data.start_date
        ? new Date(data.start_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'Chưa có';

    const cardData = [
        { title: 'Địa điểm tham quan', value: data.locations || 'Các điểm đến nổi bật đang được cập nhật.', icon: <Landmark size={22} color="#10b981" /> },
        { title: 'Ẩm thực', value: 'Đồ ăn sáng, món địa phương và thực đơn đa dạng.', icon: <ChefHat size={22} color="#10b981" /> },
        { title: 'Đối tượng thích hợp', value: data.suitable_for || 'Tất cả khách du lịch.', icon: <Users size={22} color="#10b981" /> },
        { title: 'Thời gian lý tưởng', value: data.ideal_time || 'Cả năm, tùy điểm đến.', icon: <Clock size={22} color="#10b981" /> },
        { title: 'Phương tiện di chuyển', value: data.transportation || 'Xe du lịch đời mới, máy lạnh, wifi.', icon: <MapPin size={22} color="#10b981" /> },
        { title: 'Lưu trú', value: 'Khách sạn 3–4 sao, tiện nghi đầy đủ.', icon: <Home size={22} color="#10b981" /> },
    ];

    return (
        <ScrollView className="flex-1 w-full bg-gray-50" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <Card title="Tổng quan chuyến đi" icon={<Info size={24} color="#10b981" />}>
                <Text className="text-gray-700 text-base leading-7">{data.description || 'Không có mô tả chi tiết cho tour này.'}</Text>
            </Card>
            <Card title="Thông tin tour" icon={<IdCard size={24} color="#10b981" />} className="mt-4">
                <ItemRow icon={<IdCard size={20} color="#10b981" />} label="Mã tour" value={data.id} />
                <ItemRow icon={<CalendarDays size={20} color="#10b981" />} label="Ngày khởi hành" value={startDate} />
                <ItemRow icon={<MapPin size={20} color="#10b981" />} label="Khởi hành từ" value={data.start_location} />
                <ItemRow icon={<Users size={20} color="#10b981" />} label="Số chỗ" value={`${data.max_customers} khách`} />
                <ItemRow icon={<Clock size={20} color="#10b981" />} label="Thời gian" value={data.duration_days} />
            </Card>
            <Card title="Hướng dẫn viên" icon={<UserRound size={24} color="#10b981" />} className="mt-4">
                <ItemRow icon={<UserRound size={20} color="#10b981" />} label="Họ và tên" value={data.guide_name} />
                <ItemRow icon={<Languages size={20} color="#10b981" />} label="Ngôn ngữ" value={data.guide_languages} />
            </Card>
            <View className="flex-row flex-wrap  justify-between mt-4 px-2 gap-3">
                {cardData.map((item, index) => (
                    <View key={index} className="flex-[0_0_48%] bg-white p-4 rounded-2xl shadow-2xl  shadow-gray-300 border border-gray-200">
                        <View className="flex-row items-start gap-3">
                            {item.icon}
                            <View className="flex-1">
                                <Text className="text-base font-bold text-emerald-700 mb-1">{item.title}</Text>
                                <Text className="text-gray-700 text-sm">{item.value}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
};

export default OverviewTab;

const Card = ({ title, icon, children, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) => (
    <View className={`bg-white rounded-2xl p-4 shadow-2xl border border-gray-200 ${className || ''}`}>
        <View className="flex-row items-center gap-2 mb-3">
            {icon}
            <Text className="text-xl font-extrabold text-emerald-700 tracking-tight">{title}</Text>
        </View>
        {children}
    </View>
);

const ItemRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | null | undefined }) => (
    <View className="flex-row items-start gap-2 mb-2">
        <View className="mr-3 mt-1">{icon}</View>
        <Text className="text-base text-gray-700 flex-1">
            <Text className="font-semibold text-gray-900">{label}:</Text> {value || '—'}
        </Text>
    </View>
);
