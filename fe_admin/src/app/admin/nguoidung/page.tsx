"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { TabView, TabPanel } from 'primereact/tabview';
import SearchBar from '@/components/search';
import { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'primereact/tooltip';
import Dropdown from '@/components/dropdown';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import useUsers from '@/lib/hooks/useUsers';
import useLocation from '@/lib/hooks/useLocation';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import Add from '@/components/add';
import { User } from '@/lib/types';
import { API_URL } from '@/lib/types/url';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';


export default function Page() {
    const { users, loading, getAllUsers,createUser, updateUser, deleteUser, updateUserPoints, updateUserRole } = useUsers();
    const { provinces, districts, wards, loading: locationLoading, getDistricts, getWards } = useLocation();
    
    // State management
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isOpenUser, setIsOpenUser] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    
    // Advanced search states
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [searchField, setSearchField] = useState('all');
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    const [pointsRange, setPointsRange] = useState<[number, number] | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    
    // Form state
    const [userForm, setUserForm] = useState<Partial<User>>({
        name: '',
        email: '',
        password: '',
        phone: '',
        birthday: '',
        address: '',
        role: 'customer',
        points: 0,
        image: null
    });

    // Location form state
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedWard, setSelectedWard] = useState<string | null>(null);
    const [detailAddress, setDetailAddress] = useState<string>('');

    const toast = useRef<Toast>(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) {
                    searchInput.focus();
                }
            }
            // Escape to clear all filters
            if (e.key === 'Escape') {
                clearAllFilters();
            }
            // Ctrl/Cmd + Shift + F for advanced search toggle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                setAdvancedSearch(!advancedSearch);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [advancedSearch]);

    // --- Statistics ---
    const totalUsers = users?.length || 0;
    const customerUsers = users?.filter(u => u.role === 'customer').length || 0;
    const adminUsers = users?.filter(u => u.role === 'admin').length || 0;
    const staffUsers = users?.filter(u => u.role === 'staff').length || 0;
    const guideUsers = users?.filter(u => u.role === 'guide').length || 0;
    const totalPoints = users?.reduce((sum, user) => sum + (user.points || 0), 0) || 0;

    // --- Filter data ---
    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
        // Add to search history
        if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim())) {
            setSearchHistory(prev => [searchTerm.trim(), ...prev.slice(0, 4)]); // Keep last 5 searches
        }
    };

    // Advanced search handler
    const handleAdvancedSearch = () => {
        setAdvancedSearch(!advancedSearch);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearch('');
        setSelectedRole(null);
        setSelectedSort(null);
        setSearchField('all');
        setDateRange(null);
        setPointsRange(null);
    };

    let filteredUsers = users?.filter(user => {
        const searchTerm = search.toLowerCase().trim();
        
        // Basic search logic
        let matchesSearch = !searchTerm;
        if (searchTerm) {
            if (searchField === 'all') {
                matchesSearch = (
                    user.name?.toLowerCase().includes(searchTerm) ||
                    user.email?.toLowerCase().includes(searchTerm) ||
                    user.phone?.toLowerCase().includes(searchTerm) ||
                    user.address?.toLowerCase().includes(searchTerm)
                );
            } else if (searchField === 'name') {
                matchesSearch = user.name?.toLowerCase().includes(searchTerm) || false;
            } else if (searchField === 'email') {
                matchesSearch = user.email?.toLowerCase().includes(searchTerm) || false;
            } else if (searchField === 'phone') {
                matchesSearch = user.phone?.toLowerCase().includes(searchTerm) || false;
            } else if (searchField === 'address') {
                matchesSearch = user.address?.toLowerCase().includes(searchTerm) || false;
            }
        }
        
        // Role filter
        const matchesRole = !selectedRole || user.role === selectedRole;
        
        // Date range filter
        let matchesDateRange = true;
        if (dateRange && dateRange.length === 2) {
            const userDate = new Date(user.created_at || '');
            matchesDateRange = userDate >= dateRange[0] && userDate <= dateRange[1];
        }
        
        // Points range filter
        let matchesPointsRange = true;
        if (pointsRange) {
            const userPoints = user.points || 0;
            matchesPointsRange = userPoints >= pointsRange[0] && userPoints <= pointsRange[1];
        }
        
        return matchesSearch && matchesRole && matchesDateRange && matchesPointsRange;
    }) || [];

    // --- Sort data ---
    if (selectedSort) {
        filteredUsers = [...filteredUsers].sort((a, b) => {
            switch (selectedSort) {
                case 'nameAsc':
                    return (a.name || '').localeCompare(b.name || '');
                case 'nameDesc':
                    return (b.name || '').localeCompare(a.name || '');
                case 'dateAsc':
                    return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
                case 'dateDesc':
                    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
                case 'pointsAsc':
                    return (a.points || 0) - (b.points || 0);
                case 'pointsDesc':
                    return (b.points || 0) - (a.points || 0);
                default:
                    return 0;
            }
        });
    }

    // --- Utility Functions ---
    const handleDeleteUser = (user: User) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
        try {
            await deleteUser(user.id);
            // Refresh danh sách sau khi xóa
            await getAllUsers();
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: `Người dùng "${user.name}" đã được xóa`,
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể xóa người dùng',
                life: 3000
            });
        }
            }
        });
    };

    const handleSaveUser = async () => {
        // Validation cho các trường bắt buộc
        const fullAddress = buildFullAddress();
        if (!userForm.name?.trim() || !userForm.email?.trim() || !userForm.phone?.trim() || !fullAddress.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng nhập đầy đủ thông tin bắt buộc: tên, email, số điện thoại, địa chỉ',
                life: 3000
            });
            return;
        }

        // Validation password cho user mới
        if (!editingUser && (!userForm.password?.trim() || userForm.password.length < 6)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Mật khẩu phải có ít nhất 6 ký tự',
                life: 3000
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', userForm.name.trim());
            formData.append('email', userForm.email.trim());
            formData.append('phone', userForm.phone.trim());
            // Sử dụng địa chỉ được build từ location dropdowns
            formData.append('address', fullAddress.trim());
            formData.append('role', userForm.role || 'customer');
            formData.append('points', (userForm.points || 0).toString());
            
            // Xử lý password: bắt buộc cho user mới, tùy chọn cho user edit
            if (!editingUser) {
                // User mới: password bắt buộc
                formData.append('password', userForm.password?.trim() || '');
            } else {
                // User edit: chỉ gửi password nếu có password mới (không rỗng)
                if (userForm.password && userForm.password.trim()) {
                    formData.append('password', userForm.password.trim());
                }
                // Nếu không có password mới, không gửi trường password (backend sẽ giữ nguyên)
            }
            
            if (userForm.birthday && userForm.birthday.trim()) {
                formData.append('birthday', userForm.birthday);
            }

            // Chỉ gửi image nếu có file mới
            if (userForm.image && userForm.image instanceof File) {
                formData.append('image', userForm.image);
            }

            // Debug: Log FormData contents
            console.log('FormData contents for', editingUser ? 'update' : 'create', ':');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            if (editingUser) {
                console.log('Updating user with ID:', editingUser.id);
                await updateUser(editingUser.id, formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Người dùng đã được cập nhật',
                    life: 3000
                });
            } else {
                console.log('Creating new user');
                await createUser(formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Người dùng đã được thêm',
                    life: 3000
                });
            }
            
            // Refresh danh sách để đảm bảo data mới nhất
            await getAllUsers();
            resetForm();
            setIsOpenUser(false);
        } catch (error: any) {
            console.error('Save user error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu người dùng';
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: errorMessage,
                life: 5000
            });
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        // Format birthday để hiển thị đúng trong Calendar
        let formattedBirthday = '';
        if (user.birthday) {
            // Nếu birthday đã ở format YYYY-MM-DD thì giữ nguyên
            if (user.birthday.includes('-') && user.birthday.length === 10) {
                formattedBirthday = user.birthday;
            } else {
                // Nếu là ISO string thì convert sang YYYY-MM-DD
                const date = new Date(user.birthday);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                formattedBirthday = `${year}-${month}-${day}`;
            }
        }
        
        setUserForm({
            name: user.name,
            email: user.email,
            password: '', // Không hiển thị password cũ
            phone: user.phone || '',
            birthday: formattedBirthday,
            address: user.address,
            role: user.role,
            points: user.points || 0,
            image: user.image || null
        });
        setUploadedImage(user.image ? `${API_URL}${user.image}` : null);
        setIsOpenUser(true);
    };

    const handleUpdatePoints = async (userId: number, newPoints: number) => {
        try {
            await updateUserPoints(userId, newPoints);
            // Refresh danh sách sau khi cập nhật điểm
            await getAllUsers();
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Điểm đã được cập nhật',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể cập nhật điểm',
                life: 3000
            });
        }
    };

    const handleUpdateRole = async (userId: number, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            // Refresh danh sách sau khi cập nhật vai trò
            await getAllUsers();
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Vai trò đã được cập nhật',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể cập nhật vai trò',
                life: 3000
            });
        }
    };

    const resetForm = () => {
        setUserForm({
            name: '',
            email: '',
            password: '',
            phone: '',
            birthday: '',
            address: '',
            role: 'customer',
            points: 0,
            image: null
        });
        setUploadedImage(null);
        setEditingUser(null);
        // Reset location state
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDetailAddress('');
    };

    // File upload handlers
    const handleImageUpload = (event: any) => {
        const file = event.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
            setUserForm(prev => ({ ...prev, image: file }));
        }
    };

    const handleImageRemove = () => {
        if (uploadedImage && uploadedImage.startsWith('blob:')) {
            URL.revokeObjectURL(uploadedImage);
        }
        setUploadedImage(null);
        setUserForm(prev => ({ ...prev, image: null }));
    };

    // Location handlers
    const handleProvinceChange = (provinceCode: string) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict(null);
        setSelectedWard(null);
        if (provinceCode) {
            getDistricts(provinceCode);
        }
    };

    const handleDistrictChange = (districtCode: string) => {
        setSelectedDistrict(districtCode);
        setSelectedWard(null);
        if (districtCode) {
            getWards(districtCode);
        }
    };

    const handleWardChange = (wardCode: string) => {
        setSelectedWard(wardCode);
    };

    const buildFullAddress = () => {
        const provinceName = provinces.find(p => p.code === selectedProvince)?.name || '';
        const districtName = districts.find(d => d.code === selectedDistrict)?.name || '';
        const wardName = wards.find(w => w.code === selectedWard)?.name || '';
        
        const parts = [detailAddress, wardName, districtName, provinceName].filter(Boolean);
        return parts.join(', ');
    };

    // --- Templates ---
    const userAvatarTemplate = (rowData: User) => {
        return (
            <div className="flex items-center gap-3 p-3">
                <div className="relative">
                    <Image 
                        src={rowData.image ? `${API_URL}${rowData.image}` : "/default-avatar.png"} 
                        alt="Avatar" 
                        width="100" 
                        height="100"
                        className="w-full h-full object-cover rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-100 rounded-full p-1">
                        <i className="pi pi-user text-blue-600 text-xs"></i>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-sm">{rowData.name}</span>
                    <span className="text-xs text-gray-500">ID: #{rowData.id}</span>
                </div>
            </div>
        );
    };

    const userContactTemplate = (rowData: User) => {
        return (
            <div className="flex flex-col p-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border-l-4 border-blue-400 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <i className="pi pi-envelope text-blue-600 text-xs"></i>
                        <span className="text-sm font-medium text-gray-900 truncate">{rowData.email}</span>
                    </div>
                    {rowData.phone && (
                        <div className="flex items-center gap-2">
                            <i className="pi pi-phone text-gray-500 text-xs"></i>
                            <span className="text-xs text-gray-500">{rowData.phone}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const userRoleTemplate = (rowData: User) => {
        const roleColors = {
            admin: 'bg-red-100 text-red-800 border-red-200',
            staff: 'bg-blue-100 text-blue-800 border-blue-200',
            guide: 'bg-green-100 text-green-800 border-green-200',
            customer: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        
        return (
            <div className="flex justify-center p-3">
                <Chip
                    label={rowData.role === 'customer' ? 'Khách hàng' : 
                           rowData.role === 'admin' ? 'Quản trị' :
                           rowData.role === 'staff' ? 'Nhân viên' : 'Hướng dẫn viên'}
                    className={`${roleColors[rowData.role]} text-xs px-3 py-1 rounded-full border`}
                />
            </div>
        );
    };

    const userPointsTemplate = (rowData: User) => {
        return (
            <div className="flex justify-center p-3">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-3 border-l-4 border-emerald-400 shadow-sm">
                    <div className="flex items-center gap-2">
                        <i className="pi pi-star text-emerald-600 text-xs"></i>
                        <span className="text-sm font-bold text-emerald-700">{rowData.points?.toLocaleString() || 0}</span>
                    </div>
                    <span className="text-xs text-emerald-600">điểm</span>
                </div>
            </div>
        );
    };

    const userAddressTemplate = (rowData: User) => {
        return (
            <div className="max-w-xs p-3">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-l-4 border-gray-400 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-2">
                        <i className="pi pi-map-marker text-gray-600 text-xs mt-1"></i>
                        <span className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{rowData.address || 'Chưa cập nhật'}</span>
                    </div>
                </div>
            </div>
        );
    };

    const userDateTemplate = (rowData: User) => {
    return (
            <div className="flex flex-col p-3">
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 border-l-4 border-amber-400 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <i className="pi pi-calendar text-amber-600 text-xs"></i>
                        <span className="text-sm font-medium text-gray-900">
                            {rowData.created_at ? new Date(rowData.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="pi pi-clock text-gray-500 text-xs"></i>
                        <span className="text-xs text-gray-500">
                            {rowData.created_at ? new Date(rowData.created_at).toLocaleTimeString('vi-VN') : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const userActionTemplate = (rowData: User) => {
        return (
            <div className="flex justify-center gap-2 p-3">
                <Tooltip target=".edit-user-btn" content="Chỉnh sửa" position="top" />
                <Tooltip target=".delete-user-btn" content="Xóa người dùng" position="top" />
                <Tooltip target=".points-user-btn" content="Cập nhật điểm" position="top" />
                <Tooltip target=".role-user-btn" content="Cập nhật vai trò" position="top" />

                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    size="small"
                    className="edit-user-btn border-amber-500 !text-amber-600 hover:!bg-amber-500 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                    onClick={() => handleEditUser(rowData)}
                />
                <Button
                    icon="pi pi-star"
                    rounded
                    outlined
                    size="small"
                    className="points-user-btn border-emerald-500 !text-emerald-600 hover:!bg-emerald-500 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                    onClick={() => {
                        const newPoints = prompt(`Nhập điểm mới cho ${rowData.name}:`, (rowData.points || 0).toString());
                        if (newPoints && !isNaN(Number(newPoints))) {
                            handleUpdatePoints(rowData.id, Number(newPoints));
                        }
                    }}
                />
                <Button
                    icon="pi pi-users"
                    rounded
                    outlined
                    size="small"
                    className="role-user-btn border-blue-500 !text-blue-600 hover:!bg-blue-500 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                    onClick={() => {
                        const newRole = prompt(`Nhập vai trò mới cho ${rowData.name} (customer/admin/staff/guide):`, rowData.role);
                        if (newRole && ['customer', 'admin', 'staff', 'guide'].includes(newRole)) {
                            handleUpdateRole(rowData.id, newRole);
                        }
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    size="small"
                    className="delete-user-btn border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-200 hover:scale-110 shadow-sm"
                    onClick={() => handleDeleteUser(rowData)}
                />
            </div>
        );
    };

    const headerTemplate = () => (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-xl shadow-sm">
                        <i className="pi pi-users text-blue-600 text-xl"></i>
                    </div>
        <div>
                        <h3 className="text-xl font-bold text-gray-800">Danh sách Người dùng</h3>
                        <p className="text-sm text-gray-600">Quản lý tất cả người dùng trong hệ thống</p>
                    </div>
                    <Badge
                        value={filteredUsers.length}
                        severity="success"
                        className="text-lg px-4 py-2 rounded-full"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {selectedUsers.length > 0 && (
                        <Button
                            icon="pi pi-trash"
                            label={`Xóa (${selectedUsers.length})`}
                            outlined
                            severity="danger"
                            className="hover:scale-105 transition-all duration-200 shadow-sm"
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="w-full h-full bg-gray-50">
                <Toast ref={toast} />
                <ConfirmDialog />
                
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-[#0f766e] mb-4">
                    <div className="w-full mx-auto px-4 py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 bg-gradient-to-br from-[#0f766e] to-[#0d9488] rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                        <i className="pi pi-users text-white text-xl"></i>
                                    </div>
                                    <Title title="Quản lý Người dùng" note="Quản lý, lọc và theo dõi tất cả người dùng trong hệ thống Huy Vi Vu" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:flex items-center gap-3">
                                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 shadow-sm border border-blue-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <i className="pi pi-users text-blue-600"></i>
                                            <div className="text-lg font-bold text-blue-600">{totalUsers}</div>
                                        </div>
                                        <div className="text-xs text-blue-700 font-medium">Tổng người dùng</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 shadow-sm border border-emerald-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <i className="pi pi-star text-emerald-600"></i>
                                            <div className="text-lg font-bold text-emerald-600">{totalPoints}</div>
                                        </div>
                                        <div className="text-xs text-emerald-700 font-medium">Tổng điểm</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 shadow-sm border border-purple-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <i className="pi pi-crown text-purple-600"></i>
                                            <div className="text-lg font-bold text-purple-600">{adminUsers + staffUsers}</div>
                                        </div>
                                        <div className="text-xs text-purple-700 font-medium">Nhân viên</div>
                                    </div>
                                </div>
                                <Add label="Thêm Người dùng" onClick={() => {
                                    resetForm();
                                    setIsOpenUser(true);
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl mb-4 shadow-md border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                                    <i className="pi pi-filter text-blue-600 text-sm"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Bộ lọc và Tìm kiếm</h3>
                                    <p className="text-xs text-gray-600">Tìm kiếm và lọc theo tiêu chí</p>
                                </div>
                            </div>
                            {(search || selectedRole || selectedSort) && (
                                <Button
                                    icon="pi pi-filter-slash"
                                    label="Xóa bộ lọc"
                                    outlined
                                    size="small"
                                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 hover:scale-105"
                                    onClick={() => {
                                        setSearch('');
                                        setSelectedRole(null);
                                        setSelectedSort(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Search Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <i className="pi pi-search text-blue-600 text-sm"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        icon={advancedSearch ? "pi pi-angle-up" : "pi pi-angle-down"}
                                        label={advancedSearch ? "Tìm kiếm cơ bản" : "Tìm kiếm nâng cao"}
                                        outlined
                                        size="small"
                                        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
                                        onClick={handleAdvancedSearch}
                                    />
                                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                        ⌘⇧F
                                    </div>
                                </div>
                            </div>
                            
                            {/* Basic Search */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <SearchBar
                                        onSearch={handleSearch}
                                        placeholder="Tìm kiếm theo tên, email, số điện thoại, địa chỉ..."
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-white px-1 rounded">
                                        ⌘K
                                    </div>
                                </div>
                                
                                {/* Search Field Selector */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <i className="pi pi-filter text-gray-500 text-xs"></i>
                                        <span className="text-xs text-gray-600">Tìm trong:</span>
                                    </div>
                                    <Dropdown
                                        options={[
                                            { label: 'Tất cả trường', value: 'all' },
                                            { label: 'Tên', value: 'name' },
                                            { label: 'Email', value: 'email' },
                                            { label: 'Số điện thoại', value: 'phone' },
                                            { label: 'Địa chỉ', value: 'address' }
                                        ]}
                                        onChange={setSearchField}
                                        placeholder="Chọn trường tìm kiếm"
                                        defaultValue={searchField}
                                    />
                                </div>
                                
                                {/* Search History */}
                                {searchHistory.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <i className="pi pi-history text-gray-500 text-xs"></i>
                                            <span className="text-xs text-gray-600">Tìm kiếm gần đây:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {searchHistory.map((term, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSearch(term)}
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors duration-200"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Advanced Search */}
                            {advancedSearch && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 space-y-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="pi pi-cog text-blue-600 text-sm"></i>
                                        <span className="text-sm font-semibold text-blue-800">Tìm kiếm nâng cao</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Date Range Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-600">Khoảng thời gian tạo tài khoản:</label>
                                            <Calendar
                                                value={dateRange}
                                                onChange={(e) => setDateRange(e.value as Date[])}
                                                selectionMode="range"
                                                readOnlyInput
                                                placeholder="Chọn khoảng thời gian"
                                                className="w-full"
                                                showIcon
                                            />
                                        </div>
                                        
                                        {/* Points Range Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-600">Khoảng điểm số:</label>
                                            <div className="flex gap-2">
                                                <InputNumber
                                                    value={pointsRange?.[0] || null}
                                                    onChange={(e) => setPointsRange([e.value || 0, pointsRange?.[1] || 10000])}
                                                    placeholder="Từ"
                                                    min={0}
                                                    className="flex-1"
                                                    suffix=" điểm"
                                                />
                                                <InputNumber
                                                    value={pointsRange?.[1] || null}
                                                    onChange={(e) => setPointsRange([pointsRange?.[0] || 0, e.value || 10000])}
                                                    placeholder="Đến"
                                                    min={0}
                                                    className="flex-1"
                                                    suffix=" điểm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Filter Buttons */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-600">Bộ lọc nhanh:</label>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                label="Khách hàng mới (7 ngày)"
                                                size="small"
                                                outlined
                                                className="text-green-600 border-green-300 hover:bg-green-50"
                                                onClick={() => {
                                                    const today = new Date();
                                                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                                    setDateRange([weekAgo, today]);
                                                    setSelectedRole('customer');
                                                }}
                                            />
                                            <Button
                                                label="Điểm cao (500+)"
                                                size="small"
                                                outlined
                                                className="text-purple-600 border-purple-300 hover:bg-purple-50"
                                                onClick={() => setPointsRange([500, 10000])}
                                            />
                                            <Button
                                                label="Admin & Staff"
                                                size="small"
                                                outlined
                                                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                                                onClick={() => {
                                                    // This would need special handling since we can only select one role at a time
                                                    // For now, let's just show admin
                                                    setSelectedRole('admin');
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Role Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-green-100 rounded-lg">
                                        <i className="pi pi-users text-green-600 text-sm"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Lọc theo Vai trò</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={[
                                            { label: 'Tất cả vai trò', value: null },
                                            { label: 'Khách hàng', value: 'customer' },
                                            { label: 'Quản trị', value: 'admin' },
                                            { label: 'Nhân viên', value: 'staff' },
                                            { label: 'Hướng dẫn viên', value: 'guide' }
                                        ]}
                                        onChange={setSelectedRole}
                                        placeholder="Chọn vai trò"
                                        defaultValue={selectedRole}
                                    />
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-100 rounded-lg">
                                        <i className="pi pi-sort text-amber-600 text-sm"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Sắp xếp</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={[
                                            { label: 'Tên A-Z', value: 'nameAsc' },
                                            { label: 'Tên Z-A', value: 'nameDesc' },
                                            { label: 'Ngày tạo mới nhất', value: 'dateDesc' },
                                            { label: 'Ngày tạo cũ nhất', value: 'dateAsc' },
                                            { label: 'Điểm cao nhất', value: 'pointsDesc' },
                                            { label: 'Điểm thấp nhất', value: 'pointsAsc' }
                                        ]}
                                        onChange={setSelectedSort}
                                        placeholder="Chọn cách sắp xếp"
                                        defaultValue={selectedSort}
                                    />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-100 rounded-lg">
                                        <i className="pi pi-chart-bar text-purple-600 text-sm"></i>
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">Thống kê nhanh</label>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                                    <div className="text-xs text-purple-700 mb-1">Người dùng hiển thị:</div>
                                    <div className="text-base font-bold text-purple-800">{filteredUsers.length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Keyboard Shortcuts Help */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <i className="pi pi-keyboard text-gray-500 text-sm"></i>
                                <span className="text-xs font-semibold text-gray-600">Phím tắt:</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">⌘K</kbd>
                                    <span>Focus tìm kiếm</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">⌘⇧F</kbd>
                                    <span>Toggle tìm kiếm nâng cao</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd>
                                    <span>Xóa tất cả bộ lọc</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(search || selectedRole || selectedSort || dateRange || pointsRange) && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <i className="pi pi-info-circle text-blue-600 text-sm"></i>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-800">Bộ lọc đang áp dụng:</span>
                                    </div>
                                    <Button
                                        icon="pi pi-times"
                                        label="Xóa tất cả"
                                        outlined
                                        size="small"
                                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                                        onClick={clearAllFilters}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {search && (
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-search text-xs"></i>
                                            <span>Tìm kiếm: "{search}" ({searchField === 'all' ? 'Tất cả trường' : 
                                                searchField === 'name' ? 'Tên' :
                                                searchField === 'email' ? 'Email' :
                                                searchField === 'phone' ? 'SĐT' : 'Địa chỉ'})</span>
                                            <button
                                                onClick={() => setSearch('')}
                                                className="ml-1 hover:text-blue-600 hover:bg-blue-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedRole && (
                                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-users text-xs"></i>
                                            <span>Vai trò: {
                                                selectedRole === 'customer' ? 'Khách hàng' :
                                                selectedRole === 'admin' ? 'Quản trị' :
                                                selectedRole === 'staff' ? 'Nhân viên' : 'Hướng dẫn viên'
                                            }</span>
                                            <button
                                                onClick={() => setSelectedRole(null)}
                                                className="ml-1 hover:text-green-600 hover:bg-green-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {dateRange && dateRange.length === 2 && (
                                        <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-calendar text-xs"></i>
                                            <span>Thời gian: {dateRange[0].toLocaleDateString('vi-VN')} - {dateRange[1].toLocaleDateString('vi-VN')}</span>
                                            <button
                                                onClick={() => setDateRange(null)}
                                                className="ml-1 hover:text-purple-600 hover:bg-purple-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {pointsRange && (
                                        <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-star text-xs"></i>
                                            <span>Điểm: {pointsRange[0]} - {pointsRange[1]}</span>
                                            <button
                                                onClick={() => setPointsRange(null)}
                                                className="ml-1 hover:text-orange-600 hover:bg-orange-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedSort && (
                                        <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                            <i className="pi pi-sort text-xs"></i>
                                            <span>Sắp xếp: {
                                                selectedSort === 'nameAsc' ? 'Tên A-Z' :
                                                selectedSort === 'nameDesc' ? 'Tên Z-A' :
                                                selectedSort === 'dateDesc' ? 'Ngày tạo mới nhất' :
                                                selectedSort === 'dateAsc' ? 'Ngày tạo cũ nhất' :
                                                selectedSort === 'pointsDesc' ? 'Điểm cao nhất' :
                                                selectedSort === 'pointsAsc' ? 'Điểm thấp nhất' : selectedSort
                                            }</span>
                                            <button
                                                onClick={() => setSelectedSort(null)}
                                                className="ml-1 hover:text-amber-600 hover:bg-amber-200 rounded-full p-1 transition-all duration-200"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Filter Summary */}
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                    <div className="flex items-center justify-between text-xs text-blue-700">
                                        <span>Kết quả: <strong>{filteredUsers.length}</strong> người dùng</span>
                                        <span>Tổng: <strong>{users?.length || 0}</strong> người dùng</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[#0f766e] overflow-hidden">
                    <DataTable
                        value={filteredUsers}
                        paginator
                        rows={8}
                        rowsPerPageOptions={[5, 8, 15, 25]}
                        stripedRows
                        showGridlines
                        className="text-sm"
                        tableStyle={{ minWidth: '100%' }}
                        emptyMessage={
                            <div className="text-center py-8">
                                <i className="pi pi-users text-3xl text-gray-400 mb-3"></i>
                                <h3 className="text-base font-semibold text-gray-600 mb-2">Không tìm thấy người dùng nào</h3>
                                <p className="text-sm text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                            </div>
                        }
                        paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                        currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} người dùng"
                        header={headerTemplate}
                        selection={selectedUsers}
                        onSelectionChange={(e: any) => setSelectedUsers(e.value)}
                        selectionMode="multiple"
                        dataKey="id"
                        loading={loading}
                        sortField="created_at"
                        sortOrder={-1}
                        removableSort
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        <Column
                            field="name"
                            header="Thông tin"
                            body={userAvatarTemplate}
                            sortable
                            style={{ width: '25%' }}
                        />
                        <Column
                            field="email"
                            header="Liên hệ"
                            body={userContactTemplate}
                            style={{ width: '20%' }}
                        />
                        <Column
                            field="role"
                            header="Vai trò"
                            body={userRoleTemplate}
                            style={{ width: '12%' }}
                        />
                        <Column
                            field="points"
                            header="Điểm"
                            body={userPointsTemplate}
                            sortable
                            style={{ width: '10%' }}
                        />
                        <Column
                            field="address"
                            header="Địa chỉ"
                            body={userAddressTemplate}
                            style={{ width: '18%' }}
                        />
                        <Column
                            field="created_at"
                            header="Ngày tạo"
                            body={userDateTemplate}
                            sortable
                            style={{ width: '15%' }}
                        />
                        <Column
                            header="Thao tác"
                            body={userActionTemplate}
                            style={{ textAlign: 'center', width: '12%' }}
                            frozen
                            alignFrozen="right"
                        />
                    </DataTable>
                </div>

                {/* User Form Dialog */}
                <Dialog
                    visible={isOpenUser}
                    header={
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <i className="pi pi-user text-blue-600 text-sm"></i>
                            </div>
                            <span className="text-base font-semibold text-gray-800">
                                {editingUser ? "Chỉnh sửa Người dùng" : "Thêm Người dùng Mới"}
                            </span>
                        </div>
                    }
                    modal
                    className="w-11/12 max-w-3xl"
                    onHide={() => {
                        setIsOpenUser(false);
                        resetForm();
                    }}
                >
                    <div className="p-6">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-user text-blue-600"></i>
                                        Tên người dùng *
                                    </label>
                                    <InputText
                                        value={userForm.name || ''}
                                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                        placeholder="Nhập tên người dùng"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-envelope text-blue-600"></i>
                                        Email *
                                    </label>
                                    <InputText
                                        value={userForm.email || ''}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        placeholder="Nhập email"
                                        className="w-full"
                                        type="email"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-lock text-red-600"></i>
                                        Mật khẩu {!editingUser ? '*' : ''}
                                    </label>
                                    <InputText
                                        value={userForm.password || ''}
                                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                        placeholder={editingUser ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu (tối thiểu 6 ký tự)"}
                                        className="w-full"
                                        type="password"
                                    />
                                    {editingUser && (
                                        <p className="text-xs text-gray-500">
                                            <i className="pi pi-info-circle mr-1"></i>
                                            Để trống nếu không muốn thay đổi mật khẩu
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-phone text-gray-600"></i>
                                        Số điện thoại
                                    </label>
                                    <InputText
                                        value={userForm.phone || ''}
                                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-calendar text-gray-600"></i>
                                        Ngày sinh
                                    </label>
                                    <Calendar
                                        value={userForm.birthday ? new Date(userForm.birthday) : null}
                                        onChange={(e) => {
                                            if (e.value) {
                                                const date = new Date(e.value);
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const day = String(date.getDate()).padStart(2, '0');
                                                setUserForm({ ...userForm, birthday: `${year}-${month}-${day}` });
                                            } else {
                                                setUserForm({ ...userForm, birthday: '' });
                                            }
                                        }}
                                        placeholder="Chọn ngày sinh"
                                        className="w-full"
                                        showIcon
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-users text-green-600"></i>
                                        Vai trò
                                    </label>
                                    <Dropdown
                                        options={[
                                            { label: 'Khách hàng', value: 'customer' },
                                            { label: 'Quản trị', value: 'admin' },
                                            { label: 'Nhân viên', value: 'staff' },
                                            { label: 'Hướng dẫn viên', value: 'guide' }
                                        ]}
                                        onChange={(value) => setUserForm({ ...userForm, role: value })}
                                        placeholder="Chọn vai trò"
                                        defaultValue={userForm.role || 'customer'}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-star text-emerald-600"></i>
                                        Điểm
                                    </label>
                                    <InputNumber
                                        value={userForm.points || 0}
                                        onValueChange={(e) => setUserForm({ ...userForm, points: e.value || 0 })}
                                        placeholder="Nhập điểm"
                                        className="w-full"
                                        min={0}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-map-marker text-gray-600"></i>
                                        Địa chỉ *
                                    </label>
                                    
                                    {/* Tỉnh/Thành phố */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-600">Tỉnh/Thành phố</label>
                                        <Dropdown
                                            options={provinces.map(province => ({
                                                label: province.name,
                                                value: province.code
                                            }))}
                                            onChange={handleProvinceChange}
                                            placeholder="Chọn tỉnh/thành phố"
                                            defaultValue={selectedProvince}
                                        />
                                    </div>

                                    {/* Quận/Huyện */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-600">Quận/Huyện</label>
                                        <Dropdown
                                            options={districts.map(district => ({
                                                label: district.name,
                                                value: district.code
                                            }))}
                                            onChange={handleDistrictChange}
                                            placeholder="Chọn quận/huyện"
                                            defaultValue={selectedDistrict}
                                        />
                                    </div>

                                    {/* Phường/Xã */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-600">Phường/Xã</label>
                                        <Dropdown
                                            options={wards.map(ward => ({
                                                label: ward.name,
                                                value: ward.code
                                            }))}
                                            onChange={handleWardChange}
                                            placeholder="Chọn phường/xã"
                                            defaultValue={selectedWard}
                                        />
                                    </div>

                                    {/* Địa chỉ chi tiết */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-600">Địa chỉ chi tiết (số nhà, tên đường, ...)</label>
                                        <InputTextarea
                                            value={detailAddress}
                                            onChange={(e) => setDetailAddress(e.target.value)}
                                            placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, ...)"
                                            rows={2}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Preview địa chỉ đầy đủ */}
                                    {buildFullAddress() && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="text-xs text-blue-600 mb-1">Địa chỉ đầy đủ:</div>
                                            <div className="text-sm text-blue-800 font-medium">{buildFullAddress()}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <i className="pi pi-image text-purple-600"></i>
                                        Ảnh đại diện
                                    </label>

                                    {/* Current Image Preview */}
                                    {editingUser && editingUser.image && !uploadedImage && (
                                        <div className="mb-4">
                                            <div className="text-xs text-gray-600 mb-2">Ảnh hiện tại:</div>
                                            <div className="relative inline-block">
                                                <img
                                                    src={`${API_URL}${editingUser.image}`}
                                                    alt="Current Avatar"
                                                    className="w-56 h-56 object-cover rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* New Image Preview */}
                                    {uploadedImage && (
                                        <div className="mb-4">
                                            <div className="text-xs text-blue-600 mb-2">Ảnh mới:</div>
                                            <div className="relative inline-block">
                                                <img
                                                    src={uploadedImage}
                                                    alt="Preview"
                                                    className="w-56 h-56 object-cover rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleImageRemove}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 hover:scale-110"
                                                >
                                                    <i className="pi pi-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <FileUpload 
                                        name="image" 
                                        accept="image/*" 
                                        maxFileSize={5000000}
                                        customUpload={true}
                                        uploadHandler={handleImageUpload}
                                        chooseLabel="Chọn ảnh"
                                        className="w-full" 
                                        emptyTemplate={
                                            <div className="text-center py-8 text-gray-500">
                                                <i className="pi pi-upload text-2xl mb-2"></i>
                                                <p className="m-0">Kéo thả ảnh vào đây hoặc click để chọn</p>
                                            </div>
                                        } 
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                label="Hủy"
                                outlined
                                className="px-6 py-2 hover:scale-105 transition-all duration-200"
                                onClick={() => {
                                    setIsOpenUser(false);
                                    resetForm();
                                }}
                            />
                            <Button
                                type="button"
                                label={editingUser ? "Cập nhật" : "Thêm"}
                                onClick={handleSaveUser}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 hover:scale-105 transition-all duration-200 shadow-sm"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
};
