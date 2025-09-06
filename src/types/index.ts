export interface VehicleType {
    id: number;
    name: string;
    wheels: number;
    createdAt?: string;
  }
  
  export interface Vehicle {
    id: number;
    name: string;
    typeId: number;
    model: string;
    year: number;
    pricePerDay: number;
    available: number;
    createdAt?: string;
  }
  
  export interface BookingFormData {
    firstName: string;
    lastName: string;
    wheels: number | null;
    vehicleTypeId: number | null;
    vehicleId: number | null;
    startDate: string | null;
    endDate: string | null;
  }
  
  export interface BookingResponse {
    success: boolean;
    booking: {
      id: number;
      firstName: string;
      lastName: string;
      vehicleId: number;
      startDate: string;
      endDate: string;
      totalPrice: number;
      status: string;
      vehicle: Vehicle;
      days: number;
    };
    message: string;
  }