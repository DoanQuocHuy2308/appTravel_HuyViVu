export interface ItineraryDay {
    day: string;
    title: string;
    data: ItineraryItem[];
}

export interface ItineraryItem {
    time: string;
    activity: string;
}

export interface Note {
    title: string;
    content: string;
}

export interface Tour {
    description: string;
    highlights: string[];
    includes: string[];
    excludes: string[];
}

export interface TourDetail {
    id: number;
    name: string;
    description: string;
    highlights: string[];
    includes: string[];
    excludes: string[];
    itinerary: ItineraryDay[];
    notes: Note[];
    price: number;
    duration: string;
    location: string;
    rating: number;
    image: string;
}
