import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X } from 'lucide-react-native';

// Utility function để xác định hạng dựa trên điểm
export const getUserRank = (points: number) => {
  if (points >= 100000000) { // 100 triệu
    return {
      rank: 'Kim Cương',
      icon: '💎',
      color: '#e5e7eb', // Gray
      nextRank: null,
      pointsNeeded: 0,
      benefits: [
        'Miễn phí đổi vé máy bay',
        'Ưu tiên đặt tour',
        'Giảm giá 50% tất cả dịch vụ',
        'Hỗ trợ 24/7 VIP'
      ]
    };
  } else if (points >= 1000000) { // 1 triệu
    return {
      rank: 'Vàng',
      icon: '🥇',
      color: '#fbbf24', // Yellow
      nextRank: 'Kim Cương',
      pointsNeeded: 100000000 - points,
      benefits: [
        'Giảm giá 30% tất cả tour',
        'Ưu tiên đặt tour',
        'Tặng voucher 100k mỗi tháng',
        'Hỗ trợ khách hàng VIP'
      ]
    };
  } else if (points >= 100000) { // 100k
    return {
      rank: 'Bạc',
      icon: '🥈',
      color: '#9ca3af', // Silver
      nextRank: 'Vàng',
      pointsNeeded: 1000000 - points,
      benefits: [
        'Giảm giá 20% tất cả tour',
        'Tặng voucher 50k mỗi tháng',
        'Ưu tiên hỗ trợ khách hàng'
      ]
    };
  } else if (points >= 10000) { // 10k
    return {
      rank: 'Đồng',
      icon: '🥉',
      color: '#cd7f32', // Bronze
      nextRank: 'Bạc',
      pointsNeeded: 100000 - points,
      benefits: [
        'Giảm giá 10% tất cả tour',
        'Tặng voucher 20k mỗi tháng'
      ]
    };
  } else {
    return {
      rank: 'Thành viên',
      icon: '👤',
      color: '#6b7280', // Gray
      nextRank: 'Đồng',
      pointsNeeded: 10000 - points,
      benefits: [
        'Tặng voucher 10k mỗi tháng',
        'Tham gia chương trình tích điểm'
      ]
    };
  }
};

interface RankInfoModalProps {
  visible: boolean;
  onClose: () => void;
  userPoints: number;
}

export default function RankInfoModal({ visible, onClose, userPoints }: RankInfoModalProps) {
  const userRank = getUserRank(userPoints);
  
  const allRanks = [
    { points: 0, rank: getUserRank(0) },
    { points: 10000, rank: getUserRank(10000) },
    { points: 100000, rank: getUserRank(100000) },
    { points: 1000000, rank: getUserRank(1000000) },
    { points: 100000000, rank: getUserRank(100000000) },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Thông tin hạng thành viên</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Current Rank */}
        <View className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <View className="items-center">
            <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: userRank.color + '30' }}>
              <Text className="text-4xl">{userRank.icon}</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">{userRank.rank}</Text>
            <Text className="text-lg text-gray-600 mb-4">{userPoints.toLocaleString()} điểm</Text>
            
            {userRank.nextRank && (
              <View className="bg-white rounded-lg p-4 w-full">
                <Text className="text-center text-gray-600 mb-2">
                  Cần thêm {userRank.pointsNeeded.toLocaleString()} điểm để lên hạng {userRank.nextRank}
                </Text>
                <View className="w-full bg-gray-200 rounded-full h-2">
                  <View 
                    className="h-2 rounded-full" 
                    style={{ 
                      backgroundColor: userRank.color,
                      width: `${Math.min(100, (userPoints / (userPoints + userRank.pointsNeeded)) * 100)}%`
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Benefits */}
        <View className="p-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quyền lợi hạng {userRank.rank}</Text>
          {userRank.benefits.map((benefit, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-3" />
              <Text className="text-gray-700 flex-1">{benefit}</Text>
            </View>
          ))}
        </View>

        {/* All Ranks */}
        <View className="p-6 border-t border-gray-200">
          <Text className="text-lg font-bold text-gray-800 mb-4">Tất cả hạng thành viên</Text>
          {allRanks.map((rankInfo, index) => (
            <View key={index} className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: rankInfo.rank.color + '30' }}>
                  <Text className="text-lg">{rankInfo.rank.icon}</Text>
                </View>
                <View>
                  <Text className="font-semibold text-gray-800">{rankInfo.rank.rank}</Text>
                  <Text className="text-sm text-gray-600">{rankInfo.points.toLocaleString()} điểm</Text>
                </View>
              </View>
              {userPoints >= rankInfo.points && (
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-800 text-sm font-semibold">Đã đạt</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}
