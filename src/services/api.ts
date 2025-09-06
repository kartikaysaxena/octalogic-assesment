import axios from 'axios';
import type { VehicleType, Vehicle, BookingFormData, BookingResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get vehicle types by wheels
  getVehicleTypesByWheels: async (wheels: number): Promise<VehicleType[]> => {
    const response = await api.get(`/vehicle-types/${wheels}`);
    return response.data;
  },

  // Get vehicles by type
  getVehiclesByType: async (typeId: number): Promise<Vehicle[]> => {
    const response = await api.get(`/vehicles/type/${typeId}`);
    return response.data;
  },

  // Check vehicle availability
  checkVehicleAvailability: async (
    vehicleId: number,
    startDate: string,
    endDate: string
  ): Promise<{ available: boolean }> => {
    const response = await api.post(`/vehicles/${vehicleId}/availability`, {
      startDate,
      endDate,
    });
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData: BookingFormData): Promise<BookingResponse> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};