import { useState, useEffect } from 'react';
import { ticket_pricesAPI } from '../services/ticket_pricesAPI';
import { tourAPI } from '../services/tourAPI';
import { TourTicketPrice } from '../types';
import { newTour } from '../types';

const useTicketPrices = () => {
    const [ticketPrices, setTicketPrices] = useState<TourTicketPrice[]>([]);
    const [tours, setTours] = useState<newTour[]>([]);
    const [ticketPrice, setTicketPrice] = useState<TourTicketPrice | null>(null);
    const [loading, setLoading] = useState(false);

    // Lấy tất cả giá vé
    const getAllTicketPrices = async () => {
        try {
            setLoading(true);
            const data = await ticket_pricesAPI.getAllTicket_Prices();
            setTicketPrices(data);
        } catch (error) {
            console.error('Error fetching ticket prices:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Lấy tất cả tours để làm dropdown
    const getAllTours = async () => {
        try {
            const data = await tourAPI.getAllTours();
            setTours(data);
        } catch (error) {
            console.error('Error fetching tours:', error);
            throw error;
        }
    };

    // Lấy giá vé theo ID
    const getTicketPriceById = async (id: number) => {
        try {
            setLoading(true);
            const data = await ticket_pricesAPI.getTicket_PricesById(id);
            setTicketPrice(data);
            return data;
        } catch (error) {
            console.error('Error fetching ticket price:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Tạo giá vé mới
    const createTicketPrice = async (ticketPrice: TourTicketPrice) => {
        try {
            setLoading(true);
            const data = await ticket_pricesAPI.createTicket_Prices(ticketPrice);
            await getAllTicketPrices(); // Refresh danh sách
            return data;
        } catch (error) {
            console.error('Error creating ticket price:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật giá vé
    const updateTicketPrice = async (id: number, ticketPrice: TourTicketPrice) => {
        try {
            setLoading(true);
            const data = await ticket_pricesAPI.updateTicket_Prices(id, ticketPrice);
            await getAllTicketPrices(); // Refresh danh sách
            return data;
        } catch (error) {
            console.error('Error updating ticket price:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Xóa giá vé
    const deleteTicketPrice = async (id: number) => {
        try {
            setLoading(true);
            await ticket_pricesAPI.deleteTicket_Prices(id);
            await getAllTicketPrices(); // Refresh danh sách
        } catch (error) {
            console.error('Error deleting ticket price:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Load dữ liệu ban đầu
    useEffect(() => {
        getAllTicketPrices();
        getAllTours();
    }, []);

    return {
        ticketPrices,
        tours,
        ticketPrice,
        loading,
        getAllTicketPrices,
        getAllTours,
        getTicketPriceById,
        createTicketPrice,
        updateTicketPrice,
        deleteTicketPrice
    };
};

export default useTicketPrices;
