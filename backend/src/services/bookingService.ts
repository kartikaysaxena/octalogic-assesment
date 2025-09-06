import { db } from "../db";
import { bookings, vehicles } from "../db/schema";
import { and, eq, or, lte, gte } from "drizzle-orm";
import type { BookingInput } from "../validation/schema";

export class BookingService {
  static async checkAvailability(vehicleId: number, startDate: string, endDate: string): Promise<boolean> {
    // Check if there are any overlapping bookings
    const overlappingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.vehicleId, vehicleId),
          eq(bookings.status, "confirmed"),
          or(
            // New booking starts during existing booking
            and(
              lte(bookings.startDate, startDate),
              gte(bookings.endDate, startDate)
            ),
            // New booking ends during existing booking
            and(
              lte(bookings.startDate, endDate),
              gte(bookings.endDate, endDate)
            ),
            // New booking encompasses existing booking
            and(
              gte(bookings.startDate, startDate),
              lte(bookings.endDate, endDate)
            )
          )
        )
      );

    return overlappingBookings.length === 0;
  }

  static async createBooking(bookingData: BookingInput) {
    // First check if vehicle is available for the requested dates
    const isAvailable = await this.checkAvailability(
      bookingData.vehicleId,
      bookingData.startDate,
      bookingData.endDate
    );

    if (!isAvailable) {
      throw new Error("Vehicle is not available for the selected dates");
    }

    // Get vehicle details to calculate price
    const vehicle = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, bookingData.vehicleId))
      .get();

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Calculate total price
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * vehicle.pricePerDay;

    // Create booking
    const newBooking = await db
      .insert(bookings)
      .values({
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        vehicleId: bookingData.vehicleId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice,
        status: "confirmed",
      })
      .returning()
      .get();

    return {
      ...newBooking,
      vehicle,
      days,
    };
  }
}