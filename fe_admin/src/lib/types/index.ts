export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birthday?: string; 
  address: string;
  role: 'customer' | 'admin' | 'staff' | 'guide';
  points?: number;
  image?: File | string | null;
  token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface newTour extends Tour {
   name_type?: string;
   start_location?: string;
   end_location?: string;
   city?: string;
   guide_languages?: string;
   images?: string[];
   guide_name?: string;
   rating?: string;
   oldPrice?: string | number;
   price?: string | number;
   review_count: number;
   end_date?: string;
}

export interface Region {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  city?: string;
  country?: string;
  image?: string;
  region_id?: number;
  created_at?: string;
}

export interface TourType {
  id: number;
  name: string;
  description?: string;
}

export interface Tour {
  id: number;
  name: string;
  tour_type_id?: number;
  start_location_id?: number;
  end_location_id?: number;
  location_id?: number;
  description?: string;
  locations?: string;
  max_customers?: number;
  duration_days?: string;
  start_date?: string;
  end_date?: string;
  guide_id?: number;
  ideal_time?: string;
  transportation?: string;
  suitable_for?: string;
  point?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TourTicketPrice {
  id: number;
  tour_id?: number;
  customer_type: 'adult' | 'child' | 'infant';
  start_date?: string;
  end_date?: string;
  old_price?: number;
  price?: number;
}

export interface BookingTicketPrices {
  adult_price?: number;
  child_price?: number;
  infant_price?: number;
}

export interface TourSchedule {
  id: number;
  tour_id?: number;
  day_number?: number;
  title?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TourNote {
  id: number;
  tour_id: number;
  title: string;
  note: string;
  created_at?: string;
}

export interface Review {
  id: number;
  user_id?: number;
  tour_id?: number;
  rating: number; // 1–5
  comment?: string;
  image?: string;
  created_at?: string;
}

export interface Booking {
  id: number;
  user_id?: number;
  tour_id?: number;
  adults: number;
  children: number;
  infants: number;
  notes?: string;
  booking_date?: string;
  start_date?: string;
  end_date?: string;
  total_price?: number;
  status: 'pending' | 'confirmed' | 'canceled';
}
export interface newBooking extends Booking {
  promotion_id?: number;
  promotion_code?: string;
  discount_percent?: number;
}

export interface Banner {
  id: number;
  title?: string;
  image?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface CategoryService {
  id: number;
  name: string;
  description?: string;
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price?: number;
  created_at?: string;
}

export interface ImageService {
  id: number;
  service_id: number;
  image: string;
  created_at?: string;
}

export interface Combo {
  id: number;
  name: string;
  tour_id: number;
  description?: string;
  total_price?: number;
  discount?: number;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface ComboItem {
  id: number;
  combo_id: number;
  service_id: number;
}

export interface ComboFull extends Combo {
  final_price?: number;
  tour_name?: string;
  duration_days?: string;
  transportation?: string;
  ideal_time?: string;
  suitable_for?: string;
  point?: number;
  tour_locations?: string;
  tour_description?: string;
  tour_images?: string[];
  services?: Service[];
  tour_start_date?: string;
 
  start_location_name?: string;     
  start_city?: string;             
  end_location_name?: string;       
  end_city?: string;                
}

export interface Promotion {
  id: number;
  code: string;
  description?: string;
  discount?: number;
  max_count?: number;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'inactive';
}

export interface UserPromotion {
  id: number;
  user_id?: number;
  promotion_id?: number;
  used?: boolean;
  created_at?: string;
}

export interface UserPoint {
  id: number;
  user_id: number;
  booking_id?: number;
  points_change: number;
  reason?: string;
  created_at?: string;
}

export interface Contact {
  id: number;
  user_id?: number;
  subject?: string;
  message?: string;
  status: 'pending' | 'answered' | 'closed';
  created_at?: string;
}

export interface FavoriteTour {
  id: number;
  user_id: number;
  tour_id: number;
  created_at?: string;
}


export interface TourGuide {
  id: number;
  user_id?: number;
  experience_years?: number;
  language?: string;
  created_at?: string;
}

// Form interfaces for Location Management
export interface LocationForm {
  name: string;
  description: string;
  city: string;
  country: string;
  image: File | string | null;
  region_id: number | null;
}

export interface ImageTour {
  id: number;
  tour_id?: number | null;
  image?: string | null;
  created_at?: string;
}

export interface BookingService {
  id: number;
  user_id?: number | null;
  service_id?: number | null;
  quantity?: number;           // default 1
  price?: number | null;
  location?: string | null;
  booking_date?: string | null; // datetime ISO
}


export interface BookingDetail {
  booking_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  tour_id: number;
  tour_name: string;
  tour_description?: string;
  adults: number;
  children: number;
  infants: number;
  notes?: string;
  booking_date?: string;
  start_date?: string;
  end_date?: string;
  total_price?: number;
  status: 'pending' | 'confirmed' | 'canceled';
  ticket_prices?: BookingTicketPrices;
  tour_images?: string[];
  points_earned?: number;
}

export interface EmailData {
  to: string;
  subject: string;
  template: 'booking_confirmation' | 'booking_update' | 'booking_cancellation';
  data: {
    user_name: string;
    tour_name: string;
    booking_id: number;
    booking_date: string;
    adults: number;
    children: number;
    infants: number;
    start_date?: string;
    end_date?: string;
    total_price?: number;
    status: string;
    notes?: string;
  };
}

