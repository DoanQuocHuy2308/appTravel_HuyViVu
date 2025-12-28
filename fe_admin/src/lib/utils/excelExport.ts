import * as XLSX from 'xlsx';
import { BookingDetail } from '../types';

// Interface cho styling Excel
interface ExcelStyle {
    font?: {
        name?: string;
        sz?: number;
        bold?: boolean;
        italic?: boolean;
        color?: string;
    };
    fill?: {
        fgColor?: string;
        bgColor?: string;
        patternType?: string;
    };
    border?: {
        top?: { style?: string; color?: string };
        bottom?: { style?: string; color?: string };
        left?: { style?: string; color?: string };
        right?: { style?: string; color?: string };
    };
    alignment?: {
        horizontal?: string;
        vertical?: string;
        wrapText?: boolean;
    };
    numFmt?: string;
}

export interface ExcelExportOptions {
    filename?: string;
    sheetName?: string;
    includeHeaders?: boolean;
    dateFormat?: string;
}

export const exportBookingsToExcel = (
    bookings: BookingDetail[], 
    options: ExcelExportOptions = {}
) => {
    const {
        filename = 'danh-sach-don-hang',
        sheetName = 'Đơn hàng',
        includeHeaders = true,
        dateFormat = 'DD/MM/YYYY'
    } = options;
    
    // Chuẩn bị dữ liệu cho Excel
    const excelData = bookings.map((booking, index) => {
        // Tính giá tiền theo từng loại người nhân với số lượng
        const adultPrice = (booking.ticket_prices?.adult_price || 0) * (booking.adults || 0);
        const childPrice = (booking.ticket_prices?.child_price || 0) * (booking.children || 0);
        const infantPrice = (booking.ticket_prices?.infant_price || 0) * (booking.infants || 0);
        
        return {
            'STT': index + 1,
            'Mã đơn hàng': booking.booking_id,
            'Tên khách hàng': booking.user_name,
            'Email': booking.user_email,
            'Số điện thoại': booking.user_phone,
            'Tên tour': booking.tour_name,
            'Mã tour': booking.tour_id,
            'Người lớn': booking.adults,
            'Trẻ em': booking.children,
            'Em bé': booking.infants,
            'Tổng khách': booking.adults + booking.children + booking.infants,
            'Trạng thái': getStatusText(booking.status),
            'Giá đơn vị người lớn (VNĐ)': formatCurrency(booking.ticket_prices?.adult_price || 0),
            'Giá đơn vị trẻ em (VNĐ)': formatCurrency(booking.ticket_prices?.child_price || 0),
            'Giá đơn vị em bé (VNĐ)': formatCurrency(booking.ticket_prices?.infant_price || 0),
            'Tổng tiền người lớn (VNĐ)': formatCurrency(adultPrice),
            'Tổng tiền trẻ em (VNĐ)': formatCurrency(childPrice),
            'Tổng tiền em bé (VNĐ)': formatCurrency(infantPrice),
            'Tổng tiền (VNĐ)': formatCurrency(booking.total_price || 0),
            'Ngày đặt': booking.booking_date ? formatDate(booking.booking_date) : '',
            'Ngày bắt đầu': booking.start_date ? formatDate(booking.start_date) : '',
            'Ngày kết thúc': booking.end_date ? formatDate(booking.end_date) : '',
            'Ghi chú': booking.notes || '',
            'Điểm thưởng': booking.points_earned || 0
        };
    });

    // Tính tổng doanh thu
    const totalRevenue = bookings.reduce((sum, booking) => {
        const price = booking.total_price ? Number(booking.total_price) : 0;
        return sum + (isNaN(price) ? 0 : price);
    }, 0);
    const confirmedRevenue = bookings
        .filter(booking => booking.status === 'confirmed')
        .reduce((sum, booking) => {
            const price = booking.total_price ? Number(booking.total_price) : 0;
            return sum + (isNaN(price) ? 0 : price);
        }, 0);

    // Tính tổng tiền theo từng loại người
    const totalAdultRevenue = bookings.reduce((sum, booking) => {
        const adultPrice = (booking.ticket_prices?.adult_price || 0) * (booking.adults || 0);
        return sum + adultPrice;
    }, 0);
    
    const totalChildRevenue = bookings.reduce((sum, booking) => {
        const childPrice = (booking.ticket_prices?.child_price || 0) * (booking.children || 0);
        return sum + childPrice;
    }, 0);
    
    const totalInfantRevenue = bookings.reduce((sum, booking) => {
        const infantPrice = (booking.ticket_prices?.infant_price || 0) * (booking.infants || 0);
        return sum + infantPrice;
    }, 0);

    // Tạo workbook
    const workbook = XLSX.utils.book_new();
    
    // Tạo worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Thêm header đẹp
    const headerOffset = addExcelHeader(worksheet, 'BÁO CÁO ĐƠN HÀNG TOUR', 'Danh sách chi tiết các đơn hàng tour du lịch');
    
    // Thiết lập độ rộng cột với auto-fit
    const columnWidths = [
        { wch: 5 },   // STT
        { wch: 15 },  // Mã đơn hàng
        { wch: 25 },  // Tên khách hàng
        { wch: 30 },  // Email
        { wch: 18 },  // Số điện thoại
        { wch: 35 },  // Tên tour
        { wch: 12 },  // Mã tour
        { wch: 12 },  // Người lớn
        { wch: 12 },  // Trẻ em
        { wch: 12 },  // Em bé
        { wch: 12 },  // Tổng khách
        { wch: 18 },  // Trạng thái
        { wch: 25 },  // Giá đơn vị người lớn
        { wch: 25 },  // Giá đơn vị trẻ em
        { wch: 25 },  // Giá đơn vị em bé
        { wch: 25 },  // Tổng tiền người lớn
        { wch: 25 },  // Tổng tiền trẻ em
        { wch: 25 },  // Tổng tiền em bé
        { wch: 25 },  // Tổng tiền
        { wch: 15 },  // Ngày đặt
        { wch: 15 },  // Ngày bắt đầu
        { wch: 15 },  // Ngày kết thúc
        { wch: 40 },  // Ghi chú
        { wch: 15 }   // Điểm thưởng
    ];
    
    worksheet['!cols'] = columnWidths;
    
    // Áp dụng styling với header offset
    applyStylesToWorksheet(worksheet, excelData.length, true, headerOffset);
    
    // Thêm tổng doanh thu vào cuối sheet
    const totalRow = excelData.length + 2;
    const summaryData = [
        { 'STT': '', 'Mã đơn hàng': '', 'Tên khách hàng': '', 'Email': '', 'Số điện thoại': '', 'Tên tour': '', 'Mã tour': '', 'Người lớn': '', 'Trẻ em': '', 'Em bé': '', 'Tổng khách': '', 'Trạng thái': '', 'Giá đơn vị người lớn (VNĐ)': '', 'Giá đơn vị trẻ em (VNĐ)': '', 'Giá đơn vị em bé (VNĐ)': '', 'Tổng tiền người lớn (VNĐ)': '', 'Tổng tiền trẻ em (VNĐ)': '', 'Tổng tiền em bé (VNĐ)': '', 'Tổng tiền (VNĐ)': '', 'Ngày đặt': '', 'Ngày bắt đầu': '', 'Ngày kết thúc': '', 'Ghi chú': '', 'Điểm thưởng': '' },
        { 'STT': '', 'Mã đơn hàng': '', 'Tên khách hàng': '', 'Email': '', 'Số điện thoại': '', 'Tên tour': '', 'Mã tour': '', 'Người lớn': '', 'Trẻ em': '', 'Em bé': '', 'Tổng khách': '', 'Trạng thái': 'TỔNG DOANH THU', 'Giá đơn vị người lớn (VNĐ)': '', 'Giá đơn vị trẻ em (VNĐ)': '', 'Giá đơn vị em bé (VNĐ)': '', 'Tổng tiền người lớn (VNĐ)': formatCurrency(totalAdultRevenue), 'Tổng tiền trẻ em (VNĐ)': formatCurrency(totalChildRevenue), 'Tổng tiền em bé (VNĐ)': formatCurrency(totalInfantRevenue), 'Tổng tiền (VNĐ)': formatCurrency(totalRevenue), 'Ngày đặt': '', 'Ngày bắt đầu': '', 'Ngày kết thúc': '', 'Ghi chú': '', 'Điểm thưởng': '' },
        { 'STT': '', 'Mã đơn hàng': '', 'Tên khách hàng': '', 'Email': '', 'Số điện thoại': '', 'Tên tour': '', 'Mã tour': '', 'Người lớn': '', 'Trẻ em': '', 'Em bé': '', 'Tổng khách': '', 'Trạng thái': 'ĐÃ XÁC NHẬN', 'Giá đơn vị người lớn (VNĐ)': '', 'Giá đơn vị trẻ em (VNĐ)': '', 'Giá đơn vị em bé (VNĐ)': '', 'Tổng tiền người lớn (VNĐ)': '', 'Tổng tiền trẻ em (VNĐ)': '', 'Tổng tiền em bé (VNĐ)': '', 'Tổng tiền (VNĐ)': formatCurrency(confirmedRevenue), 'Ngày đặt': '', 'Ngày bắt đầu': '', 'Ngày kết thúc': '', 'Ghi chú': '', 'Điểm thưởng': '' }
    ];
    
    // Thêm dữ liệu tổng kết vào worksheet
    const summaryRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    summaryRange.e.r += 3; // Thêm 3 dòng
    worksheet['!ref'] = XLSX.utils.encode_range(summaryRange);
    
    // Thêm dữ liệu tổng kết
    summaryData.forEach((row, index) => {
        const rowIndex = excelData.length + index + 1;
        Object.keys(row).forEach((key, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
            worksheet[cellAddress] = { v: (row as any)[key], t: 's' };
        });
    });
    
    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Xuất file
    const fileName = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    return fileName;
};

