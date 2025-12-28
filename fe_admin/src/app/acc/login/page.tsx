'use client';

import { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import Image from 'next/image';
import useAcc from '@/lib/hooks/useAcc';
import { Toast } from 'primereact/toast';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FloatLabel } from "primereact/floatlabel";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import "@/styles/password.css";

export default function Login() {
    const { login, loading } = useAcc();
    const toast = useRef<Toast>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const { email, password } = formData;
        if (!email || !password) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập đầy đủ email và mật khẩu', life: 3000 });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await login(formData.email, formData.password);
            if (response) {
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công', life: 3000 });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Đăng nhập thất bại', life: 3000 });
            }
        } catch (error: any) {
            // Hiển thị thông báo lỗi cụ thể từ backend
            const errorMessage = error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Thất bại', 
                detail: errorMessage, 
                life: 5000 
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            
            <Toast ref={toast} />
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl max-w-6xl w-full flex flex-col lg:flex-row overflow-hidden border border-white/20 relative z-10 min-h-[700px]">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative p-12 items-center justify-center">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
                    <div className="relative z-10 text-center flex flex-col items-center">
                        <div className="relative mb-8">
                            <Image 
                                src="/iconHuyViVu.png" 
                                alt="logo" 
                                width={180} 
                                height={180} 
                                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                        </div>
                        <h2 className="text-white text-4xl font-bold mb-4 leading-tight">Chào Mừng Trở Lại!</h2>
                        <p className="text-green-100 text-xl font-light leading-relaxed max-w-sm">
                            Tiếp tục hành trình khám phá cùng chúng tôi
                        </p>
                        <div className="mt-8 w-16 h-1 bg-white/30 rounded-full"></div>
                    </div>
                </div>

                <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">
                    <div className="max-w-lg mx-auto w-full">
                        <div className="mb-12 text-center lg:text-left">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
                                <i className="fas fa-sign-in-alt text-white text-2xl"></i>
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                                Đăng Nhập
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Chưa có tài khoản?{' '}
                                <a href="/acc/register" className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 hover:underline">
                                    Đăng ký ngay
                                </a>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <FloatLabel>
                                    <InputText
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                    />
                                    <label className="text-gray-600 font-medium">Email</label>
                                </FloatLabel>
                            </div>

                            <div className="group">
                                <FloatLabel>
                                    <Password
                                        id="password"
                                        toggleMask
                                        feedback={false}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="w-full rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                    />
                                    <label className="text-gray-600 font-medium">Mật khẩu</label>
                                </FloatLabel>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        inputId="remember"
                                        checked={formData.rememberMe}
                                        onChange={(e) => handleInputChange('rememberMe', e.checked || false)}
                                        className="border-2 border-gray-300 focus:border-green-500"
                                    />
                                    <label htmlFor="remember" className="text-gray-600 text-sm font-medium cursor-pointer">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <a href="#" className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200 hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full !bg-gradient-to-r !from-green-600 !to-green-600 hover:!from-green-700 hover:!to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg border-0"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                            <i className="fas fa-sign-in-alt"></i>
                                            <span>Đăng nhập</span>
                                        </div>
                                </Button>
                            </div>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white/80 text-gray-500 font-medium">Hoặc tiếp tục với</span>
                                </div>
                            </div>

                            {/* Social buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    type="button"
                                    className="w-full !bg-white !hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 !text-gray-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-md"
                                >
                                    <i className="fab fa-google text-[#DB4437] text-lg"></i>
                                    <span>Google</span>
                                </Button>

                                <Button
                                    type="button"
                                    className="w-full !bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 !text-gray-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-md"
                                >
                                    <i className="fab fa-apple text-black text-lg"></i>
                                    <span>Apple</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
