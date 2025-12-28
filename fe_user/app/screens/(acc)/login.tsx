import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToastContext } from '@/contexts/ToastContext';
import Back from '@/components/back';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAcc from '@/hooks/useAcc';
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAcc();
  const [form, setForm] = useState({ email: "", password: "" });
  const { showToast } = useContext(ToastContext);
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      showToast('error', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const res = await login(form.email, form.password);
      if (res) {
        await AsyncStorage.setItem('user', JSON.stringify(res));
        showToast('success', 'Đăng nhập thành công');
        router.push('/(tabs)');
      } else {
        showToast('error', 'Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      showToast('error', 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  }
  const handleSocialLogin = (platform: string) => {
    showToast('info', `Đăng nhập với ${platform}`);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-200 via-blue-100 to-white">
        <StatusBar barStyle="dark-content" />
        <Back />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-32 h-32 rounded-full border-4 border-[#00523f] mb-5 justify-center items-center overflow-hidden shadow-lg">
              <Image
                source={require('@/assets/images/iconHuyViVu.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <View className="items-center mb-8">
              <Text className="text-4xl font-extrabold text-[#00523f]">Login</Text>
              <Text className="text-center text-gray-700 text-base mt-2 px-4">
                Explore the world with us!
              </Text>
            </View>
            <View className="bg-white w-full rounded-3xl p-6 shadow-lg">
              <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 mb-4 shadow-sm">
                <Icon name="envelope" size={20} color="#9CA3AF" />
                <TextInput
                  value={form.email}
                  onChangeText={text => setForm({ ...form, email: text })}
                  className="ml-3 flex-1 text-[#00523f] text-base"
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 shadow-sm mb-6">
                <Icon name="lock" size={20} color="#9CA3AF" />
                <TextInput
                  value={form.password}
                  onChangeText={text => setForm({ ...form, password: text })}
                  className="ml-3 flex-1 text-[#00523f] text-base"
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
              <TouchableOpacity
                className="bg-[#00523f] py-4 rounded-2xl items-center mb-4 shadow-md"
                onPress={handleLogin}
              >
                <Text className="text-white font-bold text-lg">Login</Text>
              </TouchableOpacity>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-3 text-gray-500 text-sm">or continue with</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>
              <View className="flex-row justify-center gap-5 mt-2">
                <TouchableOpacity
                  className="w-14 h-14 items-center justify-center border-2 border-[#00523f] rounded-full bg-red-100 active:bg-red-200"
                  onPress={() => handleSocialLogin('Google')}
                >
                  <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-14 h-14 items-center justify-center border-2 border-[#00523f] rounded-full bg-blue-100 active:bg-blue-200"
                  onPress={() => handleSocialLogin('Facebook')}
                >
                  <Icon name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-14 h-14 items-center justify-center border-2 border-[#00523f] rounded-full bg-gray-200 active:bg-gray-300"
                  onPress={() => handleSocialLogin('Apple/iCloud')}
                >
                  <Icon name="apple" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don&apos;t have an account? </Text>
                <Link href="/screens/(acc)/register" className="text-[#00523f] font-semibold">
                  Register
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
