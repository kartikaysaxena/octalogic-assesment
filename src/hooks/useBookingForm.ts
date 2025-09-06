import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { BookingFormData, VehicleType, Vehicle } from '../types';
import { apiService } from '../services/api';

export const useBookingForm = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    wheels: null,
    vehicleTypeId: null,
    vehicleId: null,
    startDate: null,
    endDate: null,
  });

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch vehicle types when wheels are selected
  useEffect(() => {
    if (formData.wheels) {
      fetchVehicleTypes(formData.wheels);
    }
  }, [formData.wheels]);

  // Fetch vehicles when vehicle type is selected
  useEffect(() => {
    if (formData.vehicleTypeId) {
      fetchVehicles(formData.vehicleTypeId);
    }
  }, [formData.vehicleTypeId]);

  // Get selected vehicle details
  useEffect(() => {
    if (formData.vehicleId) {
      const vehicle = vehicles.find(v => v.id === formData.vehicleId);
      setSelectedVehicle(vehicle || null);
    }
  }, [formData.vehicleId, vehicles]);

  // Re-validate end date when start date changes
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const validationError = validateDate('endDate', formData.endDate);
      if (validationError) {
        setError(validationError);
      } else {
        setError(null);
      }
    }
  }, [formData.startDate]);

  const fetchVehicleTypes = async (wheels: number) => {
    try {
      setLoading(true);
      const types = await apiService.getVehicleTypesByWheels(wheels);
      setVehicleTypes(types);
    } catch (err: any) {
      console.error('Error fetching vehicle types:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch vehicle types';
      setError(`Failed to fetch vehicle types: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async (typeId: number) => {
    try {
      setLoading(true);
      const vehicleList = await apiService.getVehiclesByType(typeId);
      setVehicles(vehicleList);
    } catch (err) {
      setError('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const validateDate = (field: 'startDate' | 'endDate', value: string | null): string | null => {
    if (!value) return null;
    
    const selectedDate = dayjs(value);
    const today = dayjs().startOf('day');
    
    if (field === 'startDate') {
      if (selectedDate.isBefore(today)) {
        return 'Start date cannot be in the past. Please select today or a future date.';
      }
    } else if (field === 'endDate') {
      if (formData.startDate) {
        const startDate = dayjs(formData.startDate);
        if (selectedDate.isSame(startDate) || selectedDate.isBefore(startDate)) {
          return 'End date must be after the start date. Please select a later date.';
        }
      }
    }
    
    return null;
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setError(null);
    
    // Validate dates before setting
    if (field === 'startDate' || field === 'endDate') {
      const validationError = validateDate(field, value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Reset dependent fields when parent selection changes
    if (field === 'wheels') {
      setFormData(prev => ({
        ...prev,
        vehicleTypeId: null,
        vehicleId: null,
      }));
      setVehicleTypes([]);
      setVehicles([]);
    } else if (field === 'vehicleTypeId') {
      setFormData(prev => ({
        ...prev,
        vehicleId: null,
      }));
      setVehicles([]);
    }
  };

  const validateCurrentStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 0:
        return !!(formData.firstName.trim() && formData.lastName.trim());
      case 1:
        return formData.wheels !== null;
      case 2:
        return formData.vehicleTypeId !== null;
      case 3:
        return formData.vehicleId !== null;
      case 4:
        if (!formData.startDate || !formData.endDate) return false;
        
        // Validate dates are valid
        const startDate = dayjs(formData.startDate);
        const endDate = dayjs(formData.endDate);
        const today = dayjs().startOf('day');
        
        if (startDate.isBefore(today)) return false;
        if (endDate.isSame(startDate) || endDate.isBefore(startDate)) return false;
        
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep(4)) {
      setError('Please complete all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookingResponse = await apiService.createBooking({
        ...formData,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        wheels: formData.wheels!,
        vehicleTypeId: formData.vehicleTypeId!,
        vehicleId: formData.vehicleId!,
      });

      setSuccess(`Booking confirmed! Total cost: ₹${bookingResponse.booking.totalPrice} for ${bookingResponse.booking.days} days.`);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    vehicleTypes,
    vehicles,
    selectedVehicle,
    loading,
    error,
    success,
    handleInputChange,
    validateCurrentStep,
    handleSubmit,
    setError,
  };
};
