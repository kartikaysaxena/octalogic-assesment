import { z } from "zod";

export const bookingSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  wheels: z.number().int().refine(val => val === 2 || val === 4, {
    message: "Wheels must be 2 or 4"
  }),
  vehicleTypeId: z.number().int().positive("Vehicle type is required"),
  vehicleId: z.number().int().positive("Vehicle is required"),
  startDate: z.string().refine(date => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed >= new Date();
  }, "Start date must be today or in the future"),
  endDate: z.string().refine(date => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "End date must be a valid date"),
}).refine(data => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

export type BookingInput = z.infer<typeof bookingSchema>;