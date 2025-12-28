"use client";

import { Button } from 'primereact/button';

interface SampleDataProps {
    onLoadSampleData: () => void;
}

export const SampleData = ({ onLoadSampleData }: SampleDataProps) => {
    return (
        <div className="text-center py-8">
            <i className="pi pi-database text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500 text-lg mb-2">Không có dữ liệu đặt tour</p>
            <p className="text-gray-400 text-sm mb-6">Có thể dữ liệu chưa được tải hoặc chưa có booking nào</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                    label="Làm mới dữ liệu"
                    icon="pi pi-refresh"
                    size="small"
                    outlined
                    onClick={onLoadSampleData}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                />
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Gợi ý:</p>
                <ul className="text-xs text-gray-500 text-left max-w-md mx-auto">
                    <li>• Kiểm tra kết nối API</li>
                    <li>• Đảm bảo có dữ liệu booking trong database</li>
                    <li>• Kiểm tra quyền truy cập dữ liệu</li>
                    <li>• Thử làm mới trang hoặc đăng nhập lại</li>
                </ul>
            </div>
        </div>
    );
};
