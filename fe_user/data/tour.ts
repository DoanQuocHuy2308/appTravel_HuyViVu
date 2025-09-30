export interface Tour {
    id: number;
    title: string;
    location: string;
    duration: string;
    rating: number;
    price: string;
    image: string;
}

export const TOURS_DATA: Tour[] = [
    {
        id: 1,
        title: "Du thuyền 5* Vịnh Hạ Long - Khám phá Di sản",
        location: "Hạ Long",
        duration: "2 ngày 1 đêm",
        rating: 4.9,
        price: "2.500.000đ",
        image: "https://images.unsplash.com/photo-1578994528532-15386f2a35a6?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Nghỉ dưỡng tại Bà Nà Hills - Đường lên tiên cảnh",
        location: "Đà Nẵng",
        duration: "3 ngày 2 đêm",
        rating: 4.8,
        price: "4.200.000đ",
        image: "https://images.unsplash.com/photo-1569509833799-2ab34e5a1b5c?q=80&w=1974&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Khám phá Đảo Ngọc Phú Quốc - Lặn ngắm san hô",
        location: "Phú Quốc",
        duration: "3 ngày 2 đêm",
        rating: 4.7,
        price: "3.800.000đ",
        image: "https://images.unsplash.com/photo-1616016938431-8319f0413233?q=80&w=1964&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Chinh phục nóc nhà Đông Dương - Fansipan",
        location: "Sapa",
        duration: "2 ngày 1 đêm",
        rating: 4.9,
        price: "3.100.000đ",
        image: "https://images.unsplash.com/photo-1587123953934-2d93e223c6f0?q=80&w=1974&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Trải nghiệm văn hóa Cố đô Huế",
        location: "Huế",
        duration: "2 ngày 2 đêm",
        rating: 4.6,
        price: "2.800.000đ",
        image: "https://images.unsplash.com/photo-1595825224325-1e4e6f43e061?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Bãi biển Mỹ Khê và Ngũ Hành Sơn",
        location: "Đà Nẵng",
        duration: "2 ngày 1 đêm",
        rating: 4.7,
        price: "2.950.000đ",
        image: "https://images.unsplash.com/photo-1589922582845-53535e610b27?q=80&w=2070&auto=format&fit=crop"
    },
     {
        id: 7,
        title: "Chèo thuyền Kayak trên Vịnh Lan Hạ",
        location: "Hạ Long",
        duration: "1 ngày",
        rating: 4.8,
        price: "1.200.000đ",
        image: "https://images.unsplash.com/photo-1590630784343-424a138374ee?q=80&w=1969&auto=format&fit=crop"
    }
];
