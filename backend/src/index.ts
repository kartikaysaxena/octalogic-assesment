import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import { vehicleTypes, vehicles } from "./db/schema";
import { eq } from "drizzle-orm";
import { bookingSchema } from "./validation/schema";
import { BookingService } from "./services/bookingService";

const app = new Hono();

// CORS middleware
app.use("/*", cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // React app URLs
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Get all vehicle types
app.get("/api/vehicle-types", async (c) => {
  try {
    const types = await db.select().from(vehicleTypes);
    return c.json(types);
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get vehicle types by number of wheels
app.get("/api/vehicle-types/:wheels", async (c) => {
  try {
    const wheels = parseInt(c.req.param("wheels"));
    
    if (wheels !== 2 && wheels !== 4) {
      return c.json({ error: "Wheels must be 2 or 4" }, 400);
    }

    const types = await db
      .select()
      .from(vehicleTypes)
      .where(eq(vehicleTypes.wheels, wheels));
    
    return c.json(types);
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get vehicles by type
app.get("/api/vehicles/type/:typeId", async (c) => {
  try {
    const typeId = parseInt(c.req.param("typeId"));
    
    const vehicleList = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.typeId, typeId));
    
    return c.json(vehicleList);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Check vehicle availability
app.post("/api/vehicles/:vehicleId/availability", async (c) => {
  try {
    const vehicleId = parseInt(c.req.param("vehicleId"));
    const body = await c.req.json();
    
    if (!body.startDate || !body.endDate) {
      return c.json({ error: "Start date and end date are required" }, 400);
    }

    const isAvailable = await BookingService.checkAvailability(
      vehicleId,
      body.startDate,
      body.endDate
    );

    return c.json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking availability:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create booking
app.post("/api/bookings", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate input
    console.log('Received booking data:', JSON.stringify(body, null, 2));
    const validationResult = bookingSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('Validation errors:', validationResult.error.errors);
      return c.json({ 
        error: "Validation failed", 
        details: validationResult.error.errors 
      }, 400);
    }

    const booking = await BookingService.createBooking(validationResult.data);
    
    return c.json({ 
      success: true, 
      booking,
      message: "Booking created successfully" 
    }, 201);
  } catch (error) {
    console.error("Error creating booking:", error);
    
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 8000;

console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};