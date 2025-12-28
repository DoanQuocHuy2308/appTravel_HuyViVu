'use client';

import { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import Image from 'next/image';
import useAcc from '@/lib/hooks/useAcc';
import useAddress from '@/lib/hooks/useLocation';
import { Toast } from 'primereact/toast';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Province, District, Ward } from '@/lib/types/location';
import { FloatLabel } from "primereact/floatlabel";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import { Password } from 'primereact/password';
import "@/styles/password.css";

export default function Register() {
    const { register, loading } = useAcc();
    const { provinces = [], districts = [], wards = [], getDistricts, getWards } = useAddress();
    const toast = useRef<Toast>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        province: null as Province | null,
        district: null as District | null,
        ward: null as Ward | null,
        detail: ''
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleProvinceChange = (province: Province | null) => {
        setFormData(prev => ({ ...prev, province, district: null, ward: null }));
        if (province) getDistricts(province.code);
    };

    const handleDistrictChange = (district: District | null) => {
        setFormData(prev => ({ ...prev, district, ward: null }));
        if (district) getWards(district.code);
    };

    const handleWardChange = (ward: Ward | null) => {
        handleInputChange('ward', ward);
    };

    const validateForm = () => {
        const { name, email, password, phone, province, district, ward, detail } = formData;
        if (!name || !email || !password || !phone || !province || !district || !ward || !detail) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập đầy đủ thông tin', life: 3000 });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const { name, email, password, phone, province, district, ward, detail } = formData;
            const address = `${detail}, ${ward!.name}, ${district!.name}, ${province!.name}`;
            await register(name, email, password, phone, address);
            toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng ký thành công', life: 3000 });
        } catch (error) {
            console.error('Register error:', error);
            toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Đăng ký thất bại', life: 3000 });
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
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl max-w-7xl w-full flex flex-col lg:flex-row overflow-hidden border border-white/20 relative z-10">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative p-12 items-center justify-center">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
                    <div className="relative z-10 text-center flex flex-col items-center">
                        <div className="relative mb-8">
                            <Image 
                                src="/iconHuyViVu.png" 
                                alt="logo" 
                                width={200} 
                                height={200} 
                                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                        </div>
                        <h2 className="text-white text-4xl font-bold mb-4 leading-tight">Chào Mừng Bạn!</h2>
                        <p className="text-green-100 text-xl font-light leading-relaxed max-w-sm">
                            Tạo tài khoản và bắt đầu hành trình khám phá cùng chúng tôi
                        </p>
                        <div className="mt-8 w-16 h-1 bg-white/30 rounded-full"></div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">
                    <div className="max-w-lg mx-auto w-full">
                        <div className="mb-12 text-center lg:text-left">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
                                <i className="fas fa-user-plus text-white text-2xl"></i>
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                                Đăng Ký Tài Khoản
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Đã có tài khoản?{' '}
                                <a href="/acc/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 hover:underline">
                                    Đăng nhập ngay
                                </a>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-7">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <FloatLabel>
                                        <InputText
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                        />
                                        <label className="text-gray-600 font-medium">Họ và tên</label>
                                    </FloatLabel>
                                </div>

                                <div className="group">
                                    <FloatLabel>
                                        <InputText
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                        />
                                        <label className="text-gray-600 font-medium">Số điện thoại</label>
                                    </FloatLabel>
                                </div>
                            </div>

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
                                        toggleMask
                                        feedback={false}
                                        promptLabel="Mật khẩu"
                                        weakLabel="Mật khẩu yếu"
                                        mediumLabel="Mật khẩu trung bình"
                                        strongLabel="Mật khẩu mạnh"
                                        mediumRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                        strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                    />
                                    <label className="text-gray-600 font-medium">Mật khẩu</label>
                                </FloatLabel>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="group">
                                    <FloatLabel>
                                        <Dropdown
                                            value={formData.province}
                                            options={provinces}
                                            onChange={(e) => handleProvinceChange(e.value)}
                                            optionLabel="name"
                                            placeholder="Chọn tỉnh/thành"
                                            className="w-full border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                        />
                                        <label className="text-gray-600 font-medium">Tỉnh/Thành phố</label>
                                    </FloatLabel>
                                </div>

                                <div className="group">
                                    <FloatLabel>
                                        <Dropdown
                                            value={formData.district}
                                            options={districts}
                                            onChange={(e) => handleDistrictChange(e.value)}
                                            optionLabel="name"
                                            placeholder="Chọn quận/huyện"
                                            className="w-full border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                        />
                                        <label className="text-gray-600 font-medium">Quận/Huyện</label>
                                    </FloatLabel>
                                </div>

                                <div className="group">
                                    <FloatLabel>
                                        <Dropdown
                                            value={formData.ward}
                                            options={wards}
                                            onChange={(e) => handleWardChange(e.value)}
                                            optionLabel="name"
                                            placeholder="Chọn phường/xã"
                                            className="w-full border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                        />
                                        <label className="text-gray-600 font-medium">Phường/Xã</label>
                                    </FloatLabel>
                                </div>
                            </div>

                            <div className="group">
                                <FloatLabel>
                                    <InputText
                                        type="text"
                                        value={formData.detail}
                                        onChange={(e) => handleInputChange('detail', e.target.value)}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md"
                                    />
                                    <label className="text-gray-600 font-medium">Địa chỉ chi tiết</label>
                                </FloatLabel>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full !bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg border-0"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="fas fa-spinner fa-spin"></i>
                                            <span>Đang đăng ký...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="fas fa-user-plus"></i>
                                            <span>Đăng ký ngay</span>
                                        </div>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
