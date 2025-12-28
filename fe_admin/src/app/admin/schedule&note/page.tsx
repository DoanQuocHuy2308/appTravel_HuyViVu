"use client";

import Title from '@/components/title';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import SearchBar from '@/components/search';
import { useState, useRef, useCallback } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { useSchedule } from '@/lib/hooks/useSchedule';
import { useNote } from '@/lib/hooks/useNote';
import { useTours } from '@/lib/hooks/useTour';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import Add from '@/components/add';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import '@/styles/schedule_note.css';

import { TourSchedule, TourNote, newTour } from '@/lib/types';

export default function Page() {
    // Schedule hooks
    const { schedules, loading: scheduleLoading, getAllSchedule, createSchedule, updateSchedule, deleteSchedule } = useSchedule();
    const { tours, loading: toursLoading } = useTours();
    
    // Note hooks
    const { notes, loading: noteLoading, getAllTourNotes, createTourNotes, updateTourNotes, deleteTourNotes } = useNote();
    
    // Common states
    const [search, setSearch] = useState('');
    const [selectedTour, setSelectedTour] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    
    // Schedule states
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const [selectedSchedules, setSelectedSchedules] = useState<TourSchedule[]>([]);
    const [editingSchedule, setEditingSchedule] = useState<TourSchedule | null>(null);
    const [scheduleForm, setScheduleForm] = useState({
        tour_id: '',
        day_number: '',
        title: '',
        description: ''
    });
    
    // Note states
    const [isOpenNote, setIsOpenNote] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState<TourNote[]>([]);
    const [editingNote, setEditingNote] = useState<TourNote | null>(null);
    const [noteForm, setNoteForm] = useState({
        tour_id: '',
        title: '',
        note: ''
    });
    
    const toast = useRef<Toast>(null);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
    }, []);

    // Schedule logic
    const totalSchedules = schedules?.length || 0;
    const schedulesByTour = selectedTour ? schedules?.filter((s: TourSchedule) => s.tour_id === selectedTour).length || 0 : 0;

    let filteredSchedules = schedules?.filter((schedule: TourSchedule) => {
        const searchTerm = search?.trim().toLowerCase() || '';
        
        // Lấy tên tour từ tours array
        const tour = tours?.find((t: newTour) => t.id === schedule.tour_id);
        const tourName = tour?.name?.toLowerCase() || '';
        
        // Tìm kiếm trong title, description và tên tour
        const matchesSearch = !searchTerm || 
            (schedule.title && schedule.title.toLowerCase().includes(searchTerm)) ||
            (schedule.description && schedule.description.toLowerCase().includes(searchTerm)) ||
            tourName.includes(searchTerm);
        
        const matchesTour = !selectedTour || schedule.tour_id === selectedTour;

        return matchesSearch && matchesTour;
    }) || [];

    // Note logic
    const totalNotes = notes?.length || 0;
    const notesByTour = selectedTour ? notes?.filter((n: TourNote) => n.tour_id === selectedTour).length || 0 : 0;

    let filteredNotes = notes?.filter((note: TourNote) => {
        const searchTerm = search?.trim().toLowerCase() || '';
        
        // Lấy tên tour từ tours array
        const tour = tours?.find((t: newTour) => t.id === note.tour_id);
        const tourName = tour?.name?.toLowerCase() || '';
        
        // Tìm kiếm trong title, note và tên tour
        const matchesSearch = !searchTerm || 
            (note.title && note.title.toLowerCase().includes(searchTerm)) ||
            (note.note && note.note.toLowerCase().includes(searchTerm)) ||
            tourName.includes(searchTerm);
        
        const matchesTour = !selectedTour || note.tour_id === selectedTour;

        return matchesSearch && matchesTour;
    }) || [];

    // Sort logic
    if (selectedSort === 'titleAsc') {
        if (activeTab === 0) {
            filteredSchedules.sort((a: TourSchedule, b: TourSchedule) => (a.title || '').localeCompare(b.title || ''));
        } else {
            filteredNotes.sort((a: TourNote, b: TourNote) => (a.title || '').localeCompare(b.title || ''));
        }
    }
    if (selectedSort === 'titleDesc') {
        if (activeTab === 0) {
            filteredSchedules.sort((a: TourSchedule, b: TourSchedule) => (b.title || '').localeCompare(a.title || ''));
        } else {
            filteredNotes.sort((a: TourNote, b: TourNote) => (b.title || '').localeCompare(a.title || ''));
        }
    }
    if (selectedSort === 'dateAsc') {
        if (activeTab === 0) {
            filteredSchedules.sort((a: TourSchedule, b: TourSchedule) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
        } else {
            filteredNotes.sort((a: TourNote, b: TourNote) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
        }
    }
    if (selectedSort === 'dateDesc') {
        if (activeTab === 0) {
            filteredSchedules.sort((a: TourSchedule, b: TourSchedule) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        } else {
            filteredNotes.sort((a: TourNote, b: TourNote) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        }
    }

    // Schedule handlers
    const handleDeleteSchedule = (schedule: TourSchedule) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa lịch trình "${schedule.title}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    await deleteSchedule(schedule.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Lịch trình "${schedule.title}" đã được xóa`,
                        life: 3000
                    });
                    getAllSchedule();
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể xóa lịch trình',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleSaveSchedule = async () => {
        if (!scheduleForm.tour_id?.trim() || !scheduleForm.day_number?.trim() || 
            !scheduleForm.title?.trim() || !scheduleForm.description?.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng nhập đầy đủ thông tin bắt buộc',
                life: 3000
            });
            return;
        }

        try {
            const scheduleData: Partial<TourSchedule> = {
                tour_id: Number(scheduleForm.tour_id),
                day_number: Number(scheduleForm.day_number),
                title: scheduleForm.title.trim(),
                description: scheduleForm.description.trim()
            };

            if (editingSchedule) {
                await updateSchedule(editingSchedule.id, scheduleData as TourSchedule);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Lịch trình đã được cập nhật',
                    life: 3000
                });
            } else {
                await createSchedule(scheduleData as TourSchedule);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Lịch trình đã được thêm',
                    life: 3000
                });
            }
            getAllSchedule();
            setScheduleForm({ tour_id: '', day_number: '', title: '', description: '' });
            setIsOpenSchedule(false);
        } catch (error: any) {
            console.error('Save schedule error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu lịch trình';
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: errorMessage,
                life: 5000
            });
        }
    };

    const handleEditSchedule = (schedule: TourSchedule) => {
        setEditingSchedule(schedule);
        setScheduleForm({
            tour_id: schedule.tour_id?.toString() || '',
            day_number: schedule.day_number?.toString() || '',
            title: schedule.title || '',
            description: schedule.description || ''
        });
        setIsOpenSchedule(true);
    };

    // Note handlers
    const handleDeleteNote = (note: TourNote) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa ghi chú "${note.title}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: async () => {
                try {
                    await deleteTourNotes(note.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: `Ghi chú "${note.title}" đã được xóa`,
                        life: 3000
                    });
                    getAllTourNotes();
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể xóa ghi chú',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleSaveNote = async () => {
        if (!noteForm.tour_id?.trim() || !noteForm.title?.trim() || !noteForm.note?.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng nhập đầy đủ thông tin bắt buộc',
                life: 3000
            });
            return;
        }

        try {
            const noteData: Partial<TourNote> = {
                tour_id: Number(noteForm.tour_id),
                title: noteForm.title.trim(),
                note: noteForm.note.trim()
            };

            if (editingNote) {
                await updateTourNotes(editingNote.id, noteData as TourNote);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Ghi chú đã được cập nhật',
                    life: 3000
                });
            } else {
                await createTourNotes(noteData as TourNote);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Ghi chú đã được thêm',
                    life: 3000
                });
            }
            getAllTourNotes();
            setNoteForm({ tour_id: '', title: '', note: '' });
            setIsOpenNote(false);
        } catch (error: any) {
            console.error('Save note error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu ghi chú';
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: errorMessage,
                life: 5000
            });
        }
    };

    const handleEditNote = (note: TourNote) => {
        setEditingNote(note);
        setNoteForm({
            tour_id: note.tour_id?.toString() || '',
            title: note.title || '',
            note: note.note || ''
        });
        setIsOpenNote(true);
    };

    // Common functions
    const getTourName = (tourId: number | undefined) => {
        const tour = tours?.find((t: newTour) => t.id === tourId);
        return tour ? `${tour.name} (ID: ${tour.id})` : `Tour ID: ${tourId}`;
    };

    // Schedule templates
    const scheduleTourTemplate = (rowData: any) => (
        <div key={`tour-${rowData.id}`} className="flex flex-col p-2">
            <div className="flex items-center gap-2 mb-1">
                <i className="pi pi-map-marker text-blue-500 text-xs"></i>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{getTourName(rowData.tour_id)}</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block w-fit">ID: #{rowData.tour_id || 'N/A'}</span>
        </div>
    );

    const scheduleTitleTemplate = (rowData: any) => (
        <div key={`title-${rowData.id}`} className="flex flex-col p-2">
            <div className="flex items-center gap-2 mb-1">
                <i className="pi pi-calendar text-amber-500 text-xs"></i>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.title || 'N/A'}</span>
            </div>
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full inline-block w-fit">Ngày {rowData.day_number || 'N/A'}</span>
        </div>
    );

    const scheduleDescriptionTemplate = (rowData: any) => (
        <div key={`desc-${rowData.id}`} className="max-w-xs p-2">
            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-200">
                <div className="flex items-start gap-2">
                    <i className="pi pi-file-text text-blue-500 text-xs mt-1"></i>
                    <span className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{rowData.description || 'Không có mô tả'}</span>
                </div>
            </div>
        </div>
    );

    const scheduleDayTemplate = (rowData: any) => (
        <div key={`day-${rowData.id}`} className="flex items-center justify-center p-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-1">
                    <i className="pi pi-calendar text-xs"></i>
                    <span className="text-xs font-semibold">Ngày {rowData.day_number || 'N/A'}</span>
                </div>
            </div>
        </div>
    );

    const scheduleDateTemplate = (rowData: any) => (
        <div key={`date-${rowData.id}`} className="flex flex-col p-2">
            <div className="bg-green-50 rounded-lg p-2 border-l-4 border-green-400">
                <div className="flex items-center gap-1 mb-1">
                    <i className="pi pi-clock text-green-600 text-xs"></i>
                    <span className="text-sm font-semibold text-gray-900">
                        {rowData.created_at ? new Date(rowData.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    {rowData.created_at ? new Date(rowData.created_at).toLocaleTimeString('vi-VN') : 'N/A'}
                </span>
            </div>
        </div>
    );

    const scheduleActionTemplate = (rowData: any) => (
        <div key={`action-${rowData.id}`} className="flex justify-center gap-2">
            <Tooltip target=".edit-schedule-btn" content="Chỉnh sửa" position="top" />
            <Tooltip target=".delete-schedule-btn" content="Xóa lịch trình" position="top" />

            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                size="small"
                className="edit-schedule-btn border-amber-500 !text-amber-600 hover:!bg-amber-500 hover:!text-white transition-all duration-200"
                onClick={() => handleEditSchedule(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                size="small"
                className="delete-schedule-btn border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-200"
                onClick={() => handleDeleteSchedule(rowData)}
            />
        </div>
    );

    // Note templates
    const noteTourTemplate = (rowData: any) => (
        <div key={`note-tour-${rowData.id}`} className="flex flex-col p-2">
            <div className="flex items-center gap-2 mb-1">
                <i className="pi pi-map-marker text-green-500 text-xs"></i>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{getTourName(rowData.tour_id)}</span>
            </div>
            <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full inline-block w-fit">ID: #{rowData.tour_id || 'N/A'}</span>
        </div>
    );

    const noteTitleTemplate = (rowData: any) => (
        <div key={`note-title-${rowData.id}`} className="flex flex-col p-2">
            <div className="flex items-center gap-2">
                <i className="pi pi-file-edit text-purple-500 text-xs"></i>
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{rowData.title || 'N/A'}</span>
            </div>
        </div>
    );

    const noteContentTemplate = (rowData: any) => (
        <div key={`note-content-${rowData.id}`} className="max-w-xs p-2">
            <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                <div className="flex items-start gap-2">
                    <i className="pi pi-file-text text-green-600 text-xs mt-1"></i>
                    <span className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{rowData.note || 'Không có nội dung'}</span>
                </div>
            </div>
        </div>
    );

    const noteDateTemplate = (rowData: any) => (
        <div key={`note-date-${rowData.id}`} className="flex flex-col p-2">
            <div className="bg-green-50 rounded-lg p-2 border-l-4 border-green-400">
                <div className="flex items-center gap-1 mb-1">
                    <i className="pi pi-clock text-green-600 text-xs"></i>
                    <span className="text-sm font-semibold text-gray-900">
                        {rowData.created_at ? new Date(rowData.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    {rowData.created_at ? new Date(rowData.created_at).toLocaleTimeString('vi-VN') : 'N/A'}
                </span>
            </div>
        </div>
    );

    const noteActionTemplate = (rowData: any) => (
        <div key={`note-action-${rowData.id}`} className="flex justify-center gap-2">
            <Tooltip target=".edit-note-btn" content="Chỉnh sửa" position="top" />
            <Tooltip target=".delete-note-btn" content="Xóa ghi chú" position="top" />

            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                size="small"
                className="edit-note-btn border-amber-500 !text-amber-600 hover:!bg-amber-500 hover:!text-white transition-all duration-200"
                onClick={() => handleEditNote(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                size="small"
                className="delete-note-btn border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-200"
                onClick={() => handleDeleteNote(rowData)}
            />
        </div>
    );

    // Header templates
    const scheduleHeaderTemplate = (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <i className="pi pi-calendar text-green-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Danh sách Lịch trình</h3>
                        <p className="text-sm text-gray-600">Quản lý lịch trình tour trong hệ thống</p>
                    </div>
                    <Badge
                        value={filteredSchedules.length}
                        severity="success"
                        className="text-lg px-3 py-1"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {selectedSchedules.length > 0 && (
                        <Button
                            icon="pi pi-trash"
                            label={`Xóa (${selectedSchedules.length})`}
                            outlined
                            severity="danger"
                            className="hover:scale-105 transition-all duration-200"
                        />
                    )}
                </div>
            </div>
        </div>
    );

    const noteHeaderTemplate = (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <i className="pi pi-file-edit text-green-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Danh sách Ghi chú</h3>
                        <p className="text-sm text-gray-600">Quản lý ghi chú tour trong hệ thống</p>
                    </div>
                    <Badge
                        value={filteredNotes.length}
                        severity="success"
                        className="text-lg px-3 py-1"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {selectedNotes.length > 0 && (
                        <Button
                            icon="pi pi-trash"
                            label={`Xóa (${selectedNotes.length})`}
                            outlined
                            severity="danger"
                            className="hover:scale-105 transition-all duration-200"
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="min-h-screen bg-white">
                <Toast ref={toast} />
                <ConfirmDialog />
                
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-[#0f766e]">
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl shadow-lg">
                                        <i className="pi pi-calendar-plus text-white text-2xl"></i>
                                    </div>
                                    <Title title="Quản lý Lịch trình & Ghi chú" note="Quản lý lịch trình và ghi chú tour trong hệ thống Huy Vi Vu" />
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden lg:flex items-center gap-6">
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-2xl font-bold text-blue-600">{totalSchedules}</div>
                                        <div className="text-sm text-gray-500">Lịch trình</div>
                                    </div>
                                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#0f766e]/30">
                                        <div className="text-2xl font-bold text-green-600">{totalNotes}</div>
                                        <div className="text-sm text-gray-500">Ghi chú</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl my-6 shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <i className="pi pi-filter text-blue-600 text-lg"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Bộ lọc và Tìm kiếm</h3>
                                    <p className="text-sm text-gray-600">Tìm kiếm và lọc theo tiêu chí</p>
                                </div>
                            </div>
                            {(search || selectedTour || selectedSort) && (
                                <Button
                                    icon="pi pi-filter-slash"
                                    label="Xóa bộ lọc"
                                    outlined
                                    size="small"
                                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                                    onClick={() => {
                                        setSearch('');
                                        setSelectedTour(null);
                                        setSelectedSort(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Search Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <i className="pi pi-search text-blue-600"></i>
                                <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
                            </div>
                            <div className="relative">
                                <SearchBar
                                    onSearch={handleSearch}
                                    placeholder="Tìm kiếm theo tên tour, tiêu đề, mô tả..."
                                />
                            </div>
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tour Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-map text-green-600"></i>
                                    <label className="text-sm font-semibold text-gray-700">Lọc theo Tour</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={tours?.map((tour: newTour) => ({
                                            label: `${tour.name} (ID: ${tour.id})`,
                                            value: tour.id
                                        })) || []}
                                        value={selectedTour}
                                        onChange={(e) => setSelectedTour(e.value)}
                                        placeholder={toursLoading ? "Đang tải tours..." : tours?.length === 0 ? "Không có tour nào" : "Chọn tour để lọc"}
                                        className="w-full"
                                        panelClassName="custom-dropdown-panel"
                                        showClear
                                        disabled={toursLoading || !tours || tours.length === 0}
                                        loading={toursLoading}
                                    />
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-sort text-purple-600"></i>
                                    <label className="text-sm font-semibold text-gray-700">Sắp xếp</label>
                                </div>
                                <div className="relative">
                                    <Dropdown
                                        options={[
                                            { label: 'Tiêu đề A-Z', value: 'titleAsc' },
                                            { label: 'Tiêu đề Z-A', value: 'titleDesc' },
                                            { label: 'Ngày tạo mới nhất', value: 'dateDesc' },
                                            { label: 'Ngày tạo cũ nhất', value: 'dateAsc' }
                                        ]}
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.value)}
                                        placeholder="Chọn cách sắp xếp"
                                        className="w-full"
                                        panelClassName="custom-dropdown-panel"
                                        showClear
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(search || selectedTour || selectedSort) && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <i className="pi pi-info-circle text-blue-600"></i>
                                    <span className="text-sm font-semibold text-blue-800">Bộ lọc đang áp dụng:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {search && (
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            <i className="pi pi-search text-xs"></i>
                                            <span>Tìm kiếm: "{search}"</span>
                                            <button
                                                onClick={() => setSearch('')}
                                                className="ml-1 hover:text-blue-600"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedTour && (
                                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                            <i className="pi pi-map text-xs"></i>
                                            <span>Tour: {tours?.find(t => t.id === selectedTour)?.name}</span>
                                            <button
                                                onClick={() => setSelectedTour(null)}
                                                className="ml-1 hover:text-green-600"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                    {selectedSort && (
                                        <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                            <i className="pi pi-sort text-xs"></i>
                                            <span>Sắp xếp: {
                                                selectedSort === 'titleAsc' ? 'Tiêu đề A-Z' :
                                                selectedSort === 'titleDesc' ? 'Tiêu đề Z-A' :
                                                selectedSort === 'dateDesc' ? 'Ngày tạo mới nhất' :
                                                selectedSort === 'dateAsc' ? 'Ngày tạo cũ nhất' : selectedSort
                                            }</span>
                                            <button
                                                onClick={() => setSelectedSort(null)}
                                                className="ml-1 hover:text-purple-600"
                                            >
                                                <i className="pi pi-times text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* TabView */}
                <div className="bg-white rounded-xl shadow-sm border border-[#0f766e] overflow-hidden">
                    <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                        {/* Schedule Tab */}
                        <TabPanel header={
                            <div className="flex items-center gap-2">
                                <i className="pi pi-calendar text-green-600"></i>
                                <span>Lịch trình</span>
                                <Badge value={filteredSchedules.length} severity="success" className="ml-2" />
                            </div>
                        }>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Quản lý Lịch trình</h3>
                                    <div className="flex gap-3">
                                        <Button
                                            icon="pi pi-refresh"
                                            label="Làm mới"
                                            outlined
                                            size="small"
                                            onClick={() => getAllSchedule()}
                                            className="hover:scale-105 transition-all duration-200"
                                        />
                                        <Add
                                            label="Thêm Lịch trình"
                                            onClick={() => {
                                                setEditingSchedule(null);
                                                setScheduleForm({ tour_id: '', day_number: '', title: '', description: '' });
                                                setIsOpenSchedule(true);
                                            }}
                                        />
                                    </div>
                                </div>

                                <DataTable
                                    value={filteredSchedules}
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    stripedRows
                                    showGridlines
                                    className="text-sm"
                                    tableStyle={{ minWidth: '100%' }}
                                    dataKey="id"
                                    emptyMessage={
                                        scheduleLoading ? (
                                            <div className="text-center py-12">
                                                <i className="pi pi-spinner pi-spin text-4xl text-blue-500 mb-4"></i>
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Đang tải dữ liệu...</h3>
                                                <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <i className="pi pi-calendar text-4xl text-gray-400 mb-4"></i>
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                    {schedules.length === 0 ? 'Chưa có lịch trình nào' : 'Không tìm thấy lịch trình nào'}
                                                </h3>
                                                <p className="text-gray-500">
                                                    {schedules.length === 0 
                                                        ? 'Hãy thêm lịch trình đầu tiên vào hệ thống' 
                                                        : 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                                    }
                                                </p>
                                            </div>
                                        )
                                    }
                                    paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                                    currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} lịch trình"
                                    header={scheduleHeaderTemplate}
                                    selection={selectedSchedules}
                                    onSelectionChange={(e: any) => setSelectedSchedules(e.value)}
                                    selectionMode="multiple"
                                    loading={scheduleLoading}
                                    sortField="created_at"
                                    sortOrder={-1}
                                    removableSort
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                    <Column
                                        field="tour_id"
                                        header="Tour"
                                        body={scheduleTourTemplate}
                                        sortable
                                        style={{ width: '20%' }}
                                    />
                                    <Column
                                        field="title"
                                        header="Tiêu đề"
                                        body={scheduleTitleTemplate}
                                        sortable
                                        style={{ width: '25%' }}
                                    />
                                    <Column
                                        field="description"
                                        header="Mô tả"
                                        body={scheduleDescriptionTemplate}
                                        style={{ width: '25%' }}
                                    />
                                    <Column
                                        field="day_number"
                                        header="Ngày"
                                        body={scheduleDayTemplate}
                                        sortable
                                        style={{ width: '10%' }}
                                    />
                                    <Column
                                        field="created_at"
                                        header="Ngày tạo"
                                        body={scheduleDateTemplate}
                                        sortable
                                        style={{ width: '10%' }}
                                    />
                                    <Column
                                        header="Thao tác"
                                        body={scheduleActionTemplate}
                                        style={{ textAlign: 'center', width: '10%' }}
                                        frozen
                                        alignFrozen="right"
                                    />
                                </DataTable>
                            </div>
                        </TabPanel>

                        {/* Note Tab */}
                        <TabPanel header={
                            <div className="flex items-center gap-2">
                                <i className="pi pi-file-edit text-green-600"></i>
                                <span>Ghi chú</span>
                                <Badge value={filteredNotes.length} severity="success" className="ml-2" />
                            </div>
                        }>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Quản lý Ghi chú</h3>
                                    <div className="flex gap-3">
                                        <Button
                                            icon="pi pi-refresh"
                                            label="Làm mới"
                                            outlined
                                            size="small"
                                            onClick={() => getAllTourNotes()}
                                            className="hover:scale-105 transition-all duration-200"
                                        />
                                        <Add
                                            label="Thêm Ghi chú"
                                            onClick={() => {
                                                setEditingNote(null);
                                                setNoteForm({ tour_id: '', title: '', note: '' });
                                                setIsOpenNote(true);
                                            }}
                                        />
                                    </div>
                                </div>

                                <DataTable
                                    value={filteredNotes}
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    stripedRows
                                    showGridlines
                                    className="text-sm"
                                    tableStyle={{ minWidth: '100%' }}
                                    dataKey="id"
                                    emptyMessage={
                                        noteLoading ? (
                                            <div className="text-center py-12">
                                                <i className="pi pi-spinner pi-spin text-4xl text-green-500 mb-4"></i>
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Đang tải dữ liệu...</h3>
                                                <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <i className="pi pi-file-edit text-4xl text-gray-400 mb-4"></i>
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                    {notes.length === 0 ? 'Chưa có ghi chú nào' : 'Không tìm thấy ghi chú nào'}
                                                </h3>
                                                <p className="text-gray-500">
                                                    {notes.length === 0 
                                                        ? 'Hãy thêm ghi chú đầu tiên vào hệ thống' 
                                                        : 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                                    }
                                                </p>
                                            </div>
                                        )
                                    }
                                    paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
                                    currentPageReportTemplate="Hiển thị {first} - {last} / {totalRecords} ghi chú"
                                    header={noteHeaderTemplate}
                                    selection={selectedNotes}
                                    onSelectionChange={(e: any) => setSelectedNotes(e.value)}
                                    selectionMode="multiple"
                                    loading={noteLoading}
                                    sortField="created_at"
                                    sortOrder={-1}
                                    removableSort
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                    <Column
                                        field="tour_id"
                                        header="Tour"
                                        body={noteTourTemplate}
                                        sortable
                                        style={{ width: '20%' }}
                                    />
                                    <Column
                                        field="title"
                                        header="Tiêu đề"
                                        body={noteTitleTemplate}
                                        sortable
                                        style={{ width: '30%' }}
                                    />
                                    <Column
                                        field="note"
                                        header="Nội dung"
                                        body={noteContentTemplate}
                                        style={{ width: '40%' }}
                                    />
                                    <Column
                                        field="created_at"
                                        header="Ngày tạo"
                                        body={noteDateTemplate}
                                        sortable
                                        style={{ width: '10%' }}
                                    />
                                    <Column
                                        header="Thao tác"
                                        body={noteActionTemplate}
                                        style={{ textAlign: 'center', width: '10%' }}
                                        frozen
                                        alignFrozen="right"
                                    />
                                </DataTable>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>

                {/* Schedule Dialog */}
                <Dialog
                    visible={isOpenSchedule}
                    header={editingSchedule ? "Chỉnh sửa Lịch trình" : "Thêm Lịch trình Mới"}
                    modal
                    className="w-11/12 max-w-4xl"
                    onHide={() => {
                        setIsOpenSchedule(false);
                        setEditingSchedule(null);
                        setScheduleForm({ tour_id: '', day_number: '', title: '', description: '' });
                    }}
                >
                    <div className="p-6">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tour *
                                    </label>
                                    <Dropdown
                                        options={tours?.map((tour: newTour) => ({
                                            label: `${tour.name} (ID: ${tour.id})`,
                                            value: tour.id
                                        })) || []}
                                        value={scheduleForm.tour_id ? Number(scheduleForm.tour_id) : null}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, tour_id: e.value ? e.value.toString() : '' })}
                                        placeholder={toursLoading ? "Đang tải tours..." : tours?.length === 0 ? "Không có tour nào" : "Chọn tour"}
                                        className="w-full"
                                        showClear
                                        disabled={toursLoading || !tours || tours.length === 0}
                                        loading={toursLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số ngày *
                                    </label>
                                    <InputText
                                        value={scheduleForm.day_number}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, day_number: e.target.value })}
                                        placeholder="Nhập số ngày (ví dụ: 1, 2, 3...)"
                                        className="w-full"
                                        type="number"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu đề *
                                    </label>
                                    <InputText
                                        value={scheduleForm.title}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                                        placeholder="Nhập tiêu đề lịch trình"
                                        className="w-full"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả *
                                    </label>
                                    <InputTextarea
                                        value={scheduleForm.description}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                                        placeholder="Nhập mô tả chi tiết lịch trình"
                                        className="w-full"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                type="button"
                                label="Hủy"
                                outlined
                                onClick={() => {
                                    setIsOpenSchedule(false);
                                    setEditingSchedule(null);
                                    setScheduleForm({ tour_id: '', day_number: '', title: '', description: '' });
                                }}
                            />
                            <Button
                                type="button"
                                label={editingSchedule ? "Cập nhật" : "Thêm"}
                                onClick={handleSaveSchedule}
                                className="bg-green-800 hover:bg-green-900"
                            />
                        </div>
                    </div>
                </Dialog>

                {/* Note Dialog */}
                <Dialog
                    visible={isOpenNote}
                    header={editingNote ? "Chỉnh sửa Ghi chú" : "Thêm Ghi chú Mới"}
                    modal
                    className="w-11/12 max-w-4xl"
                    onHide={() => {
                        setIsOpenNote(false);
                        setEditingNote(null);
                        setNoteForm({ tour_id: '', title: '', note: '' });
                    }}
                >
                    <div className="p-6">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tour *
                                    </label>
                                    <Dropdown
                                        options={tours?.map((tour: newTour) => ({
                                            label: `${tour.name} (ID: ${tour.id})`,
                                            value: tour.id
                                        })) || []}
                                        value={noteForm.tour_id ? Number(noteForm.tour_id) : null}
                                        onChange={(e) => setNoteForm({ ...noteForm, tour_id: e.value ? e.value.toString() : '' })}
                                        placeholder={toursLoading ? "Đang tải tours..." : tours?.length === 0 ? "Không có tour nào" : "Chọn tour"}
                                        className="w-full"
                                        showClear
                                        disabled={toursLoading || !tours || tours.length === 0}
                                        loading={toursLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu đề *
                                    </label>
                                    <InputText
                                        value={noteForm.title}
                                        onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                        placeholder="Nhập tiêu đề ghi chú"
                                        className="w-full"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung *
                                    </label>
                                    <InputTextarea
                                        value={noteForm.note}
                                        onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
                                        placeholder="Nhập nội dung ghi chú"
                                        className="w-full"
                                        rows={6}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                type="button"
                                label="Hủy"
                                outlined
                                onClick={() => {
                                    setIsOpenNote(false);
                                    setEditingNote(null);
                                    setNoteForm({ tour_id: '', title: '', note: '' });
                                }}
                            />
                            <Button
                                type="button"
                                label={editingNote ? "Cập nhật" : "Thêm"}
                                onClick={handleSaveNote}
                                className="bg-green-800 hover:bg-green-900"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
}