// Helper functions
const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
        'pending': 'Chờ xử lý',
        'confirmed': 'Đã xác nhận',
        'canceled': 'Đã hủy'
    };
    return statusMap[status] || status;
};

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    } catch {
        return dateString;
    }
};

const formatCurrency = (amount: number): string => {
    if (amount === 0) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Helper function để tính giá tiền theo loại người
const calculatePriceByPersonType = (booking: BookingDetail) => {
    const adultPrice = (booking.ticket_prices?.adult_price || 0) * (booking.adults || 0);
    const childPrice = (booking.ticket_prices?.child_price || 0) * (booking.children || 0);
    const infantPrice = (booking.ticket_prices?.infant_price || 0) * (booking.infants || 0);
    
    return {
        adultPrice,
        childPrice,
        infantPrice,
        total: adultPrice + childPrice + infantPrice
    };
};

// Helper functions cho styling Excel với XLSX
const createHeaderStyle = () => ({
    font: { name: 'Arial', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '0F766E' }, patternType: 'solid' },
    border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
});

const createDataStyle = () => ({
    font: { name: 'Arial', sz: 10, bold: false, color: { rgb: '000000' } },
    border: {
        top: { style: 'thin', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
        left: { style: 'thin', color: { rgb: 'CCCCCC' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
});

const createSummaryStyle = () => ({
    font: { name: 'Arial', sz: 11, bold: true, color: { rgb: '000000' } },
    fill: { fgColor: { rgb: 'F0F9FF' }, patternType: 'solid' },
    border: {
        top: { style: 'medium', color: { rgb: '0F766E' } },
        bottom: { style: 'medium', color: { rgb: '0F766E' } },
        left: { style: 'medium', color: { rgb: '0F766E' } },
        right: { style: 'medium', color: { rgb: '0F766E' } }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
});

const createCurrencyStyle = () => ({
    font: { name: 'Arial', sz: 10, bold: false, color: { rgb: '000000' } },
    border: {
        top: { style: 'thin', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
        left: { style: 'thin', color: { rgb: 'CCCCCC' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    },
    alignment: { horizontal: 'right', vertical: 'center', wrapText: false },
    numFmt: '#,##0" VNĐ"'
});

const createNumberStyle = () => ({
    font: { name: 'Arial', sz: 10, bold: false, color: { rgb: '000000' } },
    border: {
        top: { style: 'thin', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
        left: { style: 'thin', color: { rgb: 'CCCCCC' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    numFmt: '#,##0'
});

// Function để tạo header đẹp cho Excel
const addExcelHeader = (worksheet: XLSX.WorkSheet, title: string, subtitle?: string) => {
    // Thêm title
    const titleCell = 'A1';
    worksheet[titleCell] = { v: title, t: 's' };
    worksheet[titleCell].s = {
        font: { name: 'Arial', sz: 16, bold: true, color: { rgb: '0F766E' } },
        alignment: { horizontal: 'center', vertical: 'center' }
    };
    
    // Thêm subtitle nếu có
    if (subtitle) {
        const subtitleCell = 'A2';
        worksheet[subtitleCell] = { v: subtitle, t: 's' };
        worksheet[subtitleCell].s = {
            font: { name: 'Arial', sz: 12, bold: false, color: { rgb: '666666' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        };
    }
    
    // Thêm thông tin xuất file
    const exportInfoCell = subtitle ? 'A3' : 'A2';
    const exportDate = new Date().toLocaleString('vi-VN');
    worksheet[exportInfoCell] = { v: `Xuất báo cáo lúc: ${exportDate}`, t: 's' };
    worksheet[exportInfoCell].s = {
        font: { name: 'Arial', sz: 10, bold: false, color: { rgb: '999999' } },
        alignment: { horizontal: 'center', vertical: 'center' }
    };
    
    return subtitle ? 4 : 3; // Trả về số dòng header
};

// Function để áp dụng style cho worksheet
const applyStylesToWorksheet = (worksheet: XLSX.WorkSheet, dataLength: number, hasSummary: boolean = false, headerOffset: number = 0) => {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const headerRow = headerOffset;
    const dataStartRow = headerOffset + 1;
    
    // Style cho header (dòng header)
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = createHeaderStyle();
    }
    
    // Style cho data rows
    for (let row = dataStartRow; row < dataStartRow + dataLength; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress]) continue;
            
            const cell = worksheet[cellAddress];
            const headerCell = worksheet[XLSX.utils.encode_cell({ r: headerRow, c: col })];
            const headerValue = headerCell?.v?.toString() || '';
            
            // Áp dụng style dựa trên loại cột
            if (headerValue.includes('tiền') || headerValue.includes('Giá') || headerValue.includes('Tổng tiền')) {
                cell.s = createCurrencyStyle();
            } else if (headerValue.includes('Số lượng') || headerValue.includes('STT') || headerValue.includes('Mã')) {
                cell.s = createNumberStyle();
            } else {
                cell.s = createDataStyle();
            }
        }
    }
    
    // Style cho summary rows (nếu có)
    if (hasSummary) {
        const summaryStartRow = dataStartRow + dataLength + 2;
        for (let row = summaryStartRow; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (!worksheet[cellAddress]) continue;
                
                worksheet[cellAddress].s = createSummaryStyle();
            }
        }
    }
};

// Xuất báo cáo thống kê
export const exportBookingStatsToExcel = (bookings: BookingDetail[]) => {
    // Thống kê theo trạng thái
    const statusStats = bookings.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    // Thống kê theo tour
    const tourStats = bookings.reduce((acc, booking) => {
        const tourName = booking.tour_name;
        if (!acc[tourName]) {
            acc[tourName] = { count: 0, totalRevenue: 0 };
        }
        acc[tourName].count++;
        const price = booking.total_price ? Number(booking.total_price) : 0;
        acc[tourName].totalRevenue += isNaN(price) ? 0 : price;
        return acc;
    }, {} as { [key: string]: { count: number; totalRevenue: number } });

    // Tính tổng doanh thu
    const totalRevenue = bookings.reduce((sum, booking) => {
        const price = booking.total_price ? Number(booking.total_price) : 0;
        return sum + (isNaN(price) ? 0 : price);
    }, 0);

    // Tạo dữ liệu thống kê tổng quan
    const statsData = [
        { 'Loại thống kê': 'Tổng đơn hàng', 'Giá trị': bookings.length, 'Ghi chú': 'Tổng số đơn hàng trong hệ thống' },
        { 'Loại thống kê': 'Chờ xử lý', 'Giá trị': statusStats.pending || 0, 'Ghi chú': 'Đơn hàng đang chờ xử lý' },
        { 'Loại thống kê': 'Đã xác nhận', 'Giá trị': statusStats.confirmed || 0, 'Ghi chú': 'Đơn hàng đã được xác nhận' },
        { 'Loại thống kê': 'Đã hủy', 'Giá trị': statusStats.canceled || 0, 'Ghi chú': 'Đơn hàng đã bị hủy' },
        { 'Loại thống kê': 'Tổng doanh thu', 'Giá trị': formatCurrency(totalRevenue), 'Ghi chú': 'Tổng doanh thu từ tất cả đơn hàng' },
        { 'Loại thống kê': 'Doanh thu trung bình', 'Giá trị': bookings.length > 0 ? formatCurrency(totalRevenue / bookings.length) : '0 VNĐ', 'Ghi chú': 'Doanh thu trung bình mỗi đơn hàng' }
    ];

    // Tạo dữ liệu thống kê theo tour
    const tourStatsData = Object.entries(tourStats).map(([tourName, stats]) => ({
        'Tên tour': tourName,
        'Số đơn hàng': stats.count,
        'Tổng doanh thu (VNĐ)': formatCurrency(stats.totalRevenue),
        'Doanh thu trung bình (VNĐ)': formatCurrency(stats.count > 0 ? stats.totalRevenue / stats.count : 0),
        'Tỷ lệ (%)': bookings.length > 0 ? ((stats.count / bookings.length) * 100).toFixed(2) + '%' : '0%'
    }));

    // Tạo dữ liệu thống kê theo tháng (nếu có dữ liệu)
    const monthlyStats = bookings.reduce((acc, booking) => {
        if (booking.booking_date) {
            const month = new Date(booking.booking_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' });
            if (!acc[month]) {
                acc[month] = { count: 0, revenue: 0 };
            }
            acc[month].count++;
            const price = booking.total_price ? Number(booking.total_price) : 0;
            acc[month].revenue += isNaN(price) ? 0 : price;
        }
        return acc;
    }, {} as { [key: string]: { count: number; revenue: number } });

    const monthlyStatsData = Object.entries(monthlyStats).map(([month, stats]) => ({
        'Tháng': month,
        'Số đơn hàng': stats.count,
        'Doanh thu (VNĐ)': formatCurrency(stats.revenue),
        'Doanh thu trung bình (VNĐ)': formatCurrency(stats.count > 0 ? stats.revenue / stats.count : 0)
    }));

    // Tạo workbook
    const workbook = XLSX.utils.book_new();
    
    // Worksheet thống kê tổng quan
    const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
    const statsHeaderOffset = addExcelHeader(statsWorksheet, 'THỐNG KÊ TỔNG QUAN', 'Báo cáo tổng hợp về đơn hàng tour');
    
    statsWorksheet['!cols'] = [
        { wch: 30 },  // Loại thống kê
        { wch: 25 },  // Giá trị
        { wch: 50 }   // Ghi chú
    ];
    applyStylesToWorksheet(statsWorksheet, statsData.length, false, statsHeaderOffset);
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Thống kê tổng quan');
    
    // Worksheet thống kê theo tour
    const tourStatsWorksheet = XLSX.utils.json_to_sheet(tourStatsData);
    const tourHeaderOffset = addExcelHeader(tourStatsWorksheet, 'THỐNG KÊ THEO TOUR', 'Phân tích doanh thu theo từng tour');
    
    tourStatsWorksheet['!cols'] = [
        { wch: 35 },  // Tên tour
        { wch: 18 },  // Số đơn hàng
        { wch: 25 },  // Tổng doanh thu
        { wch: 30 },  // Doanh thu trung bình
        { wch: 15 }   // Tỷ lệ
    ];
    applyStylesToWorksheet(tourStatsWorksheet, tourStatsData.length, false, tourHeaderOffset);
    XLSX.utils.book_append_sheet(workbook, tourStatsWorksheet, 'Thống kê theo tour');
    
    // Worksheet thống kê theo tháng (nếu có dữ liệu)
    if (monthlyStatsData.length > 0) {
        const monthlyWorksheet = XLSX.utils.json_to_sheet(monthlyStatsData);
        const monthlyHeaderOffset = addExcelHeader(monthlyWorksheet, 'THỐNG KÊ THEO THÁNG', 'Phân tích doanh thu theo thời gian');
        
        monthlyWorksheet['!cols'] = [
            { wch: 25 },  // Tháng
            { wch: 18 },  // Số đơn hàng
            { wch: 25 },  // Doanh thu
            { wch: 30 }   // Doanh thu trung bình
        ];
        applyStylesToWorksheet(monthlyWorksheet, monthlyStatsData.length, false, monthlyHeaderOffset);
        XLSX.utils.book_append_sheet(workbook, monthlyWorksheet, 'Thống kê theo tháng');
    }
    
    // Xuất file
    const fileName = `bao-cao-don-hang_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    return fileName;
};

// Xuất báo cáo chi tiết theo loại người
export const exportDetailedBookingReport = (bookings: BookingDetail[]) => {
    // Tính toán chi tiết cho từng booking
    const detailedData = bookings.map((booking, index) => {
        const prices = calculatePriceByPersonType(booking);
        
        return {
            'STT': index + 1,
            'Mã đơn hàng': booking.booking_id,
            'Tên khách hàng': booking.user_name,
            'Tên tour': booking.tour_name,
            'Số lượng người lớn': booking.adults || 0,
            'Số lượng trẻ em': booking.children || 0,
            'Số lượng em bé': booking.infants || 0,
            'Tổng số người': (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0),
            'Giá đơn vị người lớn': formatCurrency(booking.ticket_prices?.adult_price || 0),
            'Giá đơn vị trẻ em': formatCurrency(booking.ticket_prices?.child_price || 0),
            'Giá đơn vị em bé': formatCurrency(booking.ticket_prices?.infant_price || 0),
            'Tổng tiền người lớn': formatCurrency(prices.adultPrice),
            'Tổng tiền trẻ em': formatCurrency(prices.childPrice),
            'Tổng tiền em bé': formatCurrency(prices.infantPrice),
            'Tổng tiền đơn hàng': formatCurrency(booking.total_price || 0),
            'Trạng thái': getStatusText(booking.status),
            'Ngày đặt': booking.booking_date ? formatDate(booking.booking_date) : '',
            'Ngày bắt đầu': booking.start_date ? formatDate(booking.start_date) : '',
            'Ngày kết thúc': booking.end_date ? formatDate(booking.end_date) : ''
        };
    });

    // Tính tổng kết
    const totalStats = bookings.reduce((acc, booking) => {
        const prices = calculatePriceByPersonType(booking);
        acc.totalAdults += booking.adults || 0;
        acc.totalChildren += booking.children || 0;
        acc.totalInfants += booking.infants || 0;
        acc.totalAdultRevenue += prices.adultPrice;
        acc.totalChildRevenue += prices.childPrice;
        acc.totalInfantRevenue += prices.infantPrice;
        acc.totalRevenue += booking.total_price || 0;
        return acc;
    }, {
        totalAdults: 0,
        totalChildren: 0,
        totalInfants: 0,
        totalAdultRevenue: 0,
        totalChildRevenue: 0,
        totalInfantRevenue: 0,
        totalRevenue: 0
    });

    // Tạo workbook
    const workbook = XLSX.utils.book_new();
    
    // Worksheet chi tiết
    const detailWorksheet = XLSX.utils.json_to_sheet(detailedData);
    
    // Thêm header đẹp
    const detailHeaderOffset = addExcelHeader(detailWorksheet, 'CHI TIẾT ĐƠN HÀNG', 'Phân tích chi tiết theo từng loại người');
    
    detailWorksheet['!cols'] = [
        { wch: 5 },   // STT
        { wch: 18 },  // Mã đơn hàng
        { wch: 30 },  // Tên khách hàng
        { wch: 40 },  // Tên tour
        { wch: 18 },  // Số lượng người lớn
        { wch: 18 },  // Số lượng trẻ em
        { wch: 18 },  // Số lượng em bé
        { wch: 18 },  // Tổng số người
        { wch: 25 },  // Giá đơn vị người lớn
        { wch: 25 },  // Giá đơn vị trẻ em
        { wch: 25 },  // Giá đơn vị em bé
        { wch: 25 },  // Tổng tiền người lớn
        { wch: 25 },  // Tổng tiền trẻ em
        { wch: 25 },  // Tổng tiền em bé
        { wch: 25 },  // Tổng tiền đơn hàng
        { wch: 18 },  // Trạng thái
        { wch: 15 },  // Ngày đặt
        { wch: 15 },  // Ngày bắt đầu
        { wch: 15 }   // Ngày kết thúc
    ];
    
    // Áp dụng styling cho worksheet chi tiết
    applyStylesToWorksheet(detailWorksheet, detailedData.length, false, detailHeaderOffset);
    
    XLSX.utils.book_append_sheet(workbook, detailWorksheet, 'Chi tiết đơn hàng');

    // Worksheet tổng kết
    const summaryData = [
        { 'Loại thống kê': 'Tổng số người lớn', 'Số lượng': totalStats.totalAdults, 'Tổng tiền (VNĐ)': formatCurrency(totalStats.totalAdultRevenue) },
        { 'Loại thống kê': 'Tổng số trẻ em', 'Số lượng': totalStats.totalChildren, 'Tổng tiền (VNĐ)': formatCurrency(totalStats.totalChildRevenue) },
        { 'Loại thống kê': 'Tổng số em bé', 'Số lượng': totalStats.totalInfants, 'Tổng tiền (VNĐ)': formatCurrency(totalStats.totalInfantRevenue) },
        { 'Loại thống kê': 'Tổng số người', 'Số lượng': totalStats.totalAdults + totalStats.totalChildren + totalStats.totalInfants, 'Tổng tiền (VNĐ)': formatCurrency(totalStats.totalRevenue) },
        { 'Loại thống kê': 'Tổng doanh thu', 'Số lượng': '', 'Tổng tiền (VNĐ)': formatCurrency(totalStats.totalRevenue) }
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    
    // Thêm header đẹp
    const summaryHeaderOffset = addExcelHeader(summaryWorksheet, 'TỔNG KẾT DOANH THU', 'Thống kê tổng hợp theo từng loại người');
    
    summaryWorksheet['!cols'] = [
        { wch: 30 },  // Loại thống kê
        { wch: 18 },  // Số lượng
        { wch: 30 }   // Tổng tiền
    ];
    
    // Áp dụng styling cho worksheet tổng kết
    applyStylesToWorksheet(summaryWorksheet, summaryData.length, false, summaryHeaderOffset);
    
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Tổng kết');

    // Xuất file
    const fileName = `bao-cao-chi-tiet-don-hang_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    return fileName;
};

// Function tạo Excel với màu sắc sử dụng HTML approach
export const exportBookingsToExcelWithColors = (bookings: BookingDetail[]) => {
    // Tạo HTML table với styling
    const createStyledTable = (data: any[], title: string) => {
        const headers = Object.keys(data[0] || {});
        
        let html = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .title { 
                    font-size: 18px; 
                    font-weight: bold; 
                    color: #0F766E; 
                    text-align: center; 
                    margin-bottom: 20px; 
                }
                .subtitle { 
                    font-size: 14px; 
                    color: #666; 
                    text-align: center; 
                    margin-bottom: 30px; 
                }
                table { 
                    border-collapse: collapse; 
                    width: 100%; 
                    margin-bottom: 20px;
                }
                th { 
                    background-color: #0F766E; 
                    color: white; 
                    font-weight: bold; 
                    padding: 12px 8px; 
                    text-align: center; 
                    border: 1px solid #000;
                }
                td { 
                    padding: 8px; 
                    border: 1px solid #ccc; 
                    text-align: left;
                }
                tr:nth-child(even) { background-color: #f9f9f9; }
                tr:hover { background-color: #f0f9ff; }
                .currency { text-align: right; font-weight: bold; color: #0F766E; }
                .number { text-align: center; }
                .status-confirmed { color: #059669; font-weight: bold; }
                .status-pending { color: #d97706; font-weight: bold; }
                .status-canceled { color: #dc2626; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="title">${title}</div>
            <div class="subtitle">Xuất báo cáo lúc: ${new Date().toLocaleString('vi-VN')}</div>
            <table>
                <thead>
                    <tr>
        `;
        
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        
        html += `
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.forEach((row, index) => {
            html += '<tr>';
            headers.forEach(header => {
                const value = row[header];
                let cellClass = '';
                let displayValue = value;
                
                // Xác định class cho cell
                if (header.includes('tiền') || header.includes('Giá') || header.includes('Tổng tiền')) {
                    cellClass = 'currency';
                } else if (header.includes('Số lượng') || header.includes('STT') || header.includes('Mã')) {
                    cellClass = 'number';
                } else if (header === 'Trạng thái') {
                    if (value === 'Đã xác nhận') cellClass = 'status-confirmed';
                    else if (value === 'Chờ xử lý') cellClass = 'status-pending';
                    else if (value === 'Đã hủy') cellClass = 'status-canceled';
                }
                
                html += `<td class="${cellClass}">${displayValue}</td>`;
            });
            html += '</tr>';
        });
        
        html += `
                </tbody>
            </table>
        </body>
        </html>
        `;
        
        return html;
    };

    // Chuẩn bị dữ liệu
    const excelData = bookings.map((booking, index) => {
        const adultPrice = (booking.ticket_prices?.adult_price || 0) * (booking.adults || 0);
        const childPrice = (booking.ticket_prices?.child_price || 0) * (booking.children || 0);
        const infantPrice = (booking.ticket_prices?.infant_price || 0) * (booking.infants || 0);
        
        return {
            'STT': index + 1,
            'Mã đơn hàng': booking.booking_id,
            'Tên khách hàng': booking.user_name,
            'Email': booking.user_email,
            'Số điện thoại': booking.user_phone,
            'Tên tour': booking.tour_name,
            'Mã tour': booking.tour_id,
            'Người lớn': booking.adults,
            'Trẻ em': booking.children,
            'Em bé': booking.infants,
            'Tổng khách': booking.adults + booking.children + booking.infants,
            'Trạng thái': getStatusText(booking.status),
            'Giá đơn vị người lớn (VNĐ)': formatCurrency(booking.ticket_prices?.adult_price || 0),
            'Giá đơn vị trẻ em (VNĐ)': formatCurrency(booking.ticket_prices?.child_price || 0),
            'Giá đơn vị em bé (VNĐ)': formatCurrency(booking.ticket_prices?.infant_price || 0),
            'Tổng tiền người lớn (VNĐ)': formatCurrency(adultPrice),
            'Tổng tiền trẻ em (VNĐ)': formatCurrency(childPrice),
            'Tổng tiền em bé (VNĐ)': formatCurrency(infantPrice),
            'Tổng tiền (VNĐ)': formatCurrency(booking.total_price || 0),
            'Ngày đặt': booking.booking_date ? formatDate(booking.booking_date) : '',
            'Ngày bắt đầu': booking.start_date ? formatDate(booking.start_date) : '',
            'Ngày kết thúc': booking.end_date ? formatDate(booking.end_date) : '',
            'Ghi chú': booking.notes || '',
            'Điểm thưởng': booking.points_earned || 0
        };
    });

    // Tạo HTML
    const htmlContent = createStyledTable(excelData, 'BÁO CÁO ĐƠN HÀNG TOUR - DANH SÁCH CHI TIẾT');
    
    // Tạo và download file HTML
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-don-hang-mau-sac_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return link.download;
};
