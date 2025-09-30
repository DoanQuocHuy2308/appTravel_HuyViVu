import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAPI } from '@/services/userAPI';

const { width } = Dimensions.get('window');

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleRegister = async () => {
    const { name, email, password, phone } = form;
    if (!name || !email || !password || !phone) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    const user = await userAPI.register(name, email, password, phone);
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      alert('Đăng ký thành công!');
      router.replace('/(tabs)');
    } else {
      alert('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-200 via-blue-100 to-white">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            className="m-4 w-10 h-10 border-2 rounded-full items-center justify-center border-[#318b89]"
            onPress={() => router.back()}
          >
            <Icon name="arrow-left" size={20} color="#00523f" />
          </TouchableOpacity>
          <View className="w-32 h-32 rounded-full border-4 border-[#00523f] mb-6 mx-auto overflow-hidden items-center justify-center shadow-lg">
            <Image
              source={require('@/assets/images/iconHuyViVu.png')}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <View className="items-center mb-8 px-4">
            <Text className="text-4xl font-extrabold text-[#00523f] mb-2">Register</Text>
            <Text className="text-center text-gray-700 text-base">
              Create a new account to explore the world!
            </Text>
          </View>

          <View className="bg-white mx-4 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 mb-4 shadow-sm">
              <Icon name="user" size={20} color="#9CA3AF" />
              <TextInput
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                className="ml-3 h-10 flex-1 text-[#00523f] text-base"
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 mb-4 shadow-sm">
              <Icon name="envelope" size={20} color="#9CA3AF" />
              <TextInput
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                className="ml-3 h-10 flex-1 text-[#00523f] text-base"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 mb-4 shadow-sm">
              <Icon name="lock" size={20} color="#9CA3AF" />
              <TextInput
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                className="ml-3 h-10 flex-1 text-[#00523f] text-base"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            </View>

            <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 mb-6 shadow-sm">
              <Icon name="phone" size={20} color="#9CA3AF" />
              <TextInput
                value={form.phone}
                onChangeText={(text) => setForm({ ...form, phone: text })}
                className="ml-3 h-10 flex-1 text-[#00523f] text-base"
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              className="bg-[#00523f] py-4 rounded-2xl items-center mb-4 shadow-md"
              onPress={handleRegister}
            >
              <Text className="text-white text-xl font-bold">Register</Text>
            </TouchableOpacity>
            <View className="flex-row justify-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/screens/(acc)/login')}>
                <Text className="text-[#00523f] font-semibold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
