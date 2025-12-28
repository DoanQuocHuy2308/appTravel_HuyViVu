export const formatDate = (date?: string | Date | null) => {
    if (!date) return "Chưa cập nhật";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Không hợp lệ";
    return dateObj.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
export const getTimeRemaining = (startDate: string | Date) => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();

    const diff = start - now;

    if (diff <= 0) return "Đã khởi hành";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
};


