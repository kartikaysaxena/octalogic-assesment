import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const vehicleTypes = sqliteTable("vehicle_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  wheels: integer("wheels").notNull(), // 2 for bikes, 4 for cars
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  typeId: integer("type_id").notNull().references(() => vehicleTypes.id),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  pricePerDay: real("price_per_day").notNull(),
  available: integer("available").notNull().default(1), // 1 for available, 0 for not available
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  totalPrice: real("total_price").notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Relations
export const vehicleTypesRelations = relations(vehicleTypes, ({ many }) => ({
  vehicles: many(vehicles),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  type: one(vehicleTypes, {
    fields: [vehicles.typeId],
    references: [vehicleTypes.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [bookings.vehicleId],
    references: [vehicles.id],
  }),
}));