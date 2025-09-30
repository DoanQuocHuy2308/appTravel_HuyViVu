export interface ItineraryActivity {
    time: string;
    activity: string;
}

export interface ItineraryDay {
    day: string;
    title: string;
    data: ItineraryActivity[];
}

export interface Note {
    title: string;
    content: string;
}

export interface Tour {
    id: number;
    title: string;
    location: string;
    duration: string;
    rating: number;
    reviews: number;
    price: string;
    images: string[];
    description: string;
    highlights: string[];
    includes: string[];
    excludes: string[];
    itinerary: ItineraryDay[];
    notes: Note[];
}
