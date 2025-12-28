import { API_URL } from "../types/url";
import axios from "axios";
import { TourTicketPrice } from "../types/index";

// Helper function to map backend data to frontend interface
const mapTicketPriceData = (data: any): TourTicketPrice => {
    return {
        id: data.id,
        tour_id: data.tour_id,
        customer_type: data.customer_type,
        start_date: data.start_date,
        end_date: data.end_date,
        old_price: data.old_price || data.oldPrice, // Handle both field names
        price: data.price
    };
};

export const ticket_pricesAPI = {
    getAllTicket_Prices: async (): Promise<TourTicketPrice[]> => {
        const response = await axios.get(`${API_URL}/tour_ticket_prices/getAllTour_Ticket_Prices`);
        return response.data.map(mapTicketPriceData);
    },
    getTicket_PricesById: async (id: number): Promise<TourTicketPrice> => {
        const response = await axios.get(`${API_URL}/tour_ticket_prices/getTour_Ticket_PricesById?id=${id}`);
        return mapTicketPriceData(response.data);
    },
    createTicket_Prices: async (ticket_prices: TourTicketPrice): Promise<TourTicketPrice> => {
        const response = await axios.post(`${API_URL}/tour_ticket_prices/createTour_Ticket_Prices`, ticket_prices);
        return response.data;
    },
    updateTicket_Prices: async (id: number, ticket_prices: TourTicketPrice): Promise<TourTicketPrice> => {
        const response = await axios.put(`${API_URL}/tour_ticket_prices/updateTour_Ticket_Prices?id=${id}`, ticket_prices);
        return response.data;
    },
    deleteTicket_Prices: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/tour_ticket_prices/deleteTour_Ticket_Prices?id=${id}`);
    }
}