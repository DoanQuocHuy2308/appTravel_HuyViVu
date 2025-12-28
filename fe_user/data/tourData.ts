import { TourDetail } from "@/types/tourType";

export const tourData: TourDetail = {
    id: 1,
    name: "Khám Phá Kỳ Quan Vịnh Hạ Long - Du Thuyền 5 Sao",
    location: "Hạ Long, Quảng Ninh",
    duration: "2 ngày 1 đêm",
    rating: 4.8,
    price: 2500000,
    image: "https://images.unsplash.com/photo-1578994528532-15386f2a35a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Trải nghiệm một hành trình khó quên trên Vịnh Hạ Long, di sản thiên nhiên thế giới. Tận hưởng sự sang trọng trên du thuyền 5 sao, khám phá những hang động kỳ vĩ, chèo thuyền kayak giữa làn nước trong xanh và thưởng thức hải sản tươi ngon.",
    highlights: [
        "Khám phá Vịnh Hạ Long - Di sản thiên nhiên thế giới",
        "Trải nghiệm du thuyền 5 sao sang trọng",
        "Chèo thuyền kayak khám phá hang động",
        "Thưởng thức hải sản tươi ngon",
        "Ngắm hoàng hôn tuyệt đẹp trên vịnh"
    ],
    includes: [
        "Vé tham quan Vịnh Hạ Long",
        "Ăn uống trên du thuyền (2 bữa trưa, 1 bữa tối, 1 bữa sáng)",
        "Hướng dẫn viên chuyên nghiệp",
        "Thuyền kayak và phao cứu sinh",
        "Xe đưa đón từ Hà Nội"
    ],
    excludes: [
        "Đồ uống có cồn",
        "Chi phí cá nhân",
        "Bảo hiểm du lịch",
        "Tiền tip cho hướng dẫn viên",
        "Các hoạt động không có trong chương trình"
    ],
    itinerary: [
        {
            day: "Ngày 1",
            title: "Hà Nội - Vịnh Hạ Long - Khám Phá",
            data: [
                { time: "08:00", activity: "Xe đón quý khách tại Hà Nội, khởi hành đi Hạ Long." },
                { time: "12:00", activity: "Đến cảng Tuần Châu, làm thủ tục lên du thuyền." },
            ]
        },
        {
            day: "Ngày 2",
            title: "Hạ Long - Hà Nội",
            data: [
                { time: "06:30", activity: "Ngắm bình minh trên vịnh và tham gia lớp học Taichi." },
                { time: "12:00", activity: "Tàu cập bến, xe đưa quý khách trở về Hà Nội." },
            ]
        }
    ],
    notes: [
        { title: "Nên mang theo", content: "Kem chống nắng, mũ, kính râm, đồ bơi, máy ảnh và sạc dự phòng." },
        { title: "Giấy tờ tùy thân", content: "Vui lòng mang theo CMND/CCCD hoặc Hộ chiếu để làm thủ tục check-in." },
    ]
};