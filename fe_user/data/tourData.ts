import { Tour } from "@/types/tourType";

export const tourData: Tour = {
    id: 1,
    title: "Khám Phá Kỳ Quan Vịnh Hạ Long - Du Thuyền 5 Sao",
    location: "Hạ Long, Quảng Ninh",
    duration: "2 ngày 1 đêm",
    rating: 4.8,
    reviews: 128,
    price: "2.500.000",
    images: [
        "https://images.unsplash.com/photo-1578994528532-15386f2a35a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1557636395-2a2977423984?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1566416295478-831c19b626a5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    description: "Trải nghiệm một hành trình khó quên trên Vịnh Hạ Long, di sản thiên nhiên thế giới. Tận hưởng sự sang trọng trên du thuyền 5 sao, khám phá những hang động kỳ vĩ, chèo thuyền kayak giữa làn nước trong xanh và thưởng thức hải sản tươi ngon.",
    highlights: [
        "Du thuyền 5 sao sang trọng với đầy đủ tiện nghi.",
        "Tham quan Hang Sửng Sốt, một trong những hang động đẹp nhất.",
        "Chèo thuyền Kayak hoặc đi thuyền nan tại Hang Luồn.",
        "Tắm biển và leo núi tại đảo Ti Tốp.",
        "Tham gia lớp học nấu ăn và câu mực đêm trên du thuyền."
    ],
    includes: ["Phòng nghỉ đêm trên du thuyền", "Các bữa ăn theo chương trình", "Vé tham quan các điểm", "Thuyền Kayak", "Hướng dẫn viên"],
    excludes: ["Đồ uống cá nhân", "Chi phí cá nhân", "VAT"],
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
