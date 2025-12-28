"use client";

import { Menubar } from "primereact/menubar";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'primeicons/primeicons.css';
import iconHuyViVu from '@/../public/iconHuyViVu.png';
import useUser from "@/lib/hooks/useUser";
import {API_URL} from "@/lib/types/url";
import { User } from "@/lib/types";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
function AdminMenubarContent() {
    const notificationCount = 5;
    const [user, setUser] = useState<User | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);
    
    const avatar = (
        <div className="flex items-center space-x-4 px-2">
            <div className="relative cursor-pointer">
                <i className="fas fa-bell text-gray-700 text-xl"></i>
                {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {notificationCount}
                    </span>
                )}
            </div>

            <Image
                src={isClient && user?.image ? `${API_URL}${user?.image}` : iconHuyViVu.src}
                alt={isClient && user?.name ? user.name : "Admin"}
                width={40}
                height={40}
                className="rounded-full w-[40px] h-[40px] border border-green-800 object-cover"
                onError={(e) => {
                    console.log('Image load error, falling back to default icon');
                    e.currentTarget.src = iconHuyViVu.src;
                }}
            />
        </div>
    );

    return (
        <Menubar
            start={
                <h2 className="text-sm lg:text-base font-bold bg-gradient-to-r from-[#0f766e] to-[#14b8a6] bg-clip-text text-transparent tracking-wide truncate">
                    <span className="hidden sm:inline">Chào Mừng Bạn Đến Với Trang Quản Lý Huy Vi Vu</span>
                    <span className="sm:hidden">Huy Vi Vu Admin</span>
                </h2>
            }
            end={avatar}
            className="!bg-white !border-0 !m-0 !shadow-none !rounded-none"
        />
    );
}

// Dynamic import để tránh hydration mismatch
const AdminMenubar = dynamic(() => Promise.resolve(AdminMenubarContent), {
    ssr: false,
    loading: () => (
        <div className="!bg-white !border-0 m-2 shadow-md rounded-2xl h-16 flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
        </div>
    )
});

export default AdminMenubar;
