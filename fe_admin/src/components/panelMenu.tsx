'use client';
import { PanelMenu } from 'primereact/panelmenu';
import { Toast } from 'primereact/toast';
import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

export default function slider() {
    const toast = useRef<Toast>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            url: '/admin/dashboard'
        },
        {
            label: 'Quản lý Tours',
            icon: 'pi pi-compass',
            items: [
                {
                    label: 'Địa điểm',
                    icon: 'pi pi-map-marker',
                    url: '/admin/diadiem'
                },
                {
                    label: 'Tours',
                    icon: 'pi pi-map-marker',
                    url: '/admin/tours'
                },
                {
                    label: 'Giá vé',
                    icon: 'pi pi-dollar',
                    url: '/admin/category_ticket'
                },
                {
                    label: 'Loại tour',
                    icon: 'pi pi-tag',
                    url: '/admin/category_tour'
                },
                {
                    label: 'Lịch trình Tour',
                    icon: 'pi pi-calendar',
                    url: '/admin/schedule&note'
                },
                {
                    label: 'Thông tin tour',
                    icon: 'pi pi-info-circle',
                    url: '/admin/tours'
                }
            ]
        },
        {
            label: 'Dịch vụ',
            icon: 'pi pi-utensils',
            items: [
                {
                    label: 'Loại dịch vụ',
                    icon: 'pi pi-tag',
                    url: '/admin/category_service'
                },
                {
                    label: 'Dịch vụ',
                    icon: 'pi pi-list',
                }
            ]
        },
        {
            label: 'Quản lý Ảnh',
            icon: 'pi pi-image',
            items: [
                {
                    label: 'Ảnh dịch vụ',
                    icon: 'pi pi-images',
                    url: '/admin/tours'
                },
                {
                    label: 'Ảnh tour',
                    icon: 'pi pi-images',
                    url: '/admin/images_tour'
                }
            ]
        }
        ,
        {
            label: 'Quản lý Người dùng',
            icon: 'pi pi-users',
            url: '/admin/nguoidung'
        },
        {
            label: 'Đơn đặt Tours',
            icon: 'pi pi-book',
            url: '/admin/bookings'
        },
        {
            label: 'Báo cáo & Thống kê',
            icon: 'pi pi-chart-line',
            url: '/admin/baocao'
        },
        {
            label: 'Khác',
            icon: 'pi pi-book',
            items: [
                {
                    label: 'Combos',
                    icon: 'pi pi-book',
                    url: '/admin/combos'
                },
                {
                    label: 'Vouchers',
                    icon: 'pi pi-book',
                    url: '/admin/vouchers'
                },
                {
                    label: 'Đánh giá & Liên hệ',
                    icon: 'pi pi-star',
                    url: '/admin/tours'
                }
            ]
        }
        ,
        {
            label: 'Cài đặt',
            icon: 'pi pi-cog',
            url: '/admin/settings'
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            onClick: () => {
                localStorage.removeItem('user');
            },
            command: () => {
                toast.current?.show({ severity: 'success', summary: 'Signed out', detail: 'User logged out', life: 3000 });
            },
            url: '/acc/login'
        }
    ];

    if (!mounted) {
        return (
            <div className="">
                <div className="flex justify-center items-center my-5 mx-auto border border-gray-200 w-32 h-32 rounded-2xl overflow-hidden">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="w-full md:w-20rem bg-white p-2 overflow-y-auto">
                    <div className="space-y-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <Toast ref={toast} />
            <div className="flex justify-center items-center my-4 mx-auto border border-gray-200 w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                    src="/iconHuyViVu.png" 
                    alt="logo" 
                    width={100} 
                    height={100}
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
                <PanelMenu 
                    model={items} 
                    className="w-full !bg-white !text-[#0f766e] !border-0 !p-0" 
                />
            </div>
        </div>
    )
};
