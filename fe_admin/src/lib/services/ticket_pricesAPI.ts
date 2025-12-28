import { API_URL } from "../types/url";
import axios from "axios";
import { TourTicketPrice } from "../types/index";

export const ticket_pricesAPI = {
    getAllTicket_Prices: async (): Promise<TourTicketPrice[]> => {
        const response = await axios.get(`${API_URL}/tour_ticket_prices/getAllTour_Ticket_Prices`);
        return response.data;   
    },
    getTicket_PricesById: async (id: number): Promise<TourTicketPrice> => {
        const response = await axios.get(`${API_URL}/tour_ticket_prices/getTour_Ticket_PricesById?id=${id}`);
        return response.data;
    },
    createTicket_Prices: async (ticket_prices: Omit<TourTicketPrice, 'id'>): Promise<TourTicketPrice> => {
        const response = await axios.post(`${API_URL}/tour_ticket_prices/createTour_Ticket_Prices`, ticket_prices);
        return response.data;
    },
    updateTicket_Prices: async (id: number, ticket_prices: Omit<TourTicketPrice, 'id'>): Promise<TourTicketPrice> => {
        const response = await axios.put(`${API_URL}/tour_ticket_prices/updateTour_Ticket_Prices?id=${id}`, ticket_prices);
            return response.data;
    },
    deleteTicket_Prices: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/tour_ticket_prices/deleteTour_Ticket_Prices?id=${id}`);
    }
}