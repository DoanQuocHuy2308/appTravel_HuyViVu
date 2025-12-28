import axios from 'axios';
import { API_URL } from '../types/url';

export interface EmailData {
    to: string;
    subject: string;
    template: 'booking_confirmation' | 'booking_update' | 'booking_cancellation';
    data: {
        user_name: string;
        tour_name: string;
        booking_id: number;
        booking_date: string;
        start_date?: string;
        end_date?: string;
        adults: number;
        children: number;
        infants: number;
        total_price?: number;
        status: string;
        notes?: string;
    };
}

export const emailAPI = {
    sendBookingConfirmation: async (emailData: EmailData): Promise<void> => {
        await axios.post(`${API_URL}/email/send-booking-confirmation`, emailData);
    },
    
    sendBookingUpdate: async (emailData: EmailData): Promise<void> => {
        await axios.post(`${API_URL}/email/send-booking-update`, emailData);
    },
    
    sendBookingCancellation: async (emailData: EmailData): Promise<void> => {
        await axios.post(`${API_URL}/email/send-booking-cancellation`, emailData);
    }
};
