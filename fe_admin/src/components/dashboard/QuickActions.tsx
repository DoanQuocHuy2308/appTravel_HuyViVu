"use client";

import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

export const QuickActions = () => {
    const router = useRouter();

    const actions = [
        {
            label: 'Thêm Tour',
            icon: 'pi pi-plus',
            route: '/admin/tours',
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Tạo tour mới'
        },
        {
            label: 'Quản lý Booking',
            icon: 'pi pi-calendar',
            route: '/admin/bookings',
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Xem và quản lý bookings'
        },
        {
            label: 'Người dùng',
            icon: 'pi pi-users',
            route: '/admin/nguoidung',
            color: 'bg-purple-500 hover:bg-purple-600',
            description: 'Quản lý người dùng'
        },
        {
            label: 'Báo cáo',
            icon: 'pi pi-chart-bar',
            route: '/admin/reports',
            color: 'bg-amber-500 hover:bg-amber-600',
            description: 'Xem báo cáo chi tiết'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                    <i className="pi pi-bolt text-white text-xl"></i>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Thao tác nhanh</h3>
                    <p className="text-sm text-gray-600">Các chức năng thường dùng</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        label={action.label}
                        icon={action.icon}
                        className={`${action.color} text-white border-0 rounded-lg p-4 h-auto flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105`}
                        onClick={() => router.push(action.route)}
                        tooltip={action.description}
                        tooltipOptions={{ position: 'top' }}
                    />
                ))}
            </div>
        </div>
    );
};